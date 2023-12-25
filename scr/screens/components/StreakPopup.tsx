import { View, Text, StyleSheet } from 'react-native'
import React, { useContext } from 'react'
import { Streak } from '../../constants/Types'
import { ThemeContext } from '../../constants/Colors'

type StreakPopupProps = {
    streak: Streak,
}
const StreakPopup = ({ streak }: StreakPopupProps) => {
    const theme = useContext(ThemeContext);

    return (
        <View style={[{ backgroundColor: 'gold', }, style.masterView]}>
            <Text>Unique post count: {streak.uniquePostSeen}</Text>
            <Text>Current streak: {streak.currentStreak}</Text>
            <Text>Best streak: {streak.bestStreak}</Text>
        </View>
    )
}

export default StreakPopup

const style = StyleSheet.create({
    masterView: {
        flex: 1,
        position: 'absolute',
    }
})