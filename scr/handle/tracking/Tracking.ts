import Aptabase, { trackEvent } from "@aptabase/react-native";
import { FirebaseDatabase_IncreaseNumberAsync } from "../../firebase/FirebaseDatabase";
import { todayString } from "../AppUtils";
import { APTA_KEY } from "../../../keys";

Aptabase.init(APTA_KEY);

const isDev = () => __DEV__

export const MainTrack = (
    eventName: string,
    fbPaths: (string | undefined)[],
    aptaValue?: Record<string, string | number | boolean>) => {
    // track apta base

    let aptaEvent

    if (isDev())
        aptaEvent = 'dev__' + eventName
    else
        aptaEvent = eventName

    trackEvent(aptaEvent, aptaValue)
    console.log('------------------------')
    console.log('testtttt apta event', aptaEvent, JSON.stringify(aptaValue));

    // track firebase

    const prefixFbTrackPath = isDev() ? 'tracking/dev/' : 'tracking/production/'

    for (let i = 0; i < fbPaths.length; i++) {
        let path = prefixFbTrackPath + fbPaths[i]
        path = path.replaceAll('#d', todayString)
        console.log('fb path', path);

        FirebaseDatabase_IncreaseNumberAsync(path, 0)
    }
}