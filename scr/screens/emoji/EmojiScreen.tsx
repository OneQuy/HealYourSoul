// @ts-ignore
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import { View, StyleSheet, TouchableOpacity, FlatList, ActivityIndicator, Animated } from 'react-native'
import React, { useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'
import { BorderRadius, Category, Icon, LocalText, Outline, Size } from '../../constants/AppConstants'
import { ThemeContext } from '../../constants/Colors'
import ImageBackgroundWithLoading from '../components/ImageBackgroundWithLoading';
import ImageBackgroundOrView from '../components/ImageBackgroundOrView';
import { widthPercentageToDP } from 'react-native-responsive-screen';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ExtractAllNumbersInText } from '../../handle/UtilsTS';
import BottomBar, { BottomBarItem } from '../others/BottomBar';
import { SaveCurrentScreenForLoadNextTime, SaveMediaAsync, ShareImageAsync } from '../../handle/AppUtils';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { playAnimLoadedMedia } from '../../handle/GoodayAnimation';

const MinEmojiId = 1
const MaxEmojiId = 182

const emojiColumn = 7

const category = Category.Emoji

const EmojiScreen = () => {
  const theme = useContext(ThemeContext);
  const { bottom: bottomInset } = useSafeAreaInsets()
  const [emojiUri_Left, setEmojiUri_Left] = useState('')
  const [emojiUri_Right, setEmojiUri_Right] = useState('')
  const [emojiUri_Result, setEmojiUri_Result] = useState('')
  const [showBorderForEmojiSide, setShowBorderForEmojiSide] = useState<'left' | 'right' | undefined>(undefined)
  const navigation = useNavigation()
  const lastSetEmojiSideIsLeftOrRight = useRef(false)
  const mediaViewScaleAnimRef = useRef(new Animated.Value(1)).current

  // const [reasonCanNotUpload, setReasonCanNotUpload] = useState<undefined | { reason: string, showSubscribeButton?: boolean }>(undefined)
  // const [isHandling, setIsHandling] = useState(true)
  // const { isPremium } = usePremium()

  const style = useMemo(() => {
    return StyleSheet.create({
      masterView: { paddingTop: Outline.GapHorizontal, flex: 1, justifyContent: 'center', alignItems: 'center', gap: Outline.GapHorizontal, },

      showView: { alignItems: 'center', gap: Outline.GapHorizontal, },
      plusView: { justifyContent: 'center', alignItems: 'center', gap: Outline.Horizontal, flexDirection: 'row' },

      bigEmojiView: { width: widthPercentageToDP(25), aspectRatio: 1, borderRadius: BorderRadius.BR, borderColor: theme.counterBackground, borderWidth: StyleSheet.hairlineWidth },
      bigEmojiView_Border: { width: widthPercentageToDP(25), aspectRatio: 1, },

      resultEmojiView: { width: widthPercentageToDP(60), aspectRatio: 1, borderRadius: BorderRadius.BR, borderColor: theme.counterBackground, borderWidth: StyleSheet.hairlineWidth },
      resultEmojiView_Border: { width: widthPercentageToDP(60), aspectRatio: 1 },

      pickEmojiFlatlistView: { flex: 1, },
      imageEmojiInList: { width: (widthPercentageToDP(100) - Outline.GapVertical * 2) / emojiColumn, aspectRatio: 1 },
    })
  }, [theme, bottomInset])

  const onPressEmojiSide = useCallback((left: boolean) => {
    setShowBorderForEmojiSide(left ? 'left' : 'right')
  }, [])

  const onPressEmojiInList = useCallback((uri: string) => {
    let setForLeftOrRight = true

    if (showBorderForEmojiSide === 'left')
      setForLeftOrRight = true
    else if (showBorderForEmojiSide === 'right')
      setForLeftOrRight = false
    else {
      if (lastSetEmojiSideIsLeftOrRight.current)
        setForLeftOrRight = false
      else
        setForLeftOrRight = true
    }

    if (setForLeftOrRight)
      setEmojiUri_Left(uri)
    else
      setEmojiUri_Right(uri)

    lastSetEmojiSideIsLeftOrRight.current = setForLeftOrRight

    setShowBorderForEmojiSide(undefined)
  }, [showBorderForEmojiSide])

  const onPressPin = useCallback(() => {
  }, [])

  const onResultLoad = useCallback(() => {
    playAnimLoadedMedia(mediaViewScaleAnimRef)
  }, [])

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

  const bottomBarItems = useMemo(() => {
    return [
      {
        text: LocalText.share,
        onPress: () => ShareImageAsync(emojiUri_Result, category),
        icon: Icon.ShareImage,
        countType: 'share'
      },
      {
        text: LocalText.pin,
        onPress: onPressPin,
        icon: Icon.Pin,
      },
      {
        text: LocalText.save,
        onPress: () => SaveMediaAsync(category, emojiUri_Result),
        icon: Icon.Download,
        countType: 'download',
      },
    ] as BottomBarItem[]
  }, [emojiUri_Result, onPressPin])

  const emojiUriArr = useMemo(() => {
    const arr = []

    for (let i = MinEmojiId; i <= MaxEmojiId; i++) {
      arr.push(`https://emojimix.app/emojimixfusion/a${i}.png`)
    }

    return arr
  }, [])

  useEffect(() => {
    if (!emojiUri_Left && !emojiUri_Right)
      return

    const id1 = ExtractAllNumbersInText(emojiUri_Left)
    const id2 = ExtractAllNumbersInText(emojiUri_Right)

    if (id1.length <= 0 && id2.length <= 0)
      return

    const uri = `https://emojimix.app/emojimixfusion/${id1[0]}_${id2[0]}.png`

    setEmojiUri_Result(uri)
  }, [emojiUri_Left, emojiUri_Right])

  // save last visit category screen

  useFocusEffect(
    useCallback(() => {
      SaveCurrentScreenForLoadNextTime(navigation)
    }, [])
  )

  // main render

  return (
    <View style={style.masterView}>
      {/* show view */}

      <View style={style.showView}>
        {/* plus view */}
        <View style={style.plusView}>
          {/* left side emoji */}
          <TouchableOpacity onPress={() => onPressEmojiSide(true)}>
            <ImageBackgroundOrView
              newUriNewKey={true}
              style={(!emojiUri_Left || showBorderForEmojiSide === 'left') ? style.bigEmojiView : style.bigEmojiView_Border}
              source={{ uri: emojiUri_Left }}
              indicatorProps={{ color: theme.counterBackground }}
            />
          </TouchableOpacity>

          {/* plus icon */}
          <MaterialCommunityIcons name={Icon.Plus} color={theme.counterBackground} size={Size.IconBig} />

          {/* right side emoji */}
          <TouchableOpacity onPress={() => onPressEmojiSide(false)}>
            <ImageBackgroundOrView
              newUriNewKey={true}
              style={(!emojiUri_Right || showBorderForEmojiSide === 'right') ? style.bigEmojiView : style.bigEmojiView_Border}
              source={{ uri: emojiUri_Right }}
              indicatorProps={{ color: theme.counterBackground }}
            />
          </TouchableOpacity>
        </View>

        {/* result view */}

        <Animated.View style={{ transform: [{ scale: mediaViewScaleAnimRef }] }}>
          <ImageBackgroundOrView
            newUriNewKey={true}
            style={!emojiUri_Result ? style.resultEmojiView : style.resultEmojiView_Border}
            source={{ uri: emojiUri_Result }}
            indicatorProps={{ color: theme.counterBackground }}
            onLoad={onResultLoad}
          />
        </Animated.View>
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

      <BottomBar
        items={bottomBarItems}
        id={undefined}
        category={category}
      />

    </View>
  )
}

export default EmojiScreen