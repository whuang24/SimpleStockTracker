import { initializeApp } from "firebase/app";
import { getFirestore, collection } from "firebase/firestore"

const firebaseConfig = {
    apiKey: "AIzaSyCQ_VPmjHepDPP2ge14UGRplcpsKJ9P4WI",
    authDomain: "react-stock-tracker.firebaseapp.com",
    projectId: "react-stock-tracker",
    storageBucket: "react-stock-tracker.appspot.com",
    messagingSenderId: "500127425065",
    appId: "1:500127425065:web:5cd099d72ceaf8702df238"
  };
  

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const graphDataCollection = collection(db, "graphData")
