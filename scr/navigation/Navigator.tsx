import 'react-native-gesture-handler';
import React, { useEffect } from 'react'
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
import { ArtScreen, CuteScreen, QuoteTextScreen, RandomMemeScreen, SarcasmScreen, } from '../screens/other_thepage_screens/Index';
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

export type DrawerParamList = {
  [ScreenName.Meme]: undefined,
  [ScreenName.RandomMeme]: undefined,
  [ScreenName.Comic]: undefined,
  // [ScreenName.RedditMeme]: undefined,
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
  [ScreenName.IAPPage]: undefined,
}

type MainNavigatorProps = {
  initialRouteName: keyof DrawerParamList | null
}

type ScreenNamePair = [keyof DrawerParamList, any]

const Drawer = createDrawerNavigator<DrawerParamList>();

const ScreenList: ScreenNamePair[] = [
  [ScreenName.Meme, MemeScreen],
  [ScreenName.RandomMeme, RandomMemeScreen],
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
  [ScreenName.WikiFact, WikipediaScreen],
  [ScreenName.ShortFact, NinjaFactScreen],
  [ScreenName.Joke, NinjaJokeScreen],
  [ScreenName.QuoteText, QuoteTextScreen],
  [ScreenName.Picture, PictureScreen],
  [ScreenName.AwardPicture, PicturesOfTheYearScreen],
  [ScreenName.FunWebsite, FunWebsitesScreen],
  [ScreenName.TopMovie, TopMovieScreen],
  [ScreenName.BestShortFilms, BestShortFilmsScreen],
  [ScreenName.IAPPage, IAPPage],
]

const Navigator = ({ initialRouteName }: MainNavigatorProps) => {
  let screenList = ScreenList

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