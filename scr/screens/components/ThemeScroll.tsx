import React, { useMemo, useRef } from 'react'
import { ScrollView } from 'react-native-gesture-handler'
import { RootState, useAppDispatch, useAppSelector } from '../../redux/Store';
import { ThemeType, themes } from '../../constants/Colors';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { setTheme } from '../../redux/MiscSlice';

const ThemeScroll = () => {
    const themeValues = useRef(Object.keys(themes));
    const dispatch = useAppDispatch();
    const currentTheme = useAppSelector((state: RootState) => state.misc.themeType);

    // const style = useMemo(() => {
    //     return StyleSheet.create({
    //         circleTO: 
    //     })
    // }, [theme])

    return (
        <ScrollView horizontal>
            {
                themeValues.current.map((theme, index) =>
                    <TouchableOpacity
                        onPress={() => dispatch(setTheme(theme as ThemeType))}
                        key={index}
                        style={{ borderWidth: currentTheme === theme ? 1 : 0, width: 20, height: 20, borderRadius: 10, backgroundColor: themes[theme as ThemeType].primary }}
                    />)
            }
        </ScrollView>
    )
}

export default ThemeScroll