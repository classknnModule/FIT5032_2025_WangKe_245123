<template>
  <div class="table-container">
    <div class="table-header">
      <h3>{{ title }}</h3>
      <div class="table-controls">
        <select v-model="selectedTimeRange" @change="filterData" class="table-select">
          <option value="7">Last 7 days</option>
          <option value="30">Last 30 days</option>
          <option value="90">Last 90 days</option>
          <option value="365">Last year</option>
        </select>
        <input
          v-model="searchQuery"
          @input="filterData"
          placeholder="Search..."
          class="search-input"
        />
        <div class="export-controls">
          <button @click="exportToCSV" class="export-btn csv-btn">
            📊 Export CSV
          </button>
          <button @click="exportToPDF" class="export-btn pdf-btn">
            📄 Export PDF
          </button>
        </div>
      </div>
    </div>

    <div class="column-search-row">
      <div class="column-search">
        <input
          v-model="columnSearch.date"
          type="text"
          placeholder="Search date..."
          class="column-search-input"
        />
      </div>
      <div class="column-search">
        <select v-model="columnSearch.mood" class="column-search-select">
          <option value="">All Moods</option>
          <option value="Great">Great</option>
          <option value="Good">Good</option>
          <option value="Okay">Okay</option>
          <option value="Bad">Bad</option>
          <option value="Terrible">Terrible</option>
        </select>
      </div>
      <div class="column-search">
        <input
          v-model="columnSearch.exerciseTime"
          type="text"
          placeholder="Search exercise..."
          class="column-search-input"
        />
      </div>
      <div class="column-search">
        <input
          v-model="columnSearch.sleepTime"
          type="text"
          placeholder="Search sleep..."
          class="column-search-input"
        />
      </div>
    </div>

    <div class="table-wrapper">
      <table class="data-table">
        <thead>
          <tr>
            <th @click="sortBy('date')" class="sortable">
              Date
              <span class="sort-icon" :class="getSortClass('date')">↕</span>
            </th>
            <th @click="sortBy('mood')" class="sortable">
              Mood
              <span class="sort-icon" :class="getSortClass('mood')">↕</span>
            </th>
            <th @click="sortBy('exerciseTime')" class="sortable">
              Exercise Time/h
              <span class="sort-icon" :class="getSortClass('exerciseTime')">↕</span>
            </th>
            <th @click="sortBy('sleepTime')" class="sortable">
              Sleep Time/h
              <span class="sort-icon" :class="getSortClass('sleepTime')">↕</span>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in paginatedData" :key="item.id" class="data-row">
            <td>{{ formatDate(item.date) }}</td>
            <td>
              <span class="mood-badge" :class="getMoodClass(item.mood)">
                {{ item.mood || 'N/A' }}
              </span>
            </td>
            <td class="numeric">{{ item.exerciseTime || 0 }}</td>
            <td class="numeric">{{ item.sleepTime || 0 }}</td>
          </tr>
        </tbody>
      </table>

      <div v-if="paginatedData.length === 0" class="no-data">
        <p>No data available</p>
      </div>
    </div>

    <div class="pagination-container">
      <div class="pagination-info">
        Showing {{ startIndex + 1 }} to {{ endIndex }} of {{ filteredData.length }} entries
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

    <div class="table-stats" v-if="stats">
      <div class="stat-item">
        <span class="stat-label">Total Records:</span>
        <span class="stat-value">{{ filteredData.length }}</span>
      </div>
      <div class="stat-item">
        <span class="stat-label">Avg Exercise:</span>
        <span class="stat-value">{{ stats.avgExercise }}h</span>
      </div>
      <div class="stat-item">
        <span class="stat-label">Avg Sleep:</span>
        <span class="stat-value">{{ stats.avgSleep }}h</span>
      </div>
    </div>

    <div class="add-data-form">
      <h4>Add New Health Record</h4>
      <form @submit.prevent="addNewRecord" class="data-form">
        <div class="form-row">
          <div class="form-group">
            <label for="date">Date:</label>
            <input
              type="date"
              id="date"
              v-model="newRecord.date"
              required
              class="form-input"
            />
          </div>
          <div class="form-group">
            <label for="mood">Mood:</label>
            <select
              id="mood"
              v-model="newRecord.mood"
              required
              class="form-input"
            >
              <option value="">Select mood</option>
              <option value="Great">Great</option>
              <option value="Good">Good</option>
              <option value="Okay">Okay</option>
              <option value="Bad">Bad</option>
              <option value="Terrible">Terrible</option>
            </select>
          </div>
        </div>
        <div class="form-row">
          <div class="form-group">
            <label for="exercise">Exercise Time (hours):</label>
            <input
              type="number"
              id="exercise"
              v-model.number="newRecord.exerciseTime"
              min="0"
              max="24"
              step="0.5"
              required
              class="form-input"
            />
          </div>
          <div class="form-group">
            <label for="sleep">Sleep Time (hours):</label>
            <input
              type="number"
              id="sleep"
              v-model.number="newRecord.sleepTime"
              min="0"
              max="24"
              step="0.5"
              required
              class="form-input"
            />
          </div>
        </div>
        <div class="form-actions">
          <button type="submit" :disabled="isSubmitting" class="submit-btn">
            {{ isSubmitting ? 'Adding...' : 'Add Record' }}
          </button>
          <button type="button" @click="resetForm" class="reset-btn">
            Reset
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import { ChartDataService } from '@/services/chartDataService'

export default {
  name: 'InteractiveChart',
  props: {
    title: {
      type: String,
      default: 'Health Metrics'
    },
    dataType: {
      type: String,
      default: 'combined'
    }
  },
  data() {
    return {
      rawData: [],
      filteredData: [],
      selectedTimeRange: 30,
      searchQuery: '',
      sortField: 'date',
      sortDirection: 'desc',
      stats: null,
      loading: false,
      unsubscribe: null,
      newRecord: {
        date: new Date().toISOString().split('T')[0],
        mood: '',
        exerciseTime: 0,
        sleepTime: 0
      },
      isSubmitting: false,
      currentPage: 1,
      itemsPerPage: 10,
      columnSearch: {
        date: '',
        mood: '',
        exerciseTime: '',
        sleepTime: ''
      }
    }
  },
  computed: {
    totalPages() {
      return Math.ceil(this.filteredData.length / this.itemsPerPage)
    },

    paginatedData() {
      const start = (this.currentPage - 1) * this.itemsPerPage
      const end = start + this.itemsPerPage
      return this.filteredData.slice(start, end)
    },

    startIndex() {
      return (this.currentPage - 1) * this.itemsPerPage
    },

    endIndex() {
      return Math.min(this.startIndex + this.itemsPerPage, this.filteredData.length)
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
    filteredData() {
      if (this.currentPage > this.totalPages && this.totalPages > 0) {
        this.currentPage = this.totalPages
      }
    },
    columnSearch: {
      handler() {
        this.filterData()
      },
      deep: true
    }
  },
  async mounted() {
    await this.loadData()
    this.setupRealtimeUpdates()
  },
  beforeUnmount() {
    if (this.unsubscribe) {
      this.unsubscribe()
    }
  },
  methods: {
    async loadData() {
      try {
        this.loading = true
        this.rawData = await ChartDataService.getHealthMetrics()
        this.filterData()
      } catch (error) {
        console.error('Error loading data:', error)
      } finally {
        this.loading = false
      }
    },

    setupRealtimeUpdates() {
      this.unsubscribe = ChartDataService.subscribeToHealthMetrics((data) => {
        this.rawData = data
        this.filterData()
      })
    },

    filterData() {
      let filtered = [...this.rawData]

      const cutoffDate = new Date()
      cutoffDate.setDate(cutoffDate.getDate() - this.selectedTimeRange)
      filtered = filtered.filter(item => new Date(item.date) >= cutoffDate)

      if (this.searchQuery) {
        const query = this.searchQuery.toLowerCase()
        filtered = filtered.filter(item =>
          (item.mood && item.mood.toLowerCase().includes(query)) ||
          item.exerciseTime.toString().includes(query) ||
          item.sleepTime.toString().includes(query)
        )
      }

      if (this.columnSearch.date) {
        const term = this.columnSearch.date.toLowerCase()
        filtered = filtered.filter(item => this.formatDate(item.date).toLowerCase().includes(term))
      }

      if (this.columnSearch.mood) {
        filtered = filtered.filter(item => item.mood === this.columnSearch.mood)
      }

      if (this.columnSearch.exerciseTime) {
        const term = this.columnSearch.exerciseTime.toLowerCase()
        filtered = filtered.filter(item => item.exerciseTime.toString().includes(term))
      }

      if (this.columnSearch.sleepTime) {
        const term = this.columnSearch.sleepTime.toLowerCase()
        filtered = filtered.filter(item => item.sleepTime.toString().includes(term))
      }

      this.sortData(filtered)
      this.calculateStats()
    },

    goToPage(page) {
      if (page >= 1 && page <= this.totalPages) {
        this.currentPage = page
      }
    },

    sortBy(field) {
      if (this.sortField === field) {
        this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc'
      } else {
        this.sortField = field
        this.sortDirection = 'asc'
      }
      this.sortData([...this.filteredData])
    },

    sortData(data) {
      data.sort((a, b) => {
        let aVal = a[this.sortField]
        let bVal = b[this.sortField]

        if (this.sortField === 'date') {
          aVal = new Date(aVal)
          bVal = new Date(bVal)
        } else if (typeof aVal === 'string') {
          aVal = aVal.toLowerCase()
          bVal = bVal.toLowerCase()
        }

        if (aVal < bVal) return this.sortDirection === 'asc' ? -1 : 1
        if (aVal > bVal) return this.sortDirection === 'asc' ? 1 : -1
        return 0
      })

      this.filteredData = data
    },

    getSortClass(field) {
      if (this.sortField !== field) return ''
      return this.sortDirection === 'asc' ? 'sort-asc' : 'sort-desc'
    },

    getMoodClass(mood) {
      if (!mood) return 'mood-neutral'
      const moodLower = mood.toLowerCase()
      if (moodLower.includes('happy') || moodLower.includes('good') || moodLower.includes('great')) {
        return 'mood-positive'
      } else if (moodLower.includes('sad') || moodLower.includes('bad') || moodLower.includes('terrible')) {
        return 'mood-negative'
      }
      return 'mood-neutral'
    },

    formatDate(date) {
      if (!date) return 'N/A'
      return new Date(date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      })
    },

    calculateStats() {
      if (this.filteredData.length === 0) {
        this.stats = null
        return
      }

      const exerciseTimes = this.filteredData.map(item => item.exerciseTime || 0)
      const sleepTimes = this.filteredData.map(item => item.sleepTime || 0)

      this.stats = {
        avgExercise: (exerciseTimes.reduce((a, b) => a + b, 0) / exerciseTimes.length).toFixed(1),
        avgSleep: (sleepTimes.reduce((a, b) => a + b, 0) / sleepTimes.length).toFixed(1)
      }
    },

    async addNewRecord() {
      try {
        this.isSubmitting = true
        await ChartDataService.addHealthMetric(this.newRecord)
        this.resetForm()
        alert('Health record added successfully!')
      } catch (error) {
        console.error('Error adding record:', error)
        alert('Failed to add record. Please try again.')
      } finally {
        this.isSubmitting = false
      }
    },

    resetForm() {
      this.newRecord = {
        date: new Date().toISOString().split('T')[0],
        mood: '',
        exerciseTime: 0,
        sleepTime: 0
      }
    },

    exportToCSV() {
      const headers = ['Date', 'Mood', 'Exercise Time (h)', 'Sleep Time (h)']
      const csvContent = [headers.join(',')]

      this.paginatedData.forEach(record => {
        const row = [
          `"${this.formatDate(record.date)}"`,
          `"${record.mood}"`,
          `"${record.exerciseTime}"`,
          `"${record.sleepTime}"`
        ]
        csvContent.push(row.join(','))
      })

      const blob = new Blob([csvContent.join('\n')], { type: 'text/csv;charset=utf-8;' })
      const link = document.createElement('a')
      const url = URL.createObjectURL(blob)
      link.setAttribute('href', url)
      link.setAttribute('download', `health_records_${new Date().toISOString().split('T')[0]}.csv`)
      link.style.visibility = 'hidden'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    },

    async exportToPDF() {
      try {
        const { jsPDF } = await import('jspdf')

        const pdf = new jsPDF()
        const pageWidth = pdf.internal.pageSize.getWidth()
        const pageHeight = pdf.internal.pageSize.getHeight()

        pdf.setFontSize(16)
        pdf.text('Health Records', pageWidth / 2, 20, { align: 'center' })

        let yPosition = 40
        const lineHeight = 8
        const margin = 20

        pdf.setFontSize(10)
        const headers = ['Date', 'Mood', 'Exercise (h)', 'Sleep (h)']
        const colWidths = [40, 30, 35, 35]
        let xPosition = margin

        headers.forEach((header, index) => {
          pdf.text(header, xPosition, yPosition)
          xPosition += colWidths[index]
        })

        yPosition += lineHeight
        pdf.line(margin, yPosition, pageWidth - margin, yPosition)
        yPosition += 5

        this.paginatedData.forEach(record => {
          if (yPosition > pageHeight - 30) {
            pdf.addPage()
            yPosition = 20
          }

          xPosition = margin
          const rowData = [
            this.formatDate(record.date),
            record.mood,
            record.exerciseTime.toString(),
            record.sleepTime.toString()
          ]

          rowData.forEach((data, index) => {
            pdf.text(data, xPosition, yPosition)
            xPosition += colWidths[index]
          })

          yPosition += lineHeight
        })

        pdf.save(`health_records_${new Date().toISOString().split('T')[0]}.pdf`)
      } catch (error) {
        console.error('Error exporting PDF:', error)
        alert('Error exporting PDF. Please make sure jsPDF is installed.')
      }
    }
  }
}
</script>

<style scoped>
.table-container {
  background: white;
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.08);
  padding: 0;
  margin: 20px 0;
  overflow: hidden;
}

.table-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0;
  flex-wrap: wrap;
  gap: 20px;
  padding: 24px;
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
  color: white;
}

.table-header h3 {
  margin: 0;
  color: white;
  font-size: 1.8rem;
  font-weight: 600;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.table-controls {
  display: flex;
  gap: 16px;
  align-items: center;
  flex-wrap: wrap;
}

.export-controls {
  display: flex;
  gap: 8px;
  align-items: center;
}

.export-btn {
  padding: 10px 16px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 20px;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
  color: white;
  background: rgba(255, 255, 255, 0.2);
  display: flex;
  align-items: center;
  gap: 6px;
}

.export-btn:hover {
  background: rgba(255, 255, 255, 0.3);
  border-color: rgba(255, 255, 255, 0.5);
  transform: translateY(-1px);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
}

.csv-btn:hover {
  background: rgba(40, 167, 69, 0.8);
  border-color: #28a745;
}

.pdf-btn:hover {
  background: rgba(220, 53, 69, 0.8);
  border-color: #dc3545;
}

.table-select,
.search-input {
  padding: 12px 16px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 25px;
  font-size: 14px;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
  transition: all 0.3s ease;
  color: #333;
}

.search-input {
  min-width: 250px;
  padding-left: 44px;
  position: relative;
}

.table-controls::before {
  content: '🔍';
  position: absolute;
  left: 16px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 16px;
  z-index: 1;
  pointer-events: none;
}

.table-select:focus,
.search-input:focus {
  outline: none;
  border-color: rgba(255, 255, 255, 0.8);
  background: white;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  transform: translateY(-1px);
}

.column-search-row {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
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
  padding: 12px 16px;
  border: 2px solid #e1e8ed;
  border-radius: 10px;
  font-size: 13px;
  background: white;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.column-search-input:focus,
.column-search-select:focus {
  outline: none;
  border-color: #4facfe;
  box-shadow: 0 0 0 3px rgba(79, 172, 254, 0.1), 0 4px 12px rgba(0, 0, 0, 0.1);
  transform: translateY(-1px);
}

.pagination-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24px;
  background: linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%);
  border-top: 1px solid #e1e8ed;
  margin-bottom: 0;
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
  content: '📈';
  font-size: 16px;
}

.pagination-controls {
  display: flex;
  align-items: center;
  gap: 8px;
}

.pagination-btn {
  padding: 12px 18px;
  border: 2px solid #e1e8ed;
  background: white;
  color: #495057;
  border-radius: 10px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  min-width: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.pagination-btn:hover:not(:disabled) {
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
  color: white;
  border-color: #4facfe;
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(79, 172, 254, 0.3);
}

.pagination-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
  background: #f8f9fa;
  color: #adb5bd;
}

.pagination-btn.active {
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
  color: white;
  border-color: #4facfe;
  box-shadow: 0 6px 20px rgba(79, 172, 254, 0.3);
  transform: translateY(-1px);
}

.pagination-pages {
  display: flex;
  gap: 4px;
  padding: 0 12px;
}

.table-stats {
  display: flex;
  justify-content: center;
  gap: 24px;
  padding: 20px 24px;
  background: linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%);
  border-top: 1px solid #e1e8ed;
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 16px 20px;
  background: rgba(79, 172, 254, 0.1);
  border-radius: 12px;
  transition: all 0.3s ease;
  min-width: 120px;
}

.stat-item:hover {
  background: rgba(79, 172, 254, 0.2);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(79, 172, 254, 0.2);
}

.stat-label {
  font-size: 12px;
  color: #6c757d;
  font-weight: 500;
  margin-bottom: 4px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.stat-value {
  font-size: 18px;
  color: #495057;
  font-weight: 700;
}

@media (max-width: 768px) {
  .table-header {
    padding: 20px;
    flex-direction: column;
    align-items: stretch;
    gap: 16px;
  }

  .table-controls {
    flex-direction: column;
    gap: 12px;
  }

  .search-input {
    min-width: auto;
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

  .table-stats {
    flex-wrap: wrap;
    gap: 16px;
  }

  .stat-item {
    min-width: 100px;
  }
}

.table-wrapper {
  overflow-x: auto;
  border-radius: 8px;
  border: 1px solid #e1e5e9;
}

.data-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 14px;
}

.data-table th {
  background: #f8f9fa;
  padding: 12px 16px;
  text-align: center;
  font-weight: 600;
  color: #495057;
  border-bottom: 2px solid #dee2e6;
  position: relative;
}

.data-table th.sortable {
  cursor: pointer;
  user-select: none;
  transition: background-color 0.2s;
}

.data-table th.sortable:hover {
  background: #e9ecef;
}

.sort-icon {
  margin-left: 8px;
  font-size: 12px;
  color: #6c757d;
}

.sort-icon.sort-asc::after {
  content: '↑';
}

.sort-icon.sort-desc::after {
  content: '↓';
}

.data-table td {
  padding: 12px 16px;
  border-bottom: 1px solid #dee2e6;
  vertical-align: middle;
  text-align: center;
}

.data-row:hover {
  background: #f8f9fa;
}

.numeric {
  text-align: center;
  font-weight: 500;
}

.mood-badge {
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
  text-transform: capitalize;
}

.mood-positive {
  background: #d4edda;
  color: #155724;
}

.mood-negative {
  background: #f8d7da;
  color: #721c24;
}

.mood-neutral {
  background: #e2e3e5;
  color: #383d41;
}

.no-data {
  text-align: center;
  padding: 40px;
  color: #6c757d;
}

.table-stats {
  display: flex;
  justify-content: space-around;
  margin-top: 20px;
  padding-top: 20px;
  border-top: 1px solid #dee2e6;
  flex-wrap: wrap;
  gap: 15px;
}

.stat-item {
  text-align: center;
}

.stat-label {
  display: block;
  font-size: 12px;
  color: #6c757d;
  margin-bottom: 4px;
}

.stat-value {
  display: block;
  font-size: 18px;
  font-weight: 600;
  color: #2c3e50;
}

@media (max-width: 768px) {
  .table-header {
    flex-direction: column;
    align-items: stretch;
  }

  .table-controls {
    flex-direction: column;
  }

  .search-input {
    min-width: auto;
  }

  .data-table {
    font-size: 12px;
  }

  .data-table th,
  .data-table td {
    padding: 8px 12px;
  }
}
</style>

<style scoped>
.add-data-form {
  margin-top: 30px;
  padding: 20px;
  background: #f8f9fa;
  border-radius: 8px;
  border: 1px solid #dee2e6;
}

.add-data-form h4 {
  margin: 0 0 20px 0;
  color: #2c3e50;
  font-size: 1.2rem;
}

.data-form {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.form-row {
  display: flex;
  gap: 15px;
  flex-wrap: wrap;
}

.form-group {
  flex: 1;
  min-width: 200px;
}

.form-group label {
  display: block;
  margin-bottom: 5px;
  font-weight: 500;
  color: #495057;
}

.form-input {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #ced4da;
  border-radius: 4px;
  font-size: 14px;
  background: white;
}

.form-input:focus {
  outline: none;
  border-color: #007bff;
  box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.25);
}

.form-actions {
  display: flex;
  gap: 10px;
  justify-content: flex-end;
}

.submit-btn {
  padding: 10px 20px;
  background: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
}

.submit-btn:hover:not(:disabled) {
  background: #0056b3;
}

.submit-btn:disabled {
  background: #6c757d;
  cursor: not-allowed;
}

.reset-btn {
  padding: 10px 20px;
  background: #6c757d;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
}

.reset-btn:hover {
  background: #545b62;
}

@media (max-width: 768px) {
  .form-row {
    flex-direction: column;
  }

  .form-group {
    min-width: auto;
  }

  .form-actions {
    flex-direction: column;
  }
}
</style>
