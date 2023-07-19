// https://firebase.google.com/docs/
// install: npm install firebase

import { initializeApp } from 'firebase/app';

// Get these info when creating WEB app on firebase console:
// - Go to Console
// - Go to Project Settings
// - Add app > Web
const firebaseConfig = {
    apiKey: "AIzaSyDr-zTMO6TG9gvJvJ39Eg0kGtqbKqKxutY",
    authDomain: "warm-379a6.firebaseapp.com",
    databaseURL: "https://warm-379a6-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "warm-379a6",
    storageBucket: "warm-379a6.appspot.com",
    messagingSenderId: "1015171008666",
    appId: "1:1015171008666:web:385e8965b0509321577723",
    measurementId: "G-HX5BLQQJW5"
  };

var FirebaseApp = null;

export function GetFirebaseApp() {
    FirebaseInit();
    return FirebaseApp;
}

export function FirebaseInit() {
    if (FirebaseApp)
        return;

    FirebaseApp = initializeApp(firebaseConfig);
}