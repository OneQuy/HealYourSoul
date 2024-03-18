import { useCallback, useEffect, useRef, useState } from "react";
import { Animated, Dimensions, ImageLoadEventData, NativeSyntheticEvent } from "react-native";

const window = Dimensions.get('window')

/**
## Usage:
```tsx
    const { imageHeightAnimRef, onLoad, heightInPixel } = useHeightOfImageWhenWidthFull(maxHeightImage)
```
PUT onLoad ON THE IMAGE COMPONENT:
```tsx
    <Image onLoad={onLoad} ... />
```
PUT imageHeightAnimRef ON THE VIEW OR IMAGE WITH ANIMTED IF YOU WANT TO PLAY ANIM SET HIGHT:
 ```tsx
    <Animated.View style={{ width: widthPercentageToDP(100), height: imageHeightAnimRef }}>
 ```
 */
export const useHeightOfImageWhenWidthFull = (maxHeightPixel?: number) => {
    const [height, setHeight] = useState(maxHeightPixel === undefined ? 0 : maxHeightPixel)

    const imageHeightAnimRef = useRef(new Animated.Value(height)).current

    const onLoad = useCallback((e: NativeSyntheticEvent<ImageLoadEventData>) => {
        const imageH = e.nativeEvent.source.height
        const imageW = e.nativeEvent.source.width

        if (imageH >= imageW) {// square or vertical
            if (maxHeightPixel === undefined)
                setHeight(imageH)
            else if (imageH > maxHeightPixel)
                setHeight(maxHeightPixel)
            else
                setHeight(maxHeightPixel)
        }
        else {
            const height = window.width * imageH / imageW

            if (maxHeightPixel === undefined)
                setHeight(height)
            else if (height > maxHeightPixel)
                setHeight(maxHeightPixel)
            else
                setHeight(height)
        }
    }, [maxHeightPixel])

    // effect height image

    useEffect(() => {
        Animated.spring(imageHeightAnimRef, {
            useNativeDriver: false,
            toValue: height
        }).start()
    }, [height])

    return {
        heightInPixel: height,
        onLoad,
        imageHeightAnimRef,
    } as const
}