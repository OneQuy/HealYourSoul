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
import IAPPage from '../screens/IAP/IAPPage';
import { ArtScreen, CuteScreen, QuoteTextScreen, SarcasmScreen } from '../screens/other_thepage_screens/Index';
import NinjaFactScreen from '../screens/ninja_fact/NinjaFactScreen';
import PictureScreen from '../screens/picture/PictureScreen';
import NinjaJokeScreen from '../screens/ninja_fact/NinjaJokeScreen';
import TheTriviaScreen from '../screens/trivia/TriviaScreen';
import ReminderScreen from '../screens/reminder/ReminderScreen';

export type DrawerParamList = {
  [ScreenName.Comic]: undefined,
  [ScreenName.Meme]: undefined,
  [ScreenName.Quote]: undefined,
  [ScreenName.CatDog]: undefined,
  [ScreenName.Love]: undefined,
  [ScreenName.Satisfying]: undefined,
  [ScreenName.NSFW]: undefined,
  [ScreenName.Cute]: undefined,
  [ScreenName.Art]: undefined,
  [ScreenName.Sarcasm]: undefined,
  [ScreenName.Trivia]: undefined,
  [ScreenName.ShortFact]: undefined,
  [ScreenName.Joke]: undefined,
  [ScreenName.Picture]: undefined,
  [ScreenName.QuoteText]: undefined,
  // [ScreenName.Reminder]: undefined,
  [ScreenName.IAPPage]: undefined,
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
  [ScreenName.Sarcasm, SarcasmScreen],
  [ScreenName.Cute, CuteScreen],
  [ScreenName.Art, ArtScreen],
  [ScreenName.Trivia, TheTriviaScreen],
  [ScreenName.ShortFact, NinjaFactScreen],
  [ScreenName.Joke, NinjaJokeScreen],
  [ScreenName.Picture, PictureScreen],
  [ScreenName.QuoteText, QuoteTextScreen],
  // [ScreenName.Reminder, ReminderScreen],
  [ScreenName.IAPPage, IAPPage],
]

const Navigator = ({ initialRouteName }: MainNavigatorProps) => {
  let screenList = ScreenList

  // check to remove for ios reviewing lol

  if (Is_IOS_And_OfflineOrLowerReviewVersion()) {
    screenList = screenList.filter(i => i[0] !== ScreenName.NSFW)

    if (initialRouteName === ScreenName.NSFW)
      initialRouteName = ScreenName.Meme
  }

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