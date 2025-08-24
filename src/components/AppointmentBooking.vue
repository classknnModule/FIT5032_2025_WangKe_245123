<template>
  <div class="appointment-booking">
    <div class="booking-header">
      <h2>Appointment Booking System</h2>
      <button @click="showBookingForm = !showBookingForm" class="btn-primary">
        {{ showBookingForm ? 'Hide Form' : 'Book Appointment' }}
      </button>
    </div>

    <div v-if="showBookingForm" class="booking-form">
      <h3>Book New Appointment</h3>
      <form @submit.prevent="bookAppointment">
        <div class="form-group">
          <label for="title">Appointment Title:</label>
          <input
            id="title"
            v-model="newAppointment.title"
            type="text"
            required
            placeholder="Enter appointment title"
          >
        </div>

        <div class="form-group">
          <label for="date">Date:</label>
          <input
            id="date"
            v-model="newAppointment.date"
            type="date"
            required
          >
        </div>

        <div class="form-group">
          <label for="time">Time:</label>
          <input
            id="time"
            v-model="newAppointment.time"
            type="time"
            required
          >
        </div>

        <div class="form-group">
          <label for="duration">Duration (minutes):</label>
          <select id="duration" v-model="newAppointment.duration" required>
            <option value="30">30 minutes</option>
            <option value="60">1 hour</option>
            <option value="90">1.5 hours</option>
            <option value="120">2 hours</option>
          </select>
        </div>

        <div class="form-group">
          <label for="description">Description:</label>
          <textarea
            id="description"
            v-model="newAppointment.description"
            placeholder="Enter appointment description"
          ></textarea>
        </div>

        <div class="form-actions">
          <button type="submit" class="btn-primary">Book Appointment</button>
          <button type="button" @click="resetForm" class="btn-secondary">Reset</button>
        </div>
      </form>
    </div>

    <div v-if="conflictMessage" class="conflict-message">
      {{ conflictMessage }}
    </div>

    <div class="calendar-container">
      <FullCalendar
        ref="fullCalendar"
        :options="calendarOptions"
      />
    </div>

    <div class="appointments-list">
      <h3>Upcoming Appointments</h3>
      <div v-if="appointments.length === 0" class="no-appointments">
        No appointments scheduled
      </div>
      <div v-else class="appointment-cards">
        <div
          v-for="appointment in upcomingAppointments"
          :key="appointment.id"
          class="appointment-card"
        >
          <div class="appointment-header">
            <h4>{{ appointment.title }}</h4>
            <button @click="cancelAppointment(appointment.id)" class="btn-danger">
              Cancel
            </button>
          </div>
          <div class="appointment-details">
            <p><strong>Date:</strong> {{ formatDate(appointment.start) }}</p>
            <p><strong>Time:</strong> {{ formatTime(appointment.start) }} - {{ formatTime(appointment.end) }}</p>
            <p v-if="appointment.extendedProps.description">
              <strong>Description:</strong> {{ appointment.extendedProps.description }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import FullCalendar from '@fullcalendar/vue3'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'

export default {
  name: 'AppointmentBooking',
  components: {
    FullCalendar
  },
  data() {
    return {
      showBookingForm: false,
      conflictMessage: '',
      newAppointment: {
        title: '',
        date: '',
        time: '',
        duration: '60',
        description: ''
      },
      appointments: [],
      calendarOptions: {
        plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
        headerToolbar: {
          left: 'prev,next today',
          center: 'title',
          right: 'dayGridMonth,timeGridWeek,timeGridDay'
        },
        initialView: 'dayGridMonth',
        editable: true,
        selectable: true,
        selectMirror: true,
        dayMaxEvents: true,
        weekends: true,
        events: [],
        select: this.handleDateSelect,
        eventClick: this.handleEventClick,
        eventDrop: this.handleEventDrop,
        eventResize: this.handleEventResize
      }
    }
  },
  computed: {
    upcomingAppointments() {
      const now = new Date()
      return this.appointments
        .filter(apt => new Date(apt.start) >= now)
        .sort((a, b) => new Date(a.start) - new Date(b.start))
    }
  },
  mounted() {
    this.loadAppointments()
    this.updateCalendarEvents()
  },
  methods: {
    handleDateSelect(selectInfo) {
      const selectedDate = selectInfo.start.toISOString().split('T')[0]
      this.newAppointment.date = selectedDate
      this.showBookingForm = true
    },

    handleEventClick(clickInfo) {
      if (confirm(`Delete appointment '${clickInfo.event.title}'?`)) {
        this.cancelAppointment(clickInfo.event.id)
      }
    },

    handleEventDrop(dropInfo) {
      this.updateAppointmentTime(dropInfo.event)
    },

    handleEventResize(resizeInfo) {
      this.updateAppointmentTime(resizeInfo.event)
    },

    bookAppointment() {
      if (!this.validateAppointment()) {
        return
      }

      const startDateTime = new Date(`${this.newAppointment.date}T${this.newAppointment.time}`)
      const endDateTime = new Date(startDateTime.getTime() + (this.newAppointment.duration * 60000))

      if (this.checkConflict(startDateTime, endDateTime)) {
        this.conflictMessage = 'Appointment conflicts with existing booking. Please choose a different time.'
        setTimeout(() => {
          this.conflictMessage = ''
        }, 5000)
        return
      }

      const appointment = {
        id: Date.now().toString(),
        title: this.newAppointment.title,
        start: startDateTime.toISOString(),
        end: endDateTime.toISOString(),
        backgroundColor: '#4CAF50',
        borderColor: '#45a049',
        extendedProps: {
          description: this.newAppointment.description,
          duration: this.newAppointment.duration
        }
      }

      this.appointments.push(appointment)
      this.saveAppointments()
      this.updateCalendarEvents()
      this.resetForm()
      this.showBookingForm = false

      alert('Appointment booked successfully!')
    },

    validateAppointment() {
      if (!this.newAppointment.title.trim()) {
        alert('Please enter appointment title')
        return false
      }
      if (!this.newAppointment.date) {
        alert('Please select a date')
        return false
      }
      if (!this.newAppointment.time) {
        alert('Please select a time')
        return false
      }

      const selectedDateTime = new Date(`${this.newAppointment.date}T${this.newAppointment.time}`)
      const now = new Date()

      if (selectedDateTime <= now) {
        alert('Please select a future date and time')
        return false
      }

      return true
    },

    checkConflict(startTime, endTime) {
      return this.appointments.some(apt => {
        const aptStart = new Date(apt.start)
        const aptEnd = new Date(apt.end)

        return (startTime < aptEnd && endTime > aptStart)
      })
    },

    cancelAppointment(appointmentId) {
      if (confirm('Are you sure you want to cancel this appointment?')) {
        this.appointments = this.appointments.filter(apt => apt.id !== appointmentId)
        this.saveAppointments()
        this.updateCalendarEvents()
      }
    },

    updateAppointmentTime(event) {
      const appointment = this.appointments.find(apt => apt.id === event.id)
      if (appointment) {
        appointment.start = event.start.toISOString()
        appointment.end = event.end.toISOString()
        this.saveAppointments()
      }
    },

    resetForm() {
      this.newAppointment = {
        title: '',
        date: '',
        time: '',
        duration: '60',
        description: ''
      }
      this.conflictMessage = ''
    },

    updateCalendarEvents() {
      this.calendarOptions.events = [...this.appointments]
    },

    loadAppointments() {
      const saved = localStorage.getItem('appointments')
      if (saved) {
        this.appointments = JSON.parse(saved)
      }
    },

    saveAppointments() {
      localStorage.setItem('appointments', JSON.stringify(this.appointments))
    },

    formatDate(dateString) {
      return new Date(dateString).toLocaleDateString()
    },

    formatTime(dateString) {
      return new Date(dateString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  }
}
</script>

<style scoped>
.appointment-booking {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.booking-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.booking-header h2 {
  color: #333;
  margin: 0;
}

.booking-form {
  background: #f9f9f9;
  padding: 20px;
  border-radius: 8px;
  margin-bottom: 20px;
  border: 1px solid #ddd;
}

.booking-form h3 {
  margin-top: 0;
  color: #333;
}

.form-group {
  margin-bottom: 15px;
}

.form-group label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
  color: #555;
}

.form-group input,
.form-group select,
.form-group textarea {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
}

.form-group textarea {
  height: 80px;
  resize: vertical;
}

.form-actions {
  display: flex;
  gap: 10px;
  margin-top: 20px;
}

.btn-primary {
  background-color: #4CAF50;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: background-color 0.3s;
}

.btn-primary:hover {
  background-color: #45a049;
}

.btn-secondary {
  background-color: #6c757d;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: background-color 0.3s;
}

.btn-secondary:hover {
  background-color: #5a6268;
}

.btn-danger {
  background-color: #dc3545;
  color: white;
  padding: 5px 10px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
  transition: background-color 0.3s;
}

.btn-danger:hover {
  background-color: #c82333;
}

.conflict-message {
  background-color: #f8d7da;
  color: #721c24;
  padding: 10px;
  border-radius: 4px;
  margin-bottom: 20px;
  border: 1px solid #f5c6cb;
}

.calendar-container {
  margin: 20px 0;
  background: white;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.appointments-list {
  margin-top: 30px;
}

.appointments-list h3 {
  color: #333;
  margin-bottom: 15px;
}

.no-appointments {
  text-align: center;
  color: #666;
  font-style: italic;
  padding: 20px;
}

.appointment-cards {
  display: grid;
  gap: 15px;
}

.appointment-card {
  background: white;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 15px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.appointment-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.appointment-header h4 {
  margin: 0;
  color: #333;
}

.appointment-details p {
  margin: 5px 0;
  color: #666;
}

@media (max-width: 768px) {
  .booking-header {
    flex-direction: column;
    gap: 10px;
    align-items: stretch;
  }

  .form-actions {
    flex-direction: column;
  }

  .appointment-header {
    flex-direction: column;
    align-items: stretch;
    gap: 10px;
  }
}
</style>
