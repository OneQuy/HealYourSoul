import { View, StyleSheet } from 'react-native'
import React, { useContext } from 'react'
import { ThemeContext } from '../../constants/Colors'

const HairLine = ({ marginVertical }: { marginVertical?: number }) => {
    const theme = useContext(ThemeContext)

    return (
        <View style={{
            backgroundColor: theme.counterBackground,
            width: '100%',
            marginVertical,
            height: StyleSheet.hairlineWidth
        }} />
    )
}

export default HairLine