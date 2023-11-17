import { View, Text, ScrollView, Image, ImageBackground } from 'react-native'
import React from 'react'
import { BorderRadius, FontSize, FontWeight, LocalText, Outline } from '../../constants/AppConstants'
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from "react-native-responsive-screen";
import { TouchableOpacity } from 'react-native-gesture-handler';

const ids = [
  {
    id: 'gooday_month_1',
    month: 1,
    bg: require('../../../assets/images/btn_bg_1.jpeg')
  },
  {
    id: 'gooday_month_6',
    month: 6,
    bg: require('../../../assets/images/btn_bg_3.jpeg')
  },
  {
    id: 'gooday_month_12',
    month: 12,
    bg: require('../../../assets/images/btn_bg_2.jpeg')
  },
]

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
    <ScrollView contentContainerStyle={{ backgroundColor: 'white', padding: Outline.Horizontal, gap: Outline.GapVertical_2 }}>
      <Text style={{ color: 'black', fontSize: FontSize.Normal, }}>{LocalText.premium_benefit}</Text>
      {
        reasonItems.map(({ icon, title, content }) => {
          return (
            <View key={title} style={{ flexDirection: 'row', gap: Outline.Horizontal }}>
              <Image source={icon} resizeMode='contain' style={{ width: wp('13%'), height: wp('13%') }} />
              <View style={{ flex: 1, justifyContent: 'center', gap: Outline.GapVertical }}>
                <Text style={{ color: 'black', fontSize: FontSize.Normal, fontWeight: FontWeight.B600 }}>{title}</Text>
                <Text style={{ color: 'black', fontSize: FontSize.Small_L, }}>{content}</Text>
              </View>
            </View>)
        })
      }
      <Text style={{ marginTop: Outline.GapVertical_2, color: 'black', fontSize: FontSize.Normal, }}>{LocalText.select_premium}</Text>
      {
        ids.map(({ id, month, bg }) => {
          const date = new Date(Date.now() + month * 31 * 24 * 3600 * 1000)
          
          return (
            <View key={id} style={{ gap: Outline.VerticalMini }}>
              <TouchableOpacity style={{ borderRadius: BorderRadius.BR, overflow: 'hidden' }}>
                <ImageBackground source={bg} style={{ alignItems: 'center', padding: Outline.GapVertical_2, justifyContent: 'center', }}>
                  <Text style={{ color: 'white', fontSize: FontSize.Normal, fontWeight: FontWeight.B600 }}>{month} month{month > 1 ? 's' : ''}</Text>
                  <Text style={{ color: 'white', fontSize: FontSize.Normal }}>$0.99</Text>
                </ImageBackground>
              </TouchableOpacity>
              <Text style={{ color: 'black', fontSize: FontSize.Small_L, }}>Subscribe for {month} months. From today to {date.toLocaleDateString()}</Text>
            </View>)
        })
      }
      <Text style={{ color: 'black', fontSize: FontSize.Normal, }}>{LocalText.thank_you_premium}</Text>
    </ScrollView>
  )
}

export default IAPPage