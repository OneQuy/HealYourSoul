import { View, Text } from 'react-native'
import React from 'react'
import { RandomColor, ToCanPrint } from '../handle/UtilsTS'
import { DrawerContentComponentProps } from '@react-navigation/drawer'

type Props = {
    couple: DrawerContentComponentProps['state']['routes'],
}

const DrawerCoupleItem = ({ 
    couple,
}: Props) => {
    console.log(ToCanPrint(couple));
    
    return (
        <View style={{ backgroundColor: RandomColor(), height: 50, width: '100%' }}>

        </View>
    )
}

export default DrawerCoupleItem