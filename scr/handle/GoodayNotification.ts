import AsyncStorage from "@react-native-async-storage/async-storage";
import { LocalText, StorageKey_NinjaFact_DataNoti, StorageKey_NinjaFact_ToggleNoti, StorageKey_NinjaJoke_DataNoti, StorageKey_NinjaJoke_ToggleNoti, StorageKey_Quote_DataNoti, StorageKey_Quote_ToggleNoti } from "../constants/AppConstants";
import { GetQuoteListAsync_FromApi } from "./services/QuoteTextApi";
import { Quote } from "../constants/Types";
import { cancelAllLocalNotificationsAsync, setNotification_ForNextDay } from "./Nofitication";
import { GetBooleanAsync } from "./AsyncStorageUtils";
import { GetFactListAsync_FromApi } from "./services/NinjaFact";
import { GetJokeListAsync_FromApi } from "./services/NinjaJoke";

const daysToNotiEveryday = 10

export const timeInHour24hNoti_Quote = 10 // 10h AM
export const timeInHour24hNoti_Fact = 19
export const timeInHour24hNoti_Joke = 14

var arr_Quote: { content: string, author: string }[] | undefined = undefined
var arr_Fact: string[] | undefined = undefined
var arr_Joke: string[] | undefined = undefined

export const setNotificationAsync = async () => {
    // clear all

    await cancelAllLocalNotificationsAsync()

    // quote

    const isToggleQuote = await GetBooleanAsync(StorageKey_Quote_ToggleNoti)

    if (arr_Quote && isToggleQuote) {
        for (let i = 0; i < arr_Quote.length; i++) {
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
        for (let i = 0; i < arr_Fact.length; i++) {
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
        for (let i = 0; i < arr_Joke.length; i++) {
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

    const cached = await AsyncStorage.getItem(StorageKey_Quote_DataNoti)
    let arr: Quote[] = cached ? JSON.parse(cached) as Quote[] : []

    if (arr && arr.length >= daysToNotiEveryday) {
        arr_Quote = arr.slice(0, daysToNotiEveryday)

        // console.log('local quoted', arr_Quote.length, arr.length);

        await AsyncStorage.setItem(StorageKey_Quote_DataNoti, JSON.stringify(arr.slice(daysToNotiEveryday)))
        return
    }

    const quotes = await GetQuoteListAsync_FromApi()

    // console.log('call api quote');

    if (quotes) {
        await AsyncStorage.setItem(StorageKey_Quote_DataNoti, JSON.stringify(arr.concat(quotes)))
    }

    await CheckAndPrepareDataForNotificationAsync_Quote()
}


export const CheckAndPrepareDataForNotificationAsync_Fact = async () => {
    if (arr_Fact)
        return

    const cached = await AsyncStorage.getItem(StorageKey_NinjaFact_DataNoti)
    let arr: string[] = cached ? JSON.parse(cached) as string[] : []

    if (arr && arr.length >= daysToNotiEveryday) {
        arr_Fact = arr.slice(0, daysToNotiEveryday)
        // Clipboard_AppendLine('locallll fact')
        await AsyncStorage.setItem(StorageKey_NinjaFact_DataNoti, JSON.stringify(arr.slice(daysToNotiEveryday)))
        return
    }

    const strings = await GetFactListAsync_FromApi()
    // Clipboard_AppendLine('apiiii fact')

    if (strings) {
        await AsyncStorage.setItem(StorageKey_NinjaFact_DataNoti, JSON.stringify(arr.concat(strings)))
    }

    await CheckAndPrepareDataForNotificationAsync_Fact()
}


export const CheckAndPrepareDataForNotificationAsync_Joke = async () => {
    if (arr_Joke)
        return

    const cached = await AsyncStorage.getItem(StorageKey_NinjaJoke_DataNoti)
    let arr: string[] = cached ? JSON.parse(cached) as string[] : []

    if (arr && arr.length >= daysToNotiEveryday) {
        arr_Joke = arr.slice(0, daysToNotiEveryday)
        // Clipboard_AppendLine('locallll joke')
        await AsyncStorage.setItem(StorageKey_NinjaJoke_DataNoti, JSON.stringify(arr.slice(daysToNotiEveryday)))
        return
    }

    const strings = await GetJokeListAsync_FromApi()
    // Clipboard_AppendLine('apiiiiii joke')

    if (strings) {
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
