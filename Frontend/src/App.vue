<template>
  <div
    id="app"
    class="background-cover"
    :style="{ backgroundImage: `url(${bgImage})` }"
  >
    <!-- Welcome Page -->
    <div class="welcome-box" v-if="!showJournal">
      <input
        v-model="name"
        type="text"
        placeholder="Enter your name"
        class="input-box"
      />
      <!--
      <button class="welcome-button" @click="showWelcome = true">
        Welcome
      </button>
      <p v-if="showWelcome" class="greeting">Welcome, {{ name }}!</p> -->
      <button class="welcome-button" @click="showJournal = true">
        Open Journal
      </button>
      <!-- <button class="back-button" @click="resetName">← Reset Name</button> -->
    </div>

    <!-- Journal Page -->
    <div class="journal-image" v-else>
      <!-- <img
        :src="looseLeafImage"
        alt="Loose Leaf Journal"
        class="looseleaf-img"
      /> -->

      <!-- Mood and Category Selectors -->
      <div v-if="showTextBox && !entryStarted" class="selector-box">
        <h3>How are you feeling?</h3>
        <select v-model="selectedMood" class="dropdown">
          <option disabled value="">Select a mood</option>
          <option
            v-for="option in moodOptions"
            :key="option.value"
            :value="option.value"
          >
            {{ option.label }}
          </option>
        </select>

        <h3>Choose a category:</h3>
        <select v-model="selectedCategory" class="dropdown">
          <option disabled value="">Select Category</option>
          <option>Venting</option>
          <option>Life</option>
          <option>Travel</option>
          <option>Hobbies</option>
          <option>Finances</option>
          <option>Goals</option>
        </select>

        <button class="start-entry-button" @click="startEntry">
          Start Writing
        </button>
      </div>

      <!-- Journal Textbox -->
      <div v-else-if="entryStarted" class="entry-box">
        <input
          v-model="newTitle"
          type="text"
          placeholder="Entry Title"
          class="entry-input"
        />
        <textarea
          v-model="journalEntry"
          placeholder="Start writing your journal entry here..."
          class="journal-textbox"
        ></textarea>
        <button class="save-entry-button" @click="saveEntry">Save Entry</button>
      </div>

      <!-- Past Entries List -->
      <div class="entries-list">
        <h2>{{ name }}'s Past Entries</h2>
        <ul>
          <li v-for="entry in entries" :key="entry._id">
            <div @click="toggleEntry(entry._id)" style="cursor: pointer">
              <strong>Title: {{ entry.title }}</strong
              ><br />
              Category: {{ entry.category }}<br />
              Mood: {{ getMoodLabel(entry.mood) }}<br />
              Created on {{ formatDate(entry.created) }} <br />
              Last Edited on {{ formatDate(entry.edited) }}<br />
            </div>
            <!-- show entry if expanded-->
            <div
              v-if="expandedEntryId === entry._id"
              style="margin-top: 0.5rem; padding-left: 1rem"
            >
              {{ entry.entry }}
            </div>
          </li>
        </ul>
      </div>

      <button v-if="!showTextBox" class="new-entry-button" @click="newEntry">
        + New Entry
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";
import bgImage from "@/assets/journal-cover.jpg";
import looseLeafImage from "@/assets/looseleaf.jpg";

// UI State
const name = ref("");
const showWelcome = ref(false);
const showJournal = ref(false);
const showTextBox = ref(false);
const entryStarted = ref(false);
const expandedEntryId = ref(null);

// Form Data
const selectedMood = ref("");
const selectedCategory = ref("");
const journalEntry = ref("");
const newTitle = ref("");
const moodOptions = [
  { label: "😊 Happy", value: 5 },
  { label: "😢 Sad", value: 1 },
  { label: "😡 Angry", value: 2 },
  { label: "😴 Tired", value: 3 },
  { label: "🤯 Stressed", value: 4 },
];

// Past Entries
const entries = ref([]);

// Fetch existing entries when page loads
onMounted(async () => {
  const res = await axios.get("http://localhost:5000/api/entries");
  entries.value = res.data;
});

function formatDate(isoString) {
  const options = {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  };
  return new Date(isoString).toLocaleDateString(undefined, options);
}

const getMoodLabel = (moodValue) => {
  const mood = moodOptions.find((option) => option.value === moodValue);
  return mood ? mood.label : moodValue;
};

const toggleEntry = (id) => {
  expandedEntryId.value = expandedEntryId.value === id ? null : id;
};

function resetName() {
  name.value = "";
  showWelcome.value = false;
}

function newEntry() {
  showTextBox.value = true;
  entryStarted.value = false;
  selectedMood.value = "";
  selectedCategory.value = "";
  journalEntry.value = "";
  newTitle.value = "";
}

function startEntry() {
  if (selectedMood.value && selectedCategory.value) {
    entryStarted.value = true;
  } else {
    alert("Please select both a mood and a category before writing!");
  }
}

async function saveEntry() {
  if (
    !newTitle.value.trim() ||
    !journalEntry.value.trim() ||
    !selectedMood.value ||
    !selectedCategory.value
  ) {
    alert("Please fill out all fields before saving.");
    return;
  }

  const newEntryObj = {
    title: newTitle.value,
    category: selectedCategory.value,
    mood: selectedMood.value,
    entry: journalEntry.value,
  };
  try {
    const res = await axios.post(
      "http://localhost:5000/api/entries",
      newEntryObj
    );
    entries.value.unshift(res.data); // Add new entry at the top

    alert(`Entry saved under "${selectedCategory.value}"! 🎉`);
  } catch (error) {
    console.error("Save failed:", error.response?.data || error.message);
    alert(`Save failed: ${error.response?.data?.error || "Unknown error"}`);
  }

  // Reset form
  showTextBox.value = false;
  entryStarted.value = false;
  journalEntry.value = "";
  selectedMood.value = "";
  selectedCategory.value = "";
  newTitle.value = "";
}
</script>

<style scoped>
#app {
  display: flex !important;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 0 !important;
  max-width: 100vw !important;
}

.background-cover {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  display: flex;
  justify-content: center;
  align-items: center;
}

.welcome-box {
  background-color: transparent;
  padding: 2rem;
  border-radius: 12px;
  text-align: center;
  margin-top: -300px;
}

.input-box {
  padding: 0.5rem 1rem;
  font-size: 1rem;
  border: 2px solid #f54291;
  border-radius: 8px;
  margin-bottom: 1rem;
  width: 100%;
}

.welcome-button {
  background: linear-gradient(135deg, #fddde6, #fbc2eb);
  border: none;
  border-radius: 20px;
  color: #fff;
  font-size: 1rem;
  font-weight: bold;
  padding: 0.75rem 2rem;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.15);
  margin: 0.5rem;
}

.welcome-button:hover {
  transform: scale(1.05);
  background: linear-gradient(135deg, #fbc2eb, #fddde6);
}

.back-button {
  margin-top: 1rem;
  background: #fff0f4;
  color: #d63384;
  border: 2px solid #d63384;
  padding: 0.4rem 1rem;
  border-radius: 12px;
  font-weight: bold;
  cursor: pointer;
  transition: 0.3s;
}

.back-button:hover {
  background-color: #ffd6e7;
  color: #000;
}

.greeting {
  margin-top: 1rem;
  font-size: 1.2rem;
  font-weight: bold;
  color: #f54291;
}

.journal-image {
  display: flex;
  flex-direction: column; /* important so content stacks vertically */
  align-items: center;
  width: 100%;
  max-width: 1200px;
  min-height: 100vh; /* minimum full height */
  overflow-y: auto;
  padding: 2rem;
  background-image: url("@/assets/looseleaf.jpg"); /* <-- set the background here */
  background-repeat: repeat-y; /* <-- repeat vertically */
  /* background-size: contain; or 'cover', depending on effect */
  background-size: cover; /* or 'cover', depending on effect */
  background-position: top center; /* keep it centered */
  position: relative;
}

.looseleaf-img {
  /* width: 600px; */
  width: 100%;
  /* max-width: 90vw; */
  display: block;
  height: auto;
  object-fit: contain;
  border-radius: 12px;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.3);
}

/* New Styles */
.selector-box,
.entry-box {
  position: absolute;
  top: 120px;
  left: 50%;
  transform: translateX(-50%);
  width: 80%;
  background: rgba(255, 255, 255, 0.9);
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
  text-align: center;
  z-index: 10;
}

.dropdown {
  width: 80%;
  padding: 0.5rem;
  margin: 1rem 0;
  font-size: 1rem;
  border-radius: 8px;
  border: 2px solid #fbc2eb;
}

.start-entry-button,
.save-entry-button {
  margin-top: 1rem;
  background: linear-gradient(135deg, #ffe0f7, #fbc2eb);
  border: none;
  border-radius: 20px;
  color: #333;
  font-size: 1rem;
  font-weight: bold;
  padding: 0.75rem 2rem;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.15);
}

.start-entry-button:hover,
.save-entry-button:hover {
  transform: scale(1.05);
  background: linear-gradient(135deg, #fbc2eb, #ffe0f7);
}

.journal-textbox {
  width: 100%;
  height: 300px;
  padding: 1rem;
  font-size: 1rem;
  border-radius: 12px;
  border: 2px solid #fbc2eb;
  resize: vertical;
  margin-top: 1rem;
}

.new-entry-button {
  /* position: absolute; */
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  padding: 0.6rem 1.5rem;
  font-size: 1rem;
  font-weight: bold;
  border: none;
  border-radius: 20px;
  background: linear-gradient(135deg, #ffe0f7, #fbc2eb);
  color: #333;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.15);
  cursor: pointer;
  transition: 0.3s ease;
}

.new-entry-button:hover {
  transform: scale(1.05);
  background: linear-gradient(135deg, #fbc2eb, #ffe0f7);
}
.entries-list {
  margin-top: 2rem;
  background: rgba(255, 255, 255, 0.95); /* more solid background */
  border-radius: 12px;
  padding: 1rem;
  width: 80%;
  max-width: 600px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.15);
  color: #333; /* dark text */
  font-size: 1rem;
  position: absolute;
  /* top: 20%; */
  left: 25%;
  z-index: 5;
}

.entries-list h2 {
  margin-bottom: 1rem;
  color: #d63384; /* nice pop */
  text-align: center;
  font-weight: bold;
}

.entries-list ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.entries-list li {
  margin-bottom: 1rem;
  padding: 0.5rem;
  border-bottom: 1px solid #ccc;
  line-height: 1.5;
  color: #222; /* darker text for better readability */
}
</style>
