import 'react-native-gesture-handler';
import React from 'react'
import { createDrawerNavigator } from '@react-navigation/drawer';
import { NavigationContainer } from '@react-navigation/native';
import { ScreenName } from '../constants/AppConstants';
import ComicScreen from '../screens/comic/ComicScreen';
import RealScreen from '../screens/real/RealScreen';

export type DrawerParamList = {
  [ScreenName.Comic]: undefined,
  [ScreenName.RealMedia]: undefined,
}

const Drawer = createDrawerNavigator<DrawerParamList>();

const Navigator = () => {
  return (
  <NavigationContainer>
    <Drawer.Navigator initialRouteName={ScreenName.Comic}>
      <Drawer.Screen name={ScreenName.Comic} component={ComicScreen} />
      <Drawer.Screen name={ScreenName.RealMedia} component={RealScreen} />
    </Drawer.Navigator>
  </NavigationContainer>
  )
}

export default Navigator;