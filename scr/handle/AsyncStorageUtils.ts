// @ts-ignore
import AsyncStorage from "@react-native-async-storage/async-storage"

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

const IsToday = (date: Date): boolean => {
    return IsSameDateMonthYear(date, new Date())
}

export const IsTodayAndSameHour = (date: Date): boolean => {
    if (!IsToday(date))
        return false

    const now = new Date()

    return date.getHours() === now.getHours()
}

const IsSameDateMonthYear = (a: Date, b: Date): boolean => {
    if (a.getDate() === b.getDate() &&
        a.getMonth() === b.getMonth() &&
        a.getFullYear() === b.getFullYear()) {
        return true
    }
    else
        return false
}