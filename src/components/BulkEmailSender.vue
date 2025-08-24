<template>
  <div class="bulk-email-sender">
    <div class="email-header">
      <div class="header-content">
        <div class="header-icon">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M4 4H20C21.1 4 22 4.9 22 6V18C22 19.1 21.1 20 20 20H4C2.9 20 2 19.1 2 18V6C2 4.9 2.9 4 4 4Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <polyline points="22,6 12,13 2,6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </div>
        <h2>Bulk Email Sender</h2>
        <p>Send personalized emails to multiple recipients efficiently</p>
      </div>
    </div>

    <div class="email-form">
      <div class="form-section email-content-section">
        <div class="section-header">
          <h3>
            <span class="section-icon">✉️</span>
            Email Content
          </h3>
        </div>
        
        <div class="form-grid">
          <div class="form-group">
            <label for="subject">Subject</label>
            <input
              id="subject"
              v-model="emailData.subject"
              type="text"
              placeholder="Enter email subject"
              required
              class="modern-input"
            >
          </div>

          <div class="form-group full-width">
            <label for="message">Message</label>
            <textarea
              id="message"
              v-model="emailData.message"
              placeholder="Enter your message"
              rows="6"
              required
              class="modern-textarea"
            ></textarea>
          </div>

          <div class="form-group full-width">
            <label for="attachment">Attachment</label>
            <div class="file-upload-area">
              <input
                ref="attachmentInput"
                type="file"
                @change="handleFileUpload"
                class="file-input"
                accept=".pdf,.doc,.docx,.txt,.jpg,.png,.xlsx,.csv"
                id="attachment"
              />
              <label for="attachment" class="file-upload-label">
                <div class="upload-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M21 15V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V15" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    <polyline points="7,10 12,15 17,10" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    <line x1="12" y1="15" x2="12" y2="3" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                  </svg>
                </div>
                <span>Click to upload or drag and drop</span>
                <small>PDF, DOC, TXT, JPG, PNG, XLSX, CSV (Max 10MB)</small>
              </label>
            </div>
            
            <div v-if="attachment" class="attachment-info">
              <div class="attachment-details">
                <span class="attachment-icon">📎</span>
                <div class="attachment-text">
                  <strong>{{ attachment.name }}</strong>
                  <small>{{ formatFileSize(attachment.size) }}</small>
                </div>
              </div>
              <button @click="removeAttachment" class="btn-remove-attachment">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <line x1="18" y1="6" x2="6" y2="18" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  <line x1="6" y1="6" x2="18" y2="18" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </button>
            </div>
          </div>
        </div>

        <div v-if="errorMessage" class="error-message">
          <span class="error-icon">⚠️</span>
          {{ errorMessage }}
        </div>
      </div>

      <div class="form-section recipients-section">
        <div class="section-header">
          <h3>
            <span class="section-icon">👥</span>
            Recipients Management
          </h3>
        </div>

        <div class="recipient-input-card">
          <h4>Add Individual Recipient</h4>
          <div class="recipient-input">
            <div class="form-group">
              <label for="recipientName">Name</label>
              <input
                id="recipientName"
                v-model="newRecipient.name"
                type="text"
                placeholder="Recipient name"
                class="modern-input"
              >
            </div>

            <div class="form-group">
              <label for="recipientEmail">Email</label>
              <input
                id="recipientEmail"
                v-model="newRecipient.email"
                type="email"
                placeholder="recipient@example.com"
                class="modern-input"
              >
            </div>

            <button @click="addRecipient" class="btn-add">
              <span class="btn-icon">+</span>
              Add Recipient
            </button>
          </div>
        </div>

        <div class="bulk-import-card">
          <h4>
            <span class="section-icon">📋</span>
            Bulk Import
          </h4>
          <textarea
            v-model="bulkEmails"
            placeholder="Enter emails separated by commas or new lines:\nemail1@example.com, email2@example.com\nor\nemail1@example.com\nemail2@example.com"
            rows="4"
            class="modern-textarea"
          ></textarea>
          <button @click="importBulkEmails" class="btn-import">
            <span class="btn-icon">📥</span>
            Import Emails
          </button>
        </div>

        <div class="recipients-list-card">
          <div class="recipients-header">
            <h4>
              <span class="section-icon">📧</span>
              Recipients ({{ recipients.length }})
            </h4>
            <div class="recipients-actions" v-if="recipients.length > 0">
              <button @click="selectAllRecipients" class="btn-select">
                {{ allSelected ? 'Deselect All' : 'Select All' }}
              </button>
              <button @click="clearAllRecipients" class="btn-clear">
                Clear All
              </button>
            </div>
          </div>
          
          <div v-if="recipients.length === 0" class="no-recipients">
            <div class="empty-state">
              <span class="empty-icon">📭</span>
              <p>No recipients added yet</p>
              <small>Add recipients individually or import them in bulk</small>
            </div>
          </div>
          
          <div v-else class="recipient-cards">
            <div
              v-for="(recipient, index) in recipients"
              :key="index"
              class="recipient-card"
              :class="{ 'selected': selectedRecipients.includes(recipient) }"
            >
              <div class="recipient-avatar">
                {{ (recipient.name || recipient.email).charAt(0).toUpperCase() }}
              </div>
              <div class="recipient-info">
                <strong>{{ recipient.name || 'No Name' }}</strong>
                <span>{{ recipient.email }}</span>
              </div>
              <button @click="removeRecipient(index)" class="btn-remove">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <line x1="18" y1="6" x2="6" y2="18" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  <line x1="6" y1="6" x2="18" y2="18" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div class="form-section send-options-section">
        <div class="section-header">
          <h3>
            <span class="section-icon">⚙️</span>
            Send Options
          </h3>
        </div>

        <div class="send-options-grid">
          <div class="option-card">
            <label class="checkbox-label">
              <input
                v-model="sendOptions.sendIndividually"
                type="checkbox"
                class="modern-checkbox"
              >
              <span class="checkmark"></span>
              <div class="option-text">
                <strong>Send individually</strong>
                <small>Recommended for privacy</small>
              </div>
            </label>
          </div>

          <div class="option-card">
            <label for="batchSize">Batch Size</label>
            <input
              id="batchSize"
              v-model.number="sendOptions.batchSize"
              type="number"
              min="1"
              max="10"
              placeholder="5"
              class="modern-input"
            >
            <small>Emails per batch</small>
          </div>

          <div class="option-card">
            <label for="delay">Delay</label>
            <input
              id="delay"
              v-model.number="sendOptions.delay"
              type="number"
              min="1"
              max="60"
              placeholder="2"
              class="modern-input"
            >
            <small>Seconds between batches</small>
          </div>
        </div>
      </div>

      <div class="form-actions">
        <button
          @click="sendBulkEmails"
          :disabled="!canSendEmails || isSending"
          class="btn-send"
          :class="{ 'sending': isSending }"
        >
          <span v-if="isSending" class="loading-spinner"></span>
          <span class="btn-text">
            {{ isSending ? 'Sending...' : `Send to ${selectedRecipients.length} Recipients` }}
          </span>
        </button>
      </div>
    </div>

    <div v-if="sendProgress.total > 0" class="progress-section">
      <div class="progress-card">
        <h3>
          <span class="section-icon">📊</span>
          Sending Progress
        </h3>
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
    </div>

    <div v-if="sendResults.length > 0" class="results-section">
      <div class="results-card">
        <h3>
          <span class="section-icon">📋</span>
          Send Results
        </h3>
        <div class="results-list">
          <div
            v-for="(result, index) in sendResults"
            :key="index"
            :class="['result-item', result.success ? 'success' : 'error']"
          >
            <div class="result-status-icon">
              <span v-if="result.success">✅</span>
              <span v-else>❌</span>
            </div>
            <div class="result-content">
              <span class="result-email">{{ result.email }}</span>
              <span v-if="!result.success" class="result-error">{{ result.error }}</span>
            </div>
            <span class="result-status">{{ result.success ? 'Sent' : 'Failed' }}</span>
          </div>
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
      attachment: null,
      errorMessage: '',
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

    async handleFileUpload(event) {
      const file = event.target.files[0]
      if (file) {
        if (file.size > 10 * 1024 * 1024) {
          this.errorMessage = 'File size must be less than 10MB'
          return
        }
        
        try {
          this.attachment = file
          // Pre-convert to base64 to avoid repeated conversions
          this.attachmentBase64 = await this.convertFileToBase64(file)
          this.errorMessage = ''
        } catch (error) {
          this.errorMessage = 'Failed to process file'
          this.attachment = null
          this.attachmentBase64 = null
        }
      }
    },

    removeAttachment() {
      this.attachment = null
      this.attachmentBase64 = null
      // Use Vue ref instead of direct DOM manipulation
      this.$nextTick(() => {
        const fileInput = this.$refs.attachmentInput
        if (fileInput) {
          fileInput.value = ''
        }
      })
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

        // Use cached base64 instead of converting each time
        if (this.attachment && this.attachmentBase64) {
          templateParams.attachment = this.attachmentBase64
          templateParams.attachment_name = this.attachment.name
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
    
      // Use cached base64
      if (this.attachment && this.attachmentBase64) {
        templateParams.attachment = this.attachmentBase64
        templateParams.attachment_name = this.attachment.name
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
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 0;
  font-family: 'Inter', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 20px;
}

.email-header {
  text-align: center;
  margin-bottom: 50px;
}

.header-content {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border-radius: 24px;
  padding: 50px 40px;
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.15);
  border: 1px solid rgba(255, 255, 255, 0.3);
  position: relative;
  overflow: hidden;
}

.header-content::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, #667eea, #764ba2, #f093fb, #f5576c);
}

.header-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 100px;
  height: 100px;
  background: linear-gradient(135deg, #667eea, #764ba2);
  border-radius: 50%;
  margin-bottom: 25px;
  color: white;
  box-shadow: 0 15px 35px rgba(102, 126, 234, 0.3);
}

.header-content h2 {
  margin: 0 0 15px 0;
  font-size: 3rem;
  font-weight: 800;
  background: linear-gradient(135deg, #667eea, #764ba2);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  letter-spacing: -0.02em;
}

.header-content p {
  margin: 0;
  color: #64748b;
  font-size: 1.2rem;
  font-weight: 500;
}

.email-form {
  display: grid;
  gap: 40px;
}

.form-section {
  background: rgba(255, 255, 255, 0.98);
  backdrop-filter: blur(20px);
  border-radius: 24px;
  padding: 40px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.4);
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
}

.form-section::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: linear-gradient(90deg, #10b981, #3b82f6, #8b5cf6);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.form-section:hover {
  transform: translateY(-8px);
  box-shadow: 0 30px 60px rgba(0, 0, 0, 0.12);
}

.form-section:hover::before {
  opacity: 1;
}

.section-header {
  margin-bottom: 35px;
  border-bottom: 2px solid #f1f5f9;
  padding-bottom: 20px;
}

.section-header h3 {
  margin: 0;
  font-size: 1.75rem;
  font-weight: 700;
  color: #1e293b;
  display: flex;
  align-items: center;
  gap: 12px;
}

.section-icon {
  font-size: 1.4em;
}

.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 25px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.form-group.full-width {
  grid-column: 1 / -1;
}

.form-group label {
  font-weight: 600;
  color: #374151;
  font-size: 1rem;
  letter-spacing: -0.01em;
}

.modern-input, .modern-textarea {
  padding: 16px 20px;
  border: 2px solid #e2e8f0;
  border-radius: 16px;
  font-size: 16px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  background: #ffffff;
  font-family: inherit;
  font-weight: 500;
}

.modern-input:focus, .modern-textarea:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 4px rgba(102, 126, 234, 0.1);
  transform: translateY(-2px);
}

.modern-textarea {
  resize: vertical;
  min-height: 140px;
  line-height: 1.6;
}

.custom-file-upload {
  position: relative;
  margin-bottom: 20px;
}

.file-input {
  position: absolute;
  opacity: 0;
  width: 100%;
  height: 100%;
  cursor: pointer;
  z-index: 2;
}

.file-upload-label {
  display: block;
  border: 3px dashed #cbd5e1;
  border-radius: 20px;
  background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
  cursor: pointer;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
}

.file-upload-label:hover {
  border-color: #667eea;
  background: linear-gradient(135deg, #f0f4ff 0%, #e0e7ff 100%);
  transform: translateY(-4px);
  box-shadow: 0 20px 40px rgba(102, 126, 234, 0.15);
}

.upload-content {
  display: flex;
  align-items: center;
  gap: 30px;
  padding: 40px;
}

.upload-icon {
  color: #667eea;
  opacity: 0.8;
}

.upload-text {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.upload-title {
  font-size: 1.25rem;
  font-weight: 700;
  color: #1e293b;
}

.upload-subtitle {
  font-size: 1rem;
  color: #64748b;
  font-weight: 500;
}

.upload-size {
  font-size: 0.875rem;
  color: #94a3b8;
}

.upload-button {
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
  padding: 16px 32px;
  border-radius: 12px;
  font-weight: 600;
  font-size: 1rem;
  box-shadow: 0 8px 20px rgba(102, 126, 234, 0.3);
  transition: all 0.3s ease;
}

.file-upload-label:hover .upload-button {
  transform: translateY(-2px);
  box-shadow: 0 12px 30px rgba(102, 126, 234, 0.4);
}

.attachment-preview {
  margin-top: 20px;
}

.attachment-card {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 20px;
  background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
  border: 2px solid #bae6fd;
  border-radius: 16px;
  animation: slideInUp 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

@keyframes slideInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.attachment-icon {
  color: #0284c7;
  background: rgba(2, 132, 199, 0.1);
  padding: 12px;
  border-radius: 12px;
}

.attachment-info {
  flex: 1;
}

.attachment-name {
  font-weight: 600;
  color: #0f172a;
  font-size: 1rem;
  margin-bottom: 4px;
}

.attachment-size {
  color: #64748b;
  font-size: 0.875rem;
}

.remove-attachment-btn {
  background: #ef4444;
  color: white;
  border: none;
  border-radius: 10px;
  width: 40px;
  height: 40px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.remove-attachment-btn:hover {
  background: #dc2626;
  transform: scale(1.1);
}

.error-message {
  color: #dc2626;
  font-size: 15px;
  margin-top: 20px;
  padding: 16px 20px;
  background: linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%);
  border: 2px solid #fecaca;
  border-radius: 16px;
  display: flex;
  align-items: center;
  gap: 12px;
  animation: shake 0.6s ease;
  font-weight: 500;
}

@keyframes shake {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-8px); }
  75% { transform: translateX(8px); }
}

.error-icon {
  font-size: 1.3em;
}

.recipients-content {
  display: grid;
  gap: 30px;
}

.recipient-input-card, .bulk-import-card, .recipients-list-card {
  background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
  border-radius: 20px;
  padding: 30px;
  border: 2px solid #e2e8f0;
  transition: all 0.3s ease;
}

.recipient-input-card:hover, .bulk-import-card:hover, .recipients-list-card:hover {
  border-color: #cbd5e1;
  transform: translateY(-2px);
}

.recipient-input-card h4, .bulk-import-card h4, .recipients-list-card h4 {
  margin: 0 0 25px 0;
  font-size: 1.3rem;
  font-weight: 700;
  color: #1e293b;
  display: flex;
  align-items: center;
  gap: 10px;
}

.recipient-input {
  display: grid;
  grid-template-columns: 1fr 1fr auto;
  gap: 20px;
  align-items: end;
}

.recipients-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 25px;
  flex-wrap: wrap;
  gap: 15px;
}

.recipients-actions {
  display: flex;
  gap: 12px;
}

.no-recipients {
  text-align: center;
  padding: 60px 20px;
}

.empty-state {
  color: #64748b;
}

.empty-icon {
  font-size: 4rem;
  display: block;
  margin-bottom: 20px;
  opacity: 0.7;
}

.empty-state p {
  margin: 0 0 8px 0;
  font-size: 1.2rem;
  font-weight: 600;
  color: #475569;
}

.empty-state small {
  font-size: 1rem;
}

.recipient-cards {
  max-height: 450px;
  overflow-y: auto;
  display: grid;
  gap: 16px;
  padding-right: 8px;
}

.recipient-cards::-webkit-scrollbar {
  width: 6px;
}

.recipient-cards::-webkit-scrollbar-track {
  background: #f1f5f9;
  border-radius: 3px;
}

.recipient-cards::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 3px;
}

.recipient-cards::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}

.recipient-card {
  display: flex;
  align-items: center;
  gap: 18px;
  padding: 20px;
  background: white;
  border-radius: 16px;
  border: 2px solid #f1f5f9;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  cursor: pointer;
}

.recipient-card:hover {
  border-color: #667eea;
  transform: translateY(-3px);
  box-shadow: 0 12px 30px rgba(102, 126, 234, 0.15);
}

.recipient-card.selected {
  border-color: #667eea;
  background: linear-gradient(135deg, #f0f4ff 0%, #e0e7ff 100%);
  box-shadow: 0 8px 25px rgba(102, 126, 234, 0.2);
}

.recipient-avatar {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 1.2rem;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
}

.recipient-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.recipient-info strong {
  color: #1e293b;
  font-size: 1.1rem;
  font-weight: 600;
}

.recipient-info span {
  color: #64748b;
  font-size: 0.95rem;
}

.btn-remove {
  background: #ef4444;
  color: white;
  border: none;
  border-radius: 10px;
  width: 36px;
  height: 36px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.btn-remove:hover {
  background: #dc2626;
  transform: scale(1.15);
}

.send-options-grid {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr;
  gap: 25px;
}

.option-card {
  background: white;
  border-radius: 16px;
  padding: 25px;
  border: 2px solid #f1f5f9;
  display: flex;
  flex-direction: column;
  gap: 12px;
  transition: all 0.3s ease;
}

.option-card:hover {
  border-color: #e2e8f0;
  transform: translateY(-2px);
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 15px;
  cursor: pointer;
}

.modern-checkbox {
  display: none;
}

.checkmark {
  width: 24px;
  height: 24px;
  border: 2px solid #cbd5e1;
  border-radius: 6px;
  position: relative;
  transition: all 0.3s ease;
  flex-shrink: 0;
}

.modern-checkbox:checked + .checkmark {
  background: linear-gradient(135deg, #667eea, #764ba2);
  border-color: #667eea;
}

.modern-checkbox:checked + .checkmark::after {
  content: '✓';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: white;
  font-size: 14px;
  font-weight: bold;
}

.option-text {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.option-text strong {
  color: #1e293b;
  font-size: 1.05rem;
  font-weight: 600;
}

.option-text small {
  color: #64748b;
  font-size: 0.875rem;
}

.option-card label {
  font-weight: 600;
  color: #374151;
  margin-bottom: 8px;
}

.option-card small {
  color: #64748b;
  font-size: 0.875rem;
  margin-top: 6px;
}

.form-actions {
  text-align: center;
  margin-top: 30px;
}

.btn-send {
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
  border: none;
  border-radius: 20px;
  padding: 20px 50px;
  font-size: 1.2rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  display: inline-flex;
  align-items: center;
  gap: 15px;
  min-width: 280px;
  justify-content: center;
  box-shadow: 0 15px 35px rgba(102, 126, 234, 0.3);
}

.btn-send:hover:not(:disabled) {
  transform: translateY(-4px);
  box-shadow: 0 25px 50px rgba(102, 126, 234, 0.4);
}

.btn-send:disabled {
  background: linear-gradient(135deg, #9ca3af, #6b7280);
  cursor: not-allowed;
  transform: none;
  box-shadow: 0 8px 20px rgba(156, 163, 175, 0.3);
}

.btn-send.sending {
  background: linear-gradient(135deg, #6b7280, #4b5563);
}

.loading-spinner {
  width: 24px;
  height: 24px;
  border: 3px solid rgba(255, 255, 255, 0.3);
  border-top: 3px solid white;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.btn-add, .btn-import, .btn-clear, .btn-select {
  background: linear-gradient(135deg, #10b981, #059669);
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
.attachment-info {
  margin-top: 8px;
  padding: 8px 12px;
  background: #f8f9fa;
  border: 1px solid #e9ecef;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  color: #495057;
}

.btn-remove-attachment {
  background: #dc3545;
  color: white;
  border: none;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  cursor: pointer;
  font-size: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.btn-remove-attachment:hover {
  background: #c82333;
}

.error-message {
  color: #dc3545;
  font-size: 14px;
  margin-top: 8px;
  padding: 8px;
  background: #f8d7da;
  border: 1px solid #f5c6cb;
  border-radius: 4px;
}

.form-input[type="file"] {
  padding: 8px;
  border: 2px dashed #dee2e6;
  border-radius: 4px;
  background: #f8f9fa;
  cursor: pointer;
  transition: border-color 0.3s ease;
}

.form-input[type="file"]:hover {
  border-color: #007bff;
}

.form-input[type="file"]:focus {
  outline: none;
  border-color: #007bff;
  box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);
}
</style>
