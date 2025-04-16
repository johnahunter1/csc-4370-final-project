<template>
  <div id="app" class="background-cover" :style="{ backgroundImage: `url(${bgImage})` }">
    <!-- Welcome Page -->
    <div class="welcome-box" v-if="!showJournal">
      <input v-model="name" type="text" placeholder="Enter your name" class="input-box" />
      <button class="welcome-button" @click="showWelcome = true">Welcome</button>
      <p v-if="showWelcome" class="greeting">Welcome, {{ name }}!</p>
      <button class="welcome-button" @click="showJournal = true">Open Journal</button>
      <button class="back-button" @click="resetName">← Reset Name</button>
    </div>

    <!-- Journal Page -->
    <div class="journal-image" v-else>
      <img :src="looseLeafImage" alt="Loose Leaf Journal" class="looseleaf-img" />
      <button class="new-entry-button" @click="newEntry">+ New Entry</button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import bgImage from '@/assets/journal-cover.jpg'
import looseLeafImage from '@/assets/looseleaf.jpg'

const name = ref('')
const showWelcome = ref(false)
const showJournal = ref(false)

function resetName() {
  name.value = ''
  showWelcome.value = false
}

function newEntry() {
  alert('New journal entry started this is for text box later dont know how to save ')
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
  box-shadow: 0 4px 10px rgba(0,0,0,0.15);
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
  box-shadow: 0 0 20px rgba(0,0,0,0.3);
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
  box-shadow: 0 4px 10px rgba(0,0,0,0.15);
  cursor: pointer;
  transition: 0.3s ease;
}

.new-entry-button:hover {
  transform: scale(1.05);
  background: linear-gradient(135deg, #fbc2eb, #ffe0f7);
}
</style>
