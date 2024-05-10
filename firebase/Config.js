import firebase from "firebase/compat/app";
import "firebase/compat/storage";
import "firebase/compat/auth";
import "firebase/compat/firestore";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getReactNativePersistence } from "@firebase/auth/dist/rn/index.js";
import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage";

const firebaseConfig = {
  apiKey: "AIzaSyBPiRrslh28md3DbkqacWsxWcy97WM04bk",
  authDomain: "projectcs303.firebaseapp.com",
  projectId: "projectcs303",
  storageBucket: "projectcs303.appspot.com",
  messagingSenderId: "176023625454",
  appId: "1:176023625454:web:1d154478eb43f4ffe39dff",
};

// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);

//instial database
const db = getFirestore(app);
const auth = getAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage)
});

export { app, db, auth, firebase };
