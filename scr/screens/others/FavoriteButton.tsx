
// @ts-ignore
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import { Animated, StyleSheet, Text, TouchableOpacity } from 'react-native'
import React, { useCallback, useContext, useEffect, useMemo, useRef } from 'react'
import { Category, FontSize, LocalText, Outline, Size } from '../../constants/AppConstants';
import { track_PressFavorite } from '../../handle/tracking/GoodayTracking';
import useIsFavorited from '../../hooks/useIsFavorited';
import { ThemeContext } from '../../constants/Colors';

const FavoriteButton = (
    {
        category,
        id,
        callbackRef,
    }: {
        category: Category,
        id: string | number | undefined,
        callbackRef: React.MutableRefObject<(() => void) | undefined>,
    }) => {
    const theme = useContext(ThemeContext);
    const scaleAnim = useRef(new Animated.Value(1)).current

    const [isFavorited, likeCount, onPressFavoriteFromHook] = useIsFavorited(category, id)

    const onPressFavorite = useCallback(async () => {
        track_PressFavorite(category, !isFavorited)
        onPressFavoriteFromHook()
    }, [onPressFavoriteFromHook, isFavorited])

    callbackRef.current = onPressFavorite

    const style = useMemo(() => {
        return StyleSheet.create({
            masterTO: { gap: Outline.GapVertical, flex: 1, justifyContent: 'center', alignItems: 'center' },
            countText: { color: theme.counterBackground, fontSize: FontSize.Small },
        })
    }, [theme])

    useEffect(() => {
        scaleAnim.setValue(1)

        if (!isFavorited)
            return


        Animated.sequence([
            Animated.spring(
                scaleAnim,
                {
                    toValue: 1.5,
                    useNativeDriver: true,
                }),
            Animated.spring(
                scaleAnim,
                {
                    toValue: 1,
                    useNativeDriver: true,
                }),
        ]).start()
    }, [isFavorited])

    return (
        <TouchableOpacity onPress={onPressFavorite} style={style.masterTO} >
            <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
                <MaterialCommunityIcons name={!isFavorited ? "cards-heart-outline" : 'cards-heart'} color={theme.counterPrimary} size={Size.Icon} />
            </Animated.View>
            <Text style={style.countText}>{Number.isNaN(likeCount) ? LocalText.like : likeCount}</Text>
        </TouchableOpacity>
    )
}

export default FavoriteButton