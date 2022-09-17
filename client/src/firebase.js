// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth , GoogleAuthProvider  } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyAL4WAEatv7C_z3pgzd0UwQq27_1ESJQJM",
    authDomain: "videoshare-361d8.firebaseapp.com",
    projectId: "videoshare-361d8",
    storageBucket: "videoshare-361d8.appspot.com",
    messagingSenderId: "1025141838565",
    appId: "1:1025141838565:web:5f8071652752605411ba0c"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth();
export const provider = new GoogleAuthProvider();

export default app;