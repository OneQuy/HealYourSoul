import { View, Text, StyleSheet, Image, TouchableOpacity, } from 'react-native'
import React, { useContext } from 'react'
import { FontSize, Outline, Size } from '../../constants/AppConstants';
import { ThemeContext } from '../../constants/Colors';

const imgTmp = 'https://i.ytimg.com/vi/4cJF1EHfVQg/hqdefault.jpg?sqp=-oaymwEcCNACELwBSFXyq4qpAw4IARUAAIhCGAFwAcABBg==&rs=AOn4CLCabcnXx7w38merVU5KlBHXHb-paA';

const MediaWithCopyrightScreen = () => {
  const theme = useContext(ThemeContext);

  // main render

  return (
    // master view
    <View style={[style.masterView, { backgroundColor: theme.background }]}>
      {/* title */}
      <View style={style.titleView}>
        <Text style={[style.titleTxt, { color: theme.text }]}>Post title</Text>
      </View>

      {/* media view */}
      <View style={style.mediaView} >
        <Image style={style.mediaImg} source={{ uri: imgTmp }} />
      </View>

      {/* credit author */}
      <View style={style.creditView}>
        <Text style={[style.creditAuthorTxt, { color: theme.text }]}>Author</Text>
      </View>

      {/* link credit */}
      <View style={style.creditView}>
        <Text style={[style.creditAuthorTxt, { color: theme.text }]}>Link Author</Text>
      </View>

      {/* navi part */}
      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        <TouchableOpacity style={{flex: 1}} >
          <Text style={[{ color: theme.text }]}>Link Author</Text>
        </TouchableOpacity>
        <TouchableOpacity style={{flex: 1}} >
          <Text style={[{ color: theme.text }]}>Link Author</Text>
        </TouchableOpacity>
      </View>

      {/* menu part */}
      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        <TouchableOpacity style={{flex: 1}} >
          <Text style={[{ color: theme.text }]}>Link Author</Text>
        </TouchableOpacity>
        <TouchableOpacity style={{flex: 1}} >
          <Text style={[{ color: theme.text }]}>Link Author</Text>
        </TouchableOpacity>
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
    flex: 1,
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