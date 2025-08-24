<template>
  <div class="admin-login">
    <div class="login-container">
      <div class="login-card">
        <div class="login-header">
          <h2>Admin Login</h2>
          <p>Please enter your credentials</p>
        </div>
        
        <form @submit.prevent="handleLogin" class="login-form">
          <div class="form-group">
            <label for="username">Username</label>
            <input
              id="username"
              v-model="credentials.username"
              type="text"
              placeholder="Enter username"
              required
            />
          </div>
          
          <div class="form-group">
            <label for="password">Password</label>
            <input
              id="password"
              v-model="credentials.password"
              type="password"
              placeholder="Enter password"
              required
            />
          </div>
          
          <div v-if="errorMessage" class="error-message">
            {{ errorMessage }}
          </div>
          
          <button type="submit" class="login-btn" :disabled="isLoading">
            <span v-if="isLoading">Logging in...</span>
            <span v-else>Login</span>
          </button>
        </form>
        
        <div v-if="isLoggedIn" class="success-message">
          <p>Welcome, Admin! You are successfully logged in.</p>
          <button @click="handleLogout" class="logout-btn">Logout</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AdminLogin',
  data() {
    return {
      credentials: {
        username: '',
        password: ''
      },
      errorMessage: '',
      isLoading: false,
      isLoggedIn: false,
      defaultAdmin: {
        username: 'admin',
        password: '020912'
      }
    }
  },
  mounted() {
    this.checkLoginStatus()
  },
  methods: {
    handleLogin() {
      this.isLoading = true
      this.errorMessage = ''
      
      setTimeout(() => {
        if (this.credentials.username === this.defaultAdmin.username && 
            this.credentials.password === this.defaultAdmin.password) {
          
          const loginData = {
            username: this.credentials.username,
            loginTime: new Date().toISOString(),
            isAdmin: true
          }
          
          localStorage.setItem('adminLogin', JSON.stringify(loginData))
          this.isLoggedIn = true
          this.credentials = { username: '', password: '' }
          
          this.$router.push('/admin-dashboard')
          this.$emit('login-success', loginData)
        } else {
          this.errorMessage = 'Invalid username or password'
        }
        
        this.isLoading = false
      }, 1000)
    },
    
    handleLogout() {
      localStorage.removeItem('adminLogin')
      this.isLoggedIn = false
      this.credentials = { username: '', password: '' }
      this.errorMessage = ''
      
      this.$emit('logout')
    },
    
    checkLoginStatus() {
      const loginData = localStorage.getItem('adminLogin')
      if (loginData) {
        try {
          const parsedData = JSON.parse(loginData)
          if (parsedData.isAdmin) {
            this.isLoggedIn = true
          }
        } catch (error) {
          localStorage.removeItem('adminLogin')
        }
      }
    },
    
    getLoginData() {
      const loginData = localStorage.getItem('adminLogin')
      return loginData ? JSON.parse(loginData) : null
    }
  }
}
</script>

<style scoped>
.admin-login {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px;
}

.login-container {
  width: 100%;
  max-width: 400px;
}

.login-card {
  background: white;
  border-radius: 12px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  padding: 40px;
  animation: slideUp 0.6s ease-out;
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.login-header {
  text-align: center;
  margin-bottom: 30px;
}

.login-header h2 {
  color: #333;
  margin: 0 0 8px 0;
  font-size: 28px;
  font-weight: 600;
}

.login-header p {
  color: #666;
  margin: 0;
  font-size: 14px;
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-group label {
  color: #333;
  font-weight: 500;
  font-size: 14px;
}

.form-group input {
  padding: 12px 16px;
  border: 2px solid #e1e5e9;
  border-radius: 8px;
  font-size: 16px;
  transition: all 0.3s ease;
  outline: none;
}

.form-group input:focus {
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.error-message {
  background: #fee;
  color: #c53030;
  padding: 12px 16px;
  border-radius: 8px;
  border: 1px solid #fed7d7;
  font-size: 14px;
  text-align: center;
}

.login-btn {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  padding: 14px 24px;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: 10px;
}

.login-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(102, 126, 234, 0.3);
}

.login-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
  transform: none;
}

.success-message {
  text-align: center;
  padding: 20px;
  background: #f0fff4;
  border: 1px solid #9ae6b4;
  border-radius: 8px;
  margin-top: 20px;
}

.success-message p {
  color: #2d3748;
  margin: 0 0 15px 0;
  font-weight: 500;
}

.logout-btn {
  background: #e53e3e;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 6px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.logout-btn:hover {
  background: #c53030;
  transform: translateY(-1px);
}

@media (max-width: 480px) {
  .admin-login {
    padding: 10px;
  }
  
  .login-card {
    padding: 30px 20px;
  }
  
  .login-header h2 {
    font-size: 24px;
  }
}
</style>