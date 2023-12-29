import { View, Text, StyleSheet } from 'react-native'
import React from 'react'

const SubRedditSelector = () => {
  return (
    <View style={[style.masterView]}>
      <Text>SubRedditSelector</Text>
    </View>
  )
}

export default SubRedditSelector

const style = StyleSheet.create({
    masterView: { position: 'absolute', width: '100%', height: '100%', backgroundColor: 'red' }
})