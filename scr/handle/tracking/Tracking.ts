import Aptabase, { trackEvent } from "@aptabase/react-native";
import { FirebaseDatabase_IncreaseNumberAsync, FirebaseDatabase_SetValueAsync } from "../../firebase/FirebaseDatabase";
import { todayString } from "../AppUtils";
import { APTA_KEY_DEV, APTA_KEY_PRODUCTION } from "../../../keys";
import { IsDev } from "../IsDev";
import { useTelemetryDeck } from "@typedigital/telemetrydeck-react";
import { GetAppConfig } from "../AppConfigHandler";
import { IsValuableArrayOrString } from "../UtilsTS";
import { Cheat } from "../Cheat";

export type SignalType = ReturnType<typeof useTelemetryDeck>['signal']

const isLog = Cheat('IsLog_Tracking')

var inited = false

var signal: SignalType | undefined = undefined

const prefixFbTrackPath = () => IsDev() ? 'tracking/dev/' : 'tracking/production/'

export const SetSignal = (sig: SignalType) => signal = sig

export const InitTrackingAsync = async () => {
    if (inited)
        return

    inited = true

    const appConfig = GetAppConfig()

    let productionKey = APTA_KEY_PRODUCTION

    if (appConfig && IsValuableArrayOrString(appConfig.tracking.aptabaseProductionKey))
        productionKey = appConfig.tracking.aptabaseProductionKey

    Aptabase.init(IsDev() ? APTA_KEY_DEV : productionKey)
}

export const TrackErrorOnFirebase = (error: string) => {
    if (!inited) {
        console.error('not inited tracking yet')
        return
    }

    const path = prefixFbTrackPath() + 'errors/' + Date.now()
    FirebaseDatabase_SetValueAsync(path, error)
    console.log('track error: ', path, ', ' + error);
}

export const MainTrack = (
    eventName: string,
    fbPaths: (string | undefined)[],
    trackingValuesObject?: Record<string, string | number | boolean>) => {
    if (!inited) {
        console.error('not inited tracking yet')
        return
    }

    const appConfig = GetAppConfig()

    const shouldTrackAptabase = !appConfig || appConfig.tracking.enableAptabase
    const shouldTrackFirebase = !appConfig || appConfig.tracking.enableFirebase
    const shouldTrackTelemetry = !appConfig || appConfig.tracking.enableTelemetry

    // console.log(shouldTrackAptabase, shouldTrackFirebase, shouldTrackTelemetry);

    if (IsDev())
        eventName = 'dev__' + eventName

    // track aptabase

    if (shouldTrackAptabase) {
        trackEvent(eventName, trackingValuesObject)

        if (isLog) {
            console.log('------------------------')
            console.log('tracking aptabase: ', eventName, JSON.stringify(trackingValuesObject));
        }
    }

    // track firebase

    if (shouldTrackFirebase) {
        for (let i = 0; i < fbPaths.length; i++) {
            let path = prefixFbTrackPath() + fbPaths[i]
            path = path.replaceAll('#d', todayString)

            if (isLog) {
                console.log('tracking on firebase: ', path);
            }

            FirebaseDatabase_IncreaseNumberAsync(path, 0)
        }
    }

    // track telemetry

    if (signal && shouldTrackTelemetry) {
        signal(eventName, trackingValuesObject)

        if (isLog) {
            console.log('tracking telemetry: ', eventName, JSON.stringify(trackingValuesObject))
        }
    }
}