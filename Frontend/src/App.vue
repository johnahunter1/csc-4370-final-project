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
      <button class="welcome-button" @click="showWelcome = true">
        Welcome
      </button>
      <p v-if="showWelcome" class="greeting">Welcome, {{ name }}!</p>
      <button class="welcome-button" @click="showJournal = true">
        Open Journal
      </button>
      <button class="back-button" @click="resetName">← Reset Name</button>
    </div>

    <!-- Journal Page -->
    <div class="journal-image" v-else>
      <img
        :src="looseLeafImage"
        alt="Loose Leaf Journal"
        class="looseleaf-img"
      />

      <div class="entry-area">
        <input
          v-model="newTitle"
          type="text"
          placeholder="Title"
          class="entry-input"
        />
        <input
          v-model="newCategory"
          type="text"
          placeholder="Category"
          class="entry-input"
        />
        <input
          v-model.number="newMood"
          type="number"
          min="1"
          max="10"
          placeholder="Mood (1-10)"
          class="entry-input"
        />
        <textarea
          v-model="newEntryText"
          placeholder="Type your journal entry here..."
          class="entry-textarea"
        ></textarea>
        <button class="save-entry-button" @click="saveEntry">Save Entry</button>
      </div>

      <div class="entries-list">
        <h2>Past Entries</h2>
        <ul>
          <li v-for="entry in entries" :key="entry._id">
            <strong>{{ entry.title }}</strong> - {{ entry.category }} (Mood:
            {{ entry.mood }})<br />
            Created: {{ formatDate(entry.created) }} <br />Edited:
            {{ formatDate(entry.edited) }}<br />
            {{ entry.entry }}
          </li>
        </ul>
      </div>

      <button class="new-entry-button" @click="newEntry">+ New Entry</button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";
import bgImage from "@/assets/journal-cover.jpg";
import looseLeafImage from "@/assets/looseleaf.jpg";

const name = ref("");
const showWelcome = ref(false);
const showJournal = ref(false);
const entries = ref([]);
const newEntryText = ref("");
const newMood = ref(5);
const newCategory = ref("");
const newTitle = ref("");

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

function resetName() {
  name.value = "";
  showWelcome.value = false;
}

function newEntry() {
  // alert(
  //   "New journal entry started this is for text box later dont know how to save "
  // );
  newEntryText.value = "";
  newMood.value = 5;
  newCategory.value = "";
  newTitle.value = "";
}

async function saveEntry() {
  // if (!newEntryText.value.trim()) return;

  // const res = await axios.post("http://localhost:5000/api/entries", {
  //   content: newEntryText.value,
  // });
  // entries.value.push(res.data); // add new entry to list
  // newEntryText.value = ""; // clear textarea
  if (
    !newTitle.value.trim() ||
    !newCategory.value.trim() ||
    !newEntryText.value.trim() ||
    newMood.value < 1 ||
    newMood.value > 10
  ) {
    alert("Please fill out all fields with valid data");
    return;
  }
  const res = await axios.post("http://localhost:5000/api/entries", {
    title: newTitle.value,
    category: newCategory.value,
    mood: newMood.value,
    entry: newEntryText.value,
  });
  entries.value.unshift(res.data); // add new entry to top
  newEntry(); // clear entry form
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
  justify-content: center;
  align-items: center;
  width: 100vw;
  height: 100vh;
  overflow: auto;
  padding: 1rem;
  position: relative;
}

.looseleaf-img {
  width: 600px;
  max-width: 90vw;
  height: auto;
  object-fit: contain;
  border-radius: 12px;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.3);
}

.entry-area {
  margin-top: 1rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
}

.entry-input {
  width: 80%;
  max-width: 600px;
  padding: 0.6rem;
  margin: 0.5rem 0;
  border-radius: 10px;
  border: 2px solid #fbc2eb;
  font-size: 1rem;
}

.entry-textarea {
  width: 80%;
  max-width: 600px;
  height: 150px;
  padding: 1rem;
  border-radius: 12px;
  border: 2px solid #fbc2eb;
  margin-bottom: 1rem;
  font-size: 1rem;
  resize: vertical;
}

.save-entry-button {
  background: linear-gradient(135deg, #fddde6, #fbc2eb);
  border: none;
  border-radius: 20px;
  padding: 0.6rem 1.5rem;
  font-weight: bold;
  color: #333;
  cursor: pointer;
  transition: 0.3s ease;
}

.save-entry-button:hover {
  transform: scale(1.05);
  background: linear-gradient(135deg, #fbc2eb, #fddde6);
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

.new-entry-button {
  position: absolute;
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
</style>
