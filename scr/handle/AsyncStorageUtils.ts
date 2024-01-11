import AsyncStorage from "@react-native-async-storage/async-storage"

// boolean =================

export const GetBooleanAsync = async (key: string): Promise<boolean> => {
    const s = await AsyncStorage.getItem(key)
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
export const GetNumberFloatAsync = async (key: string): Promise<number> => {
    const s = await AsyncStorage.getItem(key)

    if (!s)
        return Number.NaN

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
export const GetNumberIntAsync = async (key: string): Promise<number> => {
    const s = await AsyncStorage.getItem(key)

    if (!s)
        return Number.NaN

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

export const SetDateAsync = async (key: string, value: number): Promise<void> => {
    await AsyncStorage.setItem(key, value.toString())
}

export const SetDateAsync_Today = async (key: string): Promise<void> => {
    await SetDateAsync(key, Date.now())
}