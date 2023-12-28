import { View, Text, StyleSheet } from 'react-native'
import React from 'react'
import { DrawerContentComponentProps } from '@react-navigation/drawer'

type Props = {
    route: DrawerContentComponentProps['state']['routes'][number],
}

const DrawerSingleItem = ({
    route,
}: Props) => {
    return (
        <View style={[style.masterView]}>
            <Text>{route.name}</Text>
        </View>
    )
}

export default DrawerSingleItem

const style = StyleSheet.create({
    masterView: { flexDirection: 'row', flex: 1, }
})