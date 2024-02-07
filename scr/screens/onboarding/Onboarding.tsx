// @ts-ignore

import { View, Text, Image, StyleSheet, StatusBar, SafeAreaView, TouchableOpacity } from 'react-native'
import React, { useCallback, useContext, useMemo, useState } from 'react'
import { ThemeContext } from '../../constants/Colors';
import { logoScr } from '../others/SplashScreen';
import { BorderRadius, FontSize, FontWeight, LocalText, Outline } from '../../constants/AppConstants';
import { heightPercentageToDP } from 'react-native-responsive-screen';
import ThemeScroll, { OnPressedTheme, TrackSelectedTheme } from '../components/ThemeScroll';
import { useAppDispatch } from '../../redux/Store';
import { setOnboarded } from '../../redux/MiscSlice';
import { track_SimpleWithParam } from '../../handle/tracking/GoodayTracking';


const Onboarding = () => {
    const theme = useContext(ThemeContext);
    const [showThemes, setShowThemes] = useState(false)
    const dispatch = useAppDispatch();

    const style = useMemo(() => {
        return StyleSheet.create({
            masterView: { flex: 1, backgroundColor: theme.background, justifyContent: 'space-evenly', alignItems: 'center', },
            logoAppNameContainerView: { gap: Outline.GapVertical, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' },
            logoImg: { width: heightPercentageToDP(10), aspectRatio: 1 },

            welcomeView: { marginHorizontal: Outline.Horizontal, alignItems: 'center', },
            welcomeText: { color: theme.counterBackground, fontSize: FontSize.Big, fontWeight: FontWeight.Bold },
            welcomeText_Gooday: { color: theme.primary, fontSize: FontSize.Big, fontWeight: FontWeight.Bold },
            welcomeText_2: { color: theme.counterBackground, fontSize: FontSize.Small_L, },
            welcomeText_3: { textAlign: 'center', marginTop: Outline.Horizontal, color: theme.counterBackground, fontSize: FontSize.Small_L, },

            bottomBtnsContainerView: { width: '100%', gap: Outline.GapHorizontal, },
            bottomContainerView: { alignItems: 'center', gap: Outline.GapHorizontal, },
            themeBtnsContainerView: { flexDirection: 'row', paddingHorizontal: Outline.Horizontal, gap: Outline.GapHorizontal, },
            startTO: { marginTop: Outline.Vertical, backgroundColor: theme.primary, marginHorizontal: Outline.Horizontal, padding: Outline.Horizontal, borderRadius: BorderRadius.BR, alignItems: 'center' },
            themeTO: { flex: 1, padding: Outline.GapVertical, borderWidth: StyleSheet.hairlineWidth, borderColor: theme.counterBackground, borderRadius: BorderRadius.BR, alignItems: 'center', justifyContent: 'center', },
            themeTOText: { color: theme.counterBackground, fontSize: FontSize.Small, },
            btnText: { color: theme.counterPrimary, fontSize: FontSize.Small_L, fontWeight: FontWeight.Bold },
        })
    }, [theme])

    const onPressed = useCallback((type: 'light' | 'dark' | 'color' | 'enter') => {
        track_SimpleWithParam('onboarding', type)

        if (type === 'color')
            setShowThemes(val => !val)
        else if (type === 'light') {
            OnPressedTheme('default_light', dispatch)
        }
        else if (type === 'dark') {
            OnPressedTheme('default_dark', dispatch)
        }
        else { // enter
            dispatch(setOnboarded())
            TrackSelectedTheme()
        }
    }, [])

    return (
        <SafeAreaView style={style.masterView}>
            <StatusBar backgroundColor={theme.background} barStyle={theme.shouldStatusBarLight ? 'light-content' : 'dark-content'} />

            {/* logo & app name */}
            <View style={style.logoAppNameContainerView}>
                <Image
                    source={logoScr}
                    resizeMode='contain'
                    style={style.logoImg} />
            </View>

            {/* welcome texts */}

            <View style={style.welcomeView}>
                <Text selectable adjustsFontSizeToFit numberOfLines={1} style={style.welcomeText}>
                    {LocalText.welcome_text} <Text adjustsFontSizeToFit numberOfLines={1} style={style.welcomeText_Gooday}>Gooday!</Text>
                </Text>
                <Text selectable adjustsFontSizeToFit numberOfLines={1} style={style.welcomeText_2}>{LocalText.welcome_text_2}</Text>
                <Text selectable style={style.welcomeText_3}>{LocalText.welcome_text_3}</Text>
            </View>

            {/* bottom part*/}

            <View style={style.bottomBtnsContainerView}>
                {/* set theme */}
                <View style={style.bottomContainerView}>
                    <Text selectable adjustsFontSizeToFit numberOfLines={1} style={style.welcomeText_2}>{LocalText.set_your_theme}:</Text>
                    <View style={style.themeBtnsContainerView}>
                        <TouchableOpacity onPress={() => onPressed('light')} style={style.themeTO}>
                            <Text adjustsFontSizeToFit numberOfLines={1} style={style.themeTOText}>{LocalText.lights_mode}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => onPressed('dark')} style={style.themeTO}>
                            <Text adjustsFontSizeToFit numberOfLines={1} style={style.themeTOText}>{LocalText.darks_mode}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => onPressed('color')} style={style.themeTO}>
                            <Text adjustsFontSizeToFit numberOfLines={1} style={style.themeTOText}>{LocalText.color}</Text>
                        </TouchableOpacity>
                    </View>
                    {
                        !showThemes ? undefined :
                            <ThemeScroll mode='all' />
                    }
                </View>

                {/* start btn */}
                <TouchableOpacity onPress={() => onPressed('enter')} style={style.startTO}>
                    <Text adjustsFontSizeToFit numberOfLines={1} style={style.btnText}>{LocalText.start_gooday}</Text>
                </TouchableOpacity>
            </View>

        </SafeAreaView>
    )
}

export default Onboarding