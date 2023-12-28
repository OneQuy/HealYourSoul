import { useMemo, useRef } from "react";
import { RootState, useAppDispatch, useAppSelector } from "../redux/Store";
import { ThemeType, themes } from "../constants/Colors";
import { DrawerContentComponentProps, DrawerContentScrollView, } from '@react-navigation/drawer';
import { Text, TouchableOpacity, View } from "react-native";
import { setTheme } from "../redux/MiscSlice";
import DrawerCoupleItem from "./DrawerCoupleItem";

export function CustomDrawerContent(props: DrawerContentComponentProps) {
  const themeValues = useRef(Object.keys(themes));
  const dispatch = useAppDispatch();
  const currentTheme = useAppSelector((state: RootState) => state.misc.themeType);

  const routeCoupleArr = useMemo(() => {
    const routes = props.state.routes

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

  return (
    <View style={{ flex: 1 }}>
      <DrawerContentScrollView {...props}>
        {
          routeCoupleArr.map((couple, idx) => {
            return <DrawerCoupleItem
              masterProps={props}
              couple={couple}
              key={idx} />
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