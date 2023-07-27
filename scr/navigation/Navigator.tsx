import 'react-native-gesture-handler';
import React from 'react'
import { createDrawerNavigator } from '@react-navigation/drawer';
import { NavigationContainer } from '@react-navigation/native';
import MediaWithCopyrightScreen from '../screens/media_copyright/MediaWithCopyrightScreen';
import RealMediaScreen from '../screens/real_media/RealMediaScreen';
import { ScreenName } from '../constants/AppConstants';

export type DrawerParamList = {
  [ScreenName.Comic]: undefined,
  [ScreenName.RealMedia]: undefined,
}

const Drawer = createDrawerNavigator<DrawerParamList>();

const Navigator = () => {
  return (
  <NavigationContainer>
    <Drawer.Navigator initialRouteName={ScreenName.Comic}>
      <Drawer.Screen name={ScreenName.Comic} component={MediaWithCopyrightScreen} />
      <Drawer.Screen name={ScreenName.RealMedia} component={RealMediaScreen} />
    </Drawer.Navigator>
  </NavigationContainer>
  )
}

export default Navigator;