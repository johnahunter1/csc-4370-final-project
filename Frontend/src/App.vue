<template>
  <div id="app" class="background-cover">
    <!-- Welcome Page -->
    <div class="welcome-box" v-if="!showJournal">
      <input v-model="name" type="text" placeholder="....." class="input-box" />
      <button class="welcome-button" @click="showJournal = true">
        Open Journal
      </button>
    </div>

    <!-- Journal Page -->
    <div class="journal-image" v-else>
      <!-- Mood and Category Selectors -->
      <div v-if="showTextBox && !entryStarted" class="options-container">
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
          <option>School</option>
          <option>Venting</option>
          <option>Life</option>
          <option>Travel</option>
          <option>Hobbies</option>
          <option>Finances</option>
          <option>Goals</option>
        </select>
        <br />
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

      <div v-if="statsOpen" class="stats-box">
        <h2>{{ name }}'s Monthly Statistics:</h2>
        <h3>Entries Written: {{ editedLastMonth }}</h3>
        <h3>Average Mood: {{ averageMood }}</h3>
      </div>

      <!-- Past Entries List -->
      <div v-if="!statsOpen && !showTextBox" class="entries-list">
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
            <p
              v-if="expandedEntryId === entry._id"
              style="
                margin-top: 0.5rem;
                padding-left: 1rem;
                word-wrap: break-word;
              "
            >
              {{ entry.entry }}
            </p>
          </li>
        </ul>
      </div>

      <button class="new-entry-button" @click="newEntry">+ New Entry</button>
      <button class="stats-button" @click="showStats">Show Stats</button>
      <button class="home-button" @click="goHome">Go Home</button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import axios from "axios";

// UI State
const name = ref("");
const showWelcome = ref(false);
const showJournal = ref(false);
const showTextBox = ref(false);
const entryStarted = ref(false);
const expandedEntryId = ref(null);
const statsOpen = ref(false);
const averageMood = ref(0);

// Form Data
const selectedMood = ref("");
const selectedCategory = ref("");
const journalEntry = ref("");
const newTitle = ref("");
const numEntries = ref(0);
const moodOptions = [
  { label: "😊 5", value: 5 },
  { label: "😢 1", value: 1 },
  { label: "😡 2", value: 2 },
  { label: "😴 3", value: 3 },
  { label: "🤯 4", value: 4 },
];

// Past Entries
const entries = ref([]);

// Fetch existing entries when page loads
onMounted(async () => {
  const res = await axios.get("http://localhost:5000/api/entries");
  entries.value = res.data;
  for (let i = 0; i < entries.value.length; i++) {
    numEntries.value += 1;
    averageMood.value += entries.value[i].mood;
  }
  averageMood.value /= entries.value.length;
  averageMood.value = Math.round(averageMood.value);
  averageMood.value = getMoodLabel(averageMood.value);
});

const editedLastMonth = computed(() => {
  const oneMonthAgo = new Date();
  oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

  return entries.value.filter((entry) => new Date(entry.edited) > oneMonthAgo)
    .length;
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

function newEntry() {
  showTextBox.value = !showTextBox.value;
  entryStarted.value = false;
  selectedMood.value = "";
  selectedCategory.value = "";
  journalEntry.value = "";
  newTitle.value = "";
  statsOpen.value = false;
}

function showStats() {
  statsOpen.value = !statsOpen.value;
  showTextBox.value = false;
}

function goHome() {
  showJournal.value = false;
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
  background-repeat: no-repeat;
  background-image: url("@/assets/journal-cover.png"); /* <-- set the background here */
  background-size: contain; /*or 'cover', depending on effect*/
  background-position: top center; /* keep it centered */
  display: flex;
  justify-content: center;
  align-items: center;
}

.welcome-box {
  background-color: transparent;
  padding: 2rem;
  border-radius: 12px;
  text-align: center;
  margin-top: -355px;
  position: relative;
}

.input-box {
  padding: 0.5rem 1.5rem;
  font-size: 1rem;
  background-color: transparent;
  border-radius: 8px;
  margin-bottom: 1rem;
  width: 200px;
  position: relative;
  left: 53%;
}

.welcome-button {
  background: linear-gradient(135deg, #fddde6, #fbc2eb);
  border: none;
  border-radius: 20px;
  color: #000000;
  font-size: 1rem;
  font-weight: bold;
  padding: 0.75rem 2rem;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.15);
  margin: 0.5rem;
  position: relative;
  right: 20%;
  top: 170%;
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
  min-height: 100vh; /*minimum full height*/
  min-width: 40%;
  overflow-y: auto;
  background-image: url("@/assets/loose-leaf.png"); /* <-- set the background here */
  background-repeat: repeat-y; /* <-- repeat vertically */
  background-size: cover; /* or 'cover', depending on effect */
  background-position: top center; /* keep it centered */
  position: relative;
}

.looseleaf-img {
  width: 100%;
  display: block;
  height: auto;
  object-fit: contain;
  border-radius: 12px;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.3);
}

/* New Styles */
.options-container,
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

.options-container {
  color: #000;
}

.stats-box {
  position: absolute;
  top: 120px;
  left: 50%;
  transform: translateX(-50%);
  width: 30%;
  background: rgba(255, 255, 255, 0.9);
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
  text-align: center;
  color: #000;
  z-index: 10;
}

.stats-box h2 {
  color: #d63384;
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
  position: absolute;
  bottom: 5%;
  right: 5%;
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

.stats-button {
  position: absolute;
  bottom: 10%;
  right: 5.4%;
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

.home-button {
  position: absolute;
  bottom: 15%;
  right: 6%;
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
