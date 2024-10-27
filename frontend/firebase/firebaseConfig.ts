// hix
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import "@firebase/auth";
import '@firebase/auth';const firebaseConfig = {
    apiKey: "AIzaSyCSsLOZlwJp-xpnMV9oOC01EeAnuSNW4FQ",
    authDomain: "beatbuddies-57eaa.firebaseapp.com",
    projectId: "beatbuddies-57eaa",
    storageBucket: "beatbuddies-57eaa.appspot.com",
    messagingSenderId: "652919053078",
    appId: "1:652919053078:web:cb4e6bb4b49a3ed16f8e37"
};
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { auth, app };