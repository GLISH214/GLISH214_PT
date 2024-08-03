// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import {getAuth} from "firebase/auth";
import { getStorage } from 'firebase/storage';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAL1MB0AJTtOPwYAyOP-HHfL25eaWXbkpg",
  authDomain: "pantry-tracker-df56c.firebaseapp.com",
  projectId: "pantry-tracker-df56c",
  storageBucket: "pantry-tracker-df56c.appspot.com",
  messagingSenderId: "979110420342",
  appId: "1:979110420342:web:19091cc57bc44284186457",
  measurementId: "G-1TCYPNNXEF"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);
const storage = getStorage(app);

export const auth=getAuth();
export { firestore, storage };
export const db=getFirestore(app);
export default app;