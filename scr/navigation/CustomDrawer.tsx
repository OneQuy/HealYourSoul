import { useRef } from "react";
import { RootState, useAppDispatch, useAppSelector } from "../redux/Store";
import { ThemeType, themes } from "../constants/Colors";
import { DrawerContentComponentProps, DrawerContentScrollView, DrawerItemList, } from '@react-navigation/drawer';
import { FlatList, Text, TouchableOpacity, View } from "react-native";
import { setTheme } from "../redux/MiscSlice";
import { PickRandomElement } from "../handle/Utils";
import { ColorNameToRgb, RandomColor } from "../handle/UtilsTS";

export function CustomDrawerContent(props: DrawerContentComponentProps) {
  const themeValues = useRef(Object.keys(themes));
  const dispatch = useAppDispatch();
  const currentTheme = useAppSelector((state: RootState) => state.misc.themeType);

  const arr = new Array(10).fill(undefined).map(i => Math.random())

  return (
    <View style={{ flex: 1 }}>
      <DrawerContentScrollView {...props}>
        {
          arr.map((num) => {
            return (
              <View style={{ backgroundColor: RandomColor(), height: 50, width: '100%' }}>

              </View>
            )
          })
        }
      </DrawerContentScrollView>
      <View style={{ marginLeft: 20, marginBottom: 20 }}>
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