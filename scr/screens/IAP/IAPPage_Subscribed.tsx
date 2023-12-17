import { View, Text, ImageBackground } from 'react-native'
import React, { } from 'react'
import { FontSize, FontWeight, LocalText, Outline } from '../../constants/AppConstants'
import { SubscribedData } from '../../constants/Types'
import { SplitNumberInText } from '../../handle/UtilsTS'

const imgBg = require('../../../assets/images/subscribed-bg.jpg')
// Photo by Amy Vann on Unsplash
// https://unsplash.com/photos/a-view-of-a-beach-with-a-boat-in-the-distance-GFsc977iFL4

const IAPPage_Subscribed = ({ subscribedData }: { subscribedData: SubscribedData }) => {
    const monthNum = SplitNumberInText(subscribedData.id)
    const subDate = new Date(subscribedData.tick)

    const expiredDate = new Date(subscribedData.tick)
    expiredDate.setMonth(subDate.getMonth() + monthNum)
    expiredDate.setDate(expiredDate.getDate() + 1)

    const dayLeft = Math.ceil((expiredDate.valueOf() - Date.now()) / 1000 / 3600 / 24)

    return (
        <ImageBackground source={imgBg} style={{ flex: 1, gap: Outline.GapVertical, padding: Outline.Horizontal, backgroundColor: 'black' }}>
            <View style={{ flexDirection: 'row', }}>
                <Text style={{ color: 'black', fontSize: FontSize.Normal }}>{LocalText.you_subscribed} </Text>
                <Text style={{ color: 'black', fontWeight: FontWeight.Bold, fontSize: FontSize.Normal }}>{monthNum} Month </Text>
            </View>
            <View style={{ flexDirection: 'row', }}>
                <Text style={{ color: 'black', fontSize: FontSize.Normal }}>Subscribed date: </Text>
                <Text style={{ color: 'black', fontWeight: FontWeight.Bold, fontSize: FontSize.Normal }}>{subDate.toLocaleDateString()}</Text>
            </View>
            <View style={{ flexDirection: 'row', }}>
                <Text style={{ color: 'black', fontSize: FontSize.Normal }}>Expired data: </Text>
                <Text style={{ color: 'black', fontWeight: FontWeight.Bold, fontSize: FontSize.Normal }}>{expiredDate.toLocaleDateString()}</Text>
            </View>
            <View style={{ flexDirection: 'row', }}>
                <Text style={{ color: 'black', fontSize: FontSize.Normal }}>Day left: </Text>
                <Text style={{ color: 'black', fontWeight: FontWeight.Bold, fontSize: FontSize.Normal }}>{dayLeft}</Text>
            </View>
            <Text style={{ marginTop: Outline.GapVertical_2 * 2, color: 'black', fontSize: FontSize.Normal }}>{'I\'m glad that you supported me,' + '\n' + 'Thank you so much!'}</Text>
        </ImageBackground>
    )
}

export default IAPPage_Subscribed