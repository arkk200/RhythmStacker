import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyC2zzsBuF0gPG0mhLr3eBmj0z26KoZHJQk",
  authDomain: "rhythm-stacker.firebaseapp.com",
  projectId: "rhythm-stacker",
  storageBucket: "rhythm-stacker.appspot.com",
  messagingSenderId: "402622463693",
  appId: "1:402622463693:web:0bae5cd7a322a4fad6b384",
  measurementId: "G-T2H6BNWL1E"
};

initializeApp(firebaseConfig);
export const storage = getStorage();