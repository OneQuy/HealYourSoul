// @ts-ignore
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

// @ts-ignore
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import { useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { RootState, useAppSelector } from "../redux/Store";
import { ThemeContext } from "../constants/Colors";
import { DrawerContentComponentProps, } from '@react-navigation/drawer';
import { Image, ImageBackground, Linking, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import DrawerCoupleItem from "./DrawerCoupleItem";
import { BorderRadius, FontSize, FontWeight, Icon, LocalText, Outline, ScreenName, Size, StorageKey_ForceDev, StorageKey_PremiumBgID } from "../constants/AppConstants";
import { CommonStyles } from "../constants/CommonConstants";
import useDrawerMenuItemUtils from '../hooks/useDrawerMenuItemUtils';
import { logoScr } from '../screens/others/SplashScreen';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { IsContentScreen, OpenStore, RateApp, versionAsNumber } from '../handle/AppUtils';
import { GetAppConfig } from '../handle/AppConfigHandler';
import { FilterOnlyLetterAndNumberFromString, RegexUrl } from '../handle/UtilsTS';
import { track_PressDrawerItem } from '../handle/tracking/GoodayTracking';
import { GetNumberIntAsync, SetBooleanAsync, SetNumberAsync } from '../handle/AsyncStorageUtils';
import { toast } from '@baronha/ting';
import { IsDev } from '../handle/IsDev';

const premiumBGs = [
  [require(`../../assets/images/premium_btn/0.jpg`), '#1c1c1c'],
  [require(`../../assets/images/premium_btn/4.jpg`), 'white'],
  [require(`../../assets/images/premium_btn/5.jpg`), '#1c1c1c'],
  [require(`../../assets/images/premium_btn/3.jpg`), '#1c1c1c'], // 3
  [require(`../../assets/images/premium_btn/6.jpg`), '#1c1c1c'],
  [require(`../../assets/images/premium_btn/7.jpeg`), 'white'],
  [require(`../../assets/images/premium_btn/2.jpg`), 'white'], // 6
  [require(`../../assets/images/premium_btn/8.jpg`), '#1c1c1c'],
  [require(`../../assets/images/premium_btn/1.jpg`), 'white'],
]

// const urlbg = 'https://images.unsplash.com/photo-1548268770-66184a21657e?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MzR8fHNreXxlbnwwfHwwfHx8MA%3D%3D'

export function CustomDrawerContent(props: DrawerContentComponentProps) {
  const pressLogoCountRef = useRef(0)
  const [_, onPressPremium] = useDrawerMenuItemUtils(ScreenName.IAPPage, props)
  const [isFocusSetting, onPressSetting] = useDrawerMenuItemUtils(ScreenName.Setting, props)
  const safeAreaInsets = useSafeAreaInsets()
  const theme = useContext(ThemeContext);
  const disableScreens = useAppSelector((state: RootState) => state.userData.disableScreens)
  const [premiumBg, setPremiumBg] = useState<[NodeRequire, string]>([premiumBGs[0][0], 'black'])

  const [notice, onPressNotice] = useMemo(() => {
    const data = GetAppConfig()?.notice

    if (!data)
      return [undefined, undefined]

    const maxVersion = typeof data.max_version === 'number' ? data.max_version : 0

    if (versionAsNumber > maxVersion) {
      return [undefined, undefined]
    }

    if (!data.content || data.content.trim().length <= 0) {
      return [undefined, undefined]
    }

    return [
      data.content,
      () => {
        if (data.is_press_to_open_store)
          OpenStore()
        else {
          if (RegexUrl(data.link))
            Linking.openURL(data.link)
        }
      }]
  }, [GetAppConfig()?.notice, theme])

  const changePremiumBtnBg = useCallback(async () => {
    let curId = await GetNumberIntAsync(StorageKey_PremiumBgID, -1)

    curId++

    if (curId >= premiumBGs.length)
      curId = 0

    const set = premiumBGs[curId]

    setPremiumBg([set[0], set[1]])

    SetNumberAsync(StorageKey_PremiumBgID, curId)

    // console.log(curId);
  }, [])

  const showUpdateBtn = useMemo(() => {
    const data = GetAppConfig()?.latest_version

    if (!data)
      return false

    if (Platform.OS === 'android')
      return versionAsNumber < data.android.version
    else
      return versionAsNumber < data.ios.version
  }, [GetAppConfig()?.latest_version])

  const routeCoupleArr = useMemo(() => {
    const routes = props.state.routes.filter(screen => {
      const name = screen.name as ScreenName

      return IsContentScreen(name) &&
        (!disableScreens || !disableScreens.includes(name))
    })

    const arr: (typeof routes[number])[][] = []

    for (let i = 0; i < routes.length; i += 2) {
      if (i < routes.length - 1)
        arr.push(routes.slice(i, i + 2))
      else {
        arr.push(routes.slice(i))
        break
      }
    }

    return arr
  }, [disableScreens])

  const onPressLogo = useCallback(() => {
    changePremiumBtnBg()

    if (!IsDev())
      return

    pressLogoCountRef.current++

    if (pressLogoCountRef.current < 20)
      return

    pressLogoCountRef.current = 0
    SetBooleanAsync(StorageKey_ForceDev, true)
    toast({ message: 'FORCE DEV' })
  }, [])

  const renderCategoryButtons = useCallback(() => {
    return <ScrollView contentContainerStyle={{ paddingBottom: Outline.GapHorizontal, }} showsVerticalScrollIndicator={false}>
      {
        routeCoupleArr.map((couple, idx) => {
          return <DrawerCoupleItem
            masterProps={props}
            couple={couple}
            key={idx} />
        })
      }
    </ScrollView>
  }, [props])

  const onPressPremiumButton = useCallback(() => {
    track_PressDrawerItem(FilterOnlyLetterAndNumberFromString(ScreenName.IAPPage))
    onPressPremium()
  }, [onPressPremium])

  const onPressSettingButton = useCallback(() => {
    track_PressDrawerItem(FilterOnlyLetterAndNumberFromString(ScreenName.Setting))
    onPressSetting()
  }, [onPressSetting])

  useEffect(() => {
    changePremiumBtnBg()
  }, [])

  const colorSettingText = !isFocusSetting ? theme.background : theme.primary

  return (
    <View style={{ flex: 1, backgroundColor: theme.background }}>
      {/* logo & app name */}
      <View onTouchEnd={onPressLogo} style={[style.topMasterView, CommonStyles.justifyContentCenter_AlignItemsCenter, { marginTop: safeAreaInsets.top }]}>
        <Image source={logoScr} resizeMode='contain' style={[style.logoImg]} />
        <Text style={[style.appNameText, { color: theme.counterBackground }]}>Gooday{IsDev() ? '.' : ''}</Text>
      </View>
      {
        renderCategoryButtons()
      }
      <View style={[style.bottomMasterView, { backgroundColor: theme.primary }]}>
        {/* premium btn */}
        <TouchableOpacity onPress={onPressPremiumButton}>
          {/* @ts-ignore */}
          <ImageBackground resizeMode="cover" source={premiumBg[0]} style={[style.premiumIB, CommonStyles.justifyContentCenter_AlignItemsCenter]}>
            {/* <ImageBackground resizeMode="cover" source={{ uri: urlbg }} style={[style.premiumIB, CommonStyles.justifyContentCenter_AlignItemsCenter]}> */}
            <MaterialCommunityIcons name={Icon.Coffee} color={premiumBg[1]} size={Size.Icon} />
            <Text numberOfLines={1} adjustsFontSizeToFit style={[style.premiumText, { color: premiumBg[1] }]}>{LocalText.donate_me}</Text>
          </ImageBackground>
        </TouchableOpacity>

        {/* setting & rating */}
        <View style={style.settingContainer}>
          {/* setting */}
          <TouchableOpacity onPress={onPressSettingButton} style={[style.settingBtnView, CommonStyles.flex1_justifyContentCenter_AlignItemsCenter, { borderColor: theme.background, backgroundColor: isFocusSetting ? theme.background : theme.primary }]}>
            <MaterialIcons name={Icon.Setting} color={colorSettingText} size={Size.IconTiny} />
            <Text style={[{ color: colorSettingText }]}>{LocalText.setting}</Text>
          </TouchableOpacity>
          {/* rate */}
          <TouchableOpacity onPress={RateApp} style={[style.settingBtnView, { borderColor: theme.background }, CommonStyles.flex1_justifyContentCenter_AlignItemsCenter]}>
            <MaterialIcons name={Icon.Star} color={theme.background} size={Size.IconTiny} />
            <Text style={[{ color: theme.background }]}>{LocalText.rate_me}</Text>
          </TouchableOpacity>
        </View>

        {/* theme */}

        {/* <ThemeScroll /> */}

        {/* version */}
        <View onTouchEnd={OpenStore} style={style.versionContainerView}>
          {/* version text */}
          <Text style={{ color: theme.background, }}>Version: v{versionAsNumber}</Text>
          {/* update btn */}
          {
            !showUpdateBtn ? undefined :
              // false ? undefined :
              <View style={[style.versionBtnView, { backgroundColor: theme.background, }]}>
                <Text style={[style.updateBtnTxt, { color: theme.counterBackground, }]}>{LocalText.update}</Text>
              </View>
          }
        </View>
        {/* notice */}
        {
          !notice ? undefined :
            // false ? undefined :
            <Text onPress={onPressNotice} adjustsFontSizeToFit numberOfLines={3} style={{ marginHorizontal: Outline.Horizontal, color: theme.counterPrimary, textAlign: 'center' }}>{notice}</Text>
        }
      </View>
    </View>
  )
}

const style = StyleSheet.create({
  topMasterView: { flexDirection: 'row', gap: Outline.GapVertical, marginBottom: Outline.GapVertical, },
  logoImg: { width: Size.IconBig, height: Size.IconBig },
  appNameText: { fontSize: FontSize.Normal, fontWeight: FontWeight.Bold },
  bottomMasterView: { borderTopRightRadius: BorderRadius.BR, borderTopLeftRadius: BorderRadius.BR, paddingVertical: Outline.Horizontal, gap: Outline.GapVertical },
  premiumIB: { marginLeft: Outline.Horizontal, flexDirection: 'row', gap: Outline.GapHorizontal, padding: Outline.GapVertical_2, paddingHorizontal: Outline.Horizontal, marginRight: Outline.Horizontal, borderRadius: BorderRadius.BR, overflow: 'hidden', },
  premiumText: { color: 'white', fontSize: FontSize.Small_L, fontWeight: FontWeight.B500 },
  versionContainerView: { marginLeft: Outline.Horizontal, flexDirection: 'row', alignItems: 'center' },
  versionBtnView: { marginLeft: Outline.GapVertical, borderRadius: BorderRadius.BR8, padding: Outline.VerticalMini },
  updateBtnTxt: { fontWeight: FontWeight.B500 },
  settingBtnView: { padding: Outline.VerticalMini, borderWidth: StyleSheet.hairlineWidth, borderRadius: BorderRadius.BR8, flexDirection: 'row', gap: Outline.GapHorizontal },
  settingContainer: { marginLeft: Outline.Horizontal, flexDirection: 'row', gap: Outline.GapHorizontal, marginRight: Outline.Horizontal },
})