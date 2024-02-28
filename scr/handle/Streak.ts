import AsyncStorage from "@react-native-async-storage/async-storage";
import { Streak } from "../constants/Types";
import { IsToday, IsYesterday } from "./UtilsTS";
import { StorageKey_Streak } from "../constants/AppConstants";

var data: Streak[] | undefined = undefined

/**
 * @returns true if handled.
 * @returns false if already handled today.
 * @param countUniquePost. countUniquePost = 0 for not set, < 0 for 1++, > 0 for inc this
 */
export async function SetStreakAsync(id: string) {
    // check load data

    if (data === undefined) {
        var s = await AsyncStorage.getItem(StorageKey_Streak)

        if (s)
            data = JSON.parse(s) as Streak[]
        else
            data = []
    }

    // find item

    let item = data.find(streak => streak.id === id)

    if (!item) {
        item = {
            id,
            uniquePostSeen: 0,
            bestStreak: 0,
            currentStreak: 0,
            lastDateTick: new Date(0).getTime(),
        } as Streak

        data.push(item)
    }

    // set streak

    const lastDate = new Date(item.lastDateTick)
    let recorded = false

    if (!IsToday(lastDate)) {
        recorded = true
        item.lastDateTick = Date.now()
        const isStreak = IsYesterday(lastDate)

        if (isStreak) {
            item.currentStreak++
        }
        else { // not streak
            item.currentStreak = 1
        }

        item.bestStreak = Math.max(item.bestStreak, item.currentStreak)
    }

    // save

    AsyncStorage.setItem(StorageKey_Streak, JSON.stringify(data))
    // console.log(JSON.stringify(data, null, 1));

    return recorded
}

export async function GetStreakAsync(id: string) {
    if (data === undefined) {
        var s = await AsyncStorage.getItem(StorageKey_Streak)

        if (s)
            data = JSON.parse(s) as Streak[]
        else
            data = []
    }

    const item = data.find(streak => streak.id === id)
    return item
}