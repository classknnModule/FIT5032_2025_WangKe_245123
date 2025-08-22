<template>
  <div class="firebase-container">
    <div class="firebase-card">
      <div class="firebase-header">
        <h1>🔥 Firebase Sign In</h1>
        <p>Welcome back! Sign in to your account</p>
      </div>

      <form @submit.prevent="signin" class="firebase-form">
        <div class="form-group">
          <label for="email">Email Address</label>
          <input
            id="email"
            type="email"
            v-model="email"
            placeholder="Enter your email address"
            required
            :disabled="isLoading"
            class="form-input"
          />
        </div>

        <div class="form-group">
          <label for="password">Password</label>
          <input
            id="password"
            type="password"
            v-model="password"
            placeholder="Enter your password"
            required
            :disabled="isLoading"
            class="form-input"
          />
        </div>

        <div v-if="errorMessage" class="error-message">
          {{ errorMessage }}
        </div>

        <div v-if="successMessage" class="success-message">
          {{ successMessage }}
        </div>

        <button type="submit" :disabled="isLoading || !isFormValid" class="firebase-button">
          <span v-if="isLoading">Signing In...</span>
          <span v-else>🚀 Sign In</span>
        </button>
      </form>

      <div class="register-link">
        <p>Don't have an account? <router-link to="/Fireregister" class="link">Create one here</router-link></p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue"
import { getAuth, signInWithEmailAndPassword } from "firebase/auth"
import { useRouter, useRoute } from "vue-router"

const email = ref("")
const password = ref("")
const errorMessage = ref("")
const successMessage = ref("")
const isLoading = ref(false)
const router = useRouter()
const route = useRoute()
const auth = getAuth()

const isFormValid = computed(() => {
  return email.value.trim() !== '' && password.value.trim() !== ''
})

const clearMessages = () => {
  setTimeout(() => {
    errorMessage.value = ''
    successMessage.value = ''
  }, 3000)
}

const signin = async () => {
  errorMessage.value = ''
  successMessage.value = ''
  isLoading.value = true

  try {
    await new Promise(resolve => setTimeout(resolve, 500))

    const userCredential = await signInWithEmailAndPassword(auth, email.value, password.value)
    console.log("Firebase Login Successful!", userCredential.user)

    successMessage.value = 'Sign in successful! Redirecting to dashboard...'

    setTimeout(() => {
      const redirectTo = route.query.redirect || '/about'
      router.push(redirectTo)
    }, 1500)

  } catch (error) {
    console.log(error.code)
    switch (error.code) {
      case 'auth/user-not-found':
        errorMessage.value = 'No account found with this email. Please check your email or create an account.'
        break
      case 'auth/wrong-password':
        errorMessage.value = 'Incorrect password. Please try again.'
        break
      case 'auth/invalid-email':
        errorMessage.value = 'Please enter a valid email address.'
        break
      case 'auth/too-many-requests':
        errorMessage.value = 'Too many failed attempts. Please try again later.'
        break
      default:
        errorMessage.value = 'Sign in failed. Please check your credentials and try again.'
    }
    clearMessages()
  } finally {
    isLoading.value = false
  }
}
</script>

<style scoped>
.firebase-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%);
  padding: 20px;
}

.firebase-card {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  padding: 2.5rem;
  border-radius: 20px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 450px;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.firebase-header {
  text-align: center;
  margin-bottom: 2rem;
}

.firebase-header h1 {
  color: #333;
  margin-bottom: 0.5rem;
  font-size: 1.8rem;
  font-weight: 700;
}

.firebase-header p {
  color: #666;
  margin: 0;
  font-size: 0.95rem;
}

.firebase-form {
  display: flex;
  flex-direction: column;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  color: #333;
  font-weight: 600;
  font-size: 0.9rem;
}

.form-input {
  width: 100%;
  padding: 1rem;
  border: 2px solid #e1e8ed;
  border-radius: 12px;
  font-size: 1rem;
  transition: all 0.3s ease;
  box-sizing: border-box;
  background: rgba(255, 255, 255, 0.8);
}

.form-input:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
  background: white;
}

.form-input:disabled {
  background-color: #f5f5f5;
  cursor: not-allowed;
  opacity: 0.7;
}

.error-message {
  background: linear-gradient(135deg, #fee, #fdd);
  color: #c33;
  padding: 1rem;
  border-radius: 12px;
  margin-bottom: 1rem;
  border: 1px solid #fcc;
  text-align: center;
  font-weight: 500;
  animation: slideIn 0.3s ease-out;
}

.success-message {
  background: linear-gradient(135deg, #efe, #dfd);
  color: #363;
  padding: 1rem;
  border-radius: 12px;
  margin-bottom: 1rem;
  border: 1px solid #cfc;
  text-align: center;
  font-weight: 500;
  animation: slideIn 0.3s ease-out;
}

.firebase-button {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  padding: 1rem 1.5rem;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-bottom: 1.5rem;
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
}

.firebase-button:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(102, 126, 234, 0.4);
}

.firebase-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}

.register-link {
  text-align: center;
  padding-top: 1rem;
  border-top: 1px solid #eee;
}

.register-link p {
  color: #666;
  margin: 0;
  font-size: 0.9rem;
}

.link {
  color: #667eea;
  text-decoration: none;
  font-weight: 600;
  transition: color 0.3s ease;
}

.link:hover {
  color: #5a67d8;
  text-decoration: underline;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (max-width: 480px) {
  .firebase-container {
    padding: 10px;
  }

  .firebase-card {
    padding: 2rem;
  }

  .firebase-header h1 {
    font-size: 1.5rem;
  }
}
</style>
