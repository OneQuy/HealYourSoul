// @ts-ignore
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import { View, StyleSheet, TouchableOpacity, FlatList, Animated } from 'react-native'
import React, { useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'
import { BorderRadius, Category, Icon, LocalText, Outline, Size } from '../../constants/AppConstants'
import { ThemeContext } from '../../constants/Colors'
import ImageBackgroundWithLoading from '../components/ImageBackgroundWithLoading';
import ImageBackgroundOrView from '../components/ImageBackgroundOrView';
import { widthPercentageToDP } from 'react-native-responsive-screen';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ExtractAllNumbersInText, IsValuableArrayOrString, ToCanPrintError } from '../../handle/UtilsTS';
import BottomBar, { BottomBarItem } from '../others/BottomBar';
import { AlertWithError, SaveCurrentScreenForLoadNextTime, SaveMediaAsync, ShareImageAsync } from '../../handle/AppUtils';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { playAnimLoadedMedia } from '../../handle/GoodayAnimation';
import HeaderRightButtons from '../components/HeaderRightButtons';
import HairLine from '../components/HairLine';
import { useAppDispatch, useAppSelector } from '../../redux/Store';
import { toggleEmojiMix } from '../../redux/UserDataSlice';
import { RandomInt } from '../../handle/Utils';

const MinEmojiId = 1
const MaxEmojiId = 182

const emojiColumn = 7
const emojiSize = (widthPercentageToDP(100) - Outline.GapVertical * 2) / emojiColumn
const emojiSizePinnded = emojiSize / 1.5

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
  const pinnedEmojiMixes = useAppSelector(state => state.userData.pinnedEmojiMixes)
  const dispatch = useAppDispatch()

  // const [reasonCanNotUpload, setReasonCanNotUpload] = useState<undefined | { reason: string, showSubscribeButton?: boolean }>(undefined)
  // const [isHandling, setIsHandling] = useState(true)
  // const { isPremium } = usePremium()

  const ids = useMemo(() => {
    const id1arr = ExtractAllNumbersInText(emojiUri_Left)
    const id2arr = ExtractAllNumbersInText(emojiUri_Right)

    if (id1arr.length <= 0 || id2arr.length <= 0)
      return undefined

    return [id1arr[0], id2arr[0]] as [number, number]
  }, [emojiUri_Left, emojiUri_Right])

  const style = useMemo(() => {
    return StyleSheet.create({
      masterView: { paddingTop: Outline.GapHorizontal, flex: 1, justifyContent: 'center', alignItems: 'center', gap: Outline.GapHorizontal, },

      showView: { alignItems: 'center', gap: Outline.GapHorizontal, },
      plusView: { justifyContent: 'center', alignItems: 'center', gap: Outline.Horizontal, flexDirection: 'row' },

      bigEmojiView: { width: widthPercentageToDP(25), aspectRatio: 1, borderRadius: BorderRadius.BR, borderColor: theme.counterBackground, borderWidth: StyleSheet.hairlineWidth },
      bigEmojiView_Border: { width: widthPercentageToDP(25), aspectRatio: 1, },

      resultEmojiView: { width: widthPercentageToDP(60), aspectRatio: 1, borderRadius: BorderRadius.BR, borderColor: theme.counterBackground, borderWidth: StyleSheet.hairlineWidth },
      resultEmojiView_Border: { width: widthPercentageToDP(60), aspectRatio: 1 },

      pinnedFlatlist: { gap: Outline.GapHorizontal, },
      pinnedView: { height: emojiSizePinnded, },

      pickEmojiFlatlistView: { flex: 1, },
      imageEmojiInList: { width: emojiSize, aspectRatio: 1 },

      imageEmojiPinned: { width: emojiSizePinnded, aspectRatio: 1 },
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

  const set2Emoji = useCallback((ids: [number, number]) => {
    const leftUri = singleEmojiUri(ids[0])
    const rightUri = singleEmojiUri(ids[1])

    onPressEmojiInList(leftUri)
    onPressEmojiInList(rightUri)
  }, [onPressEmojiInList])

  const isPinned = useMemo(() => {
    return ids && pinnedEmojiMixes && pinnedEmojiMixes.find(i => {
      return (i[0] === ids[0] && i[1] === ids[1]) || (i[1] === ids[0] && i[0] === ids[1])
    })

  }, [ids, pinnedEmojiMixes])

  const onPressRandom = useCallback(() => {
    set2Emoji([
      RandomInt(MinEmojiId, MaxEmojiId),
      RandomInt(MinEmojiId, MaxEmojiId)])
  }, [set2Emoji])

  const onPressPinInBottomBar = useCallback(() => {
    if (ids === undefined)
      return

    dispatch(toggleEmojiMix(ids))
  }, [ids])

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

  const renderItemPinned = useCallback(({ item: ids }: { item: [number, number] }) => {
    const uri = mixEmojiUri(ids[0], ids[1])

    return (
      <TouchableOpacity onPress={() => set2Emoji(ids)}>
        <ImageBackgroundWithLoading
          style={style.imageEmojiPinned}
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
        text: isPinned ? LocalText.unpin : LocalText.pin,
        onPress: onPressPinInBottomBar,
        icon: isPinned ? Icon.Pin : Icon.PinOutline,
      },
      {
        text: LocalText.random,
        onPress: onPressRandom,
        icon: Icon.Dice,
      },
      {
        text: LocalText.save,
        onPress: () => SaveMediaAsync(category, emojiUri_Result),
        icon: Icon.Download,
        countType: 'download',
      },
    ] as BottomBarItem[]
  }, [emojiUri_Result, onPressRandom, onPressPinInBottomBar, isPinned])

  const emojiUriArr = useMemo(() => {
    const arr = []

    for (let i = MinEmojiId; i <= MaxEmojiId; i++) {
      arr.push(singleEmojiUri(i))
    }

    return arr
  }, [])

  useEffect(() => {
    if (ids === undefined)
      return

    setEmojiUri_Result(mixEmojiUri(ids[0], ids[1]))
  }, [ids])

  // save last visit category screen

  useFocusEffect(
    useCallback(() => {
      SaveCurrentScreenForLoadNextTime(navigation)
    }, [])
  )

  // update header right

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => <HeaderRightButtons />
    });
  }, [])

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
              source={{ uri: emojiUri_Left, cache: 'force-cache' }}
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
              source={{ uri: emojiUri_Right, cache: 'force-cache' }}
              indicatorProps={{ color: theme.counterBackground }}
            />
          </TouchableOpacity>
        </View>

        {/* result view */}

        <Animated.View style={{ transform: [{ scale: mediaViewScaleAnimRef }] }}>
          <ImageBackgroundOrView
            newUriNewKey={true}
            style={!emojiUri_Result ? style.resultEmojiView : style.resultEmojiView_Border}
            source={{ uri: emojiUri_Result, cache: 'force-cache' }}
            indicatorProps={{ color: theme.counterBackground }}
            onLoad={onResultLoad}
            onError={(e) => AlertWithError(e.nativeEvent?.error ?? e.nativeEvent)}
          />
        </Animated.View>
      </View>

      {/* flat list pick emoji */}

      <HairLine widthPercent={'95%'} />

      <View style={style.pickEmojiFlatlistView}>
        <FlatList
          data={emojiUriArr}
          renderItem={renderItem}
          keyExtractor={(item) => item}
          numColumns={emojiColumn}
          showsVerticalScrollIndicator={false}
        />
      </View>

      {/* pinned */}

      {
        IsValuableArrayOrString(pinnedEmojiMixes) &&
        <HairLine widthPercent={'95%'} />
      }

      {
        IsValuableArrayOrString(pinnedEmojiMixes) && pinnedEmojiMixes &&
        <View style={style.pinnedView}>
          <FlatList
            data={pinnedEmojiMixes}
            renderItem={renderItemPinned}
            keyExtractor={(item) => item[0] + '_' + item[1]}
            showsVerticalScrollIndicator={false}
            horizontal={true}
            contentContainerStyle={style.pinnedFlatlist}
            showsHorizontalScrollIndicator={false}
          />
        </View>
      }

      {/* bottom bar */}

      <BottomBar
        items={bottomBarItems}
        category={category}
        minimal={true}
      />

    </View>
  )
}

export default EmojiScreen

const mixEmojiUri = (id1: number, id2: number) => {
  return `https://emojimix.app/emojimixfusion/${id1}_${id2}.png`
}

const singleEmojiUri = (id: number) => {
  return `https://emojimix.app/emojimixfusion/a${id}.png`
}