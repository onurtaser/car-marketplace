// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCNDKQo2gOMXhQ9DWFjcq_aBXaS35x0Byw",
  authDomain: "car-marketplace-748d7.firebaseapp.com",
  projectId: "car-marketplace-748d7",
  storageBucket: "car-marketplace-748d7.appspot.com",
  messagingSenderId: "848848615739",
  appId: "1:848848615739:web:d96913bc376dd5cd121f1e"
};

// Initialize Firebase
initializeApp(firebaseConfig);
export const db = getFirestore()