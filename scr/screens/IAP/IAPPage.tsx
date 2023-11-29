import { View, Text, ScrollView, Image, ImageBackground, Alert, Platform } from 'react-native'
import React, { useCallback, useEffect, useState } from 'react'
import { BorderRadius, FontSize, FontWeight, LocalText, Outline } from '../../constants/AppConstants'
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from "react-native-responsive-screen";
import { TouchableOpacity } from 'react-native-gesture-handler';
import { GetIAPLocalPriceAsync, FetchListroductsAsync, IAPProduct, InitIAPAsync, PurchaseAsync } from '../../handle/IAP';
import { ToCanPrint, ToCanPrintError } from '../../handle/UtilsTS';
import { Product } from 'react-native-iap';
import { IsInternetAvailableAsync, NetLord } from '../../handle/NetLord';

const ids = [
  {
    month: 1,
    imgUrl: require('../../../assets/images/btn_bg_1.jpeg'),
    product: {
      sku: 'gooday_month_1',
      isConsumable: true,
    } as IAPProduct
  },
  {
    month: 6,
    imgUrl: require('../../../assets/images/btn_bg_2.jpeg'),
    product: {
      sku: 'gooday_month_6',
      isConsumable: true,
    } as IAPProduct
  },
  {
    month: 12,
    imgUrl: require('../../../assets/images/btn_bg_3.jpeg'),
    product: {
      sku: 'gooday_month_12',
      isConsumable: true,
    } as IAPProduct
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
  const [fetchedProducts, setFetchedProducts] = useState<Product[]>([])

  const onPressed_Buy = async (id: string) => {
    const res = await PurchaseAsync(id)

    Alert.alert(
      'Clicked package ID: ' + id,
      'Result:\n\n' + ToCanPrintError(res))
  }

  const fetchLocalPriceAsync = useCallback(async () => {
    const isInternet = await IsInternetAvailableAsync();
    let needRepeat = false
    
    if (isInternet) {
      const items = await FetchListroductsAsync(ids.map(i => i.product.sku))

      if (items.length > 0)
        setFetchedProducts(items)
      else
        needRepeat = true
    }
    else
      needRepeat = true

    if (needRepeat) {
      setTimeout(fetchLocalPriceAsync, 1000);
    }
  }, [])

  useEffect(() => {
    let resInitIAP: Awaited<ReturnType<typeof InitIAPAsync>>

    const hanldeAsync = async () => {
      resInitIAP = await InitIAPAsync(
        ids.map(i => i.product),
        (id) => { },
        (error) => { })

      if (resInitIAP === undefined) {
        console.error('IAP init fail')
        return
      }

      fetchLocalPriceAsync()
    }

    hanldeAsync()

    return () => {
      if (resInitIAP)
        resInitIAP()
    }
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
        ids.map(({ month, imgUrl, product }) => {
          const date = new Date(Date.now() + month * 31 * 24 * 3600 * 1000)
          const { sku } = product
          const productFetched = fetchedProducts.find(i => i.productId === sku)
          const price = productFetched ? productFetched.localizedPrice : '...'

          return (
            <View key={sku} style={{ gap: Outline.VerticalMini }}>
              <TouchableOpacity onPress={() => onPressed_Buy(sku)} style={{ borderRadius: BorderRadius.BR, overflow: 'hidden' }}>
                <ImageBackground
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