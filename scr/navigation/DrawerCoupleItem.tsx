import { View, StyleSheet } from 'react-native'
import React, { useMemo } from 'react'
import { DrawerContentComponentProps } from '@react-navigation/drawer'
import DrawerSingleItem from './DrawerSingleItem'
import { Outline } from '../constants/AppConstants'

type Props = {
    couple: DrawerContentComponentProps['state']['routes'],
    masterProps: DrawerContentComponentProps,
    setHeight: (value: number) => void,
    height: number,
}

const DrawerCoupleItem = ({
    couple,
    masterProps,
    setHeight,
    height,
}: Props) => {
    const style = useMemo(() => {
        return StyleSheet.create({
            masterView: {
                flexDirection: 'row',
                height: height,
                gap: Outline.GapHorizontal * 2,
                padding: Outline.GapHorizontal,
            }
        })
    }, [height])

    return (
        <View style={style.masterView}>
            {
                couple.map((route, idx) => <DrawerSingleItem
                    masterProps={masterProps}
                    route={route}
                    setHeight={setHeight}
                    key={idx} />)
            }
        </View>
    )
}

export default DrawerCoupleItem