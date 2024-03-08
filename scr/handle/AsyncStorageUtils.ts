import AsyncStorage from "@react-native-async-storage/async-storage"
import { DateDiff, DateDiff_InHour, DateDiff_InMinute, IsToday, IsTodayAndSameHour } from "./UtilsTS"

// boolean =================

export const GetBooleanAsync = async (key: string, defaultValue?: boolean): Promise<boolean> => {
    const s = await AsyncStorage.getItem(key)

    if (!s)
        return defaultValue === undefined ? false : defaultValue

    return s === '1'
}

export const SetBooleanAsync = async (key: string, value: boolean): Promise<void> => {
    await AsyncStorage.setItem(key, value ? '1' : '0')
}

// number =================

/**
 * 
 * @return number or NaN
 */
export const GetNumberFloatAsync = async (key: string, defaultValue?: number): Promise<number> => {
    const s = await AsyncStorage.getItem(key)

    if (!s)
        return defaultValue === undefined ? Number.NaN : defaultValue

    try {
        return Number.parseFloat(s)
    }
    catch {
        return Number.NaN
    }
}

/**
 * 
 * @return number or NaN
 */
export const GetNumberIntAsync = async (key: string, defaultValue?: number): Promise<number> => {
    const s = await AsyncStorage.getItem(key)

    if (!s)
        return defaultValue === undefined ? Number.NaN : defaultValue

    try {
        return Number.parseInt(s)
    }
    catch {
        return Number.NaN
    }
}

export const SetNumberAsync = async (key: string, value: number): Promise<void> => {
    await AsyncStorage.setItem(key, value.toString())
}

/**
 * 
 * @returns lastest saved value (value that after increasing)
 */
export const IncreaseNumberAsync = async (key: string, startAt: number = 0, incUnit: number = 1): Promise<number> => {
    const cur = await GetNumberIntAsync(key, startAt)
    await SetNumberAsync(key, cur + incUnit)
    return cur + incUnit
}

// date & number =================

/**
 * 
 * @returns lastest saved value (value that after increasing)
 */
export const IncreaseNumberAsync_WithCheckAndResetNewDay = async (key: string, valueNewDay: number = 0, incUnit: number = 1): Promise<number> => {
    let num = await GetNumberIntAsync_WithCheckAndResetNewDay(key, valueNewDay)
    num += incUnit

    const s = `${Date.now()}_${num}`
    await AsyncStorage.setItem(key, s)
    return num
}

export const GetNumberIntAsync_WithCheckAndResetNewDay = async (key: string, valueNewDay: number = 0): Promise<number> => {
    const s = await AsyncStorage.getItem(key)

    if (!s)
        return valueNewDay

    const arr = s.split('_')

    if (!Array.isArray(arr) || arr.length !== 2)
        return valueNewDay

    try {
        const date = new Date(parseInt(arr[0]))

        if (!IsToday(date))
            return valueNewDay

        return parseInt(arr[1])
    }
    catch {
        return valueNewDay
    }
}

/**
 * 
 * @returns 
 * `{
 * 
 *  number: value. If empty or error: defaultNumber
 * 
 *  date: Date. If empty or error: undefined
 * 
 * }`
 */
export const GetPairNumberIntAndDateAsync = async (key: string, defaultNumber = 0): Promise<{ number: number, date: Date | undefined }> => {
    const s = await AsyncStorage.getItem(key)

    if (!s) {
        return {
            number: defaultNumber,
            date: undefined
        }
    }

    const arr = s.split('_')

    if (!Array.isArray(arr) || arr.length !== 2) {
        return {
            number: defaultNumber,
            date: undefined
        }
    }

    try {
        return {
            date: new Date(parseInt(arr[0])),
            number: parseInt(arr[1])
        }
    }
    catch {
        return {
            number: defaultNumber,
            date: undefined
        }
    }
}

export const SetPairNumberIntAndDateAsync_Now = async (key: string, valueNum: number, initNum: number, valueNumForSetOrForIncreaseUnit: boolean): Promise<{ number: number, date: Date | undefined }> => {
    let valueToSet = 0

    if (!valueNumForSetOrForIncreaseUnit) { // for inc => need load current value
        const { number } = await GetPairNumberIntAndDateAsync(key, initNum)
        valueToSet = number + valueNum
    }
    else
        valueToSet = valueNum

    const now = new Date()

    const s = `${now.getTime()}_${valueToSet}`
    await AsyncStorage.setItem(key, s)

    return {
        number: valueToSet,
        date: now,
    }
}

// date =================

export const GetDateAsync = async (key: string): Promise<Date | undefined> => {
    const s = await AsyncStorage.getItem(key)

    if (!s)
        return undefined

    try {
        return new Date(Number.parseInt(s))
    }
    catch {
        return undefined
    }
}

export const GetDateAsync_IsValueExistedAndIsToday = async (key: string): Promise<boolean> => {
    const d = await GetDateAsync(key)

    if (d === undefined)
        return false

    return IsToday(d)
}

export const GetDateAsync_IsValueNotExistedOrEqualOverMinFromNow = async (key: string, min: number): Promise<boolean> => {
    const d = await GetDateAsync(key)

    if (d === undefined)
        return true

    return DateDiff_InMinute(Date.now(), d) >= min
}

export const GetDateAsync_IsValueNotExistedOrEqualOverHourFromNow = async (key: string, hour: number): Promise<boolean> => {
    const d = await GetDateAsync(key)

    if (d === undefined)
        return true

    return DateDiff_InHour(Date.now(), d) >= hour
}

export const GetDateAsync_IsValueNotExistedOrEqualOverDayFromNow = async (key: string, day: number): Promise<boolean> => {
    const d = await GetDateAsync(key)

    if (d === undefined)
        return true

    return DateDiff(Date.now(), d) >= day
}

export const GetDateAsync_IsValueExistedAndIsTodayAndSameHour = async (key: string): Promise<boolean> => {
    const d = await GetDateAsync(key)

    if (d === undefined)
        return false

    return IsTodayAndSameHour(d)
}

export const SetDateAsync = async (key: string, value: number): Promise<void> => {
    await AsyncStorage.setItem(key, value.toString())
}

export const SetDateAsync_Now = async (key: string): Promise<void> => {
    await SetDateAsync(key, Date.now())
}