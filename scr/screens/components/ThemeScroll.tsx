import React, { useCallback, useMemo } from 'react'
import { RootState, useAppDispatch, useAppSelector } from '../../redux/Store';
import { ThemeType, themes } from '../../constants/Colors';
import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { setTheme } from '../../redux/MiscSlice';
import { Outline } from '../../constants/AppConstants';
import { heightPercentageToDP } from 'react-native-responsive-screen';
import { track_Theme } from '../../handle/tracking/GoodayTracking';

const size = heightPercentageToDP(3.5)

const ThemeScroll = ({ mode }: { mode: 'lights' | 'darks' | 'specials' | 'all' }) => {
    const dispatch = useAppDispatch();
    const currentTheme = useAppSelector((state: RootState) => state.misc.themeType)

    const listToDraw = useMemo(() => {
        const themeValues = Object.keys(themes)

        if (mode === 'darks')
            return themeValues.filter(i => i.includes('dark'))
        else if (mode === 'lights')
            return themeValues.filter(i => i.includes('light'))
        else if (mode === 'specials')
            return themeValues.filter(i => i.includes('special'))
        else
            return themeValues
    }, [])

    const style = useMemo(() => {
        return StyleSheet.create({
            scrollView: { gap: Outline.GapVertical, }
        })
    }, [])

    const renderItem = useCallback((theme: string, index: number) => {
        const value = themes[theme as ThemeType]
        const isCurrentTheme = theme === currentTheme

        const onPress = () => {
            // console.log('set theme: ' + theme);

            track_Theme(theme)
            
            dispatch(setTheme(theme as ThemeType))
        }

        return (
            <TouchableOpacity
                onPress={onPress}
                key={index}
                style={{
                    width: size,
                    height: size,
                    borderRadius: size / 2,
                    borderColor: value.primary,
                    backgroundColor: value.background,
                    borderWidth: size / 5,
                    justifyContent: 'center',
                    alignItems: 'center',
                }}>
                {
                    !isCurrentTheme ? undefined :
                        <View
                            style={{
                                width: size / 4,
                                height: size / 4,
                                borderRadius: size / 4 / 2,
                                backgroundColor: value.counterBackground,
                            }} />
                }
            </TouchableOpacity>
        )
    }, [currentTheme])

    return (
        <ScrollView
            horizontal
            contentContainerStyle={style.scrollView}
            showsHorizontalScrollIndicator={false}>
            {
                listToDraw.map(renderItem)
            }
        </ScrollView>
    )
}

export default ThemeScroll