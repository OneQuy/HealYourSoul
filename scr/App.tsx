import { View } from 'react-native'
import React from 'react'
import { CommonStyles } from './common/CommonConstants'
import Navigator from './navigation/Navigator'
import { PersistGate } from 'redux-persist/integration/react'
import { Provider } from 'react-redux'
import { RootState, persistor, store, useAppSelector } from './redux/Store'
import useAsyncHandle from './hooks/useAsyncHandle'
import { LoadAppData } from './handle/LoadAppData'
import SplashScreen from './screens/others/SplashScreen'
import { GetColors, ThemeContext } from './app_common/Colors'

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
  const loadedAppData = useAsyncHandle(LoadAppData);
  const isLightTheme = useAppSelector((state: RootState) => state.misc.isLightTheme);

  return (
    <ThemeContext.Provider value={GetColors(isLightTheme)} >
      <View style={CommonStyles.flex_1}>
        {
          loadedAppData ? <Navigator /> : <SplashScreen />
        }        
      </View>
    </ThemeContext.Provider>);
}

export default App