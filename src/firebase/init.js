import { initializeApp } from "firebase/app"
import { getFirestore } from "firebase/firestore"
import { getAuth } from "firebase/auth"

const firebaseConfig = {
  apiKey: "AIzaSyD6Z5RlmZ4xw1sKH1WNYZPxcgE3VnhxmNA",
  authDomain: "mentalhealth-62e7e.firebaseapp.com",
  projectId: "mentalhealth-62e7e",
  storageBucket: "mentalhealth-62e7e.firebasestorage.app",
  messagingSenderId: "943207121781",
  appId: "1:943207121781:web:b380a2520c10816d20893c"
}

const app = initializeApp(firebaseConfig)
export const db = getFirestore(app)
export const auth = getAuth(app)
export default app