<template>
  <div class="admin-dashboard">
    <div class="dashboard-container">
      <div class="dashboard-header">
        <h1>🛡️ Admin Dashboard</h1>
        <p>System Overview and User Management</p>
        <button @click="handleLogout" class="logout-btn">Logout</button>
      </div>

      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-icon">👥</div>
          <div class="stat-content">
            <h3>Total Users</h3>
            <div class="stat-number">{{ userStats.totalUsers }}</div>
            <div class="stat-change positive" v-if="userStats.newUsersToday > 0">
              +{{ userStats.newUsersToday }} today
            </div>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon">📊</div>
          <div class="stat-content">
            <h3>Active Sessions</h3>
            <div class="stat-number">{{ userStats.activeSessions }}</div>
            <div class="stat-change">Current online</div>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon">📈</div>
          <div class="stat-content">
            <h3>Growth Rate</h3>
            <div class="stat-number">{{ userStats.growthRate }}%</div>
            <div class="stat-change positive">This month</div>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon">🔥</div>
          <div class="stat-content">
            <h3>Firebase Status</h3>
            <div class="stat-number">{{ connectionStatus }}</div>
            <div class="stat-change" :class="isConnected ? 'positive' : 'negative'">
              {{ isConnected ? 'Connected' : 'Disconnected' }}
            </div>
          </div>
        </div>
      </div>

      <div class="user-management">
        <div class="section-header">
          <h2>User Management</h2>
          <button @click="refreshUserData" class="refresh-btn" :disabled="isLoading">
            <span v-if="isLoading">🔄</span>
            <span v-else>🔄</span>
            Refresh
          </button>
        </div>

        <div class="user-table-container">
          <table class="user-table">
            <thead>
              <tr>
                <th>User ID</th>
                <th>Email</th>
                <th>Registration Date</th>
                <th>Last Login</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="user in users" :key="user.uid" class="user-row">
                <td>{{ user.uid.substring(0, 8) }}...</td>
                <td>{{ user.email }}</td>
                <td>{{ formatDate(user.creationTime) }}</td>
                <td>{{ formatDate(user.lastSignInTime) }}</td>
                <td>
                  <span class="status-badge" :class="user.disabled ? 'disabled' : 'active'">
                    {{ user.disabled ? 'Disabled' : 'Active' }}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div v-if="isLoading" class="loading-state">
          <div class="loading-spinner"></div>
          <p>Loading user data...</p>
        </div>

        <div v-if="error" class="error-state">
          <p>{{ error }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, computed } from 'vue'
import { getAuth, onAuthStateChanged } from 'firebase/auth'
import { getFirestore, collection, getDocs, query, orderBy, limit } from 'firebase/firestore'
import { useRouter } from 'vue-router'

export default {
  name: 'AdminDashboard',
  setup() {
    const router = useRouter()
    const auth = getAuth()
    const db = getFirestore()

    const users = ref([])
    const isLoading = ref(false)
    const error = ref('')
    const isConnected = ref(true)

    const userStats = ref({
      totalUsers: 0,
      newUsersToday: 0,
      activeSessions: 0,
      growthRate: 0
    })

    const connectionStatus = computed(() => {
      return isConnected.value ? 'Online' : 'Offline'
    })

    const checkAdminAuth = () => {
      const adminData = localStorage.getItem('adminLogin')
      if (!adminData) {
        router.push('/admin-login')
        return false
      }

      try {
        const parsedData = JSON.parse(adminData)
        return parsedData.isAdmin === true
      } catch {
        router.push('/admin-login')
        return false
      }
    }

    const fetchUserData = async () => {
      if (!checkAdminAuth()) return

      isLoading.value = true
      error.value = ''

      // Force show mock data for testing
      const mockUsers = [
        {
          uid: '1',
          email: 'test@student.monash.edu',
          creationTime: new Date('2025-08-23'),
          lastSignInTime: new Date('2025-08-23'),
          disabled: false
        }
      ]

      users.value = mockUsers
      userStats.value = {
        totalUsers: mockUsers.length,
        newUsersToday: 1,
        activeSessions: 8,
        growthRate: 12
      }

      isLoading.value = false
    }

    const refreshUserData = () => {
      fetchUserData()
    }

    const formatDate = (date) => {
      if (!date) return 'N/A'
      return new Date(date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    }

    const handleLogout = () => {
      localStorage.removeItem('adminLogin')
      router.push('/admin-login')
    }

    onMounted(() => {
      if (checkAdminAuth()) {
        fetchUserData()
      }
    })

    return {
      users,
      userStats,
      isLoading,
      error,
      isConnected,
      connectionStatus,
      refreshUserData,
      formatDate,
      handleLogout
    }
  }
}
</script>

<style scoped>
.admin-dashboard {
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  padding: 2rem;
}

.dashboard-container {
  max-width: 1400px;
  margin: 0 auto;
}

.dashboard-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  padding: 2rem;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.dashboard-header h1 {
  margin: 0;
  color: #1f2937;
  font-size: 2rem;
}

.dashboard-header p {
  margin: 0.5rem 0 0 0;
  color: #6b7280;
}

.logout-btn {
  padding: 0.75rem 1.5rem;
  background: #ef4444;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.3s ease;
}

.logout-btn:hover {
  background: #dc2626;
  transform: translateY(-2px);
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.stat-card {
  background: white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  gap: 1.5rem;
  transition: transform 0.3s ease;
}

.stat-card:hover {
  transform: translateY(-4px);
}

.stat-icon {
  font-size: 3rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.stat-content h3 {
  margin: 0 0 0.5rem 0;
  color: #6b7280;
  font-size: 0.9rem;
  font-weight: 500;
}

.stat-number {
  font-size: 2.5rem;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 0.25rem;
}

.stat-change {
  font-size: 0.8rem;
  font-weight: 500;
}

.stat-change.positive {
  color: #10b981;
}

.stat-change.negative {
  color: #ef4444;
}

.user-management {
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 2rem;
  border-bottom: 1px solid #e5e7eb;
}

.section-header h2 {
  margin: 0;
  color: #1f2937;
}

.refresh-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  background: #667eea;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.3s ease;
}

.refresh-btn:hover:not(:disabled) {
  background: #5a67d8;
  transform: translateY(-2px);
}

.refresh-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.user-table-container {
  overflow-x: auto;
}

.user-table {
  width: 100%;
  border-collapse: collapse;
}

.user-table th,
.user-table td {
  padding: 1rem;
  text-align: left;
  border-bottom: 1px solid #e5e7eb;
}

.user-table th {
  background: #f9fafb;
  font-weight: 600;
  color: #374151;
}

.user-row:hover {
  background: #f9fafb;
}

.status-badge {
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 500;
}

.status-badge.active {
  background: #d1fae5;
  color: #065f46;
}

.status-badge.disabled {
  background: #fee2e2;
  color: #991b1b;
}

.loading-state,
.error-state {
  padding: 3rem;
  text-align: center;
  color: #6b7280;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #e5e7eb;
  border-top: 4px solid #667eea;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 1rem;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

@media (max-width: 768px) {
  .admin-dashboard {
    padding: 1rem;
  }

  .dashboard-header {
    flex-direction: column;
    gap: 1rem;
    text-align: center;
  }

  .stats-grid {
    grid-template-columns: 1fr;
  }

  .stat-card {
    padding: 1.5rem;
  }

  .user-table {
    font-size: 0.9rem;
  }
}
</style>

// 在methods中
async fetchBasicStats() {
  try {
    const { auth } = await import('@/firebase/init');
    const currentUser = auth.currentUser;

    if (!currentUser || currentUser.email !== 'admin@example.com') {
      this.error = 'Admin access required';
      return;
    }

    this.stats = {
      totalUsers: 'N/A',
      newUsersToday: 'N/A',
      activeUsers: 1,
      growthRate: 'N/A'
    };

    this.users = [{
      id: currentUser.uid,
      email: currentUser.email,
      createdAt: currentUser.metadata.creationTime,
      lastLogin: currentUser.metadata.lastSignInTime,
      status: 'Active'
    }];

  } catch (error) {
    console.error('Error:', error);
    this.error = 'Failed to load admin data';
  }
}
