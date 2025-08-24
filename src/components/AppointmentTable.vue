<template>
  <div class="appointment-table-container">
    <div class="table-header">
      <h3>Appointment Records</h3>
      <div class="table-controls">
        <div class="search-box">
          <input
            v-model="searchTerm"
            type="text"
            placeholder="Search appointments..."
            class="search-input"
          />
        </div>
        <div class="filter-controls">
          <select v-model="statusFilter" class="status-filter">
            <option value="">All Status</option>
            <option value="scheduled">Scheduled</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
          <select v-model="timeRange" class="time-filter">
            <option value="all">All Time</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="year">This Year</option>
          </select>
        </div>
      </div>
    </div>

    <div class="column-search-row">
      <div class="column-search">
        <input
          v-model="columnSearch.title"
          type="text"
          placeholder="Search title..."
          class="column-search-input"
        />
      </div>
      <div class="column-search">
        <input
          v-model="columnSearch.date"
          type="text"
          placeholder="Search date..."
          class="column-search-input"
        />
      </div>
      <div class="column-search">
        <input
          v-model="columnSearch.time"
          type="text"
          placeholder="Search time..."
          class="column-search-input"
        />
      </div>
      <div class="column-search">
        <input
          v-model="columnSearch.duration"
          type="text"
          placeholder="Search duration..."
          class="column-search-input"
        />
      </div>
      <div class="column-search">
        <select v-model="columnSearch.status" class="column-search-select">
          <option value="">All Status</option>
          <option value="scheduled">Scheduled</option>
          <option value="completed">Completed</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>
      <div class="column-search">
        <input
          v-model="columnSearch.description"
          type="text"
          placeholder="Search description..."
          class="column-search-input"
        />
      </div>
      <div class="column-search">
        <span class="column-search-placeholder">Actions</span>
      </div>
    </div>

    <div class="table-wrapper">
      <table class="appointment-table">
        <thead>
          <tr>
            <th @click="sortBy('title')" class="sortable">
              Title
              <span class="sort-icon" :class="getSortClass('title')">↕</span>
            </th>
            <th @click="sortBy('start')" class="sortable">
              Date
              <span class="sort-icon" :class="getSortClass('start')">↕</span>
            </th>
            <th @click="sortBy('start')" class="sortable">
              Time
              <span class="sort-icon" :class="getSortClass('start')">↕</span>
            </th>
            <th @click="sortBy('duration')" class="sortable">
              Duration
              <span class="sort-icon" :class="getSortClass('duration')">↕</span>
            </th>
            <th @click="sortBy('status')" class="sortable">
              Status
              <span class="sort-icon" :class="getSortClass('status')">↕</span>
            </th>
            <th>Description</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="paginatedAppointments.length === 0">
            <td colspan="7" class="no-data">No appointments found</td>
          </tr>
          <tr
            v-for="appointment in paginatedAppointments"
            :key="appointment.id"
            :class="getRowClass(appointment)"
          >
            <td class="title-cell">{{ appointment.title }}</td>
            <td class="date-cell">{{ formatDate(appointment.start) }}</td>
            <td class="time-cell">{{ formatTime(appointment.start) }} - {{ formatTime(appointment.end) }}</td>
            <td class="duration-cell">{{ getDuration(appointment) }} min</td>
            <td class="status-cell">
              <span :class="getStatusClass(getStatus(appointment))">{{ getStatus(appointment) }}</span>
            </td>
            <td class="description-cell">{{ getDescription(appointment) }}</td>
            <td class="actions-cell">
              <button
                v-if="getStatus(appointment) === 'scheduled'"
                @click="updateStatus(appointment.id, 'completed')"
                class="btn-complete"
              >
                Complete
              </button>
              <button
                v-if="getStatus(appointment) === 'scheduled'"
                @click="updateStatus(appointment.id, 'cancelled')"
                class="btn-cancel"
              >
                Cancel
              </button>
              <span v-if="getStatus(appointment) !== 'scheduled'" class="status-final">
                {{ getStatus(appointment) }}
              </span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="pagination-container">
      <div class="pagination-info">
        Showing {{ startIndex + 1 }} to {{ endIndex }} of {{ filteredAppointments.length }} entries
      </div>
      <div class="pagination-controls">
        <button
          @click="goToPage(currentPage - 1)"
          :disabled="currentPage === 1"
          class="pagination-btn"
        >
          Previous
        </button>
        <span class="pagination-pages">
          <button
            v-for="page in visiblePages"
            :key="page"
            @click="goToPage(page)"
            :class="['pagination-btn', { 'active': page === currentPage }]"
          >
            {{ page }}
          </button>
        </span>
        <button
          @click="goToPage(currentPage + 1)"
          :disabled="currentPage === totalPages"
          class="pagination-btn"
        >
          Next
        </button>
      </div>
    </div>

    <div class="table-footer">
      <div class="summary-stats">
        <span class="stat-item">
          Total: {{ appointments.length }}
        </span>
        <span class="stat-item">
          Scheduled: {{ getStatusCount('scheduled') }}
        </span>
        <span class="stat-item">
          Completed: {{ getStatusCount('completed') }}
        </span>
        <span class="stat-item">
          Cancelled: {{ getStatusCount('cancelled') }}
        </span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AppointmentTable',
  data() {
    return {
      appointments: [],
      searchTerm: '',
      statusFilter: '',
      timeRange: 'all',
      sortField: 'start',
      sortDirection: 'desc',
      refreshInterval: null,
      currentPage: 1,
      itemsPerPage: 10,
      columnSearch: {
        title: '',
        date: '',
        time: '',
        duration: '',
        status: '',
        description: ''
      }
    }
  },
  computed: {
    filteredAppointments() {
      let filtered = [...this.appointments]

      if (this.searchTerm) {
        const term = this.searchTerm.toLowerCase()
        filtered = filtered.filter(apt =>
          apt.title.toLowerCase().includes(term) ||
          this.getDescription(apt).toLowerCase().includes(term)
        )
      }

      if (this.columnSearch.title) {
        const term = this.columnSearch.title.toLowerCase()
        filtered = filtered.filter(apt => apt.title.toLowerCase().includes(term))
      }

      if (this.columnSearch.date) {
        const term = this.columnSearch.date.toLowerCase()
        filtered = filtered.filter(apt => this.formatDate(apt.start).toLowerCase().includes(term))
      }

      if (this.columnSearch.time) {
        const term = this.columnSearch.time.toLowerCase()
        filtered = filtered.filter(apt =>
          (this.formatTime(apt.start) + ' - ' + this.formatTime(apt.end)).toLowerCase().includes(term)
        )
      }

      if (this.columnSearch.duration) {
        const term = this.columnSearch.duration.toLowerCase()
        filtered = filtered.filter(apt =>
          this.getDuration(apt).toString().includes(term)
        )
      }

      if (this.columnSearch.status) {
        filtered = filtered.filter(apt => this.getStatus(apt) === this.columnSearch.status)
      }

      if (this.columnSearch.description) {
        const term = this.columnSearch.description.toLowerCase()
        filtered = filtered.filter(apt => this.getDescription(apt).toLowerCase().includes(term))
      }

      if (this.statusFilter) {
        filtered = filtered.filter(apt => this.getStatus(apt) === this.statusFilter)
      }

      if (this.timeRange !== 'all') {
        const now = new Date()
        const filterDate = new Date()

        switch (this.timeRange) {
          case 'week':
            filterDate.setDate(now.getDate() - 7)
            break
          case 'month':
            filterDate.setMonth(now.getMonth() - 1)
            break
          case 'year':
            filterDate.setFullYear(now.getFullYear() - 1)
            break
        }

        filtered = filtered.filter(apt => new Date(apt.start) >= filterDate)
      }

      return filtered.sort((a, b) => {
        let aVal, bVal

        if (this.sortField === 'duration') {
          aVal = this.getDuration(a)
          bVal = this.getDuration(b)
        } else if (this.sortField === 'status') {
          aVal = this.getStatus(a)
          bVal = this.getStatus(b)
        } else {
          aVal = a[this.sortField]
          bVal = b[this.sortField]
        }

        if (this.sortDirection === 'asc') {
          return aVal > bVal ? 1 : -1
        } else {
          return aVal < bVal ? 1 : -1
        }
      })
    },

    totalPages() {
      return Math.ceil(this.filteredAppointments.length / this.itemsPerPage)
    },

    paginatedAppointments() {
      const start = (this.currentPage - 1) * this.itemsPerPage
      const end = start + this.itemsPerPage
      return this.filteredAppointments.slice(start, end)
    },

    startIndex() {
      return (this.currentPage - 1) * this.itemsPerPage
    },

    endIndex() {
      return Math.min(this.startIndex + this.itemsPerPage, this.filteredAppointments.length)
    },

    visiblePages() {
      const pages = []
      const maxVisible = 5
      let start = Math.max(1, this.currentPage - Math.floor(maxVisible / 2))
      let end = Math.min(this.totalPages, start + maxVisible - 1)

      if (end - start + 1 < maxVisible) {
        start = Math.max(1, end - maxVisible + 1)
      }

      for (let i = start; i <= end; i++) {
        pages.push(i)
      }

      return pages
    }
  },
  watch: {
    filteredAppointments() {
      if (this.currentPage > this.totalPages && this.totalPages > 0) {
        this.currentPage = this.totalPages
      }
    }
  },
  mounted() {
    this.loadAppointments()
    this.refreshInterval = setInterval(this.loadAppointments, 1000)
  },
  beforeUnmount() {
    if (this.refreshInterval) {
      clearInterval(this.refreshInterval)
    }
  },
  methods: {
    loadAppointments() {
      try {
        const saved = localStorage.getItem('appointments')
        if (saved) {
          this.appointments = JSON.parse(saved)
        } else {
          this.appointments = []
        }
      } catch (error) {
        console.error('Error loading appointments from localStorage:', error)
        this.appointments = []
      }
    },

    saveAppointments() {
      try {
        localStorage.setItem('appointments', JSON.stringify(this.appointments))
      } catch (error) {
        console.error('Error saving appointments to localStorage:', error)
      }
    },

    sortBy(field) {
      if (this.sortField === field) {
        this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc'
      } else {
        this.sortField = field
        this.sortDirection = 'asc'
      }
    },

    getSortClass(field) {
      if (this.sortField !== field) return ''
      return this.sortDirection === 'asc' ? 'sort-asc' : 'sort-desc'
    },

    getRowClass(appointment) {
      const status = this.getStatus(appointment)
      return {
        'row-scheduled': status === 'scheduled',
        'row-completed': status === 'completed',
        'row-cancelled': status === 'cancelled'
      }
    },

    getStatusClass(status) {
      return {
        'status-scheduled': status === 'scheduled',
        'status-completed': status === 'completed',
        'status-cancelled': status === 'cancelled'
      }
    },

    getStatus(appointment) {
      return appointment.extendedProps?.status || 'scheduled'
    },

    getDescription(appointment) {
      return appointment.extendedProps?.description || '-'
    },

    getDuration(appointment) {
      if (appointment.extendedProps?.duration) {
        return appointment.extendedProps.duration
      }
      const start = new Date(appointment.start)
      const end = new Date(appointment.end)
      return Math.round((end - start) / 60000)
    },

    getStatusCount(status) {
      return this.appointments.filter(apt => this.getStatus(apt) === status).length
    },

    updateStatus(appointmentId, newStatus) {
      try {
        const appointmentIndex = this.appointments.findIndex(apt => apt.id === appointmentId)
        if (appointmentIndex !== -1) {
          if (!this.appointments[appointmentIndex].extendedProps) {
            this.appointments[appointmentIndex].extendedProps = {}
          }
          this.appointments[appointmentIndex].extendedProps.status = newStatus
          this.saveAppointments()
        }
      } catch (error) {
        console.error('Error updating appointment status:', error)
        alert('Failed to update appointment status')
      }
    },

    formatDate(date) {
      return new Date(date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      })
    },

    formatTime(date) {
      return new Date(date).toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
      })
    }
  }
}
</script>

<style scoped>
.appointment-table-container {
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  overflow: hidden;
}

.table-header {
  padding: 24px;
  border-bottom: 1px solid #e1e8ed;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.table-header h3 {
  margin: 0 0 20px 0;
  color: white;
  font-size: 1.8rem;
  font-weight: 600;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.table-controls {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 20px;
}

.search-box {
  flex: 1;
  max-width: 400px;
  position: relative;
}

.search-input {
  width: 100%;
  padding: 12px 16px 12px 44px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 25px;
  font-size: 14px;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
  transition: all 0.3s ease;
  color: #333;
}

.search-input::placeholder {
  color: #666;
}

.search-input:focus {
  outline: none;
  border-color: rgba(255, 255, 255, 0.8);
  background: white;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  transform: translateY(-1px);
}

.search-box::before {
  content: '🔍';
  position: absolute;
  left: 16px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 16px;
  z-index: 1;
}

.filter-controls {
  display: flex;
  gap: 12px;
}

.status-filter,
.time-filter {
  padding: 10px 16px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 20px;
  font-size: 14px;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
  color: #333;
  cursor: pointer;
  transition: all 0.3s ease;
  min-width: 120px;
}

.status-filter:focus,
.time-filter:focus {
  outline: none;
  border-color: rgba(255, 255, 255, 0.8);
  background: white;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  transform: translateY(-1px);
}

.column-search-row {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 12px;
  padding: 20px 24px;
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  border-bottom: 1px solid #e1e8ed;
}

.column-search {
  display: flex;
  align-items: center;
  position: relative;
}

.column-search-input,
.column-search-select {
  width: 100%;
  padding: 10px 14px;
  border: 2px solid #e1e8ed;
  border-radius: 8px;
  font-size: 13px;
  background: white;
  transition: all 0.3s ease;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.column-search-input:focus,
.column-search-select:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1), 0 4px 8px rgba(0, 0, 0, 0.1);
  transform: translateY(-1px);
}

.column-search-placeholder {
  font-size: 13px;
  color: #6c757d;
  text-align: center;
  width: 100%;
  font-weight: 500;
  padding: 10px;
  background: rgba(108, 117, 125, 0.1);
  border-radius: 8px;
}

.pagination-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 24px;
  background: linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%);
  border-top: 1px solid #e1e8ed;
}

.pagination-info {
  font-size: 14px;
  color: #6c757d;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 8px;
}

.pagination-info::before {
  content: '📊';
  font-size: 16px;
}

.pagination-controls {
  display: flex;
  align-items: center;
  gap: 8px;
}

.pagination-btn {
  padding: 10px 16px;
  border: 2px solid #e1e8ed;
  background: white;
  color: #495057;
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.3s ease;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  min-width: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.pagination-btn:hover:not(:disabled) {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-color: #667eea;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
}

.pagination-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
  background: #f8f9fa;
  color: #adb5bd;
}

.pagination-btn.active {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-color: #667eea;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
  transform: translateY(-1px);
}

.pagination-pages {
  display: flex;
  gap: 4px;
  padding: 0 8px;
}

.table-footer {
  padding: 20px 24px;
  background: linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%);
  border-top: 1px solid #e1e8ed;
}

.summary-stats {
  display: flex;
  gap: 24px;
  font-size: 14px;
  justify-content: center;
}

.stat-item {
  color: #495057;
  font-weight: 600;
  padding: 8px 16px;
  background: rgba(102, 126, 234, 0.1);
  border-radius: 20px;
  display: flex;
  align-items: center;
  gap: 6px;
  transition: all 0.3s ease;
}

.stat-item:hover {
  background: rgba(102, 126, 234, 0.2);
  transform: translateY(-1px);
}

@media (max-width: 768px) {
  .table-header {
    padding: 20px;
  }

  .table-controls {
    flex-direction: column;
    align-items: stretch;
    gap: 16px;
  }

  .search-box {
    max-width: none;
  }

  .filter-controls {
    justify-content: space-between;
  }

  .column-search-row {
    display: none;
  }

  .pagination-container {
    flex-direction: column;
    gap: 16px;
    text-align: center;
  }

  .pagination-controls {
    flex-wrap: wrap;
    justify-content: center;
  }

  .summary-stats {
    flex-wrap: wrap;
    gap: 12px;
    justify-content: center;
  }
}
</style>

<style scoped>
.table-wrapper {
  overflow-x: auto;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

.appointment-table {
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
  font-size: 14px;
  background: white;
}

.appointment-table th,
.appointment-table td {
  padding: 16px 20px;
  text-align: center;
  border-bottom: 1px solid #f1f3f4;
  vertical-align: middle;
  position: relative;
}

.appointment-table th {
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  font-weight: 600;
  color: #495057;
  position: sticky;
  top: 0;
  z-index: 10;
  border-bottom: 2px solid #dee2e6;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  font-size: 13px;
}

.appointment-table th:first-child {
  border-top-left-radius: 12px;
}

.appointment-table th:last-child {
  border-top-right-radius: 12px;
}

.appointment-table tbody tr {
  transition: all 0.3s ease;
  background: white;
}

.appointment-table tbody tr:hover {
  background: linear-gradient(135deg, #f8f9ff 0%, #fff5f5 100%);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.appointment-table tbody tr:last-child td:first-child {
  border-bottom-left-radius: 12px;
}

.appointment-table tbody tr:last-child td:last-child {
  border-bottom-right-radius: 12px;
}

.sortable {
  cursor: pointer;
  user-select: none;
  position: relative;
  transition: all 0.3s ease;
}

.sortable:hover {
  background: linear-gradient(135deg, #e9ecef 0%, #dee2e6 100%);
  color: #667eea;
}

.sort-icon {
  margin-left: 8px;
  opacity: 0.5;
  font-size: 12px;
  transition: all 0.3s ease;
}

.sort-asc .sort-icon::after {
  content: '↑';
  opacity: 1;
  color: #667eea;
  font-weight: bold;
}

.sort-desc .sort-icon::after {
  content: '↓';
  opacity: 1;
  color: #667eea;
  font-weight: bold;
}

.title-cell {
  font-weight: 600;
  color: #2c3e50;
  max-width: 200px;
  word-wrap: break-word;
  text-align: left;
  padding-left: 24px;
}

.date-cell {
  font-weight: 500;
  color: #495057;
  min-width: 120px;
  white-space: nowrap;
}

.time-cell {
  font-family: 'Courier New', monospace;
  color: #6c757d;
  font-size: 13px;
  min-width: 140px;
  white-space: nowrap;
}

.duration-cell {
  font-weight: 600;
  color: #28a745;
  min-width: 100px;
}

.status-cell {
  min-width: 120px;
}

.description-cell {
  max-width: 250px;
  word-wrap: break-word;
  text-align: left;
  color: #6c757d;
  font-style: italic;
  line-height: 1.4;
}

.actions-cell {
  display: flex;
  gap: 8px;
  justify-content: center;
  align-items: center;
  min-width: 140px;
}

.no-data {
  text-align: center;
  color: #6c757d;
  font-style: italic;
  padding: 60px 20px;
  background: linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%);
  font-size: 16px;
}

.no-data::before {
  content: '📋';
  display: block;
  font-size: 48px;
  margin-bottom: 16px;
  opacity: 0.5;
}

.row-scheduled {
  background: linear-gradient(135deg, #e3f2fd 0%, #f3e5f5 100%);
  border-left: 4px solid #2196f3;
}

.row-completed {
  background: linear-gradient(135deg, #e8f5e8 0%, #f1f8e9 100%);
  border-left: 4px solid #4caf50;
}

.row-cancelled {
  background: linear-gradient(135deg, #ffebee 0%, #fce4ec 100%);
  border-left: 4px solid #f44336;
  opacity: 0.8;
}

.status-scheduled {
  background: linear-gradient(135deg, #2196f3 0%, #21cbf3 100%);
  color: white;
  padding: 6px 12px;
  border-radius: 16px;
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  box-shadow: 0 2px 8px rgba(33, 150, 243, 0.3);
}

.status-completed {
  background: linear-gradient(135deg, #4caf50 0%, #8bc34a 100%);
  color: white;
  padding: 6px 12px;
  border-radius: 16px;
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  box-shadow: 0 2px 8px rgba(76, 175, 80, 0.3);
}

.status-cancelled {
  background: linear-gradient(135deg, #f44336 0%, #e91e63 100%);
  color: white;
  padding: 6px 12px;
  border-radius: 16px;
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  box-shadow: 0 2px 8px rgba(244, 67, 54, 0.3);
}

.btn-complete {
  background: linear-gradient(135deg, #4caf50 0%, #45a049 100%);
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 20px;
  cursor: pointer;
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(76, 175, 80, 0.3);
}

.btn-complete:hover {
  background: linear-gradient(135deg, #45a049 0%, #388e3c 100%);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(76, 175, 80, 0.4);
}

.btn-cancel {
  background: linear-gradient(135deg, #f44336 0%, #d32f2f 100%);
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 20px;
  cursor: pointer;
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(244, 67, 54, 0.3);
}

.btn-cancel:hover {
  background: linear-gradient(135deg, #d32f2f 0%, #c62828 100%);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(244, 67, 54, 0.4);
}

.status-final {
  font-size: 12px;
  color: #6c757d;
  font-style: italic;
  font-weight: 500;
  padding: 6px 12px;
  background: rgba(108, 117, 125, 0.1);
  border-radius: 16px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

@media (max-width: 1200px) {
  .appointment-table th,
  .appointment-table td {
    padding: 12px 16px;
  }

  .title-cell,
  .description-cell {
    max-width: 150px;
  }
}

@media (max-width: 768px) {
  .appointment-table {
    font-size: 12px;
  }

  .appointment-table th,
  .appointment-table td {
    padding: 10px 8px;
  }

  .title-cell {
    max-width: 100px;
    font-size: 11px;
  }

  .description-cell {
    max-width: 80px;
    font-size: 10px;
  }

  .time-cell {
    font-size: 10px;
    min-width: 100px;
  }

  .actions-cell {
    flex-direction: column;
    gap: 4px;
    min-width: 80px;
  }

  .btn-complete,
  .btn-cancel {
    padding: 4px 8px;
    font-size: 10px;
  }

  .status-scheduled,
  .status-completed,
  .status-cancelled {
    padding: 4px 8px;
    font-size: 10px;
  }
}

/* ... existing pagination and other styles ... */
</style>
