// @ts-ignore
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import { TouchableOpacity, StyleSheet, View } from 'react-native'
import React, { useCallback, useContext, useMemo } from 'react'
import { Icon, LocalText, Outline, ScreenName, Size } from '../../constants/AppConstants';
import { ThemeContext } from '../../constants/Colors';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { DrawerNavigationProp } from '@react-navigation/drawer';
import { DrawerParamList } from '../../navigation/Navigator';
import { IsDev } from '../../handle/IsDev';

const HeaderXButton = () => {
    const theme = useContext(ThemeContext);
    const navigation = useNavigation<DrawerNavigationProp<DrawerParamList>>();

    const style = useMemo(() => {
        return StyleSheet.create({
            master: { gap: Outline.GapHorizontal, flexDirection: 'row', marginLeft: 15 },
        })
    }, [])

    const onPressX = useCallback(() => {
        OnPressedXInDiversityMode(navigation)
    }, [])

    return (
        <View style={style.master}>
            {/* x button */}
            <TouchableOpacity onPress={onPressX} >
                <MaterialCommunityIcons name={Icon.Close} color={theme.primary} size={Size.Icon} />
            </TouchableOpacity>
        </View>
    )
}

export const OnPressedXInDiversityMode = (
    navigation: DrawerNavigationProp<DrawerParamList> | NavigationProp<ReactNavigation.RootParamList>) => {
    // go to diversity screen
    // @ts-ignore
    navigation.navigate(ScreenName.Saved);
}

export const UpdateHeaderXButton = (
    navigation: DrawerNavigationProp<DrawerParamList> | NavigationProp<ReactNavigation.RootParamList>,
    savedMode: boolean) => {
    const index = navigation.getState().index
    const screen = navigation.getState().routes[index].name

    let title: string = screen

    if (savedMode) {
        if (IsDev())
            title += ' (Saved)'
        else
            title = LocalText.saved_2
    }

    navigation.setOptions({
        headerLeft: savedMode ? () => <HeaderXButton /> : undefined,
        headerTitle: title,
    })
}