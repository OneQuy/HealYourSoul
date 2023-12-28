import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import React from 'react'
import { DrawerContentComponentProps } from '@react-navigation/drawer'
import { CommonActions, DrawerActions } from '@react-navigation/native'

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
        <TouchableOpacity onPress={onPress} style={[style.masterView]}>
            <Text style={[{ color: isFocused ? 'black' : 'white' }]}>{route.name}</Text>
        </TouchableOpacity>
    )
}

export default DrawerSingleItem

const style = StyleSheet.create({
    masterView: { flexDirection: 'row', flex: 1, }
})