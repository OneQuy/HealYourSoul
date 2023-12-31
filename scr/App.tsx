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

// const App = () => {
//   return (
//     <UploadScreen />
//   )
// }

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
  const {handled, result} = useAsyncHandle(LoadAppData);
  const themeType = useAppSelector((state: RootState) => state.misc.themeType);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (Cheat('ClearAllUserData')) {
      dispatch(clearAllUserData());

      console.log('ClearAllUserData');
    }
  }, []);
  
  return (
    <ThemeContext.Provider value={GetColors(themeType)} >
      <View style={CommonStyles.flex_1}>
        {
          handled && result  ? <Navigator initialRouteName={result.categoryScreenToOpenFirst} /> : <SplashScreen />
        }
      </View>
    </ThemeContext.Provider>);
}

export default App