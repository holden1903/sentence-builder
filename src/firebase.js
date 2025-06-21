import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAwf73LdR1m9uhLfWJIlx61tBPk7XSFD3M",
  authDomain: "sentence-builder-cb963.firebaseapp.com",
  projectId: "sentence-builder-cb963",
  storageBucket: "sentence-builder-cb963.firebasestorage.app",
  messagingSenderId: "467496076770",
  appId: "1:467496076770:web:c0ce2e02cd3d28118265bb"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
