import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyBCqoIKghkxaoVswS8wc7vj1TnZXxy9tXA",
  authDomain: "campus-6057f.firebaseapp.com",
  projectId: "campus-6057f",
  storageBucket: "campus-6057f.appspot.com",
  messagingSenderId: "68560705014",
  appId: "1:68560705014:web:f8f94c11498ca97a1ae3d7",
  measurementId: "G-HTYDQM4XZ6"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);


export { app, db, auth };
