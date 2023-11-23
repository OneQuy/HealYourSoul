import { View, Text, ScrollView, Image, ImageBackground, Alert, Platform } from 'react-native'
import React, { useEffect } from 'react'
import { BorderRadius, FontSize, FontWeight, LocalText, Outline } from '../../constants/AppConstants'
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from "react-native-responsive-screen";
import { TouchableOpacity } from 'react-native-gesture-handler';
import { InitIAP, PurchaseAsync } from '../../handle/IAP';
import { ToCanPrint } from '../../handle/UtilsTS';

const ids = [
  {
    id: 'gooday_month_1',
    month: 1,
    imgUrl: require('../../../assets/images/btn_bg_1.jpeg'),
    price: '$0.99',
  },
  {
    id: 'gooday_month_6',
    month: 6,
    imgUrl: require('../../../assets/images/btn_bg_2.jpeg'),
    price: '$5.99',
  },
  {
    id: 'gooday_month_12',
    month: 12,
    imgUrl: require('../../../assets/images/btn_bg_3.jpeg'),
    price: '$11.99',
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
  const onPressed_Buy = async (id: string) => {
    if (Platform.OS === 'android') {
      const res = await PurchaseAsync(id)

      Alert.alert(
        'Clicked package ID: ' + id,
        'Result:\n\n' + ToCanPrint(res))
    }
    else {
      Alert.alert(
        'Clicked package ID: ' + id,
        'After IAP review, buy popup will go here.')
    }
  }

  useEffect(() => {
    InitIAP()
  }, [])

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
        ids.map(({ id, month, imgUrl, price }) => {
          const date = new Date(Date.now() + month * 31 * 24 * 3600 * 1000)

          return (
            <View key={id} style={{ gap: Outline.VerticalMini }}>
              <TouchableOpacity onPress={() => onPressed_Buy(id)} style={{ borderRadius: BorderRadius.BR, overflow: 'hidden' }}>
                <ImageBackground
                  // source={bg} 
                  resizeMode='cover'
                  source={imgUrl}
                  style={{ alignItems: 'center', padding: Outline.GapVertical_2, justifyContent: 'center', }}>
                  <Text style={{ color: 'black', fontSize: FontSize.Normal, fontWeight: FontWeight.B600 }}>{month} month{month > 1 ? 's' : ''}</Text>
                  <Text style={{ color: 'black', fontSize: FontSize.Normal }}>{price}</Text>
                </ImageBackground>
              </TouchableOpacity>
              {/* <Text style={{ color: 'black', fontSize: FontSize.Small_L, }}>Subscribe for {month} months. From today to {date.toLocaleDateString()}</Text> */}
              <Text style={{ color: 'black', fontSize: FontSize.Small_L, }}>Subscribe for {month} months.</Text>
            </View>)
        })
      }
      <Text style={{ color: 'black', fontSize: FontSize.Normal, }}>{LocalText.thank_you_premium}</Text>
    </ScrollView>
  )
}

export default IAPPage