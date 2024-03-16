// @ts-ignore
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { View, Text, TouchableOpacity, ActivityIndicator, StyleSheet, GestureResponderEvent, Animated, Linking } from 'react-native'
import React, { useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'
import { ThemeContext } from '../../constants/Colors'
import { BorderRadius, Category, FontSize, FontWeight, Icon, LocalText, NeedReloadReason, Outline, Size } from '../../constants/AppConstants'
import { useFocusEffect, useNavigation } from '@react-navigation/native'
import { AlertWithError, SaveCurrentScreenForLoadNextTime } from '../../handle/AppUtils'
import { CommonStyles } from '../../constants/CommonConstants'
import { UniversePicOfDayData } from '../../constants/Types';
import { heightPercentageToDP, widthPercentageToDP } from 'react-native-responsive-screen';
import { ScrollView } from 'react-native-gesture-handler';
import { SafeDateString } from '../../handle/UtilsTS';
import ImageBackgroundWithLoading from '../components/ImageBackgroundWithLoading';
import { SwipeResult, useSimpleGesture } from '../../hooks/useSimpleGesture';
import { playAnimLoadedMedia } from '../../handle/GoodayAnimation';
import BottomBar, { BottomBarItem } from '../others/BottomBar';
import HeaderRightButtons from '../components/HeaderRightButtons';
import MiniIAP from '../components/MiniIAP';
import ViewCount from '../components/ViewCount';
import { GetSourceUniverse, GetUniversePicOfDayDataAsync } from '../../handle/services/UniverseApi';
import { NetLord } from '../../handle/NetLord';
import { RandomInt } from '../../handle/Utils';

const category = Category.Universe

const UniversePicOfDayView = ({
  date,
  setDate,
}: {
  date: Date,
  setDate: (d: Date) => void,
}) => {
  const navigation = useNavigation();
  const [reasonToReload, setReasonToReload] = useState(NeedReloadReason.None);
  const theme = useContext(ThemeContext);
  const [handling, setHandling] = useState(true)
  const [curentDayData, setCurentDayData] = useState<UniversePicOfDayData | undefined>(undefined)
  const favoriteCallbackRef = useRef<(() => void) | undefined>(undefined);

  const mediaViewScaleAnimRef = useRef(new Animated.Value(1)).current

  const onImageLoaded = useCallback(() => {
    playAnimLoadedMedia(mediaViewScaleAnimRef)
  }, [])

  const id = useMemo(() => {
    return SafeDateString(date, '_')
  }, [date])

  const onPressNextDay = useCallback(async (isNext: boolean) => {
    const nd = date.setDate(date.getDate() + (isNext ? 1 : -1))
    setDate(new Date(nd))
  }, [date])

  const onPressRandom = useCallback(async () => {
    // track_PressRandom(true, category, undefined)

    const minday = new Date(1995, 5, 20).getTime()

    setDate(new Date(RandomInt(minday, Date.now())))
    // setDate(new Date(2014, 4, 21))
  }, [])

  const onPressShareText = useCallback(async () => {
    // if (!selectingItem)
    //     return

    // track_SimpleWithCat(category, 'share')

    // const flp = GetFLPFromRLP(TempDirName + '/image.jpg', true)
    // const res = await DownloadFileAsync(selectingItem.thumbnailUri, flp, false)

    // if (res) {
    //     Alert.alert('Fail', ToCanPrint(res))
    //     return
    // }

    // const message =
    //     '#' + selectingItem.rank + '. ' +
    //     selectingItem.title + ': ' +
    //     selectingItem.desc + '\n' +
    //     selectingItem.info + '\n' +
    //     '★ ' + selectingItem.rate + ' on IMDb'

    // console.log(message);

    // Share
    //     .open({
    //         message,
    //         url: flp,
    //     })
    //     .catch((err) => {
    //         const error = ToCanPrint(err)

    //         if (!error.includes('User did not share'))
    //             Alert.alert('Fail', error)
    //     })
  }, [curentDayData, theme])

  const onPressSource = useCallback(() => {
    Linking.openURL(GetSourceUniverse(date))
  }, [date])

  const onTapCounted = useCallback((count: number, _: GestureResponderEvent['nativeEvent']) => {
    if (count === 2) {
      if (favoriteCallbackRef.current)
        favoriteCallbackRef.current()
    }
  }, [])

  const onSwiped = useCallback((result: SwipeResult) => {
    if (!result.primaryDirectionIsHorizontalOrVertical)
      return

    if (result.primaryDirectionIsPositive) {
      onPressNextDay(result.primaryDirectionIsPositive ? true : false)
    }
  }, [onPressNextDay])

  const [onBigViewStartTouch, onBigViewEndTouch] = useSimpleGesture(onTapCounted, undefined, onSwiped)

  const onPressToday = useCallback(async () => {
    setDate(new Date())
  }, [])

  const bottomBarItems = useMemo(() => {
    return [
      {
        text: LocalText.previous_day,
        onPress: () => onPressNextDay(false),
        icon: Icon.Left,
        scaleIcon: 1.5,
      },
      {
        text: LocalText.share,
        onPress: onPressShareText,
        icon: Icon.ShareText,
        countType: 'share',
      },
      // {
      //   favoriteCallbackRef: favoriteCallbackRef,
      // },
      {
        text: LocalText.today,
        onPress: onPressToday,
        icon: Icon.Today,
      },
      {
        text: LocalText.random,
        onPress: onPressRandom,
        icon: Icon.Dice,
      },
      {
        text: LocalText.next_day,
        onPress: () => onPressNextDay(true),
        icon: Icon.Right,
        scaleIcon: 1.5,
      },
    ] as BottomBarItem[]
  }, [onPressNextDay, onPressToday, onPressRandom, onPressShareText])

  const reloadAsync = useCallback(async () => {
    setHandling(true)
    setReasonToReload(NeedReloadReason.None)
    setCurentDayData(undefined)

    const data = await GetUniversePicOfDayDataAsync(date)

    setHandling(false)

    if (!(data instanceof Error)) { // success
      setCurentDayData(data)
      return
    }
    else { // fail
      AlertWithError(data)

      if (NetLord.IsAvailableLatestCheck())
        setReasonToReload(NeedReloadReason.FailToGetContent)
      else
        setReasonToReload(NeedReloadReason.NoInternet)
    }
  }, [date])

  useEffect(() => {
    reloadAsync()
  }, [date])

  // update header setting btn

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => <HeaderRightButtons />
    });
  }, [])

  // save last visit category screen

  useFocusEffect(useCallback(() => SaveCurrentScreenForLoadNextTime(navigation), []))

  return (
    <View pointerEvents={handling ? 'none' : 'auto'} style={[styleSheet.masterView, { backgroundColor: theme.background }]}>
      <View style={CommonStyles.flex_1} >
        {
          handling ?
            <View style={CommonStyles.flex1_justifyContentCenter_AlignItemsCenter}>
              <ActivityIndicator color={theme.counterBackground} style={{ marginRight: Outline.Horizontal }} />
            </View> :
            <View style={CommonStyles.flex1_justifyContentCenter_AlignItemsCenter}>
              {
                reasonToReload !== NeedReloadReason.None ?
                  <TouchableOpacity onPress={reloadAsync} style={[{ gap: Outline.GapVertical }, CommonStyles.flex1_justifyContentCenter_AlignItemsCenter]} >
                    <MaterialCommunityIcons name={reasonToReload === NeedReloadReason.NoInternet ? Icon.NoInternet : Icon.HeartBroken} color={theme.counterBackground} size={Size.IconMedium} />
                    <Text style={{ fontSize: FontSize.Normal, color: theme.counterBackground }}>{reasonToReload === NeedReloadReason.NoInternet ? LocalText.no_internet : LocalText.cant_get_content}</Text>
                    <Text style={{ fontSize: FontSize.Small_L, color: theme.counterBackground }}>{LocalText.tap_to_retry}</Text>
                  </TouchableOpacity>
                  :
                  <View onTouchStart={onBigViewStartTouch} onTouchEnd={onBigViewEndTouch} style={styleSheet.contentView}>
                    <Animated.View style={[{ transform: [{ scale: mediaViewScaleAnimRef }] }]}>
                      <ImageBackgroundWithLoading onLoad={onImageLoaded} resizeMode='contain' source={{ uri: curentDayData?.imgUri }} style={styleSheet.image} indicatorProps={{ color: theme.counterBackground }} />
                    </Animated.View>
                    <Text selectable style={[styleSheet.titleView, { color: theme.counterBackground, }]}>{curentDayData?.title}</Text>
                    <Text selectable style={[styleSheet.infoTextView, { color: theme.counterBackground, }]}>{curentDayData?.credit}</Text>
                    <View style={styleSheet.contentScrollView}>
                      <ScrollView >
                        <Text selectable adjustsFontSizeToFit style={[{ flexWrap: 'wrap', color: theme.counterBackground, fontSize: FontSize.Small_L }]}>{curentDayData?.explanation}</Text>
                      </ScrollView>
                    </View>
                    <View style={{ flexDirection: 'row', }}>
                      <TouchableOpacity onPress={onPressSource} style={{ flex: 1, marginLeft: Outline.GapVertical_2 }}>
                        <Text adjustsFontSizeToFit numberOfLines={1} style={{ flex: 1, fontSize: FontSize.Small }}>{LocalText.source + ': ' + GetSourceUniverse(date)}</Text>
                      </TouchableOpacity>
                      {/* view count */}
                      <View style={{ marginRight: Outline.GapVertical, alignItems: 'flex-end', }}>
                        <ViewCount cat={category} id={id} />
                      </View>
                    </View>
                  </View>
              }
            </View>
        }
      </View>

      {/* main btn part */}
      <BottomBar
        items={bottomBarItems}
        category={category}
        id={id}
      />

      <MiniIAP postID={curentDayData?.title} />
    </View>
  )
}

export default UniversePicOfDayView

const styleSheet = StyleSheet.create({
  masterView: { flex: 1, gap: Outline.GapVertical, },
  headerOptionTO: { marginRight: 15 },
  image: { width: widthPercentageToDP(100), height: heightPercentageToDP(40) },
  contentView: { flex: 1, gap: Outline.GapVertical, paddingTop: Outline.GapHorizontal },
  contentScrollView: { flex: 1, marginHorizontal: Outline.GapVertical_2 },
  titleView: { marginLeft: Outline.Horizontal, fontSize: FontSize.Normal, fontWeight: FontWeight.B500 },
  infoTextView: { paddingLeft: Outline.Horizontal, fontSize: FontSize.Small_L, },
  titleTO: { marginHorizontal: Outline.GapVertical_2, flexDirection: 'row', justifyContent: 'space-between' },
  titleText: { marginLeft: widthPercentageToDP(12), flex: 1, textAlign: 'center', fontWeight: FontWeight.Bold, fontSize: FontSize.Big },
  titleContainerView: { paddingHorizontal: Outline.GapVertical, flexDirection: 'row', gap: Outline.GapHorizontal },
  showListIconView: { padding: Outline.GapHorizontal, borderWidth: StyleSheet.hairlineWidth, borderRadius: BorderRadius.BR8 },
})