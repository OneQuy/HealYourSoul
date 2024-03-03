import { useCallback, useEffect, useState } from "react";
import { Category } from "../constants/AppConstants";
import { CountType, GetPostLikeCountAsync, LikePostAsync } from "../handle/LikeCountHandler";
import { IsDev } from "../handle/IsDev";
import { IsNumType } from "../handle/UtilsTS";

export default function useCount(
    type: CountType,
    text: string,
    category: Category,
    id: number | string | undefined)
    : {
        displayText: string,
        count: number,
        onPress: () => void
    } {
    const [displayText, setDisplayText] = useState<string>(text);
    const [count, setCount] = useState(0);

    const onValue = useCallback(async (value: number) => {
        setCount(value)

        if (IsNumType(value) && value > 0)
            setDisplayText(value.toString())
        else
            setDisplayText(text)
    }, [text])

    const onPress = useCallback(async () => {
        if (id === undefined)
            return

        LikePostAsync(type, true, category, id, (count) => onValue(count))
    }, [onValue, text, category, id]);

    useEffect(() => {
        if (id === undefined)
            onValue(Number.NaN)
        else {
            onValue(Number.NaN)
            GetPostLikeCountAsync(type, category, id, (count) => onValue(count))
        }
    }, [onValue, id, category, text, type])

    return {
        displayText,
        count,
        onPress,
    } as const
}