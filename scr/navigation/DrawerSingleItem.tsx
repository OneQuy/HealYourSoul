import { Text, StyleSheet, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { DrawerContentComponentProps } from '@react-navigation/drawer'
import { CommonActions, DrawerActions } from '@react-navigation/native'
import { BorderRadius, Icon, Outline, Size } from '../constants/AppConstants'
import { CommonStyles } from '../constants/CommonConstants'

// @ts-ignore
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

type Props = {
    route: DrawerContentComponentProps['state']['routes'][number],
    masterProps: DrawerContentComponentProps,
}

const DrawerSingleItem = ({
    route,
    masterProps,
}: Props) => {
    const focusingRoute = masterProps.state.routes[masterProps.state.index];
    const isFocused = route === focusingRoute
    const navigation = masterProps.navigation

    const onPress = () => {
        const event = navigation.emit({
            type: 'drawerItemPress',
            target: route.key,
            canPreventDefault: true,
        });

        if (!event.defaultPrevented) {
            navigation.dispatch({
                ...(isFocused
                    ? DrawerActions.closeDrawer()
                    : CommonActions.navigate({ name: route.name, merge: true })),
                target: masterProps.state.key,
            });
        }
    };

    return (
        <TouchableOpacity onPress={onPress} style={[style.masterTO, CommonStyles.justifyContentCenter_AlignItemsCenter, { borderRadius: BorderRadius.BR8 }]}>
            <View style={[style.iconView, { paddingLeft: Outline.GapVertical, borderBottomLeftRadius: BorderRadius.BR8, borderTopLeftRadius: BorderRadius.BR8 }]}>
                <MaterialCommunityIcons name={Icon.Check} color={'black'} size={Size.IconSmaller} />
            </View>
            <Text style={[{ flex: 1, textAlign: 'center', color: isFocused ? 'red' : 'black' }]}>{route.name}</Text>
        </TouchableOpacity>
    )
}

export default DrawerSingleItem

const style = StyleSheet.create({
    masterTO: { flexDirection: 'row', flex: 1, borderWidth: StyleSheet.hairlineWidth, overflow: 'hidden' },
    iconView: { height: '100%', justifyContent: 'center', }
})
