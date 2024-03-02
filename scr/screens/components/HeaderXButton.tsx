// @ts-ignore
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import { TouchableOpacity, StyleSheet, View } from 'react-native'
import React, { useCallback, useContext, useMemo } from 'react'
import { Icon, LocalText, Outline, ScreenName, Size } from '../../constants/AppConstants';
import { ThemeContext } from '../../constants/Colors';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { DrawerNavigationProp } from '@react-navigation/drawer';
import { DrawerParamList } from '../../navigation/Navigator';
import { track_Simple } from '../../handle/tracking/GoodayTracking';
import { GetScreenBackWhenPressXGlobal } from '../diversity/TheDiversity';
import { GoToScreen } from '../../handle/GoodayAppState';

const HeaderXButton = () => {
    const theme = useContext(ThemeContext);
    const navigation = useNavigation<DrawerNavigationProp<DrawerParamList>>();

    const style = useMemo(() => {
        return StyleSheet.create({
            master: { gap: Outline.GapHorizontal, flexDirection: 'row', marginLeft: 15 },
        })
    }, [])

    const onPressX = useCallback(() => {
        OnPressedXInDiversityMode()
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

export const GoToPremiumScreen = (navigation: DrawerNavigationProp<DrawerParamList> | NavigationProp<ReactNavigation.RootParamList>) => {
    track_Simple('pressed_go_to_premium')

    // @ts-ignore
    navigation.navigate(ScreenName.IAPPage)
}

export const OnPressedXInDiversityMode = () => {
    // go to diversity screen
    GoToScreen(GetScreenBackWhenPressXGlobal())
}

export const UpdateHeaderXButton = (
    navigation: DrawerNavigationProp<DrawerParamList> | NavigationProp<ReactNavigation.RootParamList>,
    replaceByXButton: boolean
) => {
    const index = navigation.getState().index
    const screen = navigation.getState().routes[index].name

    let title: string = screen

    if (replaceByXButton) {
        title += ` (${GetScreenBackWhenPressXGlobal()})`
    }

    navigation.setOptions({
        headerLeft: replaceByXButton ? () => <HeaderXButton /> : undefined,
        headerTitle: title,
    })
}