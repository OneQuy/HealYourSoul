import { Text, StyleSheet, TouchableOpacity, View } from 'react-native'
import React, { useCallback, useContext, useMemo } from 'react'
import { DrawerContentComponentProps } from '@react-navigation/drawer'
import { CommonActions, DrawerActions } from '@react-navigation/native'
import { BorderRadius, Icon, Outline, ScreenName, Size } from '../constants/AppConstants'
import { CommonStyles } from '../constants/CommonConstants'

// @ts-ignore
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { ThemeContext } from '../constants/Colors'
import useDrawerMenuItemUtils from '../hooks/useDrawerMenuItemUtils'
import { track_PressDrawerItem } from '../handle/tracking/GoodayTracking'
import { FilterOnlyLetterAndNumberFromString } from '../handle/UtilsTS'
import { GetIconOfScreen } from '../handle/AppUtils'

type Props = {
    route: DrawerContentComponentProps['state']['routes'][number],
    masterProps: DrawerContentComponentProps,
}

const DrawerSingleItem = ({
    route,
    masterProps,
}: Props) => {
    const theme = useContext(ThemeContext);
    const [isFocused, onPress] = useDrawerMenuItemUtils(route.name, masterProps)

    const icon = useMemo(() => GetIconOfScreen(route.name as ScreenName), [route.name])

    const onPressButton = useCallback(() => {
        track_PressDrawerItem(FilterOnlyLetterAndNumberFromString(route.name))
        onPress()
    }, [onPress])

    return (
        <TouchableOpacity onPress={onPressButton} style={[style.masterTO, CommonStyles.justifyContentCenter_AlignItemsCenter, { paddingHorizontal: Outline.GapVertical, backgroundColor: isFocused ? theme.primary : undefined, borderRadius: BorderRadius.BR8, borderColor: theme.text }]}>
            <View style={[style.iconView, { marginRight: Outline.GapVertical, }]}>
                <MaterialCommunityIcons name={icon} color={theme.text} size={Size.IconSmaller} />
            </View>
            <Text style={[style.labelText, { color: theme.text, }]}>{route.name}</Text>
        </TouchableOpacity>
    )
}

export default DrawerSingleItem

const style = StyleSheet.create({
    masterTO: { flexDirection: 'row', flex: 1, borderWidth: StyleSheet.hairlineWidth, },
    iconView: { height: '100%', justifyContent: 'center', },
    labelText: { flex: 1, textAlign: 'center', }
})
