// @ts-ignore
import { View, StyleSheet, Animated, Linking, FlatList } from 'react-native'
import React, { useCallback, useContext, useEffect, useMemo, useRef } from 'react'
import { ThemeContext } from '../../constants/Colors'
import { Category, FontSize, FontWeight, Icon, LocalText, Outline } from '../../constants/AppConstants'
import { useFocusEffect, useNavigation } from '@react-navigation/native'
import { SaveCurrentScreenForLoadNextTime } from '../../handle/AppUtils'
import { heightPercentageToDP, widthPercentageToDP } from 'react-native-responsive-screen';
import { SafeDateString } from '../../handle/UtilsTS';
import { SwipeResult, useSimpleGesture } from '../../hooks/useSimpleGesture';
import { playAnimLoadedMedia } from '../../handle/GoodayAnimation';
import BottomBar, { BottomBarItem } from '../others/BottomBar';
import HeaderRightButtons from '../components/HeaderRightButtons';
import MiniIAP from '../components/MiniIAP';
import { GetSourceUniverse } from '../../handle/services/UniverseApi';
import { RandomInt } from '../../handle/Utils';
import UniverseMonthItem from './UniverseMonthItem'

const category = Category.Universe

const UniverseMonthView = ({
  date,
  setDate,
}: {
  date: Date,
  setDate: (d: Date) => void,
}) => {
  const navigation = useNavigation();
  const theme = useContext(ThemeContext);

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


  const onPressSource = useCallback(() => {
    Linking.openURL(GetSourceUniverse(date))
  }, [date])

  const onSwiped = useCallback((result: SwipeResult) => {
    if (!result.primaryDirectionIsHorizontalOrVertical)
      return

    if (result.primaryDirectionIsPositive) {
      onPressNextDay(result.primaryDirectionIsPositive ? true : false)
    }
  }, [onPressNextDay])

  const [onBigViewStartTouch, onBigViewEndTouch] = useSimpleGesture(undefined, undefined, onSwiped)

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
  }, [onPressNextDay, onPressToday, onPressRandom])

  const reloadAsync = useCallback(async () => {
  }, [date])

  const daysToRender = useMemo(() => {
    const now = new Date()
    const isThisMonth = now.getMonth() === date.getMonth() && now.getFullYear() === date.getFullYear()

    let num = isThisMonth ? now.getDate() : new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate()

    return new Array(num).fill(undefined)
  }, [date])

  const style = useMemo(() => {
    return StyleSheet.create({
      masterView: { flex: 1, backgroundColor: theme.background },
      flatlistContainerView: { flex: 1 },
      // contentScrollView: { flex: 1, marginHorizontal: Outline.GapVertical },
      // titleView: { textAlign: 'center', marginHorizontal: Outline.GapVertical, fontSize: FontSize.Normal, fontWeight: FontWeight.B500 },
      // creditTxt: { fontStyle: 'italic', marginHorizontal: Outline.GapVertical, fontSize: FontSize.Small_L, },
    })
  }, [theme])

  const onPressDay = useCallback((dayNum: number) => {

  }, [date])

  const renderDay = useCallback(({ item, index }: { item: any, index: number }) => {
    return <UniverseMonthItem
      dayNum={index + 1}
      monthYear={date}
      onPressDate={onPressDay}
    />
  }, [])

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
    <View style={style.masterView}>

      <View style={style.flatlistContainerView}>
        <FlatList
          data={daysToRender}
          renderItem={renderDay}
          numColumns={7}
        />
      </View>

      {/* main btn part */}

      < BottomBar
        items={bottomBarItems}
        category={category}
        id={id}
      />

      {/* mini iap */}

      <MiniIAP postID={date.toDateString()} />
    </View >
  )
}

export default UniverseMonthView