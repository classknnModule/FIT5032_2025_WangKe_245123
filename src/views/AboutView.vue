<template>
  <div class="container mt-5">
    <div class="row">
      <div class="col-md-8 offset-md-2">
        <h1 class="text-center mb-4">❤ Mental Health Dashboard</h1>

        <!-- Dashboard Actions -->
        <div class="dashboard-actions mb-4">
          <button @click="goToEmail" class="email-button">
            📧 Send Email
          </button>
        </div>

        <div class="dashboard-grid">
          <div class="dashboard-item">
            <h4>Height:</h4>
            <div class="value-placeholder">-- cm</div>
          </div>
          <div class="dashboard-item">
            <h4>Weight:</h4>
            <div class="value-placeholder">-- kg</div>
          </div>
          <div class="dashboard-item">
            <h4>Sleep Time:</h4>
            <div class="value-placeholder">-- hours</div>
          </div>
          <div class="dashboard-item">
            <h4>Exercise Time:</h4>
            <div class="value-placeholder">-- minutes</div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div class="logout-section">
    <button @click="logout" class="logout-btn">Logout</button>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

const logout = () => {
  localStorage.removeItem('isAuthenticated')
  localStorage.removeItem('currentUser')
  router.push('/login')
}

const goToEmail = () => {
  router.push('/email')
}
</script>

<style scoped>
.dashboard-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 2rem;
}

.dashboard-header {
  text-align: center;
  margin-bottom: 3rem;
  color: white;
}

.dashboard-header h1 {
  font-size: 3rem;
  font-weight: 700;
  margin-bottom: 1rem;
  text-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.dashboard-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

.metric-card {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border-radius: 20px;
  padding: 2.5rem;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.metric-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(135deg, #6366f1, #ec4899);
}

.metric-card:hover {
  transform: translateY(-8px) scale(1.02);
  box-shadow: 0 30px 60px rgba(0, 0, 0, 0.15);
}

.metric-card h3 {
  font-size: 1.5rem;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.metric-icon {
  font-size: 2rem;
  padding: 0.5rem;
  border-radius: 12px;
  background: linear-gradient(135deg, #6366f1, #ec4899);
  color: white;
  box-shadow: 0 4px 12px rgba(99, 102, 241, 0.3);
}

.metric-value {
  font-size: 2.5rem;
  font-weight: 800;
  background: linear-gradient(135deg, #6366f1, #ec4899);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 0.5rem;
}

.metric-label {
  color: #6b7280;
  font-size: 1rem;
  font-weight: 500;
}

.logout-section {
  text-align: center;
  margin-top: 3rem;
}

.logout-btn {
  background: linear-gradient(135deg, #ef4444, #dc2626);
  color: white;
  border: none;
  padding: 1rem 2.5rem;
  border-radius: 50px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 4px 15px rgba(239, 68, 68, 0.3);
  display: inline-flex;
  align-items: center;
  gap: 0.75rem;
}

.logout-btn:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 25px rgba(239, 68, 68, 0.4);
  background: linear-gradient(135deg, #dc2626, #b91c1c);
}

@media (max-width: 768px) {
  .dashboard-container {
    padding: 1rem;
  }

  .dashboard-header h1 {
    font-size: 2.5rem;
  }

  .dashboard-grid {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }

  .metric-card {
    padding: 2rem 1.5rem;
  }

  .metric-value {
    font-size: 2rem;
  }
}

@media (max-width: 480px) {
  .dashboard-header h1 {
    font-size: 2rem;
  }

  .metric-card {
    padding: 1.5rem 1rem;
  }

  .metric-card h3 {
    font-size: 1.3rem;
  }

  .metric-value {
    font-size: 1.8rem;
  }
}

.dashboard-actions {
  display: flex;
  justify-content: center;
  margin-bottom: 2rem;
}

.email-button {
  background: linear-gradient(135deg, #10b981, #059669);
  color: white;
  border: none;
  padding: 1rem 2rem;
  border-radius: 50px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 4px 15px rgba(16, 185, 129, 0.3);
  display: inline-flex;
  align-items: center;
  gap: 0.75rem;
}

.email-button:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 25px rgba(16, 185, 129, 0.4);
  background: linear-gradient(135deg, #059669, #047857);
}
</style>
