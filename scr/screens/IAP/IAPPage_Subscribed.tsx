import { View, Text, ImageBackground } from 'react-native'
import React, {  } from 'react'
import { FontSize, FontWeight, Outline } from '../../constants/AppConstants'
import { SubscribedData } from '../../constants/Types'
import { SplitNumberInText } from '../../handle/UtilsTS'

const imgBg = 'https://images.unsplash.com/photo-1634741426773-1c110c1a0ec7?q=80&w=2160&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'

const IAPPage_Subscribed = ({ subscribedData } : { subscribedData: SubscribedData }) => {
    const monthNum = SplitNumberInText(subscribedData.id)
    const subDate = new Date(subscribedData.tick)
    
    const expiredDate = new Date(subscribedData.tick)
    expiredDate.setMonth(subDate.getMonth() + monthNum)

    const dayLeft = (expiredDate.valueOf() - Date.now()) / 1000 / 3600 / 24

    return (
        <ImageBackground source={{ uri: imgBg }} style={{ flex: 1, gap: Outline.GapVertical, padding: Outline.Horizontal, backgroundColor: 'white' }}>
            <View style={{ flexDirection: 'row', }}>
                <Text style={{ color: 'white', fontSize: FontSize.Normal }}>You subscribed: </Text>
                <Text style={{ color: 'white', fontWeight: FontWeight.Bold, fontSize: FontSize.Normal }}>{monthNum} Month </Text>
            </View>
            <View style={{ flexDirection: 'row', }}>
                <Text style={{ color: 'white', fontSize: FontSize.Normal }}>Subscribed date: </Text>
                <Text style={{ color: 'white', fontWeight: FontWeight.Bold, fontSize: FontSize.Normal }}>{ subDate.toLocaleDateString() }</Text>
            </View>
            <View style={{ flexDirection: 'row', }}>
                <Text style={{ color: 'white', fontSize: FontSize.Normal }}>Expired data: </Text>
                <Text style={{ color: 'white', fontWeight: FontWeight.Bold, fontSize: FontSize.Normal }}>{ expiredDate.toLocaleDateString() }</Text>
            </View>
            <View style={{ flexDirection: 'row', }}>
                <Text style={{ color: 'white', fontSize: FontSize.Normal }}>Day left: </Text>
                <Text style={{ color: 'white', fontWeight: FontWeight.Bold, fontSize: FontSize.Normal }}>{dayLeft}</Text>
            </View>
            <Text style={{ marginTop: Outline.GapVertical_2 * 2, color: 'white', fontSize: FontSize.Normal }}>{'I\'m glad that you supported me,' + '\n' + 'Thank you so much!'}</Text>
        </ImageBackground>
    )
}

export default IAPPage_Subscribed