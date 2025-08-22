<template>
  <div class="email-container">
    <div class="email-wrapper">
      <div class="email-header">
        <h1>📧 Send Email</h1>
        <p>Send emails with attachments using our secure email service</p>
      </div>

      <div class="email-card">
        <form @submit.prevent="sendEmail" class="email-form">
          <div class="form-row">
            <div class="form-group">
              <label for="to_email">To Email:</label>
              <input
                id="to_email"
                type="email"
                v-model="emailData.to_email"
                placeholder="recipient@example.com"
                required
                :disabled="isLoading"
                class="form-input"
              />
            </div>
            <div class="form-group">
              <label for="from_name">From Name:</label>
              <input
                id="from_name"
                type="text"
                v-model="emailData.from_name"
                placeholder="Your Name"
                required
                :disabled="isLoading"
                class="form-input"
              />
            </div>
          </div>

          <div class="form-group">
            <label for="subject">Subject:</label>
            <input
              id="subject"
              type="text"
              v-model="emailData.subject"
              placeholder="Email subject"
              required
              :disabled="isLoading"
              class="form-input"
            />
          </div>

          <div class="form-group">
            <label for="message">Message:</label>
            <textarea
              id="message"
              v-model="emailData.message"
              rows="6"
              placeholder="Write your message here..."
              required
              :disabled="isLoading"
              class="form-input"
            ></textarea>
          </div>

          <div class="form-group">
            <label for="attachment">Attachment (Optional):</label>
            <div class="file-input-wrapper">
              <input
                id="attachment"
                type="file"
                @change="handleFileUpload"
                :disabled="isLoading"
                class="file-input"
                accept=".pdf,.doc,.docx,.txt,.jpg,.png,.zip"
                title="Choose file to attach"
                placeholder="Select a file..."
              />
              <div class="file-input-label" v-if="!attachment">
                📎 Click to select a file or drag and drop
              </div>
              <div class="file-info" v-if="attachment">
                <span class="file-name">📎 {{ attachment.name }}</span>
                <span class="file-size">({{ formatFileSize(attachment.size) }})</span>
                <button type="button" @click="removeAttachment" class="remove-file">✕</button>
              </div>
            </div>
          </div>

          <div v-if="errorMessage" class="error-message">
            <span class="error-icon">⚠️</span>
            {{ errorMessage }}
          </div>

          <div v-if="successMessage" class="success-message">
            <span class="success-icon">✅</span>
            {{ successMessage }}
          </div>

          <div class="form-actions">
            <button type="button" @click="goBack" class="back-button" :disabled="isLoading">
              ← Back to Dashboard
            </button>
            <button type="submit" :disabled="isLoading || !isFormValid" class="send-button">
              <span v-if="isLoading">📤 Sending...</span>
              <span v-else>🚀 Send Email</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { getAuth, onAuthStateChanged } from 'firebase/auth'
import emailjs from '@emailjs/browser'

const router = useRouter()
const auth = getAuth()

const emailData = ref({
  to_email: '',
  from_name: '',
  subject: '',
  message: ''
})

const currentUser = ref(null)
const attachment = ref(null)
const errorMessage = ref('')
const successMessage = ref('')
const isLoading = ref(false)

// EmailJS Configuration - Please replace with your actual values
const EMAILJS_CONFIG = {
  SERVICE_ID: 'service_tl1f6jl',
  TEMPLATE_ID: 'template_buditia',
  PUBLIC_KEY: 'u4r7jB4o4iZOUAxOs'
}

onMounted(() => {
  onAuthStateChanged(auth, (user) => {
    if (user) {
      currentUser.value = user
      emailData.value.from_name = user.displayName || user.email.split('@')[0]
    }
  })
})

const isFormValid = computed(() => {
  return emailData.value.to_email.trim() !== '' &&
         emailData.value.from_name.trim() !== '' &&
         emailData.value.subject.trim() !== '' &&
         emailData.value.message.trim() !== ''
})

const handleFileUpload = (event) => {
  const file = event.target.files[0]
  if (file) {
    if (file.size > 10 * 1024 * 1024) {
      errorMessage.value = 'File size must be less than 10MB'
      event.target.value = ''
      return
    }
    attachment.value = file
    errorMessage.value = ''
  }
}

const removeAttachment = () => {
  attachment.value = null
  const fileInput = document.getElementById('attachment')
  if (fileInput) fileInput.value = ''
}

const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

const convertFileToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => resolve(reader.result)
    reader.onerror = error => reject(error)
  })
}

const sendEmail = async () => {
  errorMessage.value = ''
  successMessage.value = ''
  isLoading.value = true

  try {
    const templateParams = {
      to_email: emailData.value.to_email,
      from_name: emailData.value.from_name,
      from_email: currentUser.value?.email || 'noreply@example.com',
      subject: emailData.value.subject,
      message: emailData.value.message,
      reply_to: currentUser.value?.email || 'noreply@example.com'
    }

    if (attachment.value) {
      const base64File = await convertFileToBase64(attachment.value)
      templateParams.attachment = base64File
      templateParams.attachment_name = attachment.value.name
    }

    // Send email using EmailJS
    await emailjs.send(
      EMAILJS_CONFIG.SERVICE_ID,
      EMAILJS_CONFIG.TEMPLATE_ID,
      templateParams,
      EMAILJS_CONFIG.PUBLIC_KEY
    )

    console.log('Email sent successfully with data:', templateParams)
    successMessage.value = 'Email sent successfully! 🎉'

    setTimeout(() => {
      clearForm()
      successMessage.value = ''
    }, 3000)

  } catch (error) {
    console.error('Email sending failed:', error)
    if (error.text) {
      errorMessage.value = `Failed to send email: ${error.text}`
    } else {
      errorMessage.value = 'Failed to send email. Please check your EmailJS configuration and try again.'
    }
    setTimeout(() => {
      errorMessage.value = ''
    }, 5000)
  } finally {
    isLoading.value = false
  }
}

const clearForm = () => {
  emailData.value = {
    to_email: '',
    from_name: currentUser.value?.displayName || currentUser.value?.email.split('@')[0] || '',
    subject: '',
    message: ''
  }
  attachment.value = null
  const fileInput = document.getElementById('attachment')
  if (fileInput) fileInput.value = ''
}

const goBack = () => {
  router.push('/about')
}
</script>

<style scoped>
.email-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%);
  padding: 2rem 1rem;
}

.email-wrapper {
  max-width: 800px;
  margin: 0 auto;
}

.email-header {
  text-align: center;
  margin-bottom: 2rem;
  color: white;
}

.email-header h1 {
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
  text-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.email-header p {
  font-size: 1.1rem;
  opacity: 0.9;
  margin: 0;
}

.email-card {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border-radius: 20px;
  padding: 2.5rem;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.email-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
}

.form-group {
  display: flex;
  flex-direction: column;
}

.form-group label {
  margin-bottom: 0.5rem;
  font-weight: 600;
  color: #333;
  font-size: 0.95rem;
}

.form-input {
  padding: 1rem;
  border: 2px solid #e1e8ed;
  border-radius: 12px;
  font-size: 1rem;
  transition: all 0.3s ease;
  background: white;
}

.form-input:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.form-input:disabled {
  background: #f8f9fa;
  cursor: not-allowed;
}

textarea.form-input {
  resize: vertical;
  min-height: 120px;
}

.file-input-wrapper {
  position: relative;
}

.file-input {
  width: 100%;
  padding: 1rem;
  border: 2px dashed #e1e8ed;
  border-radius: 12px;
  background: #f8f9fa;
  cursor: pointer;
  transition: all 0.3s ease;
  opacity: 0;
  position: absolute;
  z-index: 2;
}

.file-input-label {
  padding: 1rem;
  border: 2px dashed #e1e8ed;
  border-radius: 12px;
  background: #f8f9fa;
  cursor: pointer;
  transition: all 0.3s ease;
  text-align: center;
  color: #6b7280;
  font-size: 0.95rem;
}

.file-input:hover + .file-input-label,
.file-input-label:hover {
  border-color: #667eea;
  background: #f0f4ff;
  color: #667eea;
}

.file-info {
  margin-top: 0.5rem;
  padding: 0.75rem;
  background: #e8f4fd;
  border-radius: 8px;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.file-name {
  font-weight: 600;
  color: #1e40af;
}

.file-size {
  color: #6b7280;
  font-size: 0.9rem;
}

.remove-file {
  background: #ef4444;
  color: white;
  border: none;
  border-radius: 50%;
  width: 24px;
  height: 24px;
  cursor: pointer;
  font-size: 0.8rem;
  margin-left: auto;
}

.error-message {
  background: #fef2f2;
  color: #dc2626;
  padding: 1rem;
  border-radius: 8px;
  border: 1px solid #fecaca;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.success-message {
  background: #f0fdf4;
  color: #16a34a;
  padding: 1rem;
  border-radius: 8px;
  border: 1px solid #bbf7d0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.form-actions {
  display: flex;
  gap: 1rem;
  justify-content: space-between;
  margin-top: 1rem;
}

.back-button {
  background: #6b7280;
  color: white;
  border: none;
  padding: 1rem 1.5rem;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.back-button:hover {
  background: #4b5563;
  transform: translateY(-2px);
}

.send-button {
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
  border: none;
  padding: 1rem 2rem;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.send-button:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(102, 126, 234, 0.3);
}

.send-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}

@media (max-width: 768px) {
  .email-container {
    padding: 1rem 0.5rem;
  }

  .email-card {
    padding: 1.5rem;
  }

  .form-row {
    grid-template-columns: 1fr;
    gap: 1rem;
  }

  .form-actions {
    flex-direction: column;
  }

  .email-header h1 {
    font-size: 2rem;
  }
}
</style>
