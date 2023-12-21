import { View, Text, ImageBackground, Linking } from 'react-native'
import React, { } from 'react'
import { FontSize, FontWeight, LocalText, Outline } from '../../constants/AppConstants'
import { SubscribedData } from '../../constants/Types'
import { SplitNumberInText } from '../../handle/UtilsTS'
import { GetExpiredDateAndDaysLeft } from '../../handle/AppUtils'

const imgBg = require('../../../assets/images/subscribed-bg.jpg')

const IAPPage_Subscribed = ({ subscribedData }: { subscribedData: SubscribedData }) => {
    const monthNum = SplitNumberInText(subscribedData.id)
    const [expiredDate, dayLeft] = GetExpiredDateAndDaysLeft(subscribedData.tick, monthNum)

    return (
        <ImageBackground source={imgBg} style={{ flex: 1, padding: Outline.Horizontal, justifyContent: 'space-between' }}>
            <View style={{ gap: Outline.GapVertical, }}>
                <View style={{ flexDirection: 'row', }}>
                    <Text style={{ color: 'black', fontSize: FontSize.Normal }}>{LocalText.you_subscribed} </Text>
                    <View style={{ backgroundColor: 'gold' }}>
                        <Text style={{ color: 'black', fontWeight: FontWeight.Bold, fontSize: FontSize.Normal }}>{monthNum} Month </Text>
                    </View>
                </View>
                <View style={{ flexDirection: 'row', }}>
                    <Text style={{ color: 'black', fontSize: FontSize.Normal }}>{LocalText.subscribed_date} </Text>
                    <Text style={{ color: 'black', fontWeight: FontWeight.Bold, fontSize: FontSize.Normal }}>{subDate.toLocaleDateString()}</Text>
                </View>
                <View style={{ flexDirection: 'row', }}>
                    <Text style={{ color: 'black', fontSize: FontSize.Normal }}>{LocalText.subscribed_exp_date} </Text>
                    <Text style={{ color: 'black', fontWeight: FontWeight.Bold, fontSize: FontSize.Normal }}>{expiredDate.toLocaleDateString()}</Text>
                </View>
                <View style={{ flexDirection: 'row', }}>
                    <Text style={{ color: 'black', fontSize: FontSize.Normal }}>{LocalText.day_left} </Text>
                    <Text style={{ color: 'black', fontWeight: FontWeight.Bold, fontSize: FontSize.Normal }}>{dayLeft}</Text>
                </View>
                <Text style={{ marginTop: Outline.GapVertical_2 * 2, color: 'black', fontStyle: 'italic', fontSize: FontSize.Normal }}>{LocalText.thank_you}</Text>
            </View>
            <Text onPress={() => Linking.openURL('https://unsplash.com/photos/a-view-of-a-beach-with-a-boat-in-the-distance-GFsc977iFL4')} style={{ color: 'gray', fontSize: FontSize.Small }}>Photo by Amy Vann on Unsplash.</Text>
        </ImageBackground>
    )
}

export default IAPPage_Subscribed