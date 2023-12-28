import { View, Text, StyleSheet } from 'react-native'
import React from 'react'
import { RandomColor, ToCanPrint } from '../handle/UtilsTS'
import { DrawerContentComponentProps } from '@react-navigation/drawer'
import DrawerSingleItem from './DrawerSingleItem'
import { Outline } from '../constants/AppConstants'

type Props = {
    couple: DrawerContentComponentProps['state']['routes'],
    masterProps: DrawerContentComponentProps,
}

const DrawerCoupleItem = ({
    couple,
    masterProps,
}: Props) => {
    return (
        <View style={[style.masterView, { gap: Outline.GapHorizontal, padding: Outline.GapHorizontal }]}>
            {
                couple.map((route, idx) => <DrawerSingleItem
                    masterProps={masterProps}
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