// @ts-ignore
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import { View, StyleSheet, TouchableOpacity, FlatList } from 'react-native'
import React, { useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { BorderRadius, Icon, Outline, Size } from '../../constants/AppConstants'
import { ThemeContext } from '../../constants/Colors'
import { usePremium } from '../../hooks/usePremium';
import { useNavigation } from '@react-navigation/native';
import ImageBackgroundWithLoading from '../components/ImageBackgroundWithLoading';
import ImageBackgroundOrView from '../components/ImageBackgroundOrView';
import { widthPercentageToDP } from 'react-native-responsive-screen';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ExtractAllNumbersInText } from '../../handle/UtilsTS';

const MinEmojiId = 1
const MaxEmojiId = 182

const emojiColumn = 10

const EmojiScreen = () => {
  const theme = useContext(ThemeContext);
  const { bottom: bottomInset } = useSafeAreaInsets()
  const [emoji_1, setEmoji_1] = useState('')
  const [emoji_2, setEmoji_2] = useState('')
  const [emoji_Result, setEmoji_Result] = useState('')
  const [selectingLeft, setSelectingLeft] = useState(true)

  // const [reasonCanNotUpload, setReasonCanNotUpload] = useState<undefined | { reason: string, showSubscribeButton?: boolean }>(undefined)
  // const [isHandling, setIsHandling] = useState(true)
  // const { isPremium } = usePremium()
  // const navigation = useNavigation()

  const style = useMemo(() => {
    return StyleSheet.create({
      masterView: { paddingBottom: bottomInset, paddingTop: Outline.GapHorizontal, flex: 1, justifyContent: 'center', alignItems: 'center', gap: Outline.GapHorizontal, },

      showView: { alignItems: 'center', gap: Outline.GapVertical_2 },
      plusView: { justifyContent: 'center', alignItems: 'center', gap: Outline.Horizontal, flexDirection: 'row' },

      bigEmojiView: { width: widthPercentageToDP(30), aspectRatio: 1, borderRadius: BorderRadius.BR, borderColor: theme.counterBackground, borderWidth: StyleSheet.hairlineWidth },
      bigEmojiView_Empty: { width: widthPercentageToDP(30), aspectRatio: 1, },

      resultEmojiView: { width: widthPercentageToDP(50), aspectRatio: 1, borderRadius: BorderRadius.BR, borderColor: theme.counterBackground, borderWidth: StyleSheet.hairlineWidth },
      resultEmojiView_Empty: { width: widthPercentageToDP(50), aspectRatio: 1 },

      pickEmojiFlatlistView: { flex: 1, },
      imageEmojiInList: { width: 30, aspectRatio: 1 },

      // refreshTxt: { fontSize: FontSize.Small_L, color: theme.counterBackground },
    })
  }, [theme, bottomInset])

  const onPressEmojiBig = useCallback((left: boolean) => {
    setSelectingLeft(left)
  }, [])

  const onPressEmojiInList = useCallback((uri: string) => {
    if (selectingLeft)
      setEmoji_1(uri)
    else
      setEmoji_2(uri)

    setSelectingLeft(t => !t)
  }, [selectingLeft])

  const renderItem = useCallback(({ item: uri }: { item: string }) => {
    return (
      <TouchableOpacity onPress={() => onPressEmojiInList(uri)}>
        <ImageBackgroundWithLoading
          style={style.imageEmojiInList}
          source={{ uri, cache: 'force-cache' }}
        />
      </TouchableOpacity>
    )
  }, [style, onPressEmojiInList])

  const emojiUriArr = useMemo(() => {
    const arr = []

    for (let i = MinEmojiId; i <= MaxEmojiId; i++) {
      arr.push(`https://emojimix.app/emojimixfusion/a${i}.png`)
    }

    return arr
  }, [])

  // handling something

  // if (isHandling) {
  //   return (
  //     <View style={style.masterView}>
  //       <ActivityIndicator color={theme.primary} />
  //     </View>
  //   )
  // }

  useEffect(() => {
    if (!emoji_1 && !emoji_2)
      return

    const id1 = ExtractAllNumbersInText(emoji_1)
    const id2 = ExtractAllNumbersInText(emoji_2)

    if (id1.length <= 0 && id2.length <= 0)
      return

    const uri = `https://emojimix.app/emojimixfusion/${id1[0]}_${id2[0]}.png`

    setEmoji_Result(uri)
  }, [emoji_1, emoji_2])
  // main render

  return (
    <View style={style.masterView}>
      {/* show view */}

      <View style={style.showView}>
        {/* plus view */}
        <View style={style.plusView}>
          <TouchableOpacity onPress={() => onPressEmojiBig(true)}>
            <ImageBackgroundOrView style={!emoji_1 ? style.bigEmojiView : style.bigEmojiView_Empty} source={{ uri: emoji_1 }} />
          </TouchableOpacity>

          <MaterialCommunityIcons name={Icon.Plus} color={theme.counterBackground} size={Size.IconBig} />

          <TouchableOpacity onPress={() => onPressEmojiBig(false)}>
            <ImageBackgroundOrView style={!emoji_2 ? style.bigEmojiView : style.bigEmojiView_Empty} source={{ uri: emoji_2 }} />
          </TouchableOpacity>
        </View>

        {/* result view */}

        <ImageBackgroundOrView style={!emoji_Result ? style.resultEmojiView : style.resultEmojiView_Empty} source={{ uri: emoji_Result }} />
      </View>

      {/* flat list pick emoji */}

      <View style={style.pickEmojiFlatlistView}>
        <FlatList
          data={emojiUriArr}
          renderItem={renderItem}
          keyExtractor={(item) => item}
          numColumns={emojiColumn}
          showsVerticalScrollIndicator={false}
        />
      </View>
    </View>
  )
}

export default EmojiScreen