import 'react-native-gesture-handler';
import React from 'react'
import { Text, ScrollView, TouchableOpacity, View } from 'react-native'
import { createDrawerNavigator, DrawerContentComponentProps, DrawerContentScrollView, DrawerItem, DrawerItemList, } from '@react-navigation/drawer';
import { NavigationContainer } from '@react-navigation/native';
import { ScreenName } from '../constants/AppConstants';
import ComicScreen from '../screens/comic/ComicScreen';
import RealScreen from '../screens/real/RealScreen';
import QuoteScreen from '../screens/quote/QuoteScreen';
import { ThemeType, themes } from '../constants/Colors';
import { useAppDispatch } from '../redux/Store';
import { setTheme } from '../redux/MiscSlice';

export type DrawerParamList = {
  [ScreenName.Comic]: undefined,
  [ScreenName.RealMedia]: undefined,
  [ScreenName.Quote]: undefined,
}

const Drawer = createDrawerNavigator<DrawerParamList>();

const Navigator = () => {
  return (
    <NavigationContainer>
      <Drawer.Navigator
        initialRouteName={ScreenName.Comic}
        drawerContent={(props) => <CustomDrawerContent {...props} />}
      >
        <Drawer.Screen name={ScreenName.Comic} component={ComicScreen} />
        <Drawer.Screen name={ScreenName.RealMedia} component={RealScreen} />
        <Drawer.Screen name={ScreenName.Quote} component={QuoteScreen} />
      </Drawer.Navigator>
    </NavigationContainer>
  )
}

function CustomDrawerContent(props: DrawerContentComponentProps) {
  const themeValues = Object.keys(themes);
  const dispatch = useAppDispatch();

  return (
    <View style={{ flex: 1 }}>
      <DrawerContentScrollView {...props}>
        <DrawerItemList {...props} />
      </DrawerContentScrollView>
      <View style={{marginLeft: 20, marginBottom: 20}}>
        {/* theme setting */}
        <View style={{ flexDirection: 'row', gap: 20 }}>
          <Text style={{fontWeight: '500'}}>Theme</Text>
          {
            themeValues.map((theme, index) => <TouchableOpacity onPress={() => dispatch(setTheme(theme as ThemeType))} key={index} style={{ width: 20, height: 20, borderRadius: 10, backgroundColor: themes[theme as ThemeType].primary }} />)
          }
        </View>
      </View>
    </View>
  );
}

export default Navigator;