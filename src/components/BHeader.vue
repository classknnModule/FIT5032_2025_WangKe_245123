<template>
  <header role="banner">
    <nav class="navbar navbar-expand-lg navbar-light bg-light" role="navigation" aria-label="Main navigation">
      <div class="container-fluid">
        <router-link 
          class="navbar-brand" 
          to="/"
          aria-label="Mental Health Hub - Go to homepage"
        >
          Mental Health Hub
        </router-link>
        
        <button 
          class="navbar-toggler" 
          type="button" 
          :aria-expanded="isMenuOpen"
          aria-controls="navbarNav"
          aria-label="Toggle navigation menu"
          @click="toggleMenu"
          @keydown.enter="toggleMenu"
          @keydown.space.prevent="toggleMenu"
        >
          <span class="navbar-toggler-icon" aria-hidden="true"></span>
        </button>
        
        <div 
          class="collapse navbar-collapse" 
          :class="{ show: isMenuOpen }"
          id="navbarNav"
        >
          <ul class="navbar-nav me-auto mb-2 mb-lg-0" role="menubar">
            <li class="nav-item" role="none">
              <router-link 
                class="nav-link" 
                to="/"
                role="menuitem"
                aria-label="Home page"
                @click="closeMenu"
              >
                <span aria-hidden="true">🏠</span> Home
              </router-link>
            </li>
            <li class="nav-item" role="none">
              <router-link 
                class="nav-link" 
                to="/FireRegister"
                role="menuitem"
                aria-label="Register new account"
                @click="closeMenu"
              >
                <span aria-hidden="true">📝</span> Firebase Register
              </router-link>
            </li>
            <li class="nav-item" role="none">
              <router-link 
                class="nav-link" 
                to="/Firelogin"
                role="menuitem"
                aria-label="Login to account"
                @click="closeMenu"
              >
                <span aria-hidden="true">🔐</span> Firebase Login
              </router-link>
            </li>
            <li class="nav-item" role="none">
              <router-link 
                class="nav-link" 
                to="/about"
                role="menuitem"
                aria-label="Dashboard and user information"
                @click="closeMenu"
              >
                <span aria-hidden="true">📊</span> Dashboard
              </router-link>
            </li>
            <li class="nav-item" role="none">
              <router-link 
                class="nav-link" 
                to="/evaluate"
                role="menuitem"
                aria-label="Mental health evaluation"
                @click="closeMenu"
              >
                <span aria-hidden="true">⭐</span> Evaluate
              </router-link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
    
    <div class="skip-links">
      <a href="#main-content" class="skip-link">Skip to main content</a>
      <a href="#navigation" class="skip-link">Skip to navigation</a>
    </div>
  </header>
</template>

<script setup>
import { ref } from 'vue'
import { AccessibilityUtils } from '@/utils/accessibility'

const isMenuOpen = ref(false)

const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value
  AccessibilityUtils.announceToScreenReader(
    isMenuOpen.value ? 'Navigation menu opened' : 'Navigation menu closed'
  )
}

const closeMenu = () => {
  isMenuOpen.value = false
}
</script>

<style scoped>
.skip-links {
  position: absolute;
  top: -40px;
  left: 6px;
  z-index: 1000;
}

.skip-link {
  position: absolute;
  top: -40px;
  left: 6px;
  background: #000;
  color: #fff;
  padding: 8px;
  text-decoration: none;
  border-radius: 4px;
  font-weight: bold;
  z-index: 1001;
}

.skip-link:focus {
  top: 6px;
}

.navbar-toggler:focus {
  outline: 2px solid #0066cc;
  outline-offset: 2px;
}

.nav-link:focus {
  outline: 2px solid #0066cc;
  outline-offset: 2px;
  background-color: rgba(0, 102, 204, 0.1);
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
</style>
