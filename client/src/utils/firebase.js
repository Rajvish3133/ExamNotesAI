import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_APIKEY,
  authDomain: "authexamnotes-680e1.firebaseapp.com",
  projectId: "authexamnotes-680e1",
  storageBucket: "authexamnotes-680e1.firebasestorage.app",
  messagingSenderId: "1886827406",
  appId: "1:1886827406:web:1d4f2b39852829f951eadf"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const auth = getAuth(app);

const provider = new GoogleAuthProvider();  

export { auth, provider };