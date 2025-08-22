<template>
  <div class="email-sender">
    <div class="email-card">
      <h2>📧 Send Email with Attachment</h2>

      <form @submit.prevent="sendEmail" class="email-form">
        <div class="form-group">
          <label for="to_email">To Email:</label>
          <input
            id="to_email"
            type="email"
            v-model="emailData.to_email"
            required
            class="form-input"
          />
        </div>

        <div class="form-group">
          <label for="subject">Subject:</label>
          <input
            id="subject"
            type="text"
            v-model="emailData.subject"
            required
            class="form-input"
          />
        </div>

        <div class="form-group">
          <label for="message">Message:</label>
          <textarea
            id="message"
            v-model="emailData.message"
            rows="5"
            required
            class="form-input"
          ></textarea>
        </div>

        <div class="form-group">
          <label for="attachment">Attachment:</label>
          <input
            id="attachment"
            type="file"
            @change="handleFileUpload"
            class="form-input"
            accept=".pdf,.doc,.docx,.txt,.jpg,.png"
          />
        </div>

        <div v-if="errorMessage" class="error-message">
          {{ errorMessage }}
        </div>

        <div v-if="successMessage" class="success-message">
          {{ successMessage }}
        </div>

        <button type="submit" :disabled="isLoading" class="send-button">
          <span v-if="isLoading">Sending...</span>
          <span v-else>📤 Send Email</span>
        </button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import emailjs from '@emailjs/browser'

const emailData = ref({
  to_email: '',
  subject: '',
  message: ''
})

const attachment = ref(null)
const errorMessage = ref('')
const successMessage = ref('')
const isLoading = ref(false)

const handleFileUpload = (event) => {
  const file = event.target.files[0]
  if (file) {
    if (file.size > 10 * 1024 * 1024) {
      errorMessage.value = 'File size must be less than 10MB'
      return
    }
    attachment.value = file
  }
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
      subject: emailData.value.subject,
      message: emailData.value.message,
      from_name: 'Mental Health App'
    }

    if (attachment.value) {
      const base64File = await convertFileToBase64(attachment.value)
      templateParams.attachment = base64File
      templateParams.attachment_name = attachment.value.name
    }

    await emailjs.send(
      'service_5axfo94',
      'template_buditia',
      templateParams,
      'u4r7jB4o4iZOUAxOs'
    )

    successMessage.value = 'Email sent successfully!'

    emailData.value = {
      to_email: '',
      subject: '',
      message: ''
    }
    attachment.value = null

  } catch (error) {
    console.error('Email sending failed:', error)
    errorMessage.value = 'Failed to send email. Please try again.'
  } finally {
    isLoading.value = false
  }
}
</script>

<style scoped>
.email-sender {
  max-width: 600px;
  margin: 2rem auto;
  padding: 2rem;
}

.email-card {
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  padding: 2rem;
}

.email-form {
  display: flex;
  flex-direction: column;
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
}

.form-input {
  padding: 0.75rem;
  border: 2px solid #e1e8ed;
  border-radius: 8px;
  font-size: 1rem;
}

.form-input:focus {
  outline: none;
  border-color: #007bff;
}

.send-button {
  background: linear-gradient(135deg, #007bff, #0056b3);
  color: white;
  border: none;
  padding: 1rem 2rem;
  border-radius: 8px;
  font-size: 1rem;
  cursor: pointer;
  transition: transform 0.2s;
}

.send-button:hover {
  transform: translateY(-2px);
}

.send-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.error-message {
  color: #dc3545;
  background: #f8d7da;
  padding: 0.75rem;
  border-radius: 4px;
  border: 1px solid #f5c6cb;
}

.success-message {
  color: #155724;
  background: #d4edda;
  padding: 0.75rem;
  border-radius: 4px;
  border: 1px solid #c3e6cb;
}
</style>
