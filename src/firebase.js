import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Import the functions you need from the SDKs you need
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDIq5DB32hJoUxcN9KTuKOwFYoyeLCkIvI",
  authDomain: "enviromental-club.firebaseapp.com",
  projectId: "enviromental-club",
  storageBucket: "enviromental-club.appspot.com",
  messagingSenderId: "628282948324",
  appId: "1:628282948324:web:e15474f0bfb56ea5748af1"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { app, db };