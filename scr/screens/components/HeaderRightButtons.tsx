// @ts-ignore
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import { TouchableOpacity, StyleSheet, View } from 'react-native'
import React, { useCallback, useContext, useMemo } from 'react'
import { Category, Icon, Outline, ScreenName, Size } from '../../constants/AppConstants';
import { ThemeContext } from '../../constants/Colors';
import { useNavigation } from '@react-navigation/native';
import { DiversityItemType } from '../../constants/Types';
import { useSaved } from '../../hooks/useSaved';
import { GoToPremiumScreen } from './HeaderXButton';
import { usePremium } from '../../hooks/usePremium';
import { GoToScreen } from '../../handle/GoodayAppState';
import GalleryScreen from '../gallery/GalleryScreen';

const HeaderRightButtons = (
    {
        diversityItemData,
        diversityMode,
        galleryCat,
    }: {
        diversityItemData?: DiversityItemType,
        diversityMode?: boolean,
        galleryCat?: Category,
    }) => {
    const theme = useContext(ThemeContext);
    const navigation = useNavigation()
    const [isSaved, onPressSaved] = useSaved(diversityItemData, diversityMode)
    const { isPremium } = usePremium()

    const onPressPremium = useCallback(() => {
        GoToPremiumScreen(navigation)
    }, [navigation])

    const onPressGallery = useCallback(() => {
        GoToScreen(ScreenName.Gallery, { cat: galleryCat })
    }, [])

    const style = useMemo(() => {
        return StyleSheet.create({
            master: { gap: Outline.GapHorizontal, flexDirection: 'row', marginRight: 15 },
        })
    }, [])

    return (
        <View style={style.master}>
            {/* saved btn */}
            {
                diversityItemData &&
                <TouchableOpacity onPress={onPressSaved}>
                    <MaterialCommunityIcons name={isSaved ? Icon.Bookmark : Icon.BookmarkOutline} color={theme.primary} size={Size.Icon} />
                </TouchableOpacity>
            }
            {
                galleryCat !== undefined &&
                <TouchableOpacity onPress={onPressGallery} >
                    <MaterialCommunityIcons name={Icon.Gallery} color={theme.primary} size={Size.Icon} />
                </TouchableOpacity>
            }

            {/* premium btn */}

            {
                !isPremium &&
                <TouchableOpacity onPress={onPressPremium} >
                    <MaterialCommunityIcons name={Icon.Star} color={theme.primary} size={Size.Icon} />
                </TouchableOpacity>
            }
        </View>
    )
}

export default HeaderRightButtons