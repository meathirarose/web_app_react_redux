import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: import.meta.VITE_FIREBASE_API_KEY,
  authDomain: "web-app-217a7.firebaseapp.com",
  projectId: "web-app-217a7",
  storageBucket: "web-app-217a7.appspot.com",
  messagingSenderId: "763388293237",
  appId: "1:763388293237:web:d4f04d7e0db6b600b9083c"
};

export const app = initializeApp(firebaseConfig);

export const storage = getStorage(app);
