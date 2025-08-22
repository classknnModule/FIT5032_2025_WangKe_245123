import 'bootstrap/dist/css/bootstrap.min.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

import PrimeVue from 'primevue/config'
import Aura from '@primevue/themes/aura'

const app = createApp(App)
app.use(PrimeVue, { theme: { preset: Aura } })
app.use(router)

app.mount('#app')

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD6Z5RlmZ4xw1sKH1WNYZPxcgE3VnhxmNA",
  authDomain: "mentalhealth-62e7e.firebaseapp.com",
  projectId: "mentalhealth-62e7e",
  storageBucket: "mentalhealth-62e7e.firebasestorage.app",
  messagingSenderId: "943207121781",
  appId: "1:943207121781:web:b380a2520c10816d20893c"
};

// Initialize Firebase
initializeApp(firebaseConfig);
