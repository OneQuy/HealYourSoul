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

import { Platform } from "react-native";
import { AdEventType, InterstitialAd } from "react-native-google-mobile-ads";

var initedAdmob = false

/**
 * This will show up a popup request (if needed)
 */
export const CheckAndInitAdmobAsync = async () => {
    if (initedAdmob)
        return

    initedAdmob = true

    await CheckAndRequestTrackingTransparencyAsync()

    await mobileAds().initialize()
}

class AdmobInterstitial {
    private static interstitial: InterstitialAd | undefined

    /**
     * @returns InterstitialAd. You can register events base on it.
     */
    static Init = (androidUnitId: string, iosUnitId: string): InterstitialAd => {
        if (this.interstitial)
            return this.interstitial

        const unit = Platform.OS === 'android' ? androidUnitId : iosUnitId

        this.interstitial = InterstitialAd.createForAdRequest(unit)

        return this.interstitial
    }

    /**
     * 
     * @returns if showed successully
     */
    static Show = (): boolean => {
        if (!this.interstitial) {
            console.error('[Show] Not inited AdmobInterstitial yet')
            return false
        }

        if (this.interstitial.loaded) {
            this.interstitial.show()
            return true
        }
        else
            return false
    }

    /**
     * It's okay to call this multi times at the same time.
     */
    static Load = () => {
        if (!this.interstitial) {
            console.error('[Load] Not inited AdmobInterstitial yet')
            return false
        }

        this.interstitial.load()
    }
}