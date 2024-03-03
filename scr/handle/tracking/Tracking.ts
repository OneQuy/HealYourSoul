import Aptabase, { trackEvent } from "@aptabase/react-native";
import { FirebaseDatabase_IncreaseNumberAsync, FirebaseDatabase_SetValueAsync } from "../../firebase/FirebaseDatabase";
import { todayString } from "../AppUtils";
import { APTA_KEY_DEV, APTA_KEY_PRODUCTION } from "../../../keys";
import { IsDev } from "../IsDev";
import { useTelemetryDeck } from "@typedigital/telemetrydeck-react";
import { GetAppConfig } from "../AppConfigHandler";
import { IsValuableArrayOrString } from "../UtilsTS";
import { Cheat } from "../Cheat";
import { NetLord } from "../NetLord";

export type SignalType = ReturnType<typeof useTelemetryDeck>['signal']

const aptabaseIgnoredEventNames: string[] = [
    'press_next_post_x5',
    'press_random',
    'press_drawer_item',
    'press_previous_post',
    'saved',
    'max_saved',
] as const

const isLog = Cheat('IsLog_Tracking')

var initedAptabase = false

var signal: SignalType | undefined = undefined

export const prefixFbTrackPath = () => IsDev() ? 'tracking/dev/' : 'tracking/production/'

export const SetSignal = (sig: SignalType) => signal = sig

export const InitAptabase = () => {
    if (initedAptabase)
        return

    initedAptabase = true

    const appConfig = GetAppConfig()

    let productionKey = APTA_KEY_PRODUCTION

    if (appConfig && IsValuableArrayOrString(appConfig.tracking.aptabaseProductionKey))
        productionKey = appConfig.tracking.aptabaseProductionKey

    Aptabase.init(IsDev() ? APTA_KEY_DEV : productionKey)
}

export const GetFinalAptabaseIgnoredEventNames = () => {
    const appConfig = GetAppConfig()

    if (!appConfig)
        return aptabaseIgnoredEventNames

    const additions = appConfig.tracking.aptabaseIgnores

    if (!IsValuableArrayOrString(additions))
        return aptabaseIgnoredEventNames

    const arr = additions?.split(',')

    if (!IsValuableArrayOrString(arr) || !arr)
        return aptabaseIgnoredEventNames

    return arr.concat(aptabaseIgnoredEventNames)
}

export const TrackErrorOnFirebase = (error: string) => {
    const path = prefixFbTrackPath() + 'errors/' + Date.now()
    FirebaseDatabase_SetValueAsync(path, error)
    console.log('track error firebase: ', path, ', ' + error);
}

export const MainTrack = (
    eventName: string,
    fbPaths: (string | undefined)[],
    trackingValuesObject?: Record<string, string | number | boolean>) => {
    const appConfig = GetAppConfig()

    const shouldTrackAptabase = initedAptabase &&
        (!__DEV__ || NetLord.IsAvailableLatestCheck()) &&
        (!appConfig || appConfig.tracking.enableAptabase) &&
        (!GetFinalAptabaseIgnoredEventNames().includes(eventName))

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