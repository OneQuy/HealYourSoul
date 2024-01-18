import AsyncStorage from "@react-native-async-storage/async-storage";
import { LocalText, StorageKey_NinjaFact_DataNoti, StorageKey_NinjaFact_LastDateDownload_DataNoti, StorageKey_NinjaFact_ToggleNoti, StorageKey_NinjaJoke_DataNoti, StorageKey_NinjaJoke_LastDateDownload_DataNoti, StorageKey_NinjaJoke_ToggleNoti, StorageKey_Quote_DataNoti, StorageKey_Quote_LastDateDownload_DataNoti, StorageKey_Quote_ToggleNoti } from "../constants/AppConstants";
import { GetQuoteListAsync_FromApi } from "./services/QuoteTextApi";
import { Quote } from "../constants/Types";
import { cancelAllLocalNotificationsAsync, setNotification_ForNextDay } from "./Nofitication";
import { GetBooleanAsync, GetDateAsync, SetDateAsync_Now } from "./AsyncStorageUtils";
import { GetFactListAsync_FromApi } from "./services/NinjaFact";
import { GetJokeListAsync_FromApi } from "./services/NinjaJoke";
import { ShuffleArray } from "./UtilsTS";

const daysToNotiEveryday = 10
const daysToRedownloadData = 5

export const timeInHour24hNoti_Quote = 10 // 10h AM
export const timeInHour24hNoti_Fact = 19
export const timeInHour24hNoti_Joke = 14

var arr_Quote: Quote[] | undefined = undefined
var arr_Fact: string[] | undefined = undefined
var arr_Joke: string[] | undefined = undefined

export const setNotificationAsync = async () => {
    // clear all

    await cancelAllLocalNotificationsAsync()

    // quote

    const isToggleQuote = await GetBooleanAsync(StorageKey_Quote_ToggleNoti)

    if (arr_Quote && isToggleQuote) {
        for (let i = 0; i < arr_Quote.length && i < daysToNotiEveryday; i++) {
            const quote = arr_Quote[i]

            const title = LocalText.notification_quote_of_the_day
            const message = quote.content + ' (' + quote.author + ')'

            // console.log(title, message);

            setNotification_ForNextDay(i,
                timeInHour24hNoti_Quote,
                {
                    title,
                    message,
                })
        }
    }

    // fact

    const isToggleFact = await GetBooleanAsync(StorageKey_NinjaFact_ToggleNoti)

    if (arr_Fact && isToggleFact) {
        for (let i = 0; i < arr_Fact.length && i < daysToNotiEveryday; i++) {
            const quote = arr_Fact[i]

            const title = LocalText.fact_of_the_day
            const message = quote

            setNotification_ForNextDay(i,
                timeInHour24hNoti_Fact,
                {
                    title,
                    message,
                })
        }
    }

    // fact

    const isToggleJoke = await GetBooleanAsync(StorageKey_NinjaJoke_ToggleNoti)

    if (arr_Joke && isToggleJoke) {
        for (let i = 0; i < arr_Joke.length && i < daysToNotiEveryday; i++) {
            const quote = arr_Joke[i]

            const title = LocalText.notification_joke_of_the_day
            const message = quote

            setNotification_ForNextDay(i,
                timeInHour24hNoti_Joke,
                {
                    title,
                    message,
                })
        }
    }
}

export const CheckAndPrepareDataForNotificationAsync_Quote = async () => {
    if (arr_Quote)
        return

    let cached = await AsyncStorage.getItem(StorageKey_Quote_DataNoti)

    if (cached) { // check to clear old data
        const lastDateDownloaded = await GetDateAsync(StorageKey_Quote_LastDateDownload_DataNoti)

        if (lastDateDownloaded !== undefined) {
            const distanceMs = Date.now() - lastDateDownloaded.getTime()

            if (distanceMs / 24 / 3600 / 1000 > daysToRedownloadData)
                cached = null
        }
    }

    let arr: Quote[] = cached ? JSON.parse(cached) as Quote[] : []

    if (arr && arr.length >= 1) {
        ShuffleArray(arr)
        arr_Quote = arr
        return
    }

    const quotes = await GetQuoteListAsync_FromApi()

    // console.log('call api quote');

    if (quotes) {
        SetDateAsync_Now(StorageKey_Quote_LastDateDownload_DataNoti)
        await AsyncStorage.setItem(StorageKey_Quote_DataNoti, JSON.stringify(arr.concat(quotes)))
    }

    await CheckAndPrepareDataForNotificationAsync_Quote()
}


export const CheckAndPrepareDataForNotificationAsync_Fact = async () => {
    if (arr_Fact)
        return

    let cached = await AsyncStorage.getItem(StorageKey_NinjaFact_DataNoti)

    if (cached) { // check to clear old data
        const lastDateDownloaded = await GetDateAsync(StorageKey_NinjaFact_LastDateDownload_DataNoti)

        if (lastDateDownloaded !== undefined) {
            const distanceMs = Date.now() - lastDateDownloaded.getTime()

            if (distanceMs / 24 / 3600 / 1000 > daysToRedownloadData)
                cached = null
        }
    }

    let arr: string[] = cached ? JSON.parse(cached) as string[] : []

    if (arr && arr.length >= 1) {
        ShuffleArray(arr)
        arr_Fact = arr
        return
    }

    const strings = await GetFactListAsync_FromApi()
    // Clipboard_AppendLine('apiiii fact')

    if (strings) {
        SetDateAsync_Now(StorageKey_NinjaFact_LastDateDownload_DataNoti)
        await AsyncStorage.setItem(StorageKey_NinjaFact_DataNoti, JSON.stringify(arr.concat(strings)))
    }

    await CheckAndPrepareDataForNotificationAsync_Fact()
}


export const CheckAndPrepareDataForNotificationAsync_Joke = async () => {
    if (arr_Joke)
        return

    let cached = await AsyncStorage.getItem(StorageKey_NinjaJoke_DataNoti)

    if (cached) { // check to clear old data
        const lastDateDownloaded = await GetDateAsync(StorageKey_NinjaJoke_LastDateDownload_DataNoti)

        if (lastDateDownloaded !== undefined) {
            const distanceMs = Date.now() - lastDateDownloaded.getTime()

            if (distanceMs / 24 / 3600 / 1000 > daysToRedownloadData)
                cached = null
        }
    }

    let arr: string[] = cached ? JSON.parse(cached) as string[] : []

    if (arr && arr.length >= 1) {
        ShuffleArray(arr)
        arr_Joke = arr
        return
    }

    const strings = await GetJokeListAsync_FromApi()
    // Clipboard_AppendLine('apiiiiii joke')

    if (strings) {
        SetDateAsync_Now(StorageKey_NinjaJoke_LastDateDownload_DataNoti)
        await AsyncStorage.setItem(StorageKey_NinjaJoke_DataNoti, JSON.stringify(arr.concat(strings)))
    }

    await CheckAndPrepareDataForNotificationAsync_Joke()
}

export const CheckAndPrepareDataForNotificationAsync = async () => {
    // quote

    CheckAndPrepareDataForNotificationAsync_Quote()

    // fact

    CheckAndPrepareDataForNotificationAsync_Fact()

    // joke

    CheckAndPrepareDataForNotificationAsync_Joke()
}
