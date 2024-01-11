import { View } from 'react-native'
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
import { InitAppStateMan } from './handle/AppStateMan'
import { RegisterGoodayAppState } from './handle/GoodayAppState'
import AsyncStorage from '@react-native-async-storage/async-storage'

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
  const { handled, result } = useAsyncHandle(async () => LoadAppData(theme));
  const dispatch = useAppDispatch();

  // init once

  useEffect(() => {
    // init app state

    InitAppStateMan()
    RegisterGoodayAppState(true)

    // check clear user data

    if (Cheat('ClearAllUserData')) {
      dispatch(clearAllUserData());
      AsyncStorage.clear()
      
      console.log('ClearAllUserData');
    }

    return () => {
      RegisterGoodayAppState(false)
    }
  }, []);

  return (
    <ThemeContext.Provider value={theme} >
      <View style={CommonStyles.flex_1}>
        {
          handled && result ?
            <Navigator initialRouteName={result.categoryScreenToOpenFirst} /> :
            <SplashScreen />
        }
      </View>
    </ThemeContext.Provider>);
}

export default App