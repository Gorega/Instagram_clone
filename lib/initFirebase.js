import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
    apiKey: "AIzaSyCaHSbhS7jUOiMV04BBEa2l2dX6T7pNQ4E",
    authDomain: "instagram-clone-a6598.firebaseapp.com",
    projectId: "instagram-clone-a6598",
    storageBucket: "instagram-clone-a6598.appspot.com",
    messagingSenderId: "749683987509",
    appId: "1:749683987509:web:9daca48c8dafa2e81b4d7c"
};
export const firebaseApp = initializeApp(firebaseConfig);
const storage = getStorage(firebaseApp);