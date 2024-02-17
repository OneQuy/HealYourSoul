import { Text, StyleSheet, TouchableOpacity, View, LayoutChangeEvent, LayoutRectangle } from 'react-native'
import React, { useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'
import { DrawerContentComponentProps, useDrawerStatus } from '@react-navigation/drawer'
import { BorderRadius, LocalText, Outline, ScreenName, Size } from '../constants/AppConstants'
import { CommonStyles } from '../constants/CommonConstants'

// @ts-ignore
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { ThemeContext } from '../constants/Colors'
import useDrawerMenuItemUtils from '../hooks/useDrawerMenuItemUtils'
import { IsNewlyInstall, track_PressDrawerItem } from '../handle/tracking/GoodayTracking'
import { FilterOnlyLetterAndNumberFromString, RegexUrl } from '../handle/UtilsTS'
import { GetIconOfScreen } from '../handle/AppUtils'
import { useAppDispatch, useAppSelector } from '../redux/Store'
import { checkInScreen } from '../redux/UserDataSlice'

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
    const [layoutRect, setLayoutRect] = useState<LayoutRectangle>()
    const [showNewBadge, setShowNewBadge] = useState(false)
    const checkedInScreens = useAppSelector((state) => state.userData.checkedInScreens)
    const drawerStatus = useDrawerStatus()
    const dispatch = useAppDispatch()

    const icon = useMemo(() => GetIconOfScreen(route.name as ScreenName), [route.name])

    const color = isFocused ? theme.counterPrimary : theme.primary

    const onLayout = useCallback((e: LayoutChangeEvent) => {
        const ratio = e.nativeEvent.layout.width / e.nativeEvent.layout.height
        setLayoutRect(e.nativeEvent.layout)

        if (ratio < idealRatio) {
            const h = e.nativeEvent.layout.width / idealRatio
            setHeight(h)
        }
    }, [])

    const checkAndMarkAsNewCat = useCallback(() => {
        const thisScreen = route.name as ScreenName

        const thisIsNotFirstVersionScreen = !firstVersionScreens.includes(thisScreen)

        // default screens not need to effect

        if (!thisIsNotFirstVersionScreen)
            return

        if (checkedInScreens && checkedInScreens.includes(thisScreen)) // already checked in
        {
            // console.log('aready checking');

            setShowNewBadge(false)
            return
        }

        if (IsNewlyInstall()) { // newly install, not need effect
            // console.log('newly install, not need effect');
            setShowNewBadge(false)
            dispatch(checkInScreen(route.name as ScreenName))
            return
        }

        // need effect

        setShowNewBadge(true)
    }, [route, checkedInScreens, drawerStatus])

    const onPressButton = useCallback(() => {
        track_PressDrawerItem(FilterOnlyLetterAndNumberFromString(route.name))
        onPress()
        dispatch(checkInScreen(route.name as ScreenName))
    }, [onPress, route])

    useEffect(() => {
        checkAndMarkAsNewCat()
    }, [drawerStatus])

    return (
        <TouchableOpacity onLayout={onLayout} onPress={onPressButton} style={[style.masterTO, CommonStyles.justifyContentCenter_AlignItemsCenter, { paddingHorizontal: Outline.GapVertical, backgroundColor: isFocused ? theme.primary : undefined, borderRadius: BorderRadius.BR, borderColor: theme.primary }]}>
            <View style={style.iconView}>
                <MaterialCommunityIcons name={icon} color={color} size={Size.IconSmaller} />
            </View>
            <Text adjustsFontSizeToFit numberOfLines={2} style={[style.labelText, { color: color }]}>{route.name}</Text>

            {/* new badge */}
            {
                !layoutRect || !showNewBadge ?
                    undefined :
                    <View style={{
                        position: 'absolute',
                        backgroundColor: theme.primary,
                        width: layoutRect.width / 5,
                        height: layoutRect.width / 10,
                        left: layoutRect.width - layoutRect.width / 5,
                        top: -layoutRect.width / 10 / 2,
                        justifyContent: 'center', 
                        alignItems: 'center',
                    }}>
                        <Text adjustsFontSizeToFit numberOfLines={1} style={[style.labelText, { color: theme.counterPrimary }]}>{LocalText.new}</Text>
                    </View>
            }
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
        marginRight: Outline.GapVertical,
    },
    labelText: {
        flex: 1,
        textAlign: 'center',
        // fontSize: FontSize.Small,
    }
})
