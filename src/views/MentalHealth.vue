<template>
  <div class="mental-health-page">
    <!-- Hero Section -->
    <section class="hero-section">
      <div class="hero-content">
        <div class="hero-text">
          <h1 class="hero-title">🧠 Mental Health Hub</h1>
          <p class="hero-subtitle">Your journey to wellness starts here</p>
          <p class="hero-description">
            Take control of your mental health with our comprehensive support system.
            You're not alone in this journey.
          </p>
          <div class="hero-buttons">
            <router-link to="/FireRegister" class="btn-primary">Join Our Community</router-link>
            <router-link to="/evaluate" class="btn-secondary">Share Your Experience</router-link>
          </div>
        </div>
        <div class="hero-image">
          <img
            src="@/assets/self-care.png"
            alt="Mental health support"
            class="hero-img"
          />
        </div>
      </div>
    </section>

    <!-- Features Section -->
    <section class="features-section">
      <div class="container">
        <h2 class="section-title">How We Support You</h2>
        <div class="features-grid">
          <div class="feature-card">
            <div class="feature-icon">🤝</div>
            <h3>Community Support</h3>
            <p>Connect with others who understand your journey and share experiences in a safe space.</p>
          </div>
          <div class="feature-card">
            <div class="feature-icon">📊</div>
            <h3>Track Progress</h3>
            <p>Monitor your mental health journey with personalized dashboards and insights.</p>
          </div>
          <div class="feature-card">
            <div class="feature-icon">🎯</div>
            <h3>Goal Setting</h3>
            <p>Set achievable wellness goals and celebrate your progress along the way.</p>
          </div>
          <div class="feature-card">
            <div class="feature-icon">💡</div>
            <h3>Resources</h3>
            <p>Access evidence-based tools and techniques for managing stress and anxiety.</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Inspirational Quotes Section -->
    <section class="quotes-section">
      <div class="container">
        <h2 class="section-title">Words of Encouragement</h2>
        <div class="quotes-carousel">
          <div class="quote-card active">
            <blockquote>
              "Your mental health journey: You're the hero of your own story."
            </blockquote>
            <cite>- Mental Health Hub</cite>
          </div>
          <div class="quote-card">
            <blockquote>
              "Break the silence. Break the stigma. Your voice matters."
            </blockquote>
            <cite>- Mental Health Hub</cite>
          </div>
          <div class="quote-card">
            <blockquote>
              "Mind strong. Heart strong. You strong. Every step counts."
            </blockquote>
            <cite>- Mental Health Hub</cite>
          </div>
        </div>
      </div>
    </section>

    <!-- Statistics Section -->
    <section class="stats-section">
      <div class="container">
        <div class="stats-grid">
          <div class="stat-item">
            <div class="stat-number">1 in 4</div>
            <div class="stat-label">People experience mental health issues</div>
          </div>
          <div class="stat-item">
            <div class="stat-number">85%</div>
            <div class="stat-label">Report improvement with support</div>
          </div>
          <div class="stat-item">
            <div class="stat-number">24/7</div>
            <div class="stat-label">Community support available</div>
          </div>
        </div>
      </div>
    </section>

    <!-- Call to Action Section -->
    <section class="cta-section">
      <div class="container">
        <div class="cta-content">
          <h2>Ready to Start Your Journey?</h2>
          <p>Join thousands of others who have taken the first step towards better mental health.</p>
          <div class="cta-buttons">
            <router-link to="/" class="btn-primary large">Get Started Today</router-link>
            <router-link to="/about" class="btn-outline">Learn More</router-link>
          </div>
        </div>
      </div>
    </section>

    <!-- Admin Login Section -->
    <section class="admin-section">
      <div class="container">
        <div class="admin-login-link">
          <router-link to="/admin-login" class="admin-link">
            <span class="admin-icon">🔐</span>
            Admin Login
          </router-link>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const currentQuote = ref(0)
const quotes = [
  {
    text: "Your mental health journey: You're the hero of your own story.",
    author: "Mental Health Hub"
  },
  {
    text: "Break the silence. Break the stigma. Your voice matters.",
    author: "Mental Health Hub"
  },
  {
    text: "Mind strong. Heart strong. You strong. Every step counts.",
    author: "Mental Health Hub"
  }
]

onMounted(() => {
  setInterval(() => {
    currentQuote.value = (currentQuote.value + 1) % quotes.length
    updateActiveQuote()
  }, 4000)
})

const updateActiveQuote = () => {
  const quoteCards = document.querySelectorAll('.quote-card')
  quoteCards.forEach((card, index) => {
    card.classList.toggle('active', index === currentQuote.value)
  })
}
</script>

<style scoped>
.mental-health-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
}

/* Hero Section */
.hero-section {
  padding: 4rem 2rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  position: relative;
  overflow: hidden;
}

.hero-section::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.1);
  z-index: 1;
}

.hero-content {
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 3rem;
  align-items: center;
  position: relative;
  z-index: 2;
}

.hero-title {
  font-size: 3.5rem;
  font-weight: 700;
  margin-bottom: 1rem;
  background: linear-gradient(45deg, #fff, #e0e7ff);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.hero-subtitle {
  font-size: 1.5rem;
  margin-bottom: 1rem;
  opacity: 0.9;
}

.hero-description {
  font-size: 1.1rem;
  line-height: 1.6;
  margin-bottom: 2rem;
  opacity: 0.8;
}

.hero-buttons {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.hero-img {
  width: 100%;
  height: auto;
  border-radius: 20px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
  transform: rotate(2deg);
  transition: transform 0.3s ease;
}

.hero-img:hover {
  transform: rotate(0deg) scale(1.05);
}

/* Button Styles */
.btn-primary, .btn-secondary, .btn-outline {
  padding: 1rem 2rem;
  border-radius: 50px;
  text-decoration: none;
  font-weight: 600;
  transition: all 0.3s ease;
  display: inline-block;
  text-align: center;
  border: 2px solid transparent;
}

.btn-primary {
  background: linear-gradient(135deg, #10b981, #059669);
  color: white;
  box-shadow: 0 4px 15px rgba(16, 185, 129, 0.3);
}

.btn-primary:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 25px rgba(16, 185, 129, 0.4);
  color: white;
}

.btn-secondary {
  background: rgba(255, 255, 255, 0.2);
  color: white;
  border: 2px solid rgba(255, 255, 255, 0.3);
  backdrop-filter: blur(10px);
}

.btn-secondary:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: translateY(-3px);
  color: white;
}

.btn-outline {
  background: transparent;
  color: #667eea;
  border: 2px solid #667eea;
}

.btn-outline:hover {
  background: #667eea;
  color: white;
  transform: translateY(-3px);
}

.btn-primary.large {
  padding: 1.25rem 2.5rem;
  font-size: 1.1rem;
}

/* Container */
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
}

/* Section Titles */
.section-title {
  text-align: center;
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 3rem;
  color: #1f2937;
  position: relative;
}

.section-title::after {
  content: '';
  position: absolute;
  bottom: -10px;
  left: 50%;
  transform: translateX(-50%);
  width: 80px;
  height: 4px;
  background: linear-gradient(135deg, #667eea, #764ba2);
  border-radius: 2px;
}

/* Features Section */
.features-section {
  padding: 5rem 0;
  background: white;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 2rem;
}

.feature-card {
  background: white;
  padding: 2.5rem;
  border-radius: 20px;
  text-align: center;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  border: 1px solid #f1f5f9;
}

.feature-card:hover {
  transform: translateY(-10px);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
}

.feature-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
  background: linear-gradient(135deg, #667eea, #764ba2);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.feature-card h3 {
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 1rem;
  color: #1f2937;
}

.feature-card p {
  color: #6b7280;
  line-height: 1.6;
}

/* Quotes Section */
.quotes-section {
  padding: 5rem 0;
  background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
}

.quotes-carousel {
  position: relative;
  max-width: 800px;
  margin: 0 auto;
  height: 200px;
}

.quote-card {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  background: white;
  padding: 3rem;
  border-radius: 20px;
  text-align: center;
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.1);
  opacity: 0;
  transform: translateY(20px);
  transition: all 0.5s ease;
}

.quote-card.active {
  opacity: 1;
  transform: translateY(0);
}

.quote-card blockquote {
  font-size: 1.5rem;
  font-style: italic;
  color: #1f2937;
  margin-bottom: 1rem;
  line-height: 1.6;
}

.quote-card cite {
  color: #667eea;
  font-weight: 600;
}

/* Stats Section */
.stats-section {
  padding: 5rem 0;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 3rem;
  text-align: center;
}

.stat-number {
  font-size: 3.5rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
  background: linear-gradient(45deg, #fff, #e0e7ff);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.stat-label {
  font-size: 1.1rem;
  opacity: 0.9;
}

/* CTA Section */
.cta-section {
  padding: 5rem 0;
  background: white;
}

.cta-content {
  text-align: center;
  max-width: 600px;
  margin: 0 auto;
}

.cta-content h2 {
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 1rem;
  color: #1f2937;
}

.cta-content p {
  font-size: 1.2rem;
  color: #6b7280;
  margin-bottom: 2rem;
  line-height: 1.6;
}

.cta-buttons {
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
}

/* Responsive Design */
@media (max-width: 768px) {
  .hero-content {
    grid-template-columns: 1fr;
    text-align: center;
    gap: 2rem;
  }

  .hero-title {
    font-size: 2.5rem;
  }

  .features-grid {
    grid-template-columns: 1fr;
  }

  .stats-grid {
    grid-template-columns: 1fr;
    gap: 2rem;
  }

  .hero-buttons,
  .cta-buttons {
    flex-direction: column;
    align-items: center;
  }

  .btn-primary,
  .btn-secondary,
  .btn-outline {
    width: 100%;
    max-width: 300px;
  }

  .section-title {
    font-size: 2rem;
  }

  .quote-card blockquote {
    font-size: 1.2rem;
  }
}

@media (max-width: 480px) {
  .hero-section,
  .features-section,
  .quotes-section,
  .stats-section,
  .cta-section {
    padding: 3rem 1rem;
  }

  .hero-title {
    font-size: 2rem;
  }

  .feature-card,
  .quote-card {
    padding: 2rem;
  }

  .stat-number {
    font-size: 2.5rem;
  }
}

/* Admin Section */
.admin-section {
  padding: 3rem 0;
  background: #1f2937;
  border-top: 3px solid #667eea;
  margin-top: 2rem;
}

.admin-login-link {
  text-align: center;
}

.admin-link {
  display: inline-flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem 2rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  text-decoration: none;
  border-radius: 30px;
  font-size: 1rem;
  font-weight: 600;
  transition: all 0.3s ease;
  border: 2px solid transparent;
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
}

.admin-link:hover {
  background: linear-gradient(135deg, #5a67d8 0%, #6b46c1 100%);
  color: white;
  transform: translateY(-3px);
  box-shadow: 0 8px 25px rgba(102, 126, 234, 0.4);
}

.admin-icon {
  font-size: 1.2rem;
}

/* Responsive Design for Admin Section */
@media (max-width: 768px) {
  .admin-section {
    padding: 2rem 0;
  }
  
  .admin-link {
    font-size: 0.9rem;
    padding: 0.8rem 1.5rem;
  }
}

@media (max-width: 480px) {
  .admin-section {
    padding: 1.5rem 0;
  }
  
  .admin-link {
    font-size: 0.85rem;
    padding: 0.7rem 1.2rem;
  }
}
</style>
