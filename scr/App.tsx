import { View } from 'react-native'
import React, { createContext } from 'react'
import { CommonStyles } from './common/CommonConstants'
import Navigator from './navigation/Navigator'
import { PersistGate } from 'redux-persist/integration/react'
import { Provider } from 'react-redux'
import { RootState, persistor, store, useAppSelector } from './redux/Store'
import useAsyncHandle from './hooks/useAsyncHandle'
import { LoadAppData } from './handle/LoadAppData'
import SplashScreen from './screens/others/SplashScreen'
import { GetColors } from './app_common/Colors'

const ThemeContext = createContext(GetColors(true));

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

  // if (!loadedAppData)
    // return <SplashScreen />;

  return (
  <View style={CommonStyles.flex_1}>
    <Navigator />
  </View>);
}

export default App