import React, { useCallback, useMemo, useRef } from 'react'
import { ScrollView } from 'react-native-gesture-handler'
import { useAppDispatch } from '../../redux/Store';
import { ThemeType, themes } from '../../constants/Colors';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { setTheme } from '../../redux/MiscSlice';
import { Outline } from '../../constants/AppConstants';
import { heightPercentageToDP } from 'react-native-responsive-screen';

const size = heightPercentageToDP(2.5)

const ThemeScroll = () => {
    const themeValues = useRef(Object.keys(themes));
    const dispatch = useAppDispatch();

    const style = useMemo(() => {
        return StyleSheet.create({
            scrollView: { gap: Outline.GapHorizontal, }
        })
    }, [])

    const renderItem = useCallback((theme: string, index: number) => {
        const value = themes[theme as ThemeType]

        return (
            <TouchableOpacity
                onPress={() => dispatch(setTheme(theme as ThemeType))}
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
        <ScrollView horizontal contentContainerStyle={style.scrollView}>
            {
                themeValues.current.map(renderItem)
            }
        </ScrollView>
    )
}

export default ThemeScroll