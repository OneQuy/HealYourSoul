import { View, Text, ScrollView, Image, ImageBackground, Alert, StyleSheet, ActivityIndicator } from 'react-native'
import React, { useCallback, useContext, useEffect, useState } from 'react'
import { BorderRadius, FontSize, FontWeight, LocalText, Outline } from '../../constants/AppConstants'
import { widthPercentageToDP as wp } from "react-native-responsive-screen";
import { TouchableOpacity } from 'react-native-gesture-handler';
import { FetchListroductsAsync, IAPProduct, InitIAPAsync, PurchaseAsync } from '../../handle/IAP';
import { SafeDateString, ToCanPrintError } from '../../handle/UtilsTS';
import { Product } from 'react-native-iap';
import { IsInternetAvailableAsync } from '../../handle/NetLord';
import IAPPage_Subscribed from './IAPPage_Subscribed';
import { RootState, useAppDispatch, useAppSelector } from '../../redux/Store';
import { setSubscribe } from '../../redux/UserDataSlice';
import { GetExpiredDateAndDaysLeft, HandleError } from '../../handle/AppUtils';
import { track_SimpleWithParam } from '../../handle/tracking/GoodayTracking';
import { ThemeContext } from '../../constants/Colors';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

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
  // {
  //   icon: require('../../../assets/images/ad-free-icon.png'),
  //   title: LocalText.ad_free,
  //   content: LocalText.no_ad_anymore
  // },

  {
    icon: require('../../../assets/images/love-icon.png'),
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
  const subscribedData = useAppSelector((state: RootState) => state.userData.subscribedData);
  const dispatch = useAppDispatch();
  const [processingId, setProcessingId] = useState('')
  const theme = useContext(ThemeContext)
  const insets = useSafeAreaInsets()

  const onPressed_Buy = async (id: string) => {
    track_SimpleWithParam('click_iap', id)
    setProcessingId(id)

    const res = await PurchaseAsync(id)
    // const res = undefined

    setProcessingId('')

    if (res === undefined) { // success
      track_SimpleWithParam('iap_resulted', 'successssss_' + id)

      dispatch(setSubscribe(id))

      Alert.alert(LocalText.you_are_awesome, LocalText.thank_iap)
    }
    else if (res === null) { // user cancelled
      track_SimpleWithParam('iap_resulted', 'canceled')
    }
    else { // fail
      track_SimpleWithParam('iap_resulted', 'failed')

      HandleError('IAP_Failed', res, true)

      Alert.alert(
        'Error',
        'An error occured when processing purchase. Please try again!\n' + id + '\n' + ToCanPrintError(res))
    }
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
    let resInitIAP: Awaited<ReturnType<typeof InitIAPAsync>> = undefined

    const hanldeAsync = async () => {
      if (subscribedData)
        return

      // init IAP

      resInitIAP = await InitIAPAsync(ids.map(i => i.product))

      if (resInitIAP === undefined) {
        console.error('IAP init fail')
        return
      }

      // fetch local price

      fetchLocalPriceAsync()
    }

    hanldeAsync()

    return () => {
      if (resInitIAP)
        resInitIAP()
    }
  }, [subscribedData])

  if (subscribedData) {
    return <IAPPage_Subscribed subscribedData={subscribedData} />
  }

  return (
    <ScrollView contentContainerStyle={{ backgroundColor: theme.background, padding: Outline.Horizontal, paddingBottom: insets.bottom + Outline.VerticalMini, gap: Outline.GapVertical_2 }}>
      <Text selectable style={{ color: theme.counterBackground, fontSize: FontSize.Small_L, }}>{LocalText.premium_benefit}</Text>
      {
        reasonItems.map(({ icon, title, content }) => {
          return (
            <View key={title} style={{ flexDirection: 'row', gap: Outline.Horizontal }}>
              <Image source={icon} resizeMode='contain' style={{ width: wp('13%'), height: wp('13%') }} />
              <View style={{ flex: 1, justifyContent: 'center', gap: Outline.GapHorizontal }}>
                <Text selectable style={{ color: theme.counterBackground, fontSize: FontSize.Normal, fontWeight: FontWeight.B500 }}>{title}</Text>
                <Text selectable style={{ color: theme.counterBackground, fontSize: FontSize.Small_L, }}>{content}</Text>
              </View>
            </View>)
        })
      }
      {
        ids.map(({ month, imgUrl, product }) => {
          const { sku } = product
          const productFetched = fetchedProducts.find(i => i.productId === sku)
          const price = productFetched ? productFetched.localizedPrice : '...'
          const [expiredDate, _] = GetExpiredDateAndDaysLeft(Date.now(), month, true)

          return (
            <View key={sku} style={{ gap: Outline.VerticalMini }}>
              <TouchableOpacity onPress={() => onPressed_Buy(sku)} style={{ borderRadius: BorderRadius.BR, overflow: 'hidden' }}>
                <ImageBackground
                  resizeMode='cover'
                  source={imgUrl}
                  style={{ alignItems: 'center', padding: Outline.GapVertical_2, justifyContent: 'center', }}>
                  <Text style={{ color: 'black', fontSize: FontSize.Normal, fontWeight: FontWeight.B600 }}>{month} month{month > 1 ? 's' : ''}</Text>
                  <Text style={{ color: 'black', fontSize: FontSize.Normal }}>{price}{processingId === sku ? '  ' : ''}{processingId === sku ? <ActivityIndicator color={theme.counterBackground} size={'small'} /> : undefined}</Text>
                </ImageBackground>
              </TouchableOpacity>
              <Text selectable style={{ color: theme.counterBackground, fontSize: FontSize.Small, }}>{LocalText.subscribe_for} {month}-month ({LocalText.today} {'->'} {SafeDateString(expiredDate, '/')})</Text>
            </View>)
        })
      }
      <View style={{ backgroundColor: theme.counterBackground, width: '100%', height: StyleSheet.hairlineWidth }} />
      <Text selectable style={{ color: theme.counterBackground, fontSize: FontSize.Small_L, }}>{LocalText.warning_premium}</Text>
      <Text selectable style={{ color: theme.counterBackground, fontSize: FontSize.Small_L, }}>{LocalText.thank_you_premium}</Text>
    </ScrollView>
  )
}

export default IAPPage