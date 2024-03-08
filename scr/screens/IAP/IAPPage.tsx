import { View, Text, ScrollView, Image, ImageBackground, Alert, StyleSheet, ActivityIndicator } from 'react-native'
import React, { useCallback, useContext, useState } from 'react'
import { BorderRadius, FontSize, FontWeight, LocalText, Outline, StorageKey_CachedIAP } from '../../constants/AppConstants'
import { widthPercentageToDP as wp } from "react-native-responsive-screen";
import { TouchableOpacity } from 'react-native-gesture-handler';
import { IAPProduct, PurchaseAsync } from '../../handle/IAP';
import { SafeDateString, ToCanPrintError } from '../../handle/UtilsTS';
import IAPPage_Subscribed from './IAPPage_Subscribed';
import { useAppDispatch } from '../../redux/Store';
import { setSubscribe } from '../../redux/UserDataSlice';
import { CreateUserInfoObjectAsync, GetExpiredDateAndDaysLeft, HandleError, todayString } from '../../handle/AppUtils';
import { track_SimpleWithParam } from '../../handle/tracking/GoodayTracking';
import { ThemeContext } from '../../constants/Colors';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { prefixFbTrackPath } from '../../handle/tracking/Tracking';
import { FirebaseDatabase_SetValueAsync } from '../../firebase/FirebaseDatabase';
import { usePremium } from '../../hooks/usePremium';
import { Cheat } from '../../handle/Cheat';
import { ResetNavigation } from '../../handle/GoodayAppState';
import { useMyIAP } from '../../hooks/useMyIAP';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const iapBg_1 = require('../../../assets/images/btn_bg_1.jpeg')

const lifetimeProduct: IAPProduct = {
  sku: 'gooday_lifetime',
  isConsumable: true,
} as const

const subscriptions = [
  {
    month: 1,
    imgUrl: iapBg_1,
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
] as const

const allProducts: IAPProduct[] = [lifetimeProduct, ...subscriptions.map(i => i.product)] as const

const reasonItems = [
  {
    icon: require('../../../assets/images/premium_icon.png'),
    title: LocalText.unlock_all,
    content: LocalText.unlock_all_info
  },

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
  const dispatch = useAppDispatch();
  const [processingId, setProcessingId] = useState('')
  const theme = useContext(ThemeContext)
  const insets = useSafeAreaInsets()
  const { isPremium, subscribedData } = usePremium()

  const { isInited, fetchedProducts } = useMyIAP(
    allProducts,
    async (s: string) => AsyncStorage.setItem(StorageKey_CachedIAP, s),
    async () => AsyncStorage.getItem(StorageKey_CachedIAP))

  const onPressed_Buy = async (id: string) => {
    track_SimpleWithParam('click_iap', id)
    setProcessingId(id)

    let res

    if (!__DEV__ || !Cheat('IAPSuccess')) // release mode
      res = await PurchaseAsync(id)
    else { // cheat
      res = undefined
    }

    // const res = undefined

    setProcessingId('')

    if (res === undefined) { // success
      // track count

      track_SimpleWithParam('iap_resulted', 'successssss_' + id)

      // track detail

      const pathFb = prefixFbTrackPath() + 'iap_success/' + todayString + '/' + Date.now()
      const trackText = JSON.stringify(await CreateUserInfoObjectAsync(id))
      FirebaseDatabase_SetValueAsync(pathFb, trackText)

      // dispatch

      dispatch(setSubscribe(id))

      Alert.alert(LocalText.you_are_awesome, LocalText.thank_iap)

      if (id === lifetimeProduct.sku) { // lifetimed
        ResetNavigation()
      }
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

  const renderLifetimeButton = useCallback(() => {
    const sku = lifetimeProduct.sku
    const productFetched = fetchedProducts.find(i => i.productId === sku)
    const price = productFetched ? productFetched.localizedPrice : '$ 29.99'

    return (
      <View key={sku} style={{ gap: Outline.VerticalMini }}>
        <TouchableOpacity onPress={() => onPressed_Buy(sku)} style={{ borderRadius: BorderRadius.BR, overflow: 'hidden' }}>
          <View
            style={{ borderRadius: BorderRadius.BR, borderWidth: Outline.GapHorizontal / 2, borderColor: theme.primary, alignItems: 'center', padding: Outline.GapVertical_2, justifyContent: 'center', }}>
            <Text adjustsFontSizeToFit numberOfLines={1} style={{ textAlign: 'center', color: theme.primary, fontSize: FontSize.Normal, fontWeight: FontWeight.B600 }}>{LocalText.lifetime}</Text>
            <Text adjustsFontSizeToFit numberOfLines={1} style={{ textAlign: 'center', color: theme.primary, fontSize: FontSize.Normal, fontWeight: FontWeight.B600 }}>{LocalText.lifetime_desc}</Text>
            <Text style={{ color: theme.primary, fontSize: FontSize.Normal, }}>{price}{processingId === sku ? '  ' : ''}{processingId === sku ? <ActivityIndicator color={theme.counterBackground} size={'small'} /> : undefined}</Text>
          </View>
        </TouchableOpacity>
        <Text selectable style={{ color: theme.counterBackground, fontSize: FontSize.Small, }}>{LocalText.lifetime_desc_2}</Text>
      </View>)
  }, [theme, fetchedProducts, processingId])

  if (isPremium && subscribedData) {
    return <IAPPage_Subscribed subscribedData={subscribedData} />
  }

  if (!isInited) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', gap: Outline.GapHorizontal, }}>
        <ActivityIndicator color={theme.primary} />
      </View>
    )
  }

  return (
    <ScrollView contentContainerStyle={{ backgroundColor: theme.background, padding: Outline.Horizontal, paddingBottom: insets.bottom + Outline.VerticalMini, gap: Outline.GapVertical_2 }}>
      <Text selectable style={{ color: theme.counterBackground, fontSize: FontSize.Small_L, }}>{LocalText.premium_benefit}</Text>

      {/* reasons */}

      {
        reasonItems.map(({ icon, title, content }) => {
          return (
            <View key={title} style={{ flexDirection: 'row', gap: Outline.Horizontal }}>
              <Image source={icon} resizeMode='contain' style={{ width: wp('13%'), height: wp('13%') }} />
              <View style={{ flex: 1, justifyContent: 'center', gap: Outline.GapHorizontal }}>
                <Text selectable style={{ color: theme.counterBackground, fontSize: FontSize.Normal, fontWeight: FontWeight.B500 }}>{title}</Text>
                <Text selectable style={{ color: theme.counterBackground, fontSize: FontSize.Small, }}>{content}</Text>
              </View>
            </View>)
        })
      }

      <View style={{ backgroundColor: theme.counterBackground, width: '100%', height: StyleSheet.hairlineWidth }} />

      {/* lifetime */}

      <Text selectable style={{ color: theme.counterBackground, fontSize: FontSize.Small_L, }}>{LocalText.one_time_purchase}:</Text>

      {
        renderLifetimeButton()
      }

      <View style={{ backgroundColor: theme.counterBackground, width: '100%', height: StyleSheet.hairlineWidth }} />

      {/* btns month */}

      <Text selectable style={{ color: theme.counterBackground, fontSize: FontSize.Small_L, }}>{LocalText.subscriptions}:</Text>

      {
        subscriptions.map(({ month, imgUrl, product }) => {
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

      <Text selectable numberOfLines={1} adjustsFontSizeToFit style={{ color: theme.counterBackground, fontSize: FontSize.Small_L, }}>{LocalText.thank_you_premium}</Text>
    </ScrollView>
  )
}

export default IAPPage