import 'react-native-gesture-handler';
import React, { useContext, useEffect, useMemo } from 'react'
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
import IAPPage from '../screens/IAP/IAPPage';
import { ArtScreen, AwesomeScreen, CuteScreen, InfoScreen, QuoteTextScreen, RandomMemeScreen, SarcasmScreen, SunsetScreen, TypoScreen, } from '../screens/other_thepage_screens/Index';
import NinjaFactScreen from '../screens/ninja_fact/NinjaFactScreen';
import PictureScreen from '../screens/picture/PictureScreen';
import NinjaJokeScreen from '../screens/ninja_fact/NinjaJokeScreen';
import TheTriviaScreen from '../screens/trivia/TriviaScreen';
import PicturesOfTheYearScreen from '../screens/pic_of_the_year/PicturesOfTheYearScreen';
import WikipediaScreen from '../screens/wiki/WikipediaScreen';
import FunWebsitesScreen from '../screens/fun_websites/FunWebsites';
import TopMovieScreen from '../screens/top_movies/TopMovie';
import BestShortFilmsScreen from '../screens/best_short_films/BestShortFilmsScreen';
import { OnUseEffectOnceEnterApp } from '../handle/AppUtils';
import { InitAppStateMan } from '../handle/AppStateMan';
import { RegisterGoodayAppState } from '../handle/GoodayAppState';
import SettingScreen from '../screens/setting/SettingScreen';
import { ThemeContext } from '../constants/Colors';
import { StyleSheet } from 'react-native';
import { useTelemetryDeck } from "@typedigital/telemetrydeck-react"
import { SetSignal } from '../handle/tracking/Tracking';

export type DrawerParamList = {
  [ScreenName.Meme]: undefined,
  [ScreenName.RandomMeme]: undefined,
  [ScreenName.Comic]: undefined,
  [ScreenName.Quote]: undefined,
  [ScreenName.CatDog]: undefined,
  [ScreenName.Love]: undefined,
  [ScreenName.Satisfying]: undefined,
  [ScreenName.NSFW]: undefined,
  [ScreenName.Cute]: undefined,
  [ScreenName.Art]: undefined,
  [ScreenName.Sarcasm]: undefined,
  [ScreenName.Trivia]: undefined,
  [ScreenName.WikiFact]: undefined,
  [ScreenName.ShortFact]: undefined,
  [ScreenName.Joke]: undefined,
  [ScreenName.Picture]: undefined,
  [ScreenName.QuoteText]: undefined,
  [ScreenName.AwardPicture]: undefined,
  [ScreenName.FunWebsite]: undefined,
  [ScreenName.TopMovie]: undefined,
  [ScreenName.BestShortFilms]: undefined,
  [ScreenName.Awesome]: undefined,
  [ScreenName.Sunset]: undefined,
  [ScreenName.Info]: undefined,
  [ScreenName.Typo]: undefined,
  [ScreenName.IAPPage]: undefined,
  [ScreenName.Setting]: undefined,
}

type MainNavigatorProps = {
  initialRouteName: keyof DrawerParamList | null
}

type ScreenNamePair = [keyof DrawerParamList, any]

const Drawer = createDrawerNavigator<DrawerParamList>();

const ScreenList: ScreenNamePair[] = [
  [ScreenName.Meme, MemeScreen],
  [ScreenName.RandomMeme, RandomMemeScreen],
  [ScreenName.Comic, ComicScreen], // warm
  [ScreenName.CatDog, CatDogScreen],
  [ScreenName.NSFW, NSFWScreen],
  [ScreenName.Quote, QuoteScreen], // movivation
  [ScreenName.Art, ArtScreen],
  [ScreenName.Awesome, AwesomeScreen],
  [ScreenName.Typo, TypoScreen],
  [ScreenName.Cute, CuteScreen],
  [ScreenName.Sunset, SunsetScreen], // picked nature
  [ScreenName.Love, LoveScreen],
  [ScreenName.Satisfying, SatisfyingScreen],
  [ScreenName.Sarcasm, SarcasmScreen],
  [ScreenName.Info, InfoScreen],
  [ScreenName.WikiFact, WikipediaScreen],
  [ScreenName.Trivia, TheTriviaScreen],
  [ScreenName.ShortFact, NinjaFactScreen],
  [ScreenName.Joke, NinjaJokeScreen],
  [ScreenName.QuoteText, QuoteTextScreen],
  [ScreenName.BestShortFilms, BestShortFilmsScreen],
  [ScreenName.FunWebsite, FunWebsitesScreen],
  [ScreenName.AwardPicture, PicturesOfTheYearScreen],
  [ScreenName.Picture, PictureScreen],
  [ScreenName.TopMovie, TopMovieScreen],

  // app

  [ScreenName.IAPPage, IAPPage],
  [ScreenName.Setting, SettingScreen],
]

const Navigator = ({ initialRouteName }: MainNavigatorProps) => {
  const theme = useContext(ThemeContext);
  const { signal } = useTelemetryDeck()

  const style = useMemo(() => {
    return StyleSheet.create({
      header: { backgroundColor: theme.background, elevation: 0, shadowColor: theme.background },
    })
  }, [theme])

  const renderListScreens = useMemo(() => {
    return ScreenList.map(([screenName, screen]) => {
      return <Drawer.Screen key={screenName} name={screenName} component={screen} />
    })
  }, [])

  useEffect(() => {
    SetSignal(signal)
  }, [signal])

  useEffect(() => {
    // init app state

    InitAppStateMan()
    RegisterGoodayAppState(true)

    // once enter app

    OnUseEffectOnceEnterApp()

    return () => {
      RegisterGoodayAppState(false)
    }
  }, [])

  return (
    <NavigationContainer>
      <Drawer.Navigator
        initialRouteName={!initialRouteName ? ScreenName.Meme : initialRouteName}
        drawerContent={(props) => <CustomDrawerContent {...props} />}
        screenOptions={{
          headerStyle: style.header,
          headerTintColor: theme.primary,
        }}
      >
        {
          renderListScreens
        }
      </Drawer.Navigator>
    </NavigationContainer>
  )
}

export default Navigator;