import { StatusBar, View } from 'react-native'
import React, { useEffect } from 'react'
import { CommonStyles } from './constants/CommonConstants'
import Navigator from './navigation/Navigator'
import { PersistGate } from 'redux-persist/integration/react'
import { Provider } from 'react-redux'
import { RootState, persistor, store, useAppDispatch, useAppSelector } from './redux/Store'
import useAsyncHandle from './hooks/useAsyncHandle'
import { LoadAppData } from './handle/LoadAppData'
import SplashScreen from './screens/others/SplashScreen'
import { GetColors, ThemeContext } from './constants/Colors'
import { Cheat } from './handle/Cheat'
import { clearAllUserData } from './redux/UserDataSlice'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { TelemetryDeckProvider } from '@typedigital/telemetrydeck-react'

const App = () => {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <AppRender />
      </PersistGate>
    </Provider>
  )
}

const AppRender = () => {
  const themeType = useAppSelector((state: RootState) => state.misc.themeType);
  const theme = GetColors(themeType);
  const { handled, result } = useAsyncHandle(async () => LoadAppData());
  const dispatch = useAppDispatch();

  // init once

  useEffect(() => {
    // check clear user data

    if (Cheat('ClearAllUserData')) {
      dispatch(clearAllUserData());
      AsyncStorage.clear()

      console.log('ClearAllUserData');
    }
  }, []);

  if (!handled || !result)
    return <SplashScreen theme={theme} />

  return (
    <TelemetryDeckProvider telemetryDeck={result.telemetryDeckClient}>
      <ThemeContext.Provider value={theme} >
        <StatusBar backgroundColor={theme.background} barStyle={theme.shouldStatusBarLight ? 'light-content' : 'dark-content'} />
        <View style={CommonStyles.flex_1}>
          {
            <Navigator initialRouteName={result.categoryScreenToOpenFirst} />
          }
        </View>
      </ThemeContext.Provider>
    </TelemetryDeckProvider>
  )
}

export default App