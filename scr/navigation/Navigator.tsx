import 'react-native-gesture-handler';
import React from 'react'
import { createDrawerNavigator } from '@react-navigation/drawer';
import { NavigationContainer } from '@react-navigation/native';
import MediaWithCopyrightScreen from '../screens/media_copyright/MediaWithCopyrightScreen';
import RealMediaScreen from '../screens/real_media/RealMediaScreen';
import { ScreenName } from '../app_common/AppConstants';

export type DrawerParamList = {
  [ScreenName.MediaWithCopyright]: undefined,
  [ScreenName.RealMedia]: undefined,
}

const Drawer = createDrawerNavigator<DrawerParamList>();

const Navigator = () => {
  return (
  <NavigationContainer>
    <Drawer.Navigator initialRouteName={ScreenName.MediaWithCopyright}>
      <Drawer.Screen name={ScreenName.MediaWithCopyright} component={MediaWithCopyrightScreen} />
      <Drawer.Screen name={ScreenName.RealMedia} component={RealMediaScreen} />
    </Drawer.Navigator>
  </NavigationContainer>
  )
}

export default Navigator;