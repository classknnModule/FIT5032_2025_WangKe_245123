import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import AboutView from '../views/AboutView.vue'
import LoginView from '../views/LoginView.vue'
import MentalHealth from '../views/MentalHealth.vue'
import Evaluate from '../views/Evaluate.vue'
import FirebaseSigninView from '../views/FirebaseSigninView.vue'
import FirebaseRegisterView from '../views/FirebaseRegisterView.vue'
import { getAuth, onAuthStateChanged } from 'firebase/auth'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: HomeView
  },
  {
    path: '/about',
    name: 'About',
    component: AboutView,
    meta: { requiresFirebaseAuth: true }
  },
  {
    path: '/Firelogin',
    name: 'Firelogin',
    component: FirebaseSigninView
  },
  {
    path: '/Fireregister',
    name: 'Fireregister',
    component: FirebaseRegisterView
  },
  {
    path: '/login',
    name: 'Login',
    component: LoginView
  },
  {
    path: '/mental',
    name: 'Mental',
    component: MentalHealth
  },
  {
    path: '/evaluate',
    name: 'Evaluate',
    component: Evaluate
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  const auth = getAuth()

  if (to.meta.requiresFirebaseAuth) {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        next()
      } else {
        next({ path: '/Firelogin', query: { redirect: to.fullPath } })
      }
    })
  } else if (to.meta.requiresAuth) {
    const isAuthenticated = JSON.parse(localStorage.getItem('isAuthenticated')) || false
    if (!isAuthenticated) {
      next({ path: '/login', query: { redirect: to.fullPath } })
    } else {
      next()
    }
  } else {
    next()
  }
})

export default router
