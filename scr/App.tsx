import { View, Text } from 'react-native'
import React from 'react'
import { CommonStyles } from './common/CommonConstants'
import Navigator from './navigation/Navigator'

const App = () => {
  return (
    <View style={CommonStyles.flex_1}>
      <Navigator />
    </View>
  )
}

export default App