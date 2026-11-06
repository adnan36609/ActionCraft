import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "actioncraft-f7160.firebaseapp.com",
  projectId: "actioncraft-f7160",
  storageBucket: "actioncraft-f7160.firebasestorage.app",
  messagingSenderId: "234932063661",
  appId: "1:234932063661:web:756a5218089588831ee524",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
