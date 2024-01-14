import { useCallback, useRef } from "react";
import { GestureResponderEvent } from "react-native";

const maxLimitMsForOneTap = 300
const touchDistanceThreshold = 5;

/**
    * USAGE:
    * ```js
    * const onTapCounted = useCallback((count: number, lastTapEvent: GestureResponderEvent['nativeEvent']) => {}, [])
    *
    * const [onBigViewStartTouch, onBigViewEndTouch] = useSimpleGesture(onTapCounted, onLongPressed)
    * 
    * <View onTouchStart={onBigViewStartTouch} onTouchEnd={onBigViewEndTouch} />
    * 
    * Or
    * 
    * onPressIn={onBigViewStartTouch} onPressOut={onBigViewEndTouch}
    * ```
 */
export const useSimpleGesture = (
    onTapCounted?: (count: number, lastTapNativeEvent: GestureResponderEvent['nativeEvent']) => void,
    onLongPressed?: () => void,
): [
        (e: GestureResponderEvent) => void,
        (e: GestureResponderEvent) => void,
    ] => {
    const startTouchNativeEventRef = useRef<GestureResponderEvent['nativeEvent'] | null>(null);
    const tapTimeOutCallbackRef = useRef<NodeJS.Timeout | undefined>(undefined)
    const tapCountRef = useRef(0)
    const lastTapTickRef = useRef(0)

    const onTouchStart = useCallback((e: GestureResponderEvent) => {
        startTouchNativeEventRef.current = e.nativeEvent;
    }, []);

    const triggerTapCounted = useCallback((e: GestureResponderEvent['nativeEvent']) => {
        if (typeof onTapCounted !== 'function')
            return

        onTapCounted(tapCountRef.current, e)
    }, [onTapCounted])

    const handleCountTap = useCallback((e: GestureResponderEvent['nativeEvent']) => {
        const now = Date.now()
        const howLongFromLastTap = now - lastTapTickRef.current
        lastTapTickRef.current = now

        if (howLongFromLastTap > maxLimitMsForOneTap) { // count as a new tap
            tapCountRef.current = 1
        }
        else { // count as a continous tap
            tapCountRef.current++
        }

        if (tapTimeOutCallbackRef.current)
            clearTimeout(tapTimeOutCallbackRef.current)

        tapTimeOutCallbackRef.current = setTimeout(() => triggerTapCounted(e), maxLimitMsForOneTap);
    }, [triggerTapCounted])

    const onTouchEnd = useCallback((e: GestureResponderEvent) => {
        if (!startTouchNativeEventRef.current) { 
            console.error('startTouchNativeEventRef.current is null')
            return
        }

        const distanceFromStart = Math.sqrt(
            Math.pow(e.nativeEvent.locationX - startTouchNativeEventRef.current.locationX, 2) +
            Math.pow(e.nativeEvent.locationY - startTouchNativeEventRef.current.locationY, 2));

        const isTouchOrMove = distanceFromStart < touchDistanceThreshold // is touch or move

        const howLongFromStartTouch = e.nativeEvent.timestamp - startTouchNativeEventRef.current.timestamp;
        const isLongPressed = howLongFromStartTouch > maxLimitMsForOneTap && isTouchOrMove;
        const isTap = !isLongPressed && isTouchOrMove; // tap = quick touch

        if (isTap)
            handleCountTap({...e.nativeEvent})
        else if (isLongPressed && typeof onLongPressed === 'function')
            onLongPressed()
    }, [handleCountTap, onLongPressed])

    return [onTouchStart, onTouchEnd]
}