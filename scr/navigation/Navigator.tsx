import 'react-native-gesture-handler';
import React from 'react'
import { createDrawerNavigator } from '@react-navigation/drawer';
import { NavigationContainer } from '@react-navigation/native';
import { ScreenName } from '../constants/AppConstants';
import ComicScreen from '../screens/comic/ComicScreen';
import MemeScreen from '../screens/meme/MemeScreen';
import QuoteScreen from '../screens/quote/QuoteScreen';
import CatDogScreen from '../screens/catdog/CatDogScreen';
import SatisfyingScreen from '../screens/satisfying/SatisfyingScreen';
import LoveScreen from '../screens/love/LoveScreen';
import { CustomDrawerContent } from './CustomDrawer';
import NSFWScreen from '../screens/nsfw/NSFWScreen';
import { Is_IOS_And_OfflineOrLowerReviewVersion } from '../handle/AppUtils';

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

type ScreenNamePair = [keyof DrawerParamList, any]

const Drawer = createDrawerNavigator<DrawerParamList>();

const ScreenList: ScreenNamePair[] = [
  [ScreenName.Meme, MemeScreen],
  [ScreenName.Comic, ComicScreen],
  [ScreenName.NSFW, NSFWScreen],
  [ScreenName.CatDog, CatDogScreen],
  [ScreenName.Quote, QuoteScreen],
  [ScreenName.Satisfying, SatisfyingScreen],
  [ScreenName.Love, LoveScreen],
]

const Navigator = ({ initialRouteName }: MainNavigatorProps) => {
  let screenList = ScreenList

  if (Is_IOS_And_OfflineOrLowerReviewVersion())
    screenList = screenList.filter(i => i[0] !== ScreenName.NSFW)

  return (
    <NavigationContainer>
      <Drawer.Navigator
        initialRouteName={!initialRouteName ? ScreenName.Comic : initialRouteName}
        drawerContent={(props) => <CustomDrawerContent {...props} />}
      >
        {
          screenList.map(([screenName, screen]) => {
            return <Drawer.Screen key={screenName} name={screenName} component={screen} />
          })
        }
      </Drawer.Navigator>
    </NavigationContainer>
  )
}

export default Navigator;