import { Animated } from "react-native"
import { GetBooleanAsync } from "./AsyncStorageUtils"
import { StorageKey_IsAnimLoadMedia } from "../constants/AppConstants"

var isAnim: boolean | undefined = undefined

export const reloadSettingAnimWhenLoadMedia = async () => {
    isAnim = await GetBooleanAsync(StorageKey_IsAnimLoadMedia, true)
}

export const playAnimLoadedMedia = async (animated: Animated.Value, delay?: number) => {
    if (isAnim === undefined) {
        await reloadSettingAnimWhenLoadMedia()
    }

    // console.log(isAnim);
    
    if (!isAnim) {
        animated.setValue(1)
        return
    }
    
    animated.setValue(0)

    Animated.delay(typeof delay === 'number' ? delay : 0).start(() =>
        Animated.spring(
            animated,
            {
                toValue: 1,
                useNativeDriver: true,
            }
        ).start())
}