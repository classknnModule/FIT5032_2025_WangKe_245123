<template>
  <div class="about">
    <h1>Mental Health Dashboard</h1>
    
    <div class="dashboard-grid">
      <div class="dashboard-section">
        <h2>Health Metrics</h2>
        <div class="metrics-grid">
          <div class="metric-card">
            <h3>Height</h3>
            <p>{{ height }} cm</p>
          </div>
          <div class="metric-card">
            <h3>Weight</h3>
            <p>{{ weight }} kg</p>
          </div>
          <div class="metric-card">
            <h3>Sleep Time</h3>
            <p>{{ sleepTime }} hours</p>
          </div>
          <div class="metric-card">
            <h3>Exercise Time</h3>
            <p>{{ exerciseTime }} minutes</p>
          </div>
        </div>
      </div>
      
      <div class="dashboard-section">
        <h2>Quick Actions</h2>
        <div class="actions-grid">
          <button @click="sendEmail" class="email-btn">Send Email</button>
          <button @click="logout" class="logout-btn">Logout</button>
        </div>
      </div>
      
      <div class="dashboard-section full-width">
        <h2>Appointment System</h2>
        <AppointmentBooking />
      </div>
      
      <div class="dashboard-section full-width">
        <h2>Location Services</h2>
        <MapComponent />
      </div>
    </div>
  </div>
</template>

<script>
import { getAuth, signOut } from 'firebase/auth'
import AppointmentBooking from '@/components/AppointmentBooking.vue'
import MapComponent from '@/components/MapComponent.vue'

export default {
  name: 'AboutView',
  components: {
    AppointmentBooking,
    MapComponent
  },
  data() {
    return {
      height: 175,
      weight: 70,
      sleepTime: 8,
      exerciseTime: 30
    }
  },
  methods: {
    sendEmail() {
      this.$router.push('/email')
    },
    async logout() {
      try {
        const auth = getAuth()
        await signOut(auth)
        this.$router.push('/login')
      } catch (error) {
        console.error('Logout error:', error)
        alert('Logout failed. Please try again.')
      }
    }
  }
}
</script>

<style scoped>
.about {
  padding: 20px;
  max-width: 1400px;
  margin: 0 auto;
}

.about h1 {
  text-align: center;
  color: #2c3e50;
  margin-bottom: 30px;
  font-size: 2.5rem;
}

.dashboard-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  margin-bottom: 20px;
}

.dashboard-section {
  background: white;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  border: 1px solid #e1e8ed;
}

.dashboard-section.full-width {
  grid-column: 1 / -1;
}

.dashboard-section h2 {
  color: #2c3e50;
  margin-bottom: 15px;
  font-size: 1.5rem;
  border-bottom: 2px solid #3498db;
  padding-bottom: 5px;
}

.metrics-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 15px;
}

.metric-card {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 20px;
  border-radius: 8px;
  text-align: center;
  transition: transform 0.3s ease;
}

.metric-card:hover {
  transform: translateY(-5px);
}

.metric-card h3 {
  margin: 0 0 10px 0;
  font-size: 1.1rem;
  opacity: 0.9;
}

.metric-card p {
  margin: 0;
  font-size: 1.8rem;
  font-weight: bold;
}

.actions-grid {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.email-btn, .logout-btn {
  padding: 15px 20px;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;
}

.email-btn {
  background: linear-gradient(135deg, #4CAF50, #45a049);
  color: white;
}

.email-btn:hover {
  background: linear-gradient(135deg, #45a049, #3d8b40);
  transform: translateY(-2px);
}

.logout-btn {
  background: linear-gradient(135deg, #f44336, #d32f2f);
  color: white;
}

.logout-btn:hover {
  background: linear-gradient(135deg, #d32f2f, #b71c1c);
  transform: translateY(-2px);
}

@media (max-width: 768px) {
  .dashboard-grid {
    grid-template-columns: 1fr;
  }
  
  .metrics-grid {
    grid-template-columns: 1fr;
  }
  
  .about h1 {
    font-size: 2rem;
  }
}
</style>
