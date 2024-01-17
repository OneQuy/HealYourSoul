import AsyncStorage from "@react-native-async-storage/async-storage";
import { LocalText, StorageKey_Quote_DataNoti, StorageKey_Quote_ToggleNoti } from "../constants/AppConstants";
import { GetQuoteListAsync_FromApi } from "./services/QuoteTextApi";
import { Quote } from "../constants/Types";
import { cancelAllLocalNotifications, setNotification_ForNextDay } from "./Nofitication";
import { GetBooleanAsync } from "./AsyncStorageUtils";

const minDataLength = 10

export const timeInHour24hNoti_Quote = 22 // 22h
export const timeInHour24hNoti_Fact = 19
export const timeInHour24hNoti_Joke = 14

var arr_Quote: { content: string, author: string }[] | undefined = undefined

export const setNotificationAsync = async () => {
    // clear all

    cancelAllLocalNotifications()

    // quote

    const isToggleQuote = await GetBooleanAsync(StorageKey_Quote_ToggleNoti)

    if (arr_Quote && isToggleQuote) {
        for (let i = 0; i < arr_Quote.length; i++) {
            const quote = arr_Quote[i]
            
            const title = LocalText.notification_quote_of_the_day
            const message = quote.content + ' (' + quote.author + ')'

            // console.log(title, message);

            setNotification_ForNextDay(i, {
                title,
                message,
            }, timeInHour24hNoti_Quote)
        }
    }
}

export const CheckAndPrepareDataForNotificationAsync_Quote = async () => {
    if (arr_Quote)
        return

    const cached = await AsyncStorage.getItem(StorageKey_Quote_DataNoti)
    let arr: Quote[] = cached ? JSON.parse(cached) as Quote[] : []

    if (arr && arr.length >= minDataLength) {
        arr_Quote = arr.slice(0, minDataLength)
        // console.log('local quoted', arr_Quote.length, arr.length);
        await AsyncStorage.setItem(StorageKey_Quote_DataNoti, JSON.stringify(arr.slice(minDataLength)))
        return
    }

    const quotes = await GetQuoteListAsync_FromApi()
    // console.log('call api quote');

    if (quotes) {
        await AsyncStorage.setItem(StorageKey_Quote_DataNoti, JSON.stringify(arr.concat(quotes)))
    }

    await CheckAndPrepareDataForNotificationAsync_Quote()
}

export const CheckAndPrepareDataForNotificationAsync = async () => {
    // quote

    CheckAndPrepareDataForNotificationAsync_Quote()

    // fact

    // joke
}
