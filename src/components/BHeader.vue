<template>
  <nav class="modern-nav">
    <div class="nav-container">
      <div class="nav-brand">
        <h2>🧠 Mental Health Hub</h2>
      </div>
      <ul class="nav-menu">
        <li class="nav-item">
          <router-link to="/mental" class="nav-link" active-class="active">
            <i class="icon">🏠</i>
            <span>Home</span>
          </router-link>
        </li>
        <li class="nav-item">
          <router-link to="/" class="nav-link" active-class="active">
            <i class="icon">📝</i>
            <span>Register</span>
          </router-link>
        </li>
        <li class="nav-item">
          <router-link to="/login" class="nav-link" active-class="active">
            <i class="icon">🔐</i>
            <span>Login</span>
          </router-link>
        </li>
        <li class="nav-item">
          <router-link to="/about" class="nav-link" active-class="active">
            <i class="icon">📊</i>
            <span>Dashboard</span>
          </router-link>
        </li>
        <li class="nav-item">
          <router-link to="/evaluate" class="nav-link" active-class="active">
            <i class="icon">⭐</i>
            <span>Evaluate</span>
          </router-link>
        </li>
      </ul>
    </div>
  </nav>
</template>

<style scoped>
.modern-nav {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  position: sticky;
  top: 0;
  z-index: 1000;
}

.nav-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 1rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.nav-brand h2 {
  margin: 0;
  background: linear-gradient(135deg, #6366f1, #ec4899);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  font-weight: 700;
  font-size: 1.5rem;
}

.nav-menu {
  display: flex;
  list-style: none;
  margin: 0;
  padding: 0;
  gap: 0.5rem;
}

.nav-link {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.25rem;
  border-radius: 50px;
  text-decoration: none;
  color: #64748b;
  font-weight: 500;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
}

.nav-link::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #6366f1, #ec4899);
  transition: left 0.3s ease;
  z-index: -1;
}

.nav-link:hover::before,
.nav-link.active::before {
  left: 0;
}

.nav-link:hover,
.nav-link.active {
  color: white;
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(99, 102, 241, 0.3);
}

.icon {
  font-size: 1.1rem;
}

@media (max-width: 768px) {
  .nav-container {
    flex-direction: column;
    gap: 1rem;
  }
  
  .nav-menu {
    flex-wrap: wrap;
    justify-content: center;
  }
  
  .nav-link span {
    display: none;
  }
}
</style>
