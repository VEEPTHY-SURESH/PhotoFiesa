
import { initializeApp } from "firebase/app";

const firebaseConfig = {
    apiKey: "AIzaSyCclCF4hL0iVU1bN_XK8aKvdE-fXS1Zjek",
    authDomain: "photofiesta-f9e2c.firebaseapp.com",
    projectId: "photofiesta-f9e2c",
    storageBucket: "photofiesta-f9e2c.appspot.com",
    messagingSenderId: "358464163328",
    appId: "1:358464163328:web:8418571995de9e4441d2e5",
    measurementId: "G-P6TWLHMSN2",
  };
  
  const app = initializeApp(firebaseConfig);

  export default app;