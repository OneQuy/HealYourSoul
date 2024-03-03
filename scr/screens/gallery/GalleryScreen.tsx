import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useCallback, useContext, useMemo, useState } from 'react'
import { BorderRadius, Category, FontSize, FontWeight, LocalText, Outline } from '../../constants/AppConstants'
import { ThemeContext } from '../../constants/Colors';
import GallerySeenView from './GallerySeenView';
import { RouteProp, useFocusEffect, useNavigation, useRoute } from '@react-navigation/native';
import { DrawerParamList } from '../../navigation/Navigator';
import { SafeValue } from '../../handle/UtilsTS';
import GalleryLovedView from './GalleryLovedView';
import { UpdateHeaderXButton } from '../components/HeaderXButton';

type SubView = 'seen' | 'favorite'

var lastCat = Category.Meme

export const GetLastCatOfGallery = () => lastCat

const GalleryScreen = () => {
    const theme = useContext(ThemeContext);
    const [subview, setSubView] = useState<SubView>('seen')
    const route = useRoute<RouteProp<DrawerParamList>>()
    const navigation = useNavigation()

    const onPressView = useCallback((view: SubView) => {
        setSubView(view)
    }, [])

    const cat: Category = useMemo(() => {
        // @ts-ignore
        return SafeValue(route.params?.cat, lastCat)
        // @ts-ignore
    }, [route.params?.cat])

    lastCat = cat

    const style = useMemo(() => {
        return StyleSheet.create({
            masterView: { flex: 1, backgroundColor: theme.background, gap: Outline.GapHorizontal },
            topButtonContainerView: { padding: Outline.GapVertical, paddingHorizontal: Outline.GapVertical_2, gap: Outline.GapHorizontal, flexDirection: 'row' },
            topButtonTO: { borderColor: theme.primary, borderWidth: StyleSheet.hairlineWidth, padding: Outline.GapVertical, borderRadius: BorderRadius.BR8, flex: 1, backgroundColor: theme.primary, justifyContent: 'center', alignItems: 'center' },
            topButtonTO_Inactive: { borderColor: theme.primary, borderWidth: StyleSheet.hairlineWidth, padding: Outline.GapVertical, borderRadius: BorderRadius.BR8, flex: 1, justifyContent: 'center', alignItems: 'center' },
            topButtonText: { color: theme.counterPrimary, fontWeight: FontWeight.B600, fontSize: FontSize.Small },
            topButtonText_Inactive: { color: theme.counterBackground, fontWeight: FontWeight.B600, fontSize: FontSize.Small },
        })
    }, [theme])

    useFocusEffect(useCallback(() => {
        UpdateHeaderXButton(navigation, undefined, true)
    }, [cat]))

    return (
        <View style={style.masterView}>

            {
                <View style={style.topButtonContainerView}>
                    <TouchableOpacity onPress={() => onPressView('seen')} style={subview === 'seen' ? style.topButtonTO : style.topButtonTO_Inactive}>
                        <Text adjustsFontSizeToFit numberOfLines={1} style={subview === 'seen' ? style.topButtonText : style.topButtonText_Inactive}>{LocalText.seen_posts}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => onPressView('favorite')} style={subview === 'favorite' ? style.topButtonTO : style.topButtonTO_Inactive}>
                        <Text adjustsFontSizeToFit numberOfLines={1} style={subview === 'favorite' ? style.topButtonText : style.topButtonText_Inactive}>{LocalText.favorited_posts}</Text>
                    </TouchableOpacity>
                </View>
            }

            {
                subview === 'seen' &&
                <GallerySeenView cat={cat} />
            }

            {
                subview === 'favorite' &&
                <GalleryLovedView cat={cat} />
            }
        </View>
    )
}

export default GalleryScreen