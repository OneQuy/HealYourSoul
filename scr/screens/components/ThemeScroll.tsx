import React, { useMemo, useRef } from 'react'
import { ScrollView } from 'react-native-gesture-handler'
import { RootState, useAppDispatch, useAppSelector } from '../../redux/Store';
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

    return (
        <ScrollView horizontal contentContainerStyle={style.scrollView}>
            {
                themeValues.current.map((theme, index) =>
                    <TouchableOpacity
                        onPress={() => dispatch(setTheme(theme as ThemeType))}
                        key={index}
                        style={{
                            width: size,
                            height: size,
                            borderRadius: size / 2,
                            backgroundColor: themes[theme as ThemeType].primary
                        }}
                    />)
            }
        </ScrollView>
    )
}

export default ThemeScroll