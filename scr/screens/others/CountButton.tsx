
// @ts-ignore
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useCallback, useContext, useMemo } from 'react'
import { Category, FontSize, Outline, Size } from '../../constants/AppConstants';
import { ThemeContext } from '../../constants/Colors';
import { CountType } from '../../handle/LikeCountHandler';
import useCount from '../../hooks/useCount';

export type CountButtonProps = {
    category: Category,
    id: string | number | undefined,
    type: CountType,
    icon: string,
    title: string,
    callbackRef: React.MutableRefObject<(() => void) | undefined>,
}

const CountButton = (
    {
        category,
        id,
        icon,
        title,
        type,
        callbackRef,
    }: CountButtonProps) => {
    const theme = useContext(ThemeContext);

    const [displayText, onPressFromHook] = useCount(type, title, category, id)

    const onPress = useCallback(async () => {
        // track_PressFavorite(category, !isFavorited)
        onPressFromHook()
    }, [onPressFromHook])

    callbackRef.current = onPress

    const style = useMemo(() => {
        return StyleSheet.create({
            masterTO: { gap: Outline.GapVertical, flex: 1, justifyContent: 'center', alignItems: 'center' },
            countText: { color: theme.counterPrimary, fontSize: FontSize.Small },
        })
    }, [theme])

    return (
        <TouchableOpacity onPress={onPress} style={style.masterTO} >
            <View >
                <MaterialCommunityIcons name={icon} color={theme.counterPrimary} size={Size.Icon} />
            </View>
            <Text style={style.countText}>{displayText}</Text>
        </TouchableOpacity>
    )
}

export default CountButton