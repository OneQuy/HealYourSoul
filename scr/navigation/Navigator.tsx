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
import { ArtScreen, AwesomeScreen, CuteScreen, InfoScreen, QuoteTextScreen, RandomMemeScreen, SarcasmScreen, SunsetScreen, TuneScreen, TypoScreen, VocabularyScreen, } from '../screens/other_thepage_screens/Index';
import NinjaFactScreen from '../screens/ninja_fact/NinjaFactScreen';
import PictureScreen from '../screens/picture/PictureScreen';
import NinjaJokeScreen from '../screens/ninja_fact/NinjaJokeScreen';
import TheTriviaScreen from '../screens/trivia/TriviaScreen';
import PicturesOfTheYearScreen from '../screens/pic_of_the_year/PicturesOfTheYearScreen';
import WikipediaScreen from '../screens/wiki/WikipediaScreen';
import FunWebsitesScreen from '../screens/fun_websites/FunWebsites';
import TopMovieScreen from '../screens/top_movies/TopMovie';
import BestShortFilmsScreen from '../screens/best_short_films/BestShortFilmsScreen';
import { InitAppStateMan } from '../handle/AppStateMan';
import { OnUseEffectOnceEnterApp, RegisterGoodayAppState } from '../handle/GoodayAppState';
import SettingScreen from '../screens/setting/SettingScreen';
import { ThemeContext } from '../constants/Colors';
import { StyleSheet } from 'react-native';
import { useTelemetryDeck } from "@typedigital/telemetrydeck-react"
import { SetSignal } from '../handle/tracking/Tracking';
import Onboarding from '../screens/onboarding/Onboarding';
import { RootState, useAppSelector } from '../redux/Store';
import { OnBlurSettingView } from '../screens/setting/SettingView';
import FunSoundScreen from '../screens/fun_sound/FunSoundScreen';
import SavedScreen from '../screens/saved/SavedScreen';
import { DiversityItemType } from '../constants/Types';
import { setAppUtilsTheme } from '../handle/AppUtils';
import UploadScreen from '../screens/upload/UploadScreen';

export type DrawerParamList = {
  [ScreenName.Meme]: { item: DiversityItemType } | undefined,
  [ScreenName.Vocabulary]: { item: DiversityItemType } | undefined,
  [ScreenName.FunSound]: { item: DiversityItemType } | undefined,
  [ScreenName.RandomMeme]: { item: DiversityItemType } | undefined,
  [ScreenName.Tune]: { item: DiversityItemType } | undefined,
  [ScreenName.Comic]: { item: DiversityItemType } | undefined,
  [ScreenName.Quote]: { item: DiversityItemType } | undefined,
  [ScreenName.CatDog]: { item: DiversityItemType } | undefined,
  [ScreenName.Love]: { item: DiversityItemType } | undefined,
  [ScreenName.Satisfying]: { item: DiversityItemType } | undefined,
  [ScreenName.NSFW]: { item: DiversityItemType } | undefined,
  [ScreenName.Cute]: { item: DiversityItemType } | undefined,
  [ScreenName.Art]: { item: DiversityItemType } | undefined,
  [ScreenName.Sarcasm]: { item: DiversityItemType } | undefined,
  [ScreenName.Trivia]: { item: DiversityItemType } | undefined,
  [ScreenName.WikiFact]: { item: DiversityItemType } | undefined,
  [ScreenName.ShortFact]: { item: DiversityItemType } | undefined,
  [ScreenName.Joke]: { item: DiversityItemType } | undefined,
  [ScreenName.Picture]: { item: DiversityItemType } | undefined,
  [ScreenName.QuoteText]: { item: DiversityItemType } | undefined,
  [ScreenName.AwardPicture]: { item: DiversityItemType } | undefined,
  [ScreenName.FunWebsite]: { item: DiversityItemType } | undefined,
  [ScreenName.TopMovie]: { item: DiversityItemType } | undefined,
  [ScreenName.BestShortFilms]: { item: DiversityItemType } | undefined,
  [ScreenName.Awesome]: { item: DiversityItemType } | undefined,
  [ScreenName.Sunset]: { item: DiversityItemType } | undefined,
  [ScreenName.Info]: { item: DiversityItemType } | undefined,
  [ScreenName.Typo]: { item: DiversityItemType } | undefined,

  [ScreenName.IAPPage]: undefined,
  [ScreenName.Setting]: undefined,
  [ScreenName.Saved]: undefined,
  [ScreenName.Upload]: undefined,
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
  [ScreenName.FunSound, FunSoundScreen],
  [ScreenName.Quote, QuoteScreen], // movivation
  [ScreenName.Art, ArtScreen],
  [ScreenName.Awesome, AwesomeScreen],
  [ScreenName.Tune, TuneScreen],
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
  [ScreenName.Vocabulary, VocabularyScreen],
  [ScreenName.AwardPicture, PicturesOfTheYearScreen],
  [ScreenName.Picture, PictureScreen],
  [ScreenName.TopMovie, TopMovieScreen],

  // app

  [ScreenName.IAPPage, IAPPage],
  [ScreenName.Setting, SettingScreen],
  [ScreenName.Saved, SavedScreen],
  [ScreenName.Upload, UploadScreen],
]

const Navigator = ({ initialRouteName }: MainNavigatorProps) => {
  const theme = useContext(ThemeContext);
  const { signal } = useTelemetryDeck()
  const isOnboarded = useAppSelector((state: RootState) => state.misc.onboarded);

  const style = useMemo(() => {
    return StyleSheet.create({
      header: { backgroundColor: theme.background, elevation: 0, shadowColor: theme.background },
      screenBackground: { backgroundColor: theme.background },
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
    setAppUtilsTheme(theme)
  }, [theme])

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

  if (!isOnboarded)
    return <Onboarding />

  return (
    <NavigationContainer>
      <Drawer.Navigator
        initialRouteName={!initialRouteName ? ScreenName.Meme : initialRouteName}
        drawerContent={(props) => <CustomDrawerContent {...props} />}
        screenListeners={{
          blur: (e) => {
            if (e.target?.includes(ScreenName.Setting)) {
              OnBlurSettingView()
            }
          }
        }}
        screenOptions={{
          headerStyle: style.header,
          sceneContainerStyle: style.screenBackground,
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