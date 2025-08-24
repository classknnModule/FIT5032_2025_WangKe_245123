<template>
  <div class="bulk-email-sender">
    <div class="email-header">
      <h2>Bulk Email Sender</h2>
    </div>

    <div class="email-form">
      <div class="form-section">
        <h3>Email Content</h3>
        <div class="form-group">
          <label for="subject">Subject:</label>
          <input
            id="subject"
            v-model="emailData.subject"
            type="text"
            placeholder="Enter email subject"
            required
          >
        </div>

        <div class="form-group">
          <label for="message">Message:</label>
          <textarea
            id="message"
            v-model="emailData.message"
            placeholder="Enter your message"
            rows="6"
            required
          ></textarea>
        </div>
      </div>

      <div class="form-section">
        <h3>Recipients Management</h3>

        <div class="recipient-input">
          <div class="form-group">
            <label for="recipientName">Name:</label>
            <input
              id="recipientName"
              v-model="newRecipient.name"
              type="text"
              placeholder="Recipient name"
            >
          </div>

          <div class="form-group">
            <label for="recipientEmail">Email:</label>
            <input
              id="recipientEmail"
              v-model="newRecipient.email"
              type="email"
              placeholder="recipient@example.com"
            >
          </div>

          <button @click="addRecipient" class="btn-add">Add Recipient</button>
        </div>

        <div class="bulk-import">
          <h4>Bulk Import</h4>
          <textarea
            v-model="bulkEmails"
            placeholder="Enter emails separated by commas or new lines:\nemail1@example.com, email2@example.com\nor\nemail1@example.com\nemail2@example.com"
            rows="4"
          ></textarea>
          <button @click="importBulkEmails" class="btn-import">Import Emails</button>
        </div>

        <div class="recipients-list">
          <h4>Recipients ({{ recipients.length }})</h4>
          <div v-if="recipients.length === 0" class="no-recipients">
            No recipients added yet
          </div>
          <div v-else class="recipient-cards">
            <div
              v-for="(recipient, index) in recipients"
              :key="index"
              class="recipient-card"
            >
              <div class="recipient-info">
                <strong>{{ recipient.name || 'No Name' }}</strong>
                <span>{{ recipient.email }}</span>
              </div>
              <button @click="removeRecipient(index)" class="btn-remove">×</button>
            </div>
          </div>

          <div class="recipients-actions">
            <button @click="clearAllRecipients" class="btn-clear" v-if="recipients.length > 0">
              Clear All
            </button>
            <button @click="selectAllRecipients" class="btn-select" v-if="recipients.length > 0">
              {{ allSelected ? 'Deselect All' : 'Select All' }}
            </button>
          </div>
        </div>
      </div>

      <div class="form-section">
        <h3>Send Options</h3>

        <div class="send-options">
          <div class="form-group">
            <label>
              <input
                v-model="sendOptions.sendIndividually"
                type="checkbox"
              >
              Send individually (recommended for privacy)
            </label>
          </div>

          <div class="form-group">
            <label for="batchSize">Batch Size (emails per batch):</label>
            <input
              id="batchSize"
              v-model.number="sendOptions.batchSize"
              type="number"
              min="1"
              max="10"
              placeholder="5"
            >
          </div>

          <div class="form-group">
            <label for="delay">Delay between batches (seconds):</label>
            <input
              id="delay"
              v-model.number="sendOptions.delay"
              type="number"
              min="1"
              max="60"
              placeholder="2"
            >
          </div>
        </div>
      </div>

      <div class="form-actions">
        <button
          @click="sendBulkEmails"
          :disabled="!canSendEmails || isSending"
          class="btn-send"
        >
          {{ isSending ? 'Sending...' : `Send to ${selectedRecipients.length} Recipients` }}
        </button>
      </div>
    </div>

    <div v-if="sendProgress.total > 0" class="progress-section">
      <h3>Sending Progress</h3>
      <div class="progress-bar">
        <div
          class="progress-fill"
          :style="{ width: progressPercentage + '%' }"
        ></div>
      </div>
      <div class="progress-text">
        {{ sendProgress.sent }} / {{ sendProgress.total }} emails sent
        <span v-if="sendProgress.failed > 0" class="failed-count">
          ({{ sendProgress.failed }} failed)
        </span>
      </div>
    </div>

    <div v-if="sendResults.length > 0" class="results-section">
      <h3>Send Results</h3>
      <div class="results-list">
        <div
          v-for="(result, index) in sendResults"
          :key="index"
          :class="['result-item', result.success ? 'success' : 'error']"
        >
          <span class="result-email">{{ result.email }}</span>
          <span class="result-status">{{ result.success ? '✓ Sent' : '✗ Failed' }}</span>
          <span v-if="!result.success" class="result-error">{{ result.error }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import emailjs from '@emailjs/browser'

export default {
  name: 'BulkEmailSender',
  data() {
    return {
      emailData: {
        subject: '',
        message: ''
      },
      newRecipient: {
        name: '',
        email: ''
      },
      bulkEmails: '',
      recipients: [],
      selectedRecipients: [],
      allSelected: false,
      sendOptions: {
        sendIndividually: true,
        batchSize: 5,
        delay: 2
      },
      isSending: false,
      sendProgress: {
        sent: 0,
        failed: 0,
        total: 0
      },
      sendResults: [],

      // EmailJS Configuration
      emailjsConfig: {
        serviceId: 'service_tl1f6jl',
        templateId: 'template_buditia',
        publicKey: 'u4r7jB4o4iZOUAxOs'
      }
    }
  },
  computed: {
    canSendEmails() {
      return this.emailData.subject.trim() &&
             this.emailData.message.trim() &&
             this.selectedRecipients.length > 0
    },
    progressPercentage() {
      if (this.sendProgress.total === 0) return 0
      return Math.round((this.sendProgress.sent + this.sendProgress.failed) / this.sendProgress.total * 100)
    }
  },
  mounted() {
    this.selectedRecipients = [...this.recipients]
    emailjs.init(this.emailjsConfig.publicKey)
  },
  watch: {
    recipients: {
      handler() {
        if (this.allSelected) {
          this.selectedRecipients = [...this.recipients]
        }
      },
      deep: true
    }
  },
  methods: {
    addRecipient() {
      if (!this.newRecipient.email.trim()) {
        alert('Please enter an email address')
        return
      }

      if (!this.isValidEmail(this.newRecipient.email)) {
        alert('Please enter a valid email address')
        return
      }

      if (this.recipients.some(r => r.email === this.newRecipient.email)) {
        alert('This email is already in the list')
        return
      }

      this.recipients.push({
        name: this.newRecipient.name.trim() || 'No Name',
        email: this.newRecipient.email.trim()
      })

      this.selectedRecipients.push(this.recipients[this.recipients.length - 1])

      this.newRecipient = { name: '', email: '' }
    },

    removeRecipient(index) {
      const recipient = this.recipients[index]
      this.recipients.splice(index, 1)
      this.selectedRecipients = this.selectedRecipients.filter(r => r.email !== recipient.email)
    },

    clearAllRecipients() {
      if (confirm('Are you sure you want to clear all recipients?')) {
        this.recipients = []
        this.selectedRecipients = []
      }
    },

    selectAllRecipients() {
      if (this.allSelected) {
        this.selectedRecipients = []
        this.allSelected = false
      } else {
        this.selectedRecipients = [...this.recipients]
        this.allSelected = true
      }
    },

    importBulkEmails() {
      if (!this.bulkEmails.trim()) return

      const emails = this.bulkEmails
        .split(/[,\n]/)
        .map(email => email.trim())
        .filter(email => email && this.isValidEmail(email))
        .filter(email => !this.recipients.some(r => r.email === email))

      emails.forEach(email => {
        const recipient = { name: 'Imported User', email }
        this.recipients.push(recipient)
        this.selectedRecipients.push(recipient)
      })

      this.bulkEmails = ''
      alert(`Imported ${emails.length} valid email addresses`)
    },

    async sendBulkEmails() {
      if (!this.canSendEmails) return

      this.isSending = true
      this.sendProgress = {
        sent: 0,
        failed: 0,
        total: this.selectedRecipients.length
      }
      this.sendResults = []

      try {
        if (this.sendOptions.sendIndividually) {
          await this.sendIndividualEmails()
        } else {
          await this.sendBatchEmails()
        }
      } catch (error) {
        console.error('Bulk email sending failed:', error)
        alert('Failed to send bulk emails. Please try again.')
      } finally {
        this.isSending = false
      }
    },

    async sendIndividualEmails() {
      const batches = this.chunkArray(this.selectedRecipients, this.sendOptions.batchSize)

      for (let i = 0; i < batches.length; i++) {
        const batch = batches[i]
        const batchPromises = batch.map(recipient => this.sendSingleEmail(recipient))

        await Promise.allSettled(batchPromises)

        if (i < batches.length - 1) {
          await this.delay(this.sendOptions.delay * 1000)
        }
      }
    },

    async sendSingleEmail(recipient) {
      try {
        const templateParams = {
          to_email: recipient.email,
          to_name: recipient.name,
          from_name: 'Mental Health Hub',
          from_email: 'noreply@mentalhealthhub.com',
          subject: this.emailData.subject,
          message: this.emailData.message,
          recipient_name: recipient.name
        }

        await emailjs.send(
          this.emailjsConfig.serviceId,
          this.emailjsConfig.templateId,
          templateParams,
          this.emailjsConfig.publicKey
        )

        this.sendProgress.sent++
        this.sendResults.push({
          email: recipient.email,
          success: true
        })

      } catch (error) {
        console.error(`Failed to send email to ${recipient.email}:`, error)
        this.sendProgress.failed++
        this.sendResults.push({
          email: recipient.email,
          success: false,
          error: error.message || 'Unknown error'
        })
      }
    },

    async sendBatchEmails() {
      const templateParams = {
        from_name: 'Mental Health Hub',
        from_email: 'noreply@mentalhealthhub.com',
        subject: this.emailData.subject,
        message: this.emailData.message,
        recipients: this.selectedRecipients,
        recipient_list: this.selectedRecipients.map(r => `${r.name} <${r.email}>`).join(', ')
      }

      try {
        await emailjs.send(
          this.emailjsConfig.serviceId,
          this.emailjsConfig.templateId,
          templateParams,
          this.emailjsConfig.publicKey
        )

        this.sendProgress.sent = this.selectedRecipients.length
        this.selectedRecipients.forEach(recipient => {
          this.sendResults.push({
            email: recipient.email,
            success: true
          })
        })

      } catch (error) {
        console.error('Batch email sending failed:', error)
        this.sendProgress.failed = this.selectedRecipients.length
        this.selectedRecipients.forEach(recipient => {
          this.sendResults.push({
            email: recipient.email,
            success: false,
            error: error.message || 'Batch sending failed'
          })
        })
      }
    },

    isValidEmail(email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      return emailRegex.test(email)
    },

    chunkArray(array, size) {
      const chunks = []
      for (let i = 0; i < array.length; i += size) {
        chunks.push(array.slice(i, i + size))
      }
      return chunks
    },

    delay(ms) {
      return new Promise(resolve => setTimeout(resolve, ms))
    }
  }
}
</script>

<style scoped>
.bulk-email-sender {
  max-width: 1000px;
  margin: 0 auto;
  padding: 20px;
}

.email-header h2 {
  color: #333;
  margin-bottom: 20px;
  text-align: center;
}

.email-form {
  background: #f9f9f9;
  padding: 20px;
  border-radius: 8px;
  margin-bottom: 20px;
}

.form-section {
  margin-bottom: 30px;
  padding-bottom: 20px;
  border-bottom: 1px solid #ddd;
}

.form-section:last-child {
  border-bottom: none;
}

.form-section h3 {
  color: #333;
  margin-bottom: 15px;
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
.form-group textarea {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
}

.recipient-input {
  display: grid;
  grid-template-columns: 1fr 1fr auto;
  gap: 10px;
  align-items: end;
  margin-bottom: 20px;
}

.bulk-import {
  margin-bottom: 20px;
}

.bulk-import h4 {
  margin-bottom: 10px;
  color: #555;
}

.recipients-list h4 {
  color: #555;
  margin-bottom: 10px;
}

.no-recipients {
  text-align: center;
  color: #666;
  font-style: italic;
  padding: 20px;
}

.recipient-cards {
  max-height: 300px;
  overflow-y: auto;
  border: 1px solid #ddd;
  border-radius: 4px;
  padding: 10px;
}

.recipient-card {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 12px;
  margin-bottom: 5px;
  background: white;
  border-radius: 4px;
  border: 1px solid #eee;
}

.recipient-info {
  display: flex;
  flex-direction: column;
}

.recipient-info strong {
  color: #333;
}

.recipient-info span {
  color: #666;
  font-size: 12px;
}

.recipients-actions {
  display: flex;
  gap: 10px;
  margin-top: 10px;
}

.send-options {
  display: grid;
  gap: 15px;
}

.btn-add, .btn-import, .btn-send, .btn-clear, .btn-select {
  background-color: #4CAF50;
  color: white;
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: background-color 0.3s;
}

.btn-add:hover, .btn-import:hover, .btn-send:hover, .btn-clear:hover, .btn-select:hover {
  background-color: #45a049;
}

.btn-remove {
  background-color: #f44336;
  color: white;
  border: none;
  border-radius: 50%;
  width: 24px;
  height: 24px;
  cursor: pointer;
  font-size: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.btn-remove:hover {
  background-color: #d32f2f;
}

.btn-clear {
  background-color: #ff9800;
}

.btn-clear:hover {
  background-color: #f57c00;
}

.btn-send {
  width: 100%;
  padding: 15px;
  font-size: 16px;
  font-weight: bold;
}

.btn-send:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

.progress-section {
  margin-bottom: 20px;
}

.progress-section h3 {
  color: #333;
  margin-bottom: 10px;
}

.progress-bar {
  width: 100%;
  height: 20px;
  background-color: #f0f0f0;
  border-radius: 10px;
  overflow: hidden;
  margin-bottom: 10px;
}

.progress-fill {
  height: 100%;
  background-color: #4CAF50;
  transition: width 0.3s ease;
}

.progress-text {
  text-align: center;
  color: #555;
}

.failed-count {
  color: #f44336;
  font-weight: bold;
}

.results-section {
  margin-top: 20px;
}

.results-section h3 {
  color: #333;
  margin-bottom: 15px;
}

.results-list {
  max-height: 300px;
  overflow-y: auto;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.result-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 12px;
  border-bottom: 1px solid #eee;
}

.result-item:last-child {
  border-bottom: none;
}

.result-item.success {
  background-color: #f8f9fa;
  border-left: 4px solid #4CAF50;
}

.result-item.error {
  background-color: #fff5f5;
  border-left: 4px solid #f44336;
}

.result-email {
  font-weight: bold;
  color: #333;
}

.result-status {
  font-size: 12px;
}

.result-item.success .result-status {
  color: #4CAF50;
}

.result-item.error .result-status {
  color: #f44336;
}

.result-error {
  font-size: 11px;
  color: #666;
  font-style: italic;
}

@media (max-width: 768px) {
  .recipient-input {
    grid-template-columns: 1fr;
  }

  .recipients-actions {
    flex-direction: column;
  }
}
</style>
