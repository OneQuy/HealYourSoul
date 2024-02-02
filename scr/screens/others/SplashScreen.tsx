import { View, Text, Image } from 'react-native'
import React from 'react'
import { FontSize, FontWeight, Outline } from '../../constants/AppConstants';
import { ThemeColor } from '../../constants/Colors';

export const logoScr = require('../../../assets/images/logo.png');

const SplashScreen = ({ theme }: { theme: ThemeColor }) => {
    return (
        <View style={{ backgroundColor: theme.background, flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Image source={logoScr} style={{ width: 100, height: 100 }} />
            <Text style={{ color: theme.counterBackground, fontWeight: FontWeight.Bold, marginTop: Outline.GapVertical, fontSize: FontSize.Big }}>Gooday</Text>
            <Text style={{ color: theme.counterBackground, }}>Make your day good</Text>
        </View>
    )
}

export default SplashScreen