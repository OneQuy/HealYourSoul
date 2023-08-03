import 'react-native-gesture-handler';
import React from 'react'
import { Text, ScrollView, TouchableOpacity, View } from 'react-native'
import { createDrawerNavigator, DrawerContentComponentProps, DrawerContentScrollView, DrawerItem, DrawerItemList, } from '@react-navigation/drawer';
import { NavigationContainer } from '@react-navigation/native';
import { ScreenName } from '../constants/AppConstants';
import ComicScreen from '../screens/comic/ComicScreen';
import RealScreen from '../screens/real/RealScreen';
import QuoteScreen from '../screens/quote/QuoteScreen';
import { themes } from '../constants/Colors';

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
var arr = Object.values(themes);
  return (
    <View style={{ flex: 1 }}>
      <DrawerContentScrollView {...props}>
        <DrawerItemList {...props} />
      </DrawerContentScrollView>
      <View>
        <View style={{ flexDirection: 'row' }}>
          <Text>Theme</Text>
          {/* themtyp.map((theme, index) => <TouchableOpacity key={theme + index} style={{ width: 10, height: 10, backgroundColor: theme }} />)           */}
        </View>
      </View>
    </View>
  );
}

export default Navigator;