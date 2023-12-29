
// @ts-ignore
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import { useCallback, useContext, useMemo, useRef } from "react";
import { RootState, useAppDispatch, useAppSelector } from "../redux/Store";
import { ThemeContext, ThemeType, themes } from "../constants/Colors";
import { DrawerContentComponentProps, DrawerContentScrollView, } from '@react-navigation/drawer';
import { ImageBackground, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { setTheme } from "../redux/MiscSlice";
import DrawerCoupleItem from "./DrawerCoupleItem";
import { BorderRadius, FontSize, FontWeight, Outline, ScreenName, Size } from "../constants/AppConstants";
import { CommonStyles } from "../constants/CommonConstants";
import useDrawerMenuItemUtils from '../hooks/useDrawerMenuItemUtils';

const primiumBG = require('../../assets/images/btn_bg_1.jpeg')

export function CustomDrawerContent(props: DrawerContentComponentProps) {
  const themeValues = useRef(Object.keys(themes));
  const dispatch = useAppDispatch();
  const currentTheme = useAppSelector((state: RootState) => state.misc.themeType);
  const [_, onPressPremium] = useDrawerMenuItemUtils(ScreenName.IAPPage, props)

  const routeCoupleArr = useMemo(() => {
    const routes = props.state.routes.filter(r => r.name !== ScreenName.IAPPage)

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

  const renderCategoryButtons = useCallback(() => {
    return <DrawerContentScrollView {...props}>
      {
        routeCoupleArr.map((couple, idx) => {
          return <DrawerCoupleItem
            masterProps={props}
            couple={couple}
            key={idx} />
        })
      }
    </DrawerContentScrollView>
  }, [props])

  return (
    <View style={{ flex: 1 }}>
      {
        renderCategoryButtons()
      }
      <View style={[style.bottomMasterView]}>
        {/* premium btn */}
        <TouchableOpacity onPress={onPressPremium}>
          <ImageBackground resizeMode="cover" source={primiumBG} style={[style.premiumIB, CommonStyles.justifyContentCenter_AlignItemsCenter]}>
            <MaterialCommunityIcons name={'star'} color={'black'} size={Size.Icon} />
            <Text style={[style.premiumText]}>Donate / Support</Text>
          </ImageBackground>
        </TouchableOpacity>

        {/* theme setting */}
        <View style={{ flexDirection: 'row', gap: 20 }}>
          <Text style={{ fontWeight: '500' }}>Theme</Text>
          {
            themeValues.current.map((theme, index) =>
              <TouchableOpacity
                onPress={() => dispatch(setTheme(theme as ThemeType))}
                key={index}
                style={{ borderWidth: currentTheme === theme ? 1 : 0, width: 20, height: 20, borderRadius: 10, backgroundColor: themes[theme as ThemeType].primary }} />)
          }
        </View>
      </View>
    </View>
  )
}

const style = StyleSheet.create({
  bottomMasterView: { marginLeft: Outline.Horizontal, marginBottom: Outline.Horizontal, gap: Outline.GapVertical_2 },
  premiumIB: { flexDirection: 'row', gap: Outline.GapHorizontal, padding: Outline.GapVertical_2, marginRight: Outline.Horizontal, borderRadius: BorderRadius.BR8, overflow: 'hidden', },
  premiumText: { color: 'black', fontSize: FontSize.Small_L, fontWeight: FontWeight.B500 },
})