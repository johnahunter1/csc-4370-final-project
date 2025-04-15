<template>
  <div class="background-cover" :style="{ backgroundImage: `url(${bgImage})` }">
    <div class="welcome-box">
      <input v-model="name" type="text" placeholder="Enter your name" class="input-box" />
      <button class="welcome-button" @click="showWelcome = true">Welcome</button>
      <p v-if="showWelcome" class="greeting">Welcome, {{ name }}!</p>
    </div>
  </div>
</template>

<script setup>
// yeet
import { ref } from 'vue'
import bgImage from '@/assets/journal-cover.jpg'

const name = ref('')
const showWelcome = ref(false)
</script>

<style scoped>
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
.greeting {
  margin-top: 1rem;
  font-size: 1.2rem;
  font-weight: bold;
  color: #f54291; 
}


.welcome-box {
  background-color:transparent;
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
  padding: 0.5rem 1.5rem;
  font-size: 1rem;
  border: 2px solid #333;
  border-radius: 8px;
  background-color: rgb(45, 36, 36);
  cursor: pointer;
  transition: 0.3s;
}


.greeting {
  margin-top: 1rem;
  font-size: 1.2rem;
  font-weight: bold;
}
</style>

