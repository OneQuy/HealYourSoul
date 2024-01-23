import { Animated } from "react-native"

export const playAnimLoadedMedia = (animated: Animated.Value, delay?: number) => {
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