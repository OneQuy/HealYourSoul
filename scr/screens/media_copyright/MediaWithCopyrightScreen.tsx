import { View, Text, StyleSheet, Image, } from 'react-native'
import React from 'react'
import { FontSize, Outline, Size } from '../../app_common/AppConstants';

const imgTmp = 'https://i.ytimg.com/vi/4cJF1EHfVQg/hqdefault.jpg?sqp=-oaymwEcCNACELwBSFXyq4qpAw4IARUAAIhCGAFwAcABBg==&rs=AOn4CLCabcnXx7w38merVU5KlBHXHb-paA';

const MediaWithCopyrightScreen = () => {

  // main render

  return (
    // master view
    <View style={style.masterView}>
      {/* title */}
      <View style={style.titleView}>
        <Text style={style.titleTxt}>Post title</Text>
      </View>

      {/* media view */}
      <View style={style.mediaView} >
        <Image style={style.mediaImg} source={{ uri: imgTmp }} />
      </View>

      {/* credit author */}
      <View style={style.creditView}>
        <Text style={style.creditAuthorTxt}>Author</Text>
      </View>

    </View>
  )
}

export default MediaWithCopyrightScreen;

const style = StyleSheet.create({
  masterView: {
    flex: 1,
    gap: Outline.GapVertical,
  },

  titleView: {
    paddingHorizontal: Outline.Horizontal,
  },

  titleTxt: {
    fontSize: FontSize.Big,
  },

  mediaView: {
    width: Size.WP100,
    height: Size.WP100,
  },

  mediaImg: {
    width: '100%',
    height: '100%',
  },

  creditView: {
    paddingHorizontal: Outline.Horizontal,
  },

  creditAuthorTxt: {
    fontSize: FontSize.Normal,
  },
})