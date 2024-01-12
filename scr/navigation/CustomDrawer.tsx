
// @ts-ignore
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import { useCallback, useContext, useMemo, useRef } from "react";
import { RootState, useAppDispatch, useAppSelector } from "../redux/Store";
import { ThemeContext, ThemeType, themes } from "../constants/Colors";
import { DrawerContentComponentProps, } from '@react-navigation/drawer';
import { Image, ImageBackground, Linking, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { setTheme } from "../redux/MiscSlice";
import DrawerCoupleItem from "./DrawerCoupleItem";
import { BorderRadius, FontSize, FontWeight, LocalText, Outline, ScreenName, Size, StorageKey_ForceDev } from "../constants/AppConstants";
import { CommonStyles } from "../constants/CommonConstants";
import useDrawerMenuItemUtils from '../hooks/useDrawerMenuItemUtils';
import { logoScr } from '../screens/others/SplashScreen';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { OpenStore, versionAsNumber, versionText } from '../handle/AppUtils';
import { GetAppConfig } from '../handle/AppConfigHandler';
import { FilterOnlyLetterAndNumberFromString, RegexUrl } from '../handle/UtilsTS';
import { track_PressDrawerItem } from '../handle/tracking/GoodayTracking';
import { SetBooleanAsync } from '../handle/AsyncStorageUtils';
import { toast } from '@baronha/ting';
import { IsDev } from '../handle/tracking/Tracking';

const primiumBG = require('../../assets/images/btn_bg_1.jpeg')

export function CustomDrawerContent(props: DrawerContentComponentProps) {
  const themeValues = useRef(Object.keys(themes));
  const pressLogoCountRef = useRef(0)
  const dispatch = useAppDispatch();
  const currentTheme = useAppSelector((state: RootState) => state.misc.themeType);
  const [_, onPressPremium] = useDrawerMenuItemUtils(ScreenName.IAPPage, props)
  const safeAreaInsets = useSafeAreaInsets()
  const theme = useContext(ThemeContext);

  const [notice, onPressNotice, colorNotice] = useMemo(() => {
    const data = GetAppConfig()?.notice

    if (!data)
      return [undefined, undefined, undefined]

    const maxVersion = typeof data.max_version === 'number' ? data.max_version : 0

    if (versionAsNumber > maxVersion) {
      return [undefined, undefined, undefined]
    }

    if (!data.content || data.content.trim().length <= 0) {
      return [undefined, undefined, undefined]
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
      },
      data.color && data.color.length > 0 ? data.color : theme.text]
  }, [GetAppConfig()?.notice, theme])

  const showUpdateBtn = useMemo(() => {
    const data = GetAppConfig()?.latest_version

    if (!data)
      return false

    return versionAsNumber < data.version
  }, [GetAppConfig()?.latest_version])

  const routeCoupleArr = useMemo(() => {
    const routes = props.state.routes.filter(r =>
      r.name !== ScreenName.IAPPage)

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
  }, [])

  const onPressLogo = useCallback(() => {
    pressLogoCountRef.current++

    if (pressLogoCountRef.current < 20)
      return

    pressLogoCountRef.current = 0
    SetBooleanAsync(StorageKey_ForceDev, true)
    toast({ message: 'FORCE DEV' })
  }, [])
  const renderCategoryButtons = useCallback(() => {
    return <ScrollView>
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

  return (
    <View style={{ flex: 1 }}>
      {/* logo & app name */}
      <View onTouchEnd={IsDev() ? onPressLogo : undefined} style={[style.topMasterView, CommonStyles.justifyContentCenter_AlignItemsCenter, { marginTop: safeAreaInsets.top }]}>
        <Image source={logoScr} resizeMode='contain' style={[style.logoImg]} />
        <Text style={[style.appNameText, { color: theme.text }]}>Gooday</Text>
      </View>
      {
        renderCategoryButtons()
      }
      <View style={[style.bottomMasterView]}>
        {/* premium btn */}
        <TouchableOpacity onPress={onPressPremiumButton}>
          <ImageBackground resizeMode="cover" source={primiumBG} style={[style.premiumIB, CommonStyles.justifyContentCenter_AlignItemsCenter]}>
            <MaterialCommunityIcons name={'star'} color={'black'} size={Size.Icon} />
            <Text style={[style.premiumText]}>{LocalText.donate_me}</Text>
          </ImageBackground>
        </TouchableOpacity>

        {/* theme setting */}
        <View style={{ flexDirection: 'row', gap: 20 }}>
          <Text style={{ color: theme.text, }}>{LocalText.theme}</Text>
          {
            themeValues.current.map((theme, index) =>
              <TouchableOpacity
                onPress={() => dispatch(setTheme(theme as ThemeType))}
                key={index}
                style={{ borderWidth: currentTheme === theme ? 1 : 0, width: 20, height: 20, borderRadius: 10, backgroundColor: themes[theme as ThemeType].primary }} />)
          }
        </View>
        {/* version */}
        <View onTouchEnd={OpenStore} style={style.versionContainerView}>
          <Text style={{ color: theme.text, }}>Version: {versionText}</Text>
          {
            !showUpdateBtn ? undefined :
            <View style={[style.versionBtnView, {backgroundColor: theme.primary, }]}>
              <Text style={[style.versionText, { color: theme.text, }]}>{LocalText.update}</Text>
            </View>
          }
        </View>
        {/* notice */}
        {
          !notice ? undefined :
            <Text onPress={onPressNotice} style={{ color: colorNotice, }}>{notice}</Text>
        }
      </View>
    </View>
  )
}

const style = StyleSheet.create({
  topMasterView: { flexDirection: 'row', gap: Outline.GapVertical, marginBottom: Outline.GapVertical, },
  logoImg: { width: Size.IconBig, height: Size.IconBig },
  appNameText: { fontSize: FontSize.Normal, fontWeight: FontWeight.Bold },
  bottomMasterView: { marginLeft: Outline.Horizontal, marginVertical: Outline.Horizontal, gap: Outline.GapVertical_2 },
  premiumIB: { flexDirection: 'row', gap: Outline.GapHorizontal, padding: Outline.GapVertical_2, marginRight: Outline.Horizontal, borderRadius: BorderRadius.BR8, overflow: 'hidden', },
  premiumText: { color: 'black', fontSize: FontSize.Small_L, fontWeight: FontWeight.B500 },
  versionContainerView: { flexDirection: 'row', alignItems: 'center' },
  versionBtnView: { marginLeft: Outline.GapVertical, borderRadius: BorderRadius.BR8, padding: Outline.VerticalMini },
  versionText: { fontWeight: FontWeight.B500 },
})