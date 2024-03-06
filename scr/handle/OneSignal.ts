/**
 * DOC:
 * 
 * https://documentation.onesignal.com/docs/react-native-sdk-setup
 * 
 * INSTALL:
 * 
 * + npm i react-native-onesignal
 * + (optional if error pod) cd ios && pod update
 * + Create app, go to Setting, get app ID, replace 'OneSignalKey' below
 * + Enable FCM on Firebase
 * 
 * + Android:
 *      + Go to Firebase console, Project Setting, Cloud message tab, make sure Firebase Cloud Messaging API (V1) enabled
 *      + Go to Service accounts, Create new secret key, download json
 *      + Go to OneSignal app setting, select Platform > Add Google Android (FCM), upload this json file,...
 * + iOS
 *      + add Push Notifications on XCode
 *      + Go to OneSignal app setting, select Platform > Add Apple iOS (APNs), upload p8 key, team ID KDX2P98MXK, 
 *      (p8 key doc: https://documentation.onesignal.com/docs/establishing-an-apns-authentication-key)
 * 
 * + call await InitOneSignalAsync() (maybe this showing alert request permission)
 * 
 */

import { LogLevel, OneSignal } from 'react-native-onesignal';
import { OneSignalKey } from '../../keys';

// Add OneSignal within your App's root component
export const InitOneSignalAsync = async () => {
    // // Remove this method to stop OneSignal Debugging
    // OneSignal.Debug.setLogLevel(LogLevel.Verbose);

    // OneSignal Initialization
    OneSignal.initialize(OneSignalKey);

    // requestPermission will show the native iOS or Android notification permission prompt.
    // We recommend removing the following code and instead using an In-App Message to prompt for notification permission
    await OneSignal.Notifications.requestPermission(true);

    // // Method for listening for notification clicks
    // OneSignal.Notifications.addEventListener('click', (event) => {
    //     console.log('OneSignal: notification clicked:', event);
    // })
}