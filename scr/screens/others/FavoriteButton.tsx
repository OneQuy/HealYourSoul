
// @ts-ignore
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import { Animated, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useCallback, useContext, useEffect, useMemo, useRef } from 'react'
import { BorderRadius, Category, FontSize, Outline, Size } from '../../constants/AppConstants';
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
            masterTO: { flexDirection: 'row', gap: Outline.GapHorizontal, borderRadius: BorderRadius.BR8, paddingVertical: Outline.VerticalMini, flex: 1, backgroundColor: theme.primary, justifyContent: 'center', alignItems: 'center' },
            countText: { color: theme.text, fontSize: FontSize.Normal },
        })
    }, [theme])

    useEffect(() => {
        if (!isFavorited)
            return

        scaleAnim.setValue(1)

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
                <MaterialCommunityIcons name={!isFavorited ? "cards-heart-outline" : 'cards-heart'} color={theme.counterPrimary} size={Size.IconSmaller} />
            </Animated.View>
            {
                Number.isNaN(likeCount) ? undefined :
                    <Text style={style.countText}>{likeCount}</Text>
            }
        </TouchableOpacity>
    )
}

export default FavoriteButton