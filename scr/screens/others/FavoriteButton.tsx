
// @ts-ignore
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import { Text, TouchableOpacity } from 'react-native'
import React, { useCallback, useContext } from 'react'
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

    const [isFavorited, likeCount, onPressFavoriteFromHook] = useIsFavorited(category, id)

    const onPressFavorite = useCallback(async () => {
        track_PressFavorite(category, !isFavorited)
        onPressFavoriteFromHook()
    }, [onPressFavoriteFromHook, isFavorited])

    callbackRef.current = onPressFavorite
    
    return (
        <TouchableOpacity onPress={onPressFavorite} style={{ flexDirection: 'row', gap: Outline.GapHorizontal, borderRadius: BorderRadius.BR8, paddingVertical: Outline.VerticalMini, flex: 1, backgroundColor: theme.primary, justifyContent: 'center', alignItems: 'center' }} >
            <MaterialCommunityIcons name={!isFavorited ? "cards-heart-outline" : 'cards-heart'} color={theme.counterPrimary} size={Size.IconSmaller} />
            {
                Number.isNaN(likeCount) ? undefined :
                    <Text style={{ color: theme.text, fontSize: FontSize.Normal }}>{likeCount}</Text>
            }
        </TouchableOpacity>
    )
}

export default FavoriteButton