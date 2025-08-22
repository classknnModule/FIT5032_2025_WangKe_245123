<script setup>
import { ref, onMounted } from 'vue'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'

const formData = ref({
  username: '',
  password: '',
  confirmPassword: '',
  isAustralian: false,
  reason: '',
  gender: '',
  suburb: ''
})

const submittedCards = ref([])

onMounted(() => {
  loadSubmittedData()
})

const loadSubmittedData = () => {
  try {
    const stored = localStorage.getItem('submittedCards')
    if (stored) {
      submittedCards.value = JSON.parse(stored)
    }
  } catch (error) {
    console.error('Error loading data:', error)
  }
}

const saveSubmittedData = () => {
  try {
    localStorage.setItem('submittedCards', JSON.stringify(submittedCards.value))
  } catch (error) {
    console.error('Error saving data:', error)
  }
}

const submitForm = () => {
  validateName(true)
  validatePassword(true)
  validateConfirmPassword(true)
  
  if (!errors.value.username && !errors.value.password && !errors.value.confirmPassword) {

    const existingUser = submittedCards.value.find(user => user.username === formData.value.username)
    if (existingUser) {
      errors.value.username = 'Username already exists. Please choose a different one.'
      return
    }
    

    submittedCards.value.push({ ...formData.value })
    

    saveSubmittedData()
    

    // alert(`Registration successful! You can now login with username: ${formData.value.username}`)
    

    clearForm()
  }
}

const clearForm = () => {
  formData.value = {
    username: '',
    password: '',
    confirmPassword: '',
    isAustralian: false,
    reason: '',
    gender: '',
    suburb: 'Clayton'
  }

  Object.keys(errors.value).forEach(key => {
    errors.value[key] = null
  })
}

const errors = ref({
  username: null,
  password: null,
  confirmPassword: null,
  resident: null,
  gender: null,
  reason: null
})

const validateName = (blur) => {
  if (formData.value.username.length < 3) {
    if (blur) errors.value.username = 'Name must be at least 3 characters'
  } else {
    errors.value.username = null
  }
}

const validatePassword = (blur) => {
  const password = formData.value.password
  const minLength = 8
  const hasUppercase = /[A-Z]/.test(password)
  const hasLowercase = /[a-z]/.test(password)
  const hasNumber = /\d/.test(password)
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password)

  if (password.length < minLength) {
    if (blur) errors.value.password = `Password must be at least ${minLength} characters long.`
  } else if (!hasUppercase) {
    if (blur) errors.value.password = 'Password must contain at least one uppercase letter.'
  } else if (!hasLowercase) {
    if (blur) errors.value.password = 'Password must contain at least one lowercase letter.'
  } else if (!hasNumber) {
    if (blur) errors.value.password = 'Password must contain at least one number.'
  } else if (!hasSpecialChar) {
    if (blur) errors.value.password = 'Password must contain at least one special character.'
  } else {
    errors.value.password = null
  }
}

const validateConfirmPassword = (blur) => {
  if (formData.value.password !== formData.value.confirmPassword) {
    if (blur) errors.value.confirmPassword = 'Passwords do not match.'
  } else {
    errors.value.confirmPassword = null
  }
}

const validateReason = (blur) => {
  const reason = formData.value.reason
  const hasfriend = /friend/i.test(reason)
    if (hasfriend) {
    if (blur) errors.value.reason = 'Great to have a friend'
  } else {
    errors.value.reason = null
  }
}
</script>

<template>
  <div class="registration-page">
    <div class="container">
      <div class="registration-header">
        <h1>🌟 Join Our Mental Health Community</h1>
        <p>Register to access personalized mental health resources and connect with our supportive community.</p>
      </div>
      
      <div class="registration-form-container">
        <form @submit.prevent="submitForm" class="modern-form">
          <div class="row mb-3">
            <div class="col-md-6 col-sm-6">
              <label for="username" class="form-label">Username</label>
              <input
                type="text"
                class="form-control"
                id="username"
                @blur="() => validateName(true)"
                @input="() => validateName(false)"
                v-model="formData.username"
                required
              />
              <div v-if="errors.username" class="text-danger">{{ errors.username }}</div>
            </div>
    
            <div class="col-md-6 col-sm-6">
              <label for="gender" class="form-label">Gender</label>
              <select class="form-select" id="gender" v-model="formData.gender" required>
                <option value="">Select Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>
    
          <div class="row mb-3">
            <div class="col-md-6 col-sm-6">
              <label for="password" class="form-label">Password</label>
              <input
                type="password"
                class="form-control"
                id="password"
                @blur="() => validatePassword(true)"
                @input="() => validatePassword(false)"
                v-model="formData.password"
                required
              />
              <div v-if="errors.password" class="text-danger">{{ errors.password }}</div>
            </div>
    
            <div class="col-md-6 col-sm-6">
              <label for="confirm-password" class="form-label">Confirm password</label>
              <input
                type="password"
                class="form-control"
                id="confirm-password"
                @blur="() => validateConfirmPassword(true)"
                @input="() => validateConfirmPassword(false)"
                v-model="formData.confirmPassword"
                required
              />
              <div v-if="errors.confirmPassword" class="text-danger">
                {{ errors.confirmPassword }}
              </div>
            </div>
          </div>
    
          <div class="row mb-3">
            <div class="col-md-6 col-sm-6">
              <div class="form-check">
                <input
                  type="checkbox"
                  class="form-check-input"
                  id="isAustralian"
                  v-model="formData.isAustralian"
                />
                <label class="form-check-label" for="isAustralian">Australian Resident?</label>
              </div>
            </div>
          </div>
          
          <div class="mb-3">
            <label for="reason" class="form-label">Reason for joining</label>
            <textarea
              class="form-control"
              id="reason"
              rows="3"
              v-model="formData.reason"
              @blur="() => validateReason(true)"
              required
            ></textarea>
            <div v-if="errors.reason" class="text-success mt-1">{{ errors.reason }}</div>
          </div>
          
          <div class="mb-3">
            <label for="suburb" class="form-label">Suburb</label>
            <input type="text" class="form-control" id="suburb" v-model="formData.suburb" />
          </div>
          
          <div class="text-center">
            <button type="submit" class="btn btn-primary me-2">Submit</button>
            <button type="button" class="btn btn-secondary" @click="clearForm">Clear</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<style scoped>
.registration-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 2rem 0;
}

.container {
  max-width: 900px;
  margin: 0 auto;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border-radius: 20px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.registration-header {
  text-align: center;
  padding: 3rem 2rem 2rem;
  background: linear-gradient(135deg, #6366f1, #ec4899);
  color: white;
  margin: -2rem -2rem 2rem -2rem;
}

.registration-header h1 {
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 1rem;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.registration-header p {
  font-size: 1.1rem;
  opacity: 0.9;
  max-width: 600px;
  margin: 0 auto;
}

.registration-form-container {
  padding: 0 2rem 2rem;
}

.modern-form {
  display: grid;
  gap: 1.5rem;
}

.form-group {
  position: relative;
}

.form-label {
  font-weight: 600;
  color: #374151;
  margin-bottom: 0.5rem;
  display: block;
}

.form-control, .form-select {
  width: 100%;
  padding: 1rem;
  border: 2px solid #e5e7eb;
  border-radius: 12px;
  font-size: 1rem;
  transition: all 0.3s ease;
  background: white;
}

.form-control:focus, .form-select:focus {
  border-color: #6366f1;
  box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
  outline: none;
  transform: translateY(-1px);
}

.btn-primary {
  background: linear-gradient(135deg, #6366f1, #4f46e5);
  border: none;
  padding: 1rem 2rem;
  border-radius: 12px;
  color: white;
  font-weight: 600;
  font-size: 1.1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(99, 102, 241, 0.3);
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(99, 102, 241, 0.4);
}

.text-danger {
  color: #ef4444;
  font-size: 0.875rem;
  margin-top: 0.25rem;
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.text-success {
  color: #10b981;
  font-size: 0.875rem;
  margin-top: 0.25rem;
}

@media (max-width: 768px) {
  .registration-header h1 {
    font-size: 2rem;
  }
  
  .container {
    margin: 1rem;
    border-radius: 16px;
  }
}
</style>