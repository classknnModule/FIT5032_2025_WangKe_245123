<template>
  <div class="login-container">
    <div class="login-card">
      <div class="login-header">
        <h1>Login</h1>
      </div>

      <form @submit.prevent="handleLogin" class="login-form">
        <!-- User Type Selection -->
        <div class="form-group">
          <label for="userType">User Type</label>
          <select
            id="userType"
            v-model="credentials.userType"
            required
            :disabled="isLoading"
            class="form-input"
          >
            <option value="user">Regular User</option>
            <option value="admin">Administrator</option>
          </select>
        </div>

        <div class="form-group">
          <label for="username">Username</label>
          <input
            id="username"
            type="text"
            v-model="credentials.username"
            placeholder="Enter your username"
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
            v-model="credentials.password"
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

        <button type="submit" :disabled="isLoading || !isFormValid" class="login-button">
          <span v-if="isLoading">Logging in...</span>
          <span v-else>Login</span>
        </button>
      </form>
    </div>
  </div>
</template>

<script>
import { ref, computed, inject, onMounted } from 'vue'
import { useRouter } from 'vue-router'

export default {
  name: 'LoginView',
  setup() {
    const router = useRouter()

    const credentials = ref({
      username: '',
      password: '',
      userType: '',
    })

    const errorMessage = ref('')
    const successMessage = ref('')
    const isLoading = ref(false)
    const registeredUsers = ref([])

    const DEFAULT_ADMIN = {
      username: 'admin',
      password: '12345678',
      gender: 'admin',
      isAustralian: true,
      reason: 'System Administrator',
    }

    const DEFAULT_USER = {
      username: 'user',
      password: '123',
      gender: 'other',
      isAustralian: true,
      reason: 'Default User Account',
    }

    const authState = inject('authState', null)

    onMounted(() => {
      loadRegisteredUsers()
    })

    const loadRegisteredUsers = () => {
      try {
        const stored = localStorage.getItem('submittedCards')
        if (stored) {
          registeredUsers.value = JSON.parse(stored)
        }
      } catch (error) {
        console.error('Error loading registered users:', error)
      }
    }

    const isFormValid = computed(() => {
      return credentials.value.username.trim() !== '' && credentials.value.password.trim() !== ''
    })

    const clearMessages = () => {
      setTimeout(() => {
        errorMessage.value = ''
        successMessage.value = ''
      }, 3000)
    }

    const validateCredentials = (username, password, userType) => {
      // Check registered users and default user (for regular user type)
      if (userType === 'user') {
        const registeredUser = registeredUsers.value.find(
          (user) => user.username === username && user.password === password,
        )
        if (registeredUser) {
          return { isValid: true, user: registeredUser }
        }

        // Check default user
        if (username === DEFAULT_USER.username && password === DEFAULT_USER.password) {
          return { isValid: true, user: DEFAULT_USER }
        }
      }

      // Check admin credentials (only for admin user type)
      if (userType === 'admin' &&
          username === DEFAULT_ADMIN.username &&
          password === DEFAULT_ADMIN.password) {
        return { isValid: true, user: DEFAULT_ADMIN }
      }

      return { isValid: false, user: null }
    }

    const handleLogin = async () => {
      errorMessage.value = ''
      successMessage.value = ''
      isLoading.value = true

      try {
        loadRegisteredUsers()

        await new Promise((resolve) => setTimeout(resolve, 1000))

        const validation = validateCredentials(
          credentials.value.username,
          credentials.value.password,
          credentials.value.userType
        )

        if (validation.isValid) {
          if (authState) {
            authState.isAuthenticated.value = true
            authState.user.value = {
              username: validation.user.username,
              gender: validation.user.gender,
              isAustralian: validation.user.isAustralian,
              reason: validation.user.reason,
            }
          } else {
            localStorage.setItem('isAuthenticated', 'true')
            localStorage.setItem(
              'currentUser',
              JSON.stringify({
                username: validation.user.username,
                gender: validation.user.gender,
                isAustralian: validation.user.isAustralian,
                reason: validation.user.reason,
              }),
            )
          }

          successMessage.value = 'Login successful! Redirecting...'

          setTimeout(() => {
            const redirectTo = router.currentRoute.value.query.redirect || '/about'
            router.push(redirectTo)
          }, 1500)
        } else {
          if (registeredUsers.value.length === 0) {
            errorMessage.value =
              'Invalid credentials. Try the demo credentials below or register first.'
          } else {
            errorMessage.value =
              'Invalid username or password. Please check your credentials or register first.'
          }
          clearMessages()
        }
      } catch (error) {
        errorMessage.value = 'An error occurred during login. Please try again.'
        clearMessages()
      } finally {
        isLoading.value = false
      }
    }

    const clearForm = () => {
      credentials.value.username = ''
      credentials.value.password = ''
      errorMessage.value = ''
      successMessage.value = ''
    }

    return {
      credentials,
      errorMessage,
      successMessage,
      isLoading,
      isFormValid,
      registeredUsers,
      handleLogin,
      clearForm,
    }
  },
}
</script>

<style scoped>
.login-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px;
}

.login-card {
  background: white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
  width: 100%;
  max-width: 450px;
  max-height: 90vh;
  overflow-y: auto;
}

.login-header {
  text-align: center;
  margin-bottom: 2rem;
}

.login-header h1 {
  color: #333;
  margin-bottom: 0.5rem;
  font-size: 1.8rem;
}

.login-header p {
  color: #666;
  margin: 0;
}

.login-form {
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
  font-weight: 500;
}

.form-input {
  width: 100%;
  padding: 0.75rem;
  border: 2px solid #ddd;
  border-radius: 8px;
  font-size: 1rem;
  transition: border-color 0.3s ease;
  box-sizing: border-box;
}

.form-input:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.form-input:disabled {
  background-color: #f5f5f5;
  cursor: not-allowed;
}

.error-message {
  background-color: #fee;
  color: #c33;
  padding: 0.75rem;
  border-radius: 6px;
  margin-bottom: 1rem;
  border: 1px solid #fcc;
  text-align: center;
}

.success-message {
  background-color: #efe;
  color: #363;
  padding: 0.75rem;
  border-radius: 6px;
  margin-bottom: 1rem;
  border: 1px solid #cfc;
  text-align: center;
}

.login-button {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-bottom: 1.5rem;
}

.login-button:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(102, 126, 234, 0.3);
}

.login-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}

.registration-link {
  text-align: center;
  margin-bottom: 1.5rem;
  padding-top: 1rem;
  border-top: 1px solid #eee;
}

.registration-link p {
  color: #666;
  margin: 0;
}

.register-link {
  color: #667eea;
  text-decoration: none;
  font-weight: 500;
}

.register-link:hover {
  text-decoration: underline;
}

.demo-credentials {
  background-color: #f8f9fa;
  padding: 1rem;
  border-radius: 8px;
  border-left: 4px solid #667eea;
  margin-bottom: 1rem;
}

.demo-credentials h3 {
  margin: 0 0 0.5rem 0;
  color: #333;
  font-size: 0.9rem;
}

.demo-credentials p {
  margin: 0.25rem 0;
  font-size: 0.85rem;
  color: #555;
}

.demo-credentials strong {
  color: #667eea;
}

.registered-users {
  background-color: #e8f4f8;
  padding: 1rem;
  border-radius: 8px;
  border-left: 4px solid #2196f3;
}

.registered-users h3 {
  margin: 0 0 0.5rem 0;
  color: #333;
  font-size: 0.9rem;
}

.user-list {
  max-height: 150px;
  overflow-y: auto;
}

.user-item {
  padding: 0.25rem 0;
  font-size: 0.85rem;
  color: #555;
  border-bottom: 1px solid #ddd;
}

.user-item:last-child {
  border-bottom: none;
}

@media (max-width: 480px) {
  .login-container {
    padding: 10px;
  }

  .login-card {
    padding: 1.5rem;
  }

  .login-header h1 {
    font-size: 1.5rem;
  }
}

.error-message,
.success-message {
  animation: slideIn 0.3s ease-out;
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
</style>
