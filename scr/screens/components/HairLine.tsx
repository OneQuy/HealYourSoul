import { View, StyleSheet, DimensionValue } from 'react-native'
import React, { useContext } from 'react'
import { ThemeContext } from '../../constants/Colors'

const HairLine = ({
    marginVertical,
    widthPercent,
}: {
    marginVertical?: number,
    widthPercent?: DimensionValue,
}) => {
    const theme = useContext(ThemeContext)

    return (
        <View style={{
            backgroundColor: theme.counterBackground,
            width: widthPercent ?? '100%',
            marginVertical,
            height: StyleSheet.hairlineWidth
        }} />
    )
}

export default HairLine