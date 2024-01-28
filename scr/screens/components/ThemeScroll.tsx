import React, { useCallback, useMemo } from 'react'
import { ScrollView } from 'react-native-gesture-handler'
import { useAppDispatch } from '../../redux/Store';
import { ThemeType, themes } from '../../constants/Colors';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { setTheme } from '../../redux/MiscSlice';
import { Outline } from '../../constants/AppConstants';
import { heightPercentageToDP } from 'react-native-responsive-screen';

const size = heightPercentageToDP(3.5)

const ThemeScroll = ({ mode }: { mode: 'lights' | 'darks' | 'specials' | 'all' }) => {
    const dispatch = useAppDispatch();

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
            scrollView: { gap: Outline.GapHorizontal, }
        })
    }, [])

    const renderItem = useCallback((theme: string, index: number) => {
        const value = themes[theme as ThemeType]

        const onPress = () => {
            console.log('set theme: ' + theme);

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
                }}
            />)
    }, [])

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