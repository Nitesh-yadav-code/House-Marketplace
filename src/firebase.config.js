// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";

import {getFirestore}  from "firebase/firestore"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBNAr7g5usILO5C4iHn8kv9j7ureiiAImY",
  authDomain: "house-marketplace-app-142aa.firebaseapp.com",
  projectId: "house-marketplace-app-142aa",
  storageBucket: "house-marketplace-app-142aa.appspot.com",
  messagingSenderId: "211862860434",
  appId: "1:211862860434:web:90f73f7a05df2ecfe16c4b"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore()