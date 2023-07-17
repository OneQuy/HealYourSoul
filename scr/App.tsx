import { View } from 'react-native'
import React from 'react'
import { CommonStyles } from './common/CommonConstants'
import Navigator from './navigation/Navigator'
import { PersistGate } from 'redux-persist/integration/react'
import { Provider } from 'react-redux'
import { persistor, store } from './redux/store'

const App = () => {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <View style={CommonStyles.flex_1}>
          <Navigator />
        </View>
      </PersistGate>
    </Provider>
  )
}

export default App