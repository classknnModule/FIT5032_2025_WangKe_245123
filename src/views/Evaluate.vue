<template>
  <div class="rating-container">
    <h2>Evaluate</h2>

    <div class="average-rating">
      Average score：
      <strong>{{ averageScore.toFixed(1) }}</strong> / 5
      <span v-if="ratings.length === 0"></span>
    </div>

    <div class="user-rating">
      <p>Please evaluate our score：</p>
      <div class="stars">
        <span
          v-for="star in 5"
          :key="star"
          class="star"
          :class="{ filled: star <= userScore }"
          @click="setRating(star)"
          @mouseover="hoverRating = star"
          @mouseleave="hoverRating = 0"
        >
          ★
        </span>
      </div>
      <button :disabled="userScore === 0" @click="submitRating">Submit</button>

      <p v-if="submitted" class="thank-you">Thanks！</p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

const STORAGE_KEY = 'user-ratings'

function loadRatingsFromStorage() {
  const data = localStorage.getItem(STORAGE_KEY)
  return data ? JSON.parse(data) : []
}

function saveRatingsToStorage(ratingsArray) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(ratingsArray))
}

const ratings = ref(loadRatingsFromStorage())

const userScore = ref(0)
const hoverRating = ref(0)
const submitted = ref(false)

function setRating(star) {
  userScore.value = star
  submitted.value = false
}

const averageScore = computed(() => {
  if (ratings.value.length === 0) return 0
  const sum = ratings.value.reduce((a, b) => a + b, 0)
  return sum / ratings.value.length
})

function submitRating() {
  if (userScore.value > 0) {
    ratings.value.push(userScore.value)
    saveRatingsToStorage(ratings.value)
    submitted.value = true
    userScore.value = 0
  }
}

onMounted(() => {
  ratings.value = loadRatingsFromStorage()
})
</script>

<style scoped>
.rating-container {
  max-width: 400px;
  margin: auto;
  text-align: center;
  font-family: Arial, sans-serif;
}

.average-rating {
  font-size: 1.2em;
  margin-bottom: 1em;
}

.user-rating p {
  margin-bottom: 0.5em;
}

.stars {
  font-size: 2.5em;
  cursor: pointer;
  user-select: none;
}

.star {
  color: #ccc;
  transition: color 0.2s;
}

.star.filled,
.star:hover,
.star:hover ~ .star {
  color: #f39c12;
}

button {
  margin-top: 1em;
  padding: 0.5em 1em;
  font-size: 1em;
  cursor: pointer;
}

button:disabled {
  cursor: not-allowed;
  opacity: 0.5;
}

.thank-you {
  color: green;
  margin-top: 1em;
}
</style>
