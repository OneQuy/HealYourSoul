import { Animated } from "react-native"

export const playAnimLoadedMedia = (animated: Animated.Value) => {
    animated.setValue(0)

    Animated.spring(
        animated,
        {
            toValue: 1,
            useNativeDriver: true,
        }
    ).start()
}