import { useRef } from "react";
import { RootState, useAppDispatch, useAppSelector } from "../redux/Store";
import { ThemeType, themes } from "../constants/Colors";
import { DrawerContentComponentProps, DrawerContentScrollView, DrawerItemList, } from '@react-navigation/drawer';
import { Text, TouchableOpacity, View } from "react-native";
import { setTheme } from "../redux/MiscSlice";

export function CustomDrawerContent(props: DrawerContentComponentProps) {
    const themeValues = useRef(Object.keys(themes));
    const dispatch = useAppDispatch();
    const currentTheme = useAppSelector((state: RootState) => state.misc.themeType);
  
    return (
      <View style={{ flex: 1 }}>
        <DrawerContentScrollView {...props}>
          <DrawerItemList {...props} />
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
    );
  }  