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
 * 5. go to Play console > App content, add Advertise ID
 * 6. done!
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

export class AdmobInterstitial {
    private static interstitial: InterstitialAd | undefined

    /**
     * @returns InterstitialAd. You can register events base on it.
     * 
     ## Usage:
     ```tsx
     useEffect(() => {
        // init admob interstitial

        const interstitial = AdmobInterstitial.Init(AdmobInter_Android, AdmobInter_iOS)

        const interstitialSubscribe_Load = interstitial.addAdEventListener(AdEventType.LOADED, OnAdmobInterstitial_Loaded)
        const interstitialSubscribe_Open = interstitial.addAdEventListener(AdEventType.OPENED, OnAdmobInterstitial_Opened)
        const interstitialSubscribe_Click = interstitial.addAdEventListener(AdEventType.CLICKED, OnAdmobInterstitial_Clicked)
        const interstitialSubscribe_Paid = interstitial.addAdEventListener(AdEventType.PAID, OnAdmobInterstitial_Paid)
        const interstitialSubscribe_Close = interstitial.addAdEventListener(AdEventType.CLOSED, OnAdmobInterstitial_Closed)
        const interstitialSubscribe_Error = interstitial.addAdEventListener(AdEventType.ERROR, OnAdmobInterstitial_Error)

        // return

        return () => {
            interstitialSubscribe_Load()
            interstitialSubscribe_Open()
            interstitialSubscribe_Click()
            interstitialSubscribe_Paid()
            interstitialSubscribe_Close()
            interstitialSubscribe_Error()
        }
    }, [])     
     ```
     */
    static Init = (androidUnitId: string, iosUnitId: string): InterstitialAd => {
        if (this.interstitial)
            return this.interstitial

        const unit = Platform.OS === 'android' ? androidUnitId : iosUnitId

        this.interstitial = InterstitialAd.createForAdRequest(unit)

        return this.interstitial
    }

    static GetInstance = (): InterstitialAd | undefined => {
        if (!this.interstitial || !initedAdmob) {
            console.error('[GetInstance] Not inited AdmobInterstitial or CheckAndInitAdmobAsync yet')
        }

        return this.interstitial
    }

    /**
     * 
     * @returns if showed successully
     */
    static Show = (): boolean => {
        if (!this.interstitial || !initedAdmob) {
            console.error('[Show] Not inited AdmobInterstitial or CheckAndInitAdmobAsync yet')
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
        if (!this.interstitial || !initedAdmob) {
            console.error('[Load] Not inited AdmobInterstitial or CheckAndInitAdmobAsync yet')
            return false
        }

        this.interstitial.load()
    }
}