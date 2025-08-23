<template>
  <div class="container mt-5">
    <div class="row">
      <div class="col-md-8 offset-md-2">
        <main id="main-content" role="main">
          <h1 class="text-center mb-4">📧 Send Email</h1>
          
          <div 
            v-if="message" 
            :class="messageClass"
            role="alert"
            :aria-live="messageType === 'error' ? 'assertive' : 'polite'"
            aria-atomic="true"
          >
            {{ message }}
          </div>
          
          <form @submit.prevent="sendEmail" novalidate>
            <fieldset>
              <legend class="sr-only">Email Form</legend>
              
              <div class="mb-3">
                <label for="to-email" class="form-label">
                  <span class="required-indicator" aria-label="required">*</span>
                  Recipient Email:
                </label>
                <input
                  id="to-email"
                  v-model="formData.to_email"
                  type="email"
                  class="form-control"
                  :class="{ 'is-invalid': errors.to_email }"
                  required
                  aria-required="true"
                  :aria-invalid="errors.to_email ? 'true' : 'false'"
                  :aria-describedby="errors.to_email ? 'to-email-error' : 'to-email-help'"
                  autocomplete="email"
                  placeholder="Enter recipient email address"
                />
                <div id="to-email-help" class="form-text">
                  Enter the email address of the recipient
                </div>
                <div 
                  v-if="errors.to_email" 
                  id="to-email-error" 
                  class="invalid-feedback"
                  role="alert"
                >
                  {{ errors.to_email }}
                </div>
              </div>
              
              <div class="mb-3">
                <label for="from-name" class="form-label">
                  <span class="required-indicator" aria-label="required">*</span>
                  Your Name:
                </label>
                <input
                  id="from-name"
                  v-model="formData.from_name"
                  type="text"
                  class="form-control"
                  :class="{ 'is-invalid': errors.from_name }"
                  required
                  aria-required="true"
                  :aria-invalid="errors.from_name ? 'true' : 'false'"
                  :aria-describedby="errors.from_name ? 'from-name-error' : 'from-name-help'"
                  autocomplete="name"
                  placeholder="Enter your name"
                />
                <div id="from-name-help" class="form-text">
                  Your name will appear as the sender
                </div>
                <div 
                  v-if="errors.from_name" 
                  id="from-name-error" 
                  class="invalid-feedback"
                  role="alert"
                >
                  {{ errors.from_name }}
                </div>
              </div>
              
              <div class="mb-3">
                <label for="subject" class="form-label">
                  <span class="required-indicator" aria-label="required">*</span>
                  Subject:
                </label>
                <input
                  id="subject"
                  v-model="formData.subject"
                  type="text"
                  class="form-control"
                  :class="{ 'is-invalid': errors.subject }"
                  required
                  aria-required="true"
                  :aria-invalid="errors.subject ? 'true' : 'false'"
                  :aria-describedby="errors.subject ? 'subject-error' : 'subject-help'"
                  placeholder="Enter email subject"
                />
                <div id="subject-help" class="form-text">
                  Brief description of your email content
                </div>
                <div 
                  v-if="errors.subject" 
                  id="subject-error" 
                  class="invalid-feedback"
                  role="alert"
                >
                  {{ errors.subject }}
                </div>
              </div>
              
              <div class="mb-3">
                <label for="message" class="form-label">
                  <span class="required-indicator" aria-label="required">*</span>
                  Message:
                </label>
                <textarea
                  id="message"
                  v-model="formData.message"
                  class="form-control"
                  :class="{ 'is-invalid': errors.message }"
                  rows="5"
                  required
                  aria-required="true"
                  :aria-invalid="errors.message ? 'true' : 'false'"
                  :aria-describedby="errors.message ? 'message-error' : 'message-help'"
                  placeholder="Enter your message content"
                ></textarea>
                <div id="message-help" class="form-text">
                  Enter the main content of your email
                </div>
                <div 
                  v-if="errors.message" 
                  id="message-error" 
                  class="invalid-feedback"
                  role="alert"
                >
                  {{ errors.message }}
                </div>
              </div>
              
              <div class="mb-3">
                <label for="attachment" class="form-label">
                  Attachment (optional):
                </label>
                <input
                  id="attachment"
                  ref="fileInput"
                  type="file"
                  class="form-control"
                  accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png"
                  aria-describedby="attachment-help"
                  @change="handleFileChange"
                />
                <div id="attachment-help" class="form-text">
                  Supported formats: PDF, DOC, DOCX, TXT, JPG, JPEG, PNG (Max 5MB)
                </div>
              </div>
            </fieldset>
            
            <div class="text-center">
              <button 
                type="submit" 
                class="btn btn-primary"
                :disabled="isLoading"
                :aria-describedby="isLoading ? 'loading-status' : null"
              >
                <span v-if="isLoading" aria-hidden="true" class="spinner-border spinner-border-sm me-2"></span>
                {{ isLoading ? 'Sending...' : 'Send Email' }}
              </button>
              <div v-if="isLoading" id="loading-status" class="sr-only" aria-live="polite">
                Email is being sent, please wait
              </div>
            </div>
          </form>
        </main>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import emailjs from '@emailjs/browser'
import { AccessibilityUtils } from '@/utils/accessibility'

const formData = reactive({
  to_email: '',
  from_name: '',
  subject: '',
  message: ''
})

const errors = reactive({})
const message = ref('')
const messageType = ref('')
const messageClass = ref('')
const isLoading = ref(false)
const fileInput = ref(null)

const validateForm = () => {
  Object.keys(errors).forEach(key => delete errors[key])
  
  if (!formData.to_email) {
    errors.to_email = 'Recipient email is required'
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.to_email)) {
    errors.to_email = 'Please enter a valid email address'
  }
  
  if (!formData.from_name.trim()) {
    errors.from_name = 'Your name is required'
  }
  
  if (!formData.subject.trim()) {
    errors.subject = 'Subject is required'
  }
  
  if (!formData.message.trim()) {
    errors.message = 'Message content is required'
  }
  
  return Object.keys(errors).length === 0
}

const sendEmail = async () => {
  if (!validateForm()) {
    AccessibilityUtils.announceToScreenReader(
      'Form has validation errors. Please check and correct the highlighted fields.',
      'assertive'
    )
    return
  }
  
  isLoading.value = true
  
  try {
    await emailjs.send(
      'service_tl1f6jl',
      'template_buditia',
      formData,
      'u4r7jB4o4iZOUAxOs'
    )
    
    message.value = 'Email sent successfully!'
    messageType.value = 'success'
    messageClass.value = 'alert alert-success'
    
    AccessibilityUtils.announceToScreenReader('Email sent successfully!')
    
    Object.keys(formData).forEach(key => {
      formData[key] = ''
    })
    
    if (fileInput.value) {
      fileInput.value.value = ''
    }
  } catch (error) {
    message.value = 'Failed to send email. Please try again.'
    messageType.value = 'error'
    messageClass.value = 'alert alert-danger'
    
    AccessibilityUtils.announceToScreenReader(
      'Failed to send email. Please try again.',
      'assertive'
    )
  } finally {
    isLoading.value = false
  }
}

const handleFileChange = (event) => {
  const file = event.target.files[0]
  if (file && file.size > 5 * 1024 * 1024) {
    AccessibilityUtils.announceToScreenReader(
      'File size exceeds 5MB limit. Please choose a smaller file.',
      'assertive'
    )
    event.target.value = ''
  }
}
</script>

<style scoped>
.required-indicator {
  color: #dc3545;
  font-weight: bold;
}

.form-control:focus {
  outline: 2px solid #0066cc;
  outline-offset: 2px;
  box-shadow: 0 0 0 0.2rem rgba(0, 102, 204, 0.25);
}

.btn:focus {
  outline: 2px solid #0066cc;
  outline-offset: 2px;
}

.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

.alert {
  margin-bottom: 1rem;
}

@media (prefers-reduced-motion: reduce) {
  .spinner-border {
    animation: none;
  }
}
</style>
