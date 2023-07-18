import { View, Text, Image } from 'react-native'
import React, { useContext } from 'react'
import { FontSize, Outline } from '../../app_common/AppConstants';
import { ThemeContext } from '../../app_common/Colors';

const logoScr = require('../../../assets/images/logo.png');

const SplashScreen = () => {
    const theme = useContext(ThemeContext);
    console.log(theme);
    
    return (
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
            <Image source={logoScr} style={{ width: 100, height: 100 }} />
            <Text style={{marginTop: Outline.GapVertical, fontSize: FontSize.Big}}>Warm</Text>
            <Text>Heal your Soul</Text>
        </View>
    )
}

export default SplashScreen