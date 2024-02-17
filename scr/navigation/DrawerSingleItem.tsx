import { Text, StyleSheet, TouchableOpacity, View, LayoutChangeEvent } from 'react-native'
import React, { useCallback, useContext, useMemo } from 'react'
import { DrawerContentComponentProps } from '@react-navigation/drawer'
import { BorderRadius, Outline, ScreenName, Size } from '../constants/AppConstants'
import { CommonStyles } from '../constants/CommonConstants'

// @ts-ignore
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { ThemeContext } from '../constants/Colors'
import useDrawerMenuItemUtils from '../hooks/useDrawerMenuItemUtils'
import { track_PressDrawerItem } from '../handle/tracking/GoodayTracking'
import { FilterOnlyLetterAndNumberFromString } from '../handle/UtilsTS'
import { GetIconOfScreen } from '../handle/AppUtils'

const idealRatio = 2.5

const firstVersionScreens: ScreenName[] = [
    ScreenName.Comic,
    ScreenName.Meme,
    ScreenName.Awesome,
    ScreenName.Typo,
    ScreenName.Info,
    ScreenName.Sunset,
    ScreenName.Quote,
    ScreenName.CatDog,
    ScreenName.Love,
    ScreenName.Satisfying,
    ScreenName.NSFW,
    ScreenName.Art,
    ScreenName.Cute,
    ScreenName.Sarcasm,
    ScreenName.IAPPage,
    ScreenName.WikiFact,
    ScreenName.ShortFact,
    ScreenName.Picture,
    ScreenName.Joke,
    ScreenName.QuoteText,
    ScreenName.Trivia,
    ScreenName.AwardPicture,
    ScreenName.FunWebsite,
    ScreenName.TopMovie,
    ScreenName.BestShortFilms,
    ScreenName.RandomMeme,
    ScreenName.Setting,
] as const

type Props = {
    route: DrawerContentComponentProps['state']['routes'][number],
    masterProps: DrawerContentComponentProps,
    setHeight: (value: number) => void,
}

const DrawerSingleItem = ({
    route,
    masterProps,
    setHeight,
}: Props) => {
    const theme = useContext(ThemeContext);
    const [isFocused, onPress] = useDrawerMenuItemUtils(route.name, masterProps)

    const icon = useMemo(() => GetIconOfScreen(route.name as ScreenName), [route.name])

    const color = isFocused ? theme.counterPrimary : theme.primary

    const onLayout = useCallback((e: LayoutChangeEvent) => {
        const ratio = e.nativeEvent.layout.width / e.nativeEvent.layout.height

        // console.log(ratio);

        if (ratio < idealRatio) {

            const h = e.nativeEvent.layout.width / idealRatio
            setHeight(h)

            // console.log('set height', h, e.nativeEvent.layout.height, ratio, Platform.OS);
        }
    }, [])

    const onPressButton = useCallback(() => {
        track_PressDrawerItem(FilterOnlyLetterAndNumberFromString(route.name))
        onPress()
    }, [onPress])

    return (
        <TouchableOpacity onLayout={onLayout} onPress={onPressButton} style={[style.masterTO, CommonStyles.justifyContentCenter_AlignItemsCenter, { paddingHorizontal: Outline.GapVertical, backgroundColor: isFocused ? theme.primary : undefined, borderRadius: BorderRadius.BR, borderColor: theme.primary }]}>
            <View style={[style.iconView, { marginRight: Outline.GapVertical, }]}>
                <MaterialCommunityIcons name={icon} color={color} size={Size.IconSmaller} />
            </View>
            <Text adjustsFontSizeToFit numberOfLines={2} style={[style.labelText, { color: color }]}>{route.name}</Text>
        </TouchableOpacity>
    )
}

export default DrawerSingleItem

const style = StyleSheet.create({
    masterTO: {
        flexDirection: 'row',
        flex: 1,
        borderWidth: StyleSheet.hairlineWidth,
    },
    iconView: {
        justifyContent: 'center',
    },
    labelText: {
        flex: 1,
        textAlign: 'center',
        // fontSize: FontSize.Small,
    }
})
