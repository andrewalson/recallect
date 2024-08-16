// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: FIREBASE_API_KEY,
  authDomain: "flashcard-saas-252f2.firebaseapp.com",
  projectId: "flashcard-saas-252f2",
  storageBucket: "flashcard-saas-252f2.appspot.com",
  messagingSenderId: "582881449711",
  appId: "1:582881449711:web:260d5b4de12c06d56aad1a",
  measurementId: "G-3QYR56SNR4"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
const db = getFirestore(app);

export { db };