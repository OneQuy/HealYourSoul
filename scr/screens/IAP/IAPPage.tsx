import { View, Text, ScrollView, Image } from 'react-native'
import React from 'react'
import { FontSize, FontWeight, LocalText, Outline } from '../../constants/AppConstants'
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from "react-native-responsive-screen";

const reasonItems = [
  {
    icon: require('../../../assets/images/ad-free-icon.png'),
    title: LocalText.ad_free,
    content: LocalText.no_ad_anymore
  },

  {
    icon: require('../../../assets/images/love-icon.jpeg'),
    title: LocalText.support_me,
    content: LocalText.support_me_info
  },

  {
    icon: require('../../../assets/images/coffee-icon.png'),
    title: LocalText.give_coffee,
    content: LocalText.give_coffee_info
  }
]

const IAPPage = () => {
  return (
    <ScrollView contentContainerStyle={{ flex: 1, backgroundColor: 'white', padding: Outline.Horizontal, gap: Outline.GapVertical_2 }}>
      {
        reasonItems.map(({ icon, title, content }) => {
          return (
            <View style={{ flexDirection: 'row', gap: Outline.Horizontal }}>
              <Image source={icon} resizeMode='contain' style={{ width: wp('13%'), height: wp('13%') }} />
              <View style={{ justifyContent: 'center', gap: Outline.GapVertical }}>
                <Text style={{ fontSize: FontSize.Normal, fontWeight: FontWeight.Bold }}>{title}</Text>
                <Text>{content}</Text>
              </View>
            </View>)
        })
      }

    </ScrollView>
  )
}

export default IAPPage