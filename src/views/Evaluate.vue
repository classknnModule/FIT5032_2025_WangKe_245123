<template>
  <div class="rating-container">
    <h2>Evaluate</h2>

    <div class="average-rating">
      Average score:
      <strong>{{ averageScore.toFixed(1) }}</strong> / 5
      <span v-if="ratings.length === 0"></span>
    </div>

    <div class="user-rating">
      <p>Please rate our service:</p>
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

      <p v-if="submitted" class="thank-you">Thank you!</p>
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
  max-width: 500px;
  width: 90%;
  margin: 2rem auto;
  padding: 3rem;
  text-align: center;
  font-family: 'Inter', sans-serif;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border-radius: 24px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  position: relative;
  overflow: hidden;
}

.rating-container::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(135deg, #6366f1, #ec4899);
}

.average-rating {
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 2rem;
  color: #1f2937;
  padding: 1rem;
  background: linear-gradient(135deg, #f3f4f6, #e5e7eb);
  border-radius: 16px;
  border: 2px solid #e5e7eb;
}

.user-rating {
  margin: 2rem 0;
}

.user-rating p {
  margin-bottom: 1rem;
  font-size: 1.2rem;
  font-weight: 600;
  color: #374151;
}

.stars {
  font-size: 3rem;
  cursor: pointer;
  user-select: none;
  margin: 1.5rem 0;
  display: flex;
  justify-content: center;
  gap: 0.5rem;
}

.star {
  color: #d1d5db;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1));
  transform-origin: center;
}

.star:hover {
  transform: scale(1.2) rotate(5deg);
  color: #fbbf24;
}

.star.filled {
  color: #f59e0b;
  transform: scale(1.1);
}

.star:hover ~ .star {
  color: #fbbf24;
  transform: scale(1.05);
}

button {
  margin-top: 2rem;
  padding: 1rem 2rem;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  border: none;
  border-radius: 50px;
  background: linear-gradient(135deg, #10b981, #059669);
  color: white;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 4px 15px rgba(16, 185, 129, 0.3);
  min-width: 200px;
}

button:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 25px rgba(16, 185, 129, 0.4);
  background: linear-gradient(135deg, #059669, #047857);
}

button:active {
  transform: translateY(-1px);
}

.thank-you-message {
  margin-top: 1.5rem;
  padding: 1rem;
  background: linear-gradient(135deg, #dcfce7, #bbf7d0);
  border-radius: 12px;
  color: #166534;
  font-weight: 600;
  border: 2px solid #86efac;
}

@media (max-width: 768px) {
  .rating-container {
    padding: 2rem 1.5rem;
    margin: 1rem;
  }

  .stars {
    font-size: 2.5rem;
    gap: 0.25rem;
  }

  .average-rating {
    font-size: 1.3rem;
  }
}

@media (max-width: 480px) {
  .rating-container {
    padding: 1.5rem 1rem;
  }

  .stars {
    font-size: 2rem;
  }

  button {
    padding: 0.875rem 1.5rem;
    font-size: 1rem;
    min-width: 180px;
  }
}
</style>
