// https://firebase.google.com/docs/
// install: npm install firebase

import { initializeApp } from 'firebase/app';
import { firebaseConfig } from '../../config';

// Get these info when creating WEB app on firebase console:
// - Go to Console
// - Go to Project Settings
// - Add app > Web

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