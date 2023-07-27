// https://oblador.github.io/react-native-vector-icons/

import { View, Text, StyleSheet, Image, TouchableOpacity, } from 'react-native'
import React, { useContext } from 'react'
import { FontSize, Outline, Size } from '../../constants/AppConstants';
import { ThemeContext } from '../../constants/Colors';

// @ts-ignore
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

// @ts-ignore
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

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
        <Text style={{ fontSize: FontSize.Normal, color: theme.text }}>Author</Text>
      </View>

      {/* link credit */}
      <View style={style.creditView}>
        <Text style={{ fontSize: FontSize.Small, color: theme.text }}>www.google.vn</Text>
      </View>

      {/* navi part */}
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: Outline.Horizontal, gap: Outline.GapHorizontal }}>
        <TouchableOpacity style={{ borderRadius: Outline.BorderRadius, paddingVertical: Outline.VerticalMini, flex: 1, backgroundColor: theme.primary, justifyContent: 'center', alignItems: 'center' }} >
          <MaterialCommunityIcons name={true ? "cards-heart-outline" : 'cards-heart'} color={theme.counterPrimary} size={Size.IconSmaller} />
        </TouchableOpacity>
        <TouchableOpacity style={{ borderRadius: Outline.BorderRadius, paddingVertical: Outline.VerticalMini, flex: 1, backgroundColor: theme.primary, justifyContent: 'center', alignItems: 'center' }} >
          <MaterialIcons name="keyboard-arrow-left" color={theme.counterPrimary} size={Size.Icon} />
        </TouchableOpacity>
        <TouchableOpacity style={{ borderRadius: Outline.BorderRadius, paddingVertical: Outline.VerticalMini, flex: 1, backgroundColor: theme.primary, justifyContent: 'center', alignItems: 'center' }} >
          <MaterialIcons name="keyboard-arrow-right" color={theme.counterPrimary} size={Size.Icon} />
        </TouchableOpacity>
      </View>

      {/* menu part */}
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: Outline.Horizontal, gap: Outline.GapHorizontal, marginBottom: Outline.GapVertical, }}>
        <TouchableOpacity style={{ borderRadius: Outline.BorderRadius, paddingVertical: Outline.VerticalMini, flex: 1, backgroundColor: theme.primary, justifyContent: 'center', alignItems: 'center' }} >
          <MaterialCommunityIcons name={'download'} color={theme.counterPrimary} size={Size.IconSmaller} />
        </TouchableOpacity>
        <TouchableOpacity style={{ borderRadius: Outline.BorderRadius, paddingVertical: Outline.VerticalMini, flex: 1, backgroundColor: theme.primary, justifyContent: 'center', alignItems: 'center' }} >
          <MaterialIcons name="share" color={theme.counterPrimary} size={Size.IconSmaller} />
        </TouchableOpacity>
        <TouchableOpacity style={{ borderRadius: Outline.BorderRadius, paddingVertical: Outline.VerticalMini, flex: 1, backgroundColor: theme.primary, justifyContent: 'center', alignItems: 'center' }} >
          <MaterialCommunityIcons name={'dots-horizontal'} color={theme.counterPrimary} size={Size.IconSmaller} />
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
})