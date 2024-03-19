// @ts-ignore
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

// @ts-ignore
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import { useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { RootState, useAppDispatch, useAppSelector } from "../redux/Store";
import { ThemeContext } from "../constants/Colors";
import { DrawerContentComponentProps, useDrawerStatus, } from '@react-navigation/drawer';
import { Image, ImageBackground, Linking, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import DrawerCoupleItem from "./DrawerCoupleItem";
import { BorderRadius, FontSize, FontWeight, Icon, LocalText, Outline, ScreenName, Size, StorageKey_ForceDev, StorageKey_PremiumBgID } from "../constants/AppConstants";
import { CommonStyles } from "../constants/CommonConstants";
import useDrawerMenuItemUtils from '../hooks/useDrawerMenuItemUtils';
import { logoScr } from '../screens/others/SplashScreen';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { IsContentScreen, OpenStore, RateApp, ShareApp, versionAsNumber } from '../handle/AppUtils';
import { GetAppConfig } from '../handle/AppConfigHandler';
import { FilterOnlyLetterAndNumberFromString, RegexUrl } from '../handle/UtilsTS';
import { track_PressDrawerItem } from '../handle/tracking/GoodayTracking';
import { GetNumberIntAsync, SetBooleanAsync, SetNumberAsync } from '../handle/AsyncStorageUtils';
import { toast } from '@baronha/ting';
import { IsDev } from '../handle/IsDev';
import { heightPercentageToDP } from 'react-native-responsive-screen';
import { useNavigation } from '@react-navigation/native';
import { GoToScreen, setNavigation } from '../handle/GoodayAppState';
import { usePremium } from '../hooks/usePremium';
import InboxButton, { GetInboxButtonGlobalStatus } from '../screens/inbox/InboxButton';
import { toggleMinialDrawer } from '../redux/UserDataSlice';

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

export function CustomDrawerContent(props: DrawerContentComponentProps) {
  const pressLogoCountRef = useRef(0)
  const [_, onPressPremium] = useDrawerMenuItemUtils(ScreenName.IAPPage, props)

  const [isFocusSetting, onPressSetting] = useDrawerMenuItemUtils(ScreenName.Setting, props)
  const [isFocusSaved, onPressSaved] = useDrawerMenuItemUtils(ScreenName.Saved, props)
  const [isFocusUpload, onPressUpload] = useDrawerMenuItemUtils(ScreenName.Upload, props)

  const safeAreaInsets = useSafeAreaInsets()
  const theme = useContext(ThemeContext);
  const disableScreens = useAppSelector((state: RootState) => state.userData.disableScreens)
  const minimalDrawer = useAppSelector((state) => state.userData.minimalDrawer === true)
  const [premiumBg, setPremiumBg] = useState<[NodeRequire, string]>([premiumBGs[0][0], 'black'])
  const [catItemHeight, setCatItemHeight] = useState(Math.max(50, heightPercentageToDP(7.5)))
  const [showRateAppOrShare, setShowRateAppOrShare] = useState(true)
  const isDrawerOpen = useDrawerStatus()
  const navigation = useNavigation()
  const { isPremium, isLifetimed } = usePremium()
  const dispatch = useAppDispatch()

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

  const onPressVersionText = useCallback(() => {
    if (IsDev()) {
      GoToScreen(ScreenName.Admin)
    }
    else
      OpenStore()
  }, [])

  const onPressMinimalDrawer = useCallback(() => {
    dispatch(toggleMinialDrawer())
  }, [])

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
    return <ScrollView contentContainerStyle={{ paddingBottom: Outline.GapVertical_2, }} showsVerticalScrollIndicator={false}>
      {
        routeCoupleArr.map((couple, idx) => {
          return <DrawerCoupleItem
            masterProps={props}
            couple={couple}
            height={catItemHeight}
            setHeight={setCatItemHeight}
            key={idx} />
        })
      }
    </ScrollView>
  }, [props, catItemHeight])

  const onPressPremiumButton = useCallback(() => {
    track_PressDrawerItem(FilterOnlyLetterAndNumberFromString(ScreenName.IAPPage))
    onPressPremium()
  }, [onPressPremium])

  const onPressSavedButton = useCallback(() => {
    track_PressDrawerItem(FilterOnlyLetterAndNumberFromString(ScreenName.Saved))
    onPressSaved()
  }, [onPressSaved])

  const onPressUploadButton = useCallback(() => {
    track_PressDrawerItem(FilterOnlyLetterAndNumberFromString(ScreenName.Upload))
    onPressUpload()
  }, [onPressUpload])

  const onPressSettingButton = useCallback(() => {
    track_PressDrawerItem(FilterOnlyLetterAndNumberFromString(ScreenName.Setting))
    onPressSetting()
  }, [onPressSetting])

  useEffect(() => {
    if (isDrawerOpen === 'open')
      setShowRateAppOrShare(val => !val)
  }, [isDrawerOpen])

  // init once

  useEffect(() => {
    changePremiumBtnBg()
    setNavigation(navigation)
  }, [])

  const colorSettingText = !isFocusSetting ? theme.background : theme.primary
  const colorSavedText = !isFocusSaved ? theme.background : theme.primary
  const colorUploadText = !isFocusUpload ? theme.background : theme.primary

  return (
    <View style={{ flex: 1, backgroundColor: theme.background }}>
      {/* inbox && logo & app name */}

      <View style={[style.topMasterView, CommonStyles.justifyContentCenter_AlignItemsCenter, { marginTop: safeAreaInsets.top }]}>
        {/* align with inbox btn */}

        {
          GetInboxButtonGlobalStatus() !== 'hide' &&
          <View style={{ width: Size.IconSmaller, height: Size.IconSmaller, }} />
        }

        {/* app name & logo */}

        <View style={[CommonStyles.justifyContentCenter_AlignItemsCenter, { gap: Outline.GapVertical, flex: 1, flexDirection: 'row', }]}>
          <Image source={logoScr} resizeMode='contain' style={[style.logoImg]} />
          <Text onPress={onPressLogo} style={[style.appNameText, { color: theme.counterBackground }]}>Gooday{IsDev() ? '.' : ''}</Text>
        </View>

        {/* inbox button */}

        <InboxButton />
      </View>

      {/* cat buttons */}

      {
        renderCategoryButtons()
      }

      {/* bottom buttons */}

      <View style={[style.bottomMasterView, { backgroundColor: theme.primary }]}>
        {/* minimal button */}
        <View style={style.settingContainer}>
          <View style={style.minimalBtnView}>
            <TouchableOpacity activeOpacity={0.9} onPress={onPressMinimalDrawer} style={[style.minimalTO, { backgroundColor: theme.primary, }]}>
              <View style={style.minimalArrowView}>
                <MaterialCommunityIcons name={minimalDrawer ? Icon.Up : Icon.Down} color={colorSavedText} size={Size.IconSmaller} />
              </View>
            </TouchableOpacity>
          </View>
        </View>

        {/* premium btn */}

        {
          !isLifetimed &&
          <TouchableOpacity onPress={onPressPremiumButton}>
            {/* @ts-ignore */}
            <ImageBackground resizeMode="cover" source={premiumBg[0]} style={[style.premiumIB, { paddingVertical: minimalDrawer ? Outline.GapHorizontal : Outline.Horizontal, }, CommonStyles.justifyContentCenter_AlignItemsCenter]}>
              <MaterialCommunityIcons name={Icon.Coffee} color={premiumBg[1]} size={Size.Icon} />
              <Text numberOfLines={1} adjustsFontSizeToFit style={[style.premiumText, { color: premiumBg[1] }]}>{isPremium ? LocalText.you_vip : LocalText.donate_me}</Text>
            </ImageBackground>
          </TouchableOpacity>
        }

        {/* saved button, upload */}
        {
          !minimalDrawer &&
          <View style={style.settingContainer}>
            {/* saved */}
            <TouchableOpacity onPress={onPressSavedButton} style={[style.settingBtnView, CommonStyles.flex1_justifyContentCenter_AlignItemsCenter, { borderColor: theme.background, backgroundColor: isFocusSaved ? theme.background : theme.primary }]}>
              <MaterialIcons name={Icon.Bookmark} color={colorSavedText} size={Size.IconTiny} />
              <Text style={[{ color: colorSavedText }]}>{LocalText.saved_2}</Text>
            </TouchableOpacity>

            {/* upload */}
            <TouchableOpacity onPress={onPressUploadButton} style={[style.settingBtnView, CommonStyles.flex1_justifyContentCenter_AlignItemsCenter, { borderColor: theme.background, backgroundColor: isFocusUpload ? theme.background : theme.primary }]}>
              <MaterialIcons name={Icon.Upload} color={colorUploadText} size={Size.IconTiny} />
              <Text style={[{ color: colorUploadText }]}>{LocalText.upload}</Text>
            </TouchableOpacity>
          </View>
        }

        {/* setting & rating */}
        {
          !minimalDrawer &&
          <View style={style.settingContainer}>
            {/* setting */}
            <TouchableOpacity onPress={onPressSettingButton} style={[style.settingBtnView, CommonStyles.flex1_justifyContentCenter_AlignItemsCenter, { borderColor: theme.background, backgroundColor: isFocusSetting ? theme.background : theme.primary }]}>
              <MaterialIcons name={Icon.Setting} color={colorSettingText} size={Size.IconTiny} />
              <Text style={[{ color: colorSettingText }]}>{LocalText.setting}</Text>
            </TouchableOpacity>
            {/* rate */}
            <TouchableOpacity onPress={showRateAppOrShare ? RateApp : ShareApp} style={[style.settingBtnView, { borderColor: theme.background }, CommonStyles.flex1_justifyContentCenter_AlignItemsCenter]}>
              <MaterialIcons name={showRateAppOrShare ? Icon.Star : Icon.ShareText} color={theme.background} size={Size.IconTiny} />
              <Text style={[{ color: theme.background }]}>{showRateAppOrShare ? LocalText.rate_me : LocalText.share_app_2}</Text>
            </TouchableOpacity>
          </View>
        }

        {/* version */}
        {
          (!minimalDrawer || showUpdateBtn) &&
          <View onTouchEnd={onPressVersionText} style={style.versionContainerView}>
            {/* version text */}
            <Text style={{ color: theme.background, }}>Version: v{versionAsNumber}{!showUpdateBtn ? ` (${LocalText.latest})` : ''}</Text>
            {/* update btn */}
            {
              showUpdateBtn &&
              <View style={[style.versionBtnView, { backgroundColor: theme.background, }]}>
                <Text style={[style.updateBtnTxt, { color: theme.counterBackground, }]}>{LocalText.update}</Text>
              </View>
            }
          </View>
        }

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
  topMasterView: { marginHorizontal: Outline.GapVertical, flexDirection: 'row', marginBottom: Outline.GapVertical, },
  logoImg: { width: Size.IconBig, height: Size.IconBig },
  appNameText: { fontSize: FontSize.Normal, fontWeight: FontWeight.Bold },
  bottomMasterView: { borderTopRightRadius: BorderRadius.BR, borderTopLeftRadius: BorderRadius.BR, paddingTop: Outline.GapHorizontal, paddingBottom: Outline.Horizontal, gap: Outline.GapVertical },
  premiumIB: { marginLeft: Outline.Horizontal, flexDirection: 'row', gap: Outline.GapHorizontal, paddingHorizontal: Outline.Horizontal, marginRight: Outline.Horizontal, borderRadius: BorderRadius.BR, overflow: 'hidden', },
  premiumText: { color: 'white', fontSize: FontSize.Small_L, fontWeight: FontWeight.B500 },
  versionContainerView: { marginLeft: Outline.Horizontal, flexDirection: 'row', alignItems: 'center' },
  versionBtnView: { marginLeft: Outline.GapVertical, borderRadius: BorderRadius.BR8, padding: Outline.VerticalMini },
  updateBtnTxt: { fontWeight: FontWeight.B500 },
  settingBtnView: { padding: Outline.VerticalMini, borderWidth: StyleSheet.hairlineWidth, borderRadius: BorderRadius.BR8, flexDirection: 'row', gap: Outline.GapHorizontal },
  settingContainer: { marginLeft: Outline.Horizontal, flexDirection: 'row', gap: Outline.GapHorizontal, marginRight: Outline.Horizontal },

  minimalBtnView: { top: -Outline.Horizontal, width: '100%', position: 'absolute', alignItems: 'center', justifyContent: 'center' },
  minimalTO: { aspectRatio: 2, padding: Outline.VerticalMini, borderRadius: BorderRadius.BR, alignItems: 'center', justifyContent: 'center' },
  minimalArrowView: { top: -Outline.VerticalMini },
})