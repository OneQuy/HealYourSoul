import { View, Text, Image, StatusBar } from 'react-native'
import React from 'react'
import { FontSize, FontWeight, Outline } from '../../constants/AppConstants';
import { ThemeColor } from '../../constants/Colors';
import { heightPercentageToDP } from 'react-native-responsive-screen';

export const logoScr = require('../../../assets/images/logo.png');

const logoSize = heightPercentageToDP(15)

const SplashScreen = ({ theme }: { theme: ThemeColor }) => {
    return (
        <View style={{ backgroundColor: theme.background, flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <StatusBar backgroundColor={theme.background} barStyle={theme.shouldStatusBarLight ? 'light-content' : 'dark-content'} />
            <Image source={logoScr} resizeMode='contain' style={{ height: logoSize, aspectRatio: 1 }} />
            <Text style={{ color: theme.counterBackground, fontWeight: FontWeight.Bold, marginTop: Outline.GapVertical, fontSize: FontSize.Big }}>Gooday</Text>
            <Text style={{ color: theme.counterBackground, fontSize: FontSize.Small_L }}>Make your day good</Text>
        </View>
    )
}

export default SplashScreen