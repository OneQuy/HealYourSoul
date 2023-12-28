import { View, Text, StyleSheet } from 'react-native'
import React from 'react'
import { RandomColor, ToCanPrint } from '../handle/UtilsTS'
import { DrawerContentComponentProps } from '@react-navigation/drawer'
import DrawerSingleItem from './DrawerSingleItem'

type Props = {
    couple: DrawerContentComponentProps['state']['routes'],
}

const DrawerCoupleItem = ({
    couple,
}: Props) => {
    return (
        <View style={[style.masterView, { backgroundColor: RandomColor() }]}>
            {
                couple.map((route, idx) => <DrawerSingleItem
                    route={route}
                    key={idx} />)
            }
        </View>
    )
}

export default DrawerCoupleItem

const style = StyleSheet.create({
    masterView: { flexDirection: 'row', height: 50, width: '100%' }
})