import { View, Text, StyleSheet, } from 'react-native'
import React from 'react'
import { CommonStyles } from '../../common/CommonConstants';
import { FontSize, Outline } from '../../app_common/AppConstants';

const MediaWithCopyrightScreen = () => {
  return (
    <View style={CommonStyles.flex_1}>
      <Text style={style.titleTxt}>Post title</Text>
    </View>
  )
}

export default MediaWithCopyrightScreen;

const style = StyleSheet.create({
  titleTxt: {
    paddingHorizontal: Outline.Horizontal,
    fontSize: FontSize.Title,
  }
})