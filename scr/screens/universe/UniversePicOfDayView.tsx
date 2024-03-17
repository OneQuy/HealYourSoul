// @ts-ignore
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { View, Text, TouchableOpacity, ActivityIndicator, StyleSheet, Animated, Linking, Alert } from 'react-native'
import React, { useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'
import { ThemeContext } from '../../constants/Colors'
import { Category, FontSize, FontWeight, Icon, LocalText, NeedReloadReason, Outline, Size } from '../../constants/AppConstants'
import { useFocusEffect, useNavigation } from '@react-navigation/native'
import { AlertWithError, SaveCurrentScreenForLoadNextTime } from '../../handle/AppUtils'
import { CommonStyles } from '../../constants/CommonConstants'
import { UniversePicOfDayData } from '../../constants/Types';
import { heightPercentageToDP, widthPercentageToDP } from 'react-native-responsive-screen';
import { ScrollView } from 'react-native-gesture-handler';
import { IsToday, SafeDateString, ToCanPrint } from '../../handle/UtilsTS';
import ImageBackgroundWithLoading from '../components/ImageBackgroundWithLoading';
import { SwipeResult, useSimpleGesture } from '../../hooks/useSimpleGesture';
import { playAnimLoadedMedia } from '../../handle/GoodayAnimation';
import BottomBar, { BottomBarItem } from '../others/BottomBar';
import HeaderRightButtons from '../components/HeaderRightButtons';
import MiniIAP from '../components/MiniIAP';
import ViewCount from '../components/ViewCount';
import { GetSourceUniverse, GetUniversePicOfDayDataAsync } from '../../handle/services/UniverseApi';
import { NetLord } from '../../handle/NetLord';
import { RandomInt, TempDirName } from '../../handle/Utils';
import { track_PressRandom, track_SimpleWithCat, track_SimpleWithParam } from '../../handle/tracking/GoodayTracking';
import { DownloadFileAsync, GetFLPFromRLP } from '../../handle/FileUtils';
import Share from 'react-native-share';

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
  // const favoriteCallbackRef = useRef<(() => void) | undefined>(undefined);

  const mediaViewScaleAnimRef = useRef(new Animated.Value(1)).current

  const onImageLoaded = useCallback(() => {
    playAnimLoadedMedia(mediaViewScaleAnimRef)
  }, [])

  const id = useMemo(() => {
    return SafeDateString(date, '_')
  }, [date])

  const onPressNextDay = useCallback(async (isNext: boolean) => {
    track_SimpleWithParam('universe', isNext ? 'next_day' : 'previous_day')

    const nd = date.setDate(date.getDate() + (isNext ? 1 : -1))
    setDate(new Date(nd))
  }, [date])

  const onPressRandom = useCallback(async () => {
    track_PressRandom(true, category, undefined)

    const minday = new Date(1995, 5, 20).getTime()

    setDate(new Date(RandomInt(minday, Date.now())))
    // setDate(new Date(2014, 4, 21))
  }, [])

  const onPressShareText = useCallback(async () => {
    if (!curentDayData || (!curentDayData.imgUri && !curentDayData.thumbUri))
      return

    track_SimpleWithCat(category, 'share')

    const flp = GetFLPFromRLP(TempDirName + '/image.jpg', true)

    // @ts-ignore
    const res = await DownloadFileAsync(curentDayData.imgUri ?? curentDayData.thumbUri, flp, false)

    if (res) {
      Alert.alert('Fail to share', ToCanPrint(res))
      return
    }

    const message =
      LocalText.astronomy_pic + ': ' + SafeDateString(date, ' ') + '\n' +
      curentDayData.title + '\n' +
      LocalText.credit_to + ': ' + curentDayData.credit + '\n\n' +
      curentDayData.explanation + '\n\n' +
      LocalText.source + ': ' + GetSourceUniverse(date)

    console.log(message);

    Share
      .open({
        message,
        url: flp,
      })
      .catch((err) => {
        const error = ToCanPrint(err)

        if (!error.includes('User did not share'))
          Alert.alert('Fail', error)
      })
  }, [curentDayData, date])

  const onPressSource = useCallback(() => {
    Linking.openURL(GetSourceUniverse(date))
  }, [date])

  // const onTapCounted = useCallback((count: number, _: GestureResponderEvent['nativeEvent']) => {
  //   if (count === 2) {
  //     if (favoriteCallbackRef.current)
  //       favoriteCallbackRef.current()
  //   }
  // }, [])

  const onSwiped = useCallback((result: SwipeResult) => {
    if (!result.primaryDirectionIsHorizontalOrVertical)
      return

    onPressNextDay(!result.primaryDirectionIsPositive)
  }, [onPressNextDay])

  const [onBigViewStartTouch, onBigViewEndTouch] = useSimpleGesture(undefined, undefined, onSwiped)

  const onPressToday = useCallback(async () => {
    track_SimpleWithParam('universe', 'today')
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
        text: LocalText.random_day,
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
      if (IsToday(date)) {
        Alert.alert(LocalText.popup_title_error, LocalText.popup_content_error_universe_today)
      }
      else if (date.getTime() > Date.now()) {
        Alert.alert(LocalText.popup_title_error, LocalText.popup_content_error_universe_future)
      }
      else
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
                    {/* date */}

                    <Text selectable adjustsFontSizeToFit numberOfLines={1} style={[styleSheet.titleView, { color: theme.counterBackground, }]}>{IsToday(date) ? LocalText.today : SafeDateString(date, ' ')}</Text>

                    {/* image */}

                    <Animated.View style={[{ transform: [{ scale: mediaViewScaleAnimRef }] }]}>
                      <ImageBackgroundWithLoading onLoad={onImageLoaded} resizeMode='contain' source={{ uri: curentDayData?.thumbUri ?? curentDayData?.imgUri }} style={styleSheet.image} indicatorProps={{ color: theme.counterBackground }} />
                    </Animated.View>

                    {/* title */}

                    <Text selectable adjustsFontSizeToFit numberOfLines={1} style={[styleSheet.titleView, { color: theme.primary, }]}>{curentDayData?.title}</Text>

                    {/* credit */}

                    {
                      curentDayData?.credit &&
                      <Text adjustsFontSizeToFit numberOfLines={2} selectable style={[styleSheet.creditTxt, { color: theme.counterBackground, }]}>{LocalText.credit_to + ': ' + curentDayData?.credit}</Text>
                    }

                    {/* explanation */}

                    <View style={styleSheet.contentScrollView}>
                      <ScrollView >
                        <Text selectable adjustsFontSizeToFit style={[{ flexWrap: 'wrap', color: theme.counterBackground, fontSize: FontSize.Small_L }]}>{curentDayData?.explanation}</Text>
                      </ScrollView>
                    </View>

                    {/* source & view count */}

                    <View style={{ flexDirection: 'row', marginVertical: Outline.GapHorizontal / 2, }}>
                      <TouchableOpacity onPress={onPressSource} style={{ flex: 1, marginLeft: Outline.GapVertical }}>
                        <Text adjustsFontSizeToFit numberOfLines={1} style={{ color: theme.counterBackground, flex: 1, fontSize: FontSize.Small }}>{LocalText.source + ': ' + GetSourceUniverse(date)}</Text>
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
  masterView: { flex: 1, },
  image: { width: widthPercentageToDP(100), height: heightPercentageToDP(40) },
  contentView: { flex: 1, gap: Outline.GapHorizontal, paddingTop: Outline.GapHorizontal },
  contentScrollView: { flex: 1, marginHorizontal: Outline.GapVertical },
  titleView: { textAlign: 'center', marginHorizontal: Outline.GapVertical, fontSize: FontSize.Normal, fontWeight: FontWeight.B500 },
  creditTxt: { fontStyle: 'italic', marginHorizontal: Outline.GapVertical, fontSize: FontSize.Small_L, },
})