import AsyncStorage from "@react-native-async-storage/async-storage";
import { Streak } from "../constants/Types";
import { IsToday, IsYesterday } from "./UtilsTS";

const KeyData = 'streak'

var data: Streak[] | undefined = undefined

/**
 * enter screen is counted streak
 */
export async function SetStreakAsync(id: string, countUniquePost: boolean = false) {
    // check load data

    if (data === undefined) {
        var s = await AsyncStorage.getItem(KeyData)

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

    // inc count

    if (countUniquePost)
        item.uniquePostSeen++

    // set streak

    const lastDate = new Date(item.lastDateTick)

    if (!IsToday(lastDate)) {
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

    AsyncStorage.setItem(KeyData, JSON.stringify(data))
    // console.log(JSON.stringify(data, null, 1));
}

export async function GetStreakAsync(id: string) {
    if (data === undefined) {
        var s = await AsyncStorage.getItem(KeyData)

        if (s)
            data = JSON.parse(s) as Streak[]
        else
            data = []
    }

    const item = data.find(streak => streak.id === id)
    return item
}