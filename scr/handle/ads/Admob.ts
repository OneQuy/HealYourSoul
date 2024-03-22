/**
 * Install: 
 * 1. npm i react-native-google-mobile-ads react-native-tracking-transparency
 * 2. npx pod-install
 * 3. add this to app.json:
        "react-native-google-mobile-ads": {
            "android_app_id": "ca-app-pub-xxxx",
            "ios_app_id": "ca-app-pub-xxxxx"
        }
 * 4. add this to plist file:
        <key>NSUserTrackingUsageDescription</key>
        <string>This identifier will be used to deliver personalized ads to you.</string>
 * 5. done!
 * 
 * Doc: https://docs.page/invertase/react-native-google-mobile-ads/displaying-ads#rewarded-interstitial-ads
 */

import mobileAds from 'react-native-google-mobile-ads';
import { CheckAndRequestTrackingTransparencyAsync } from './iOSTrackingTransparency';

var inited = false

export const CheckAndInitAdmobAsync = async () => {
    if (inited)
        return

    inited = true

    await CheckAndRequestTrackingTransparencyAsync()

    await mobileAds().initialize()
}