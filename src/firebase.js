import { initializeApp } from "firebase/app";
import {getAuth, GoogleAuthProvider} from 'firebase/auth'
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyAdf_K4EUUTRq9AkCLM7mSZJSTQPQSmHxI",
    authDomain: "fireship-demos-f374d.firebaseapp.com",
    projectId: "fireship-demos-f374d",
    storageBucket: "fireship-demos-f374d.appspot.com",
    messagingSenderId: "1091904064789",
    appId: "1:1091904064789:web:26791967ce45b2756cad1c",
    measurementId: "G-FK9Y55ZP3M"
  };

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth =  getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();