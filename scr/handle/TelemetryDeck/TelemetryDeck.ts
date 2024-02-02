// Install:

// 1. npm i @typedigital/telemetrydeck-react
// 2. npm i expo-crypto text-encoding
// 3. npx install-expo-modules@latest
// 4. import './scr/handle/TelemetryDeck/globals' to index.js of app
// 5. (maybe?) edit version of line below of file: node_modules/expo-crypto/ios/ExpoCrypto.podspec
//   s.platform = :ios, '13.0'
// 6. npx pod-install
// 7. add this app: <TelemetryDeckProvider telemetryDeck={telemetryDeck}>

import { createTelemetryDeck } from "@typedigital/telemetrydeck-react";

export const createTelemetryDeckClient = (appID: string, userID: string, isTest: boolean) => createTelemetryDeck({
    appID,
    clientUser: userID,
    testMode: isTest,
});
