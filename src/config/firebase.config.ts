// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

interface FirebaseConfig {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
  measurementId?: string; // Optional
}


const firebaseConfig: FirebaseConfig = {
  apiKey: "AIzaSyDoOdjDbpW7hzgmDwJ6_6Cys5vT5a4V_Wg",
  authDomain: "kim-beauty-spa-73fee.firebaseapp.com",
  projectId: "kim-beauty-spa-73fee",
  storageBucket: "kim-beauty-spa-73fee.appspot.com",
  messagingSenderId: "197645095736",
  appId: "1:197645095736:web:13a244a700a67e465327cd",
  measurementId: "G-Y517RVRFMQ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app)