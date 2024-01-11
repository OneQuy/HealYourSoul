import Aptabase, { trackEvent } from "@aptabase/react-native";
import { FirebaseDatabase_IncreaseNumberAsync } from "../firebase/FirebaseDatabase";
import { todayString } from "./AppUtils";
import { APTA_KEY } from "../../keys";

Aptabase.init(APTA_KEY);

const isDev = () => __DEV__

export const Track = (
    eventName: string,
    fbTrackingByTotalAndByDayPath: [string, string],
    aptaValue?: Record<string, string | number | boolean>) => {
    // track apta base

    let aptaEvent

    if (isDev())
        aptaEvent = 'dev__' + eventName
    else
        aptaEvent = eventName

    trackEvent(aptaEvent, aptaValue)
    // console.log('apta event', aptaEvent, JSON.stringify(aptaValue));

    // track firebase

    const prefixFbTrackPath = isDev() ? 'tracking/dev/' : 'tracking/production/'

    // track firebase - by total

    const pathTotal = prefixFbTrackPath + 'total/' + eventName + (fbTrackingByTotalAndByDayPath[0] ? '/' + fbTrackingByTotalAndByDayPath[0] : '')
    // console.log('path total', pathTotal);

    FirebaseDatabase_IncreaseNumberAsync(pathTotal, 0)

    // track firebase - by day

    if (fbTrackingByTotalAndByDayPath[1]) {
        let pathDay = prefixFbTrackPath + 'events/' + eventName + '/' + fbTrackingByTotalAndByDayPath[1]
        pathDay = pathDay.replaceAll('#d', todayString)
        // console.log('path day', pathDay);

        FirebaseDatabase_IncreaseNumberAsync(pathDay, 0)
    }
}