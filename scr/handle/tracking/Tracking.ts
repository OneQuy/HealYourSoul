import Aptabase, { trackEvent } from "@aptabase/react-native";
import { FirebaseDatabase_IncreaseNumberAsync, FirebaseDatabase_SetValueAsync } from "../../firebase/FirebaseDatabase";
import { todayString } from "../AppUtils";
import { APTA_KEY_DEV, APTA_KEY_PRODUCTION } from "../../../keys";
import { GetAppConfig } from "../AppConfigHandler";
import { GetBooleanAsync } from "../AsyncStorageUtils";
import { StorageKey_ForceDev } from "../../constants/AppConstants";
import { toast } from "@baronha/ting";

const isLog = false

var isDev = true

var inited = false

export const IsDev = () => isDev

const prefixFbTrackPath = () => IsDev() ? 'tracking/dev/' : 'tracking/production/'

export const InitTrackingAsync = async () => {
    if (inited)
        return

    inited = true

    const isDevSaved = await GetBooleanAsync(StorageKey_ForceDev)

    if (__DEV__ || isDevSaved)
        isDev = true
    else {
        const config = GetAppConfig()

        if (!config) {
            isDev = false
        }
        else
            isDev = config.force_dev
    }

    if (IsDev()) {
        toast({ message: 'DEV' })
    }

    Aptabase.init(IsDev() ? APTA_KEY_DEV : APTA_KEY_PRODUCTION)
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
    aptaValue?: Record<string, string | number | boolean>) => {
    if (!inited) {
        console.error('not inited tracking yet')
        return
    }

    // track apta base

    let aptaEvent

    if (IsDev())
        aptaEvent = 'dev__' + eventName
    else
        aptaEvent = eventName

    trackEvent(aptaEvent, aptaValue)

    if (isLog) {
        console.log('------------------------')
        console.log('testtttt apta event', aptaEvent, JSON.stringify(aptaValue));
    }

    // track firebase


    for (let i = 0; i < fbPaths.length; i++) {
        let path = prefixFbTrackPath() + fbPaths[i]
        path = path.replaceAll('#d', todayString)

        if (isLog) {
            console.log('fb path', path);
        }
        
        FirebaseDatabase_IncreaseNumberAsync(path, 0)
    }
}