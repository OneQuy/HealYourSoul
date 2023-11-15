import 'react-native-gesture-handler';
import React, { useRef } from 'react'
import { Text, TouchableOpacity, View } from 'react-native'
import { createDrawerNavigator, DrawerContentComponentProps, DrawerContentScrollView, DrawerItemList, } from '@react-navigation/drawer';
import { NavigationContainer } from '@react-navigation/native';
import { ScreenName } from '../constants/AppConstants';
import ComicScreen from '../screens/comic/ComicScreen';
import MemeScreen from '../screens/meme/MemeScreen';
import QuoteScreen from '../screens/quote/QuoteScreen';
import { ThemeType, themes } from '../constants/Colors';
import { RootState, useAppDispatch, useAppSelector } from '../redux/Store';
import { setTheme } from '../redux/MiscSlice';
import CatDogScreen from '../screens/catdog/CatDogScreen';
import SatisfyingScreen from '../screens/satisfying/SatisfyingScreen';
import LoveScreen from '../screens/love/LoveScreen';
import NSFWScreen from '../screens/nsfw/NSFWScreen';

export type DrawerParamList = {
  [ScreenName.Comic]: undefined,
  [ScreenName.Meme]: undefined,
  [ScreenName.Quote]: undefined,
  [ScreenName.CatDog]: undefined,
  [ScreenName.Love]: undefined,
  [ScreenName.Satisfying]: undefined,
  [ScreenName.NSFW]: undefined,
}

type MainNavigatorProps = {
  initialRouteName: keyof DrawerParamList | null
}

const Drawer = createDrawerNavigator<DrawerParamList>();

const Navigator = ({ initialRouteName }: MainNavigatorProps) => {
  return (
    <NavigationContainer>
      <Drawer.Navigator
        initialRouteName={!initialRouteName ? ScreenName.Comic : initialRouteName}
        drawerContent={(props) => <CustomDrawerContent {...props} />}
      >
        <Drawer.Screen name={ScreenName.Meme} component={MemeScreen} />
        <Drawer.Screen name={ScreenName.Comic} component={ComicScreen} />
        <Drawer.Screen name={ScreenName.CatDog} component={CatDogScreen} />
        {/* <Drawer.Screen name={ScreenName.NSFW} component={NSFWScreen} /> */}
        <Drawer.Screen name={ScreenName.Quote} component={QuoteScreen} />
        <Drawer.Screen name={ScreenName.Satisfying} component={SatisfyingScreen} />
        <Drawer.Screen name={ScreenName.Love} component={LoveScreen} />
      </Drawer.Navigator>
    </NavigationContainer>
  )
}

function CustomDrawerContent(props: DrawerContentComponentProps) {
  const themeValues = useRef(Object.keys(themes));
  const dispatch = useAppDispatch();
  const currentTheme = useAppSelector((state: RootState) => state.misc.themeType);

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
            themeValues.current.map((theme, index) => 
              <TouchableOpacity 
              onPress={() => dispatch(setTheme(theme as ThemeType))} 
              key={index} 
              style={{borderWidth: currentTheme === theme ? 1 : 0, width: 20, height: 20, borderRadius: 10, backgroundColor: themes[theme as ThemeType].primary }} />)
          }
        </View>
      </View>
    </View>
  );
}

export default Navigator;