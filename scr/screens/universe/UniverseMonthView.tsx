// @ts-ignore
import { View, StyleSheet, Linking, FlatList, Text, TouchableOpacity } from 'react-native'
import React, { useCallback, useContext, useEffect, useMemo } from 'react'
import { ThemeContext } from '../../constants/Colors'
import { BorderRadius, Category, FontSize, FontWeight, Icon, LocalText, Outline } from '../../constants/AppConstants'
import { useFocusEffect, useNavigation } from '@react-navigation/native'
import { SaveCurrentScreenForLoadNextTime } from '../../handle/AppUtils'
import { MonthName, SafeDateString } from '../../handle/UtilsTS';
import { SwipeResult, useSimpleGesture } from '../../hooks/useSimpleGesture';
import BottomBar, { BottomBarItem } from '../others/BottomBar';
import HeaderRightButtons from '../components/HeaderRightButtons';
import MiniIAP from '../components/MiniIAP';
import { GetSourceUniverse } from '../../handle/services/UniverseApi';
import { RandomInt } from '../../handle/Utils';
import UniverseMonthItem from './UniverseMonthItem'
import { ScrollView } from 'react-native-gesture-handler'
import useScrollViewScrollTo from '../../hooks/useScrollViewScrollTo'

export const numColumnMonthItem = 6

const category = Category.Universe

const UniverseMonthView = ({
  monthYear,
  setMonthYear,
  onPressDayOfMonth,
}: {
  monthYear: Date,
  setMonthYear: (d: Date) => void,
  onPressDayOfMonth: (dayNum: number) => void
}) => {
  const navigation = useNavigation();
  const theme = useContext(ThemeContext);

  const idForShowMiniIapAndCountView = useMemo(() => {
    return SafeDateString(monthYear, '_')
  }, [monthYear])

  const onPressNextDay = useCallback(async (isNext: boolean) => {
    const nd = monthYear.setDate(monthYear.getDate() + (isNext ? 1 : -1))
    setMonthYear(new Date(nd))
  }, [monthYear])

  const onPressRandom = useCallback(async () => {
    // track_PressRandom(true, category, undefined)

    const minday = new Date(1995, 5, 20).getTime()

    setMonthYear(new Date(RandomInt(minday, Date.now())))
    // setDate(new Date(2014, 4, 21))
  }, [])

  const onPressSource = useCallback(() => {
    Linking.openURL(GetSourceUniverse(monthYear))
  }, [monthYear])

  // const onSwiped = useCallback((result: SwipeResult) => {
  //   if (!result.primaryDirectionIsHorizontalOrVertical)
  //     return

  //   if (result.primaryDirectionIsPositive) {
  //     onPressNextDay(result.primaryDirectionIsPositive ? true : false)
  //   }
  // }, [onPressNextDay])

  // const [onBigViewStartTouch, onBigViewEndTouch] = useSimpleGesture(undefined, undefined, onSwiped)

  const onPressToday = useCallback(async () => {
    setMonthYear(new Date())
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

  const daysToRender = useMemo(() => {
    const now = new Date()
    const isThisMonth = now.getMonth() === monthYear.getMonth() && now.getFullYear() === monthYear.getFullYear()

    let num = isThisMonth ? now.getDate() : new Date(monthYear.getFullYear(), monthYear.getMonth() + 1, 0).getDate()

    return new Array(num).fill(undefined)
  }, [monthYear])

  const yearsToRender = useMemo(() => {
    const arr = []

    for (let i = new Date().getFullYear(); i >= 1995; i--)
      arr.push(i)

    return arr
  }, [])

  const monthIndexesToRender = useMemo(() => {
    const arr = []
    let min = 0, max = 11

    if (monthYear.getFullYear() === 1995)
      min = 4
    else if (monthYear.getFullYear() === new Date().getFullYear())
      max = new Date().getMonth()

    for (let i = min; i <= max; i++)
      arr.push(i)

    return arr
  }, [monthYear])

  const style = useMemo(() => {
    return StyleSheet.create({
      masterView: { flex: 1, backgroundColor: theme.background, gap: Outline.GapHorizontal, },
      flatlistContainerView: { flex: 1, alignItems: 'center' },

      yearsMasterView: { marginLeft: Outline.GapVertical, flexDirection: 'row', gap: Outline.GapHorizontal, alignItems: 'center' },
      yearsScrollContainerView: { gap: Outline.GapHorizontal },

      yearTO: { padding: Outline.GapHorizontal, alignItems: 'center', justifyContent: 'center', },
      yearTO_Current: { padding: Outline.GapHorizontal, alignItems: 'center', justifyContent: 'center', backgroundColor: theme.primary, borderRadius: BorderRadius.BR8, },

      yearTxt: { fontSize: FontSize.Small_L, color: theme.counterBackground },
      yearTxt_Current: { fontSize: FontSize.Small_L, color: theme.counterPrimary },

      headerTxt: { fontWeight: FontWeight.Bold, fontSize: FontSize.Small_L, color: theme.counterBackground },

      title: { textAlign: 'center', fontWeight: FontWeight.Bold, fontSize: FontSize.Big, color: theme.counterBackground },
    })
  }, [theme])

  const onPressDay = useCallback((dayNum: number) => {
    onPressDayOfMonth(dayNum)
  }, [onPressDayOfMonth])

  const renderDay = useCallback(({ item, index }: { item: any, index: number }) => {
    return <UniverseMonthItem
      dayNum={index + 1}
      monthYear={monthYear}
      onPressDate={onPressDay}
    />
  }, [onPressDay, monthYear])

  const {
    ref: monthRef,
    onLayoutItem: onLayoutMonth,
    keyForScollView: keyForScollViewMonth,
  } = useScrollViewScrollTo(true, monthIndexesToRender, monthYear.getMonth(), undefined, -50)

  const {
    ref: yearRef,
    onLayoutItem: onLayoutYear,
    keyForScollView: keyForScollViewYear,
  } = useScrollViewScrollTo(true, yearsToRender, monthYear.getFullYear(), undefined, -50)

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
      {/* years */}

      <View style={style.yearsMasterView}>
        <Text style={style.headerTxt}>{LocalText.year}:</Text>

        <ScrollView
          ref={yearRef}
          horizontal
          contentContainerStyle={style.yearsScrollContainerView}
          showsHorizontalScrollIndicator={false}
          key={keyForScollViewYear}
        >
          {
            yearsToRender.map((year) => {
              const isCurrent = year === monthYear.getFullYear()

              return (
                <TouchableOpacity onLayout={onLayoutYear} key={year} onPress={() => setMonthYear(new Date(year, monthYear.getMonth(), 1))} style={isCurrent ? style.yearTO_Current : style.yearTO}>
                  <Text style={isCurrent ? style.yearTxt_Current : style.yearTxt}>{year}</Text>
                </TouchableOpacity>
              )
            })
          }
        </ScrollView>
      </View>

      {/* month */}

      <View style={style.yearsMasterView}>
        <Text style={style.headerTxt}>{LocalText.month}:</Text>

        <ScrollView
          horizontal
          contentContainerStyle={style.yearsScrollContainerView}
          showsHorizontalScrollIndicator={false}
          ref={monthRef}
          key={keyForScollViewMonth}
        >
          {
            monthIndexesToRender.map((monthIndex) => {
              const isCurrent = monthIndex === monthYear.getMonth()

              return (
                <TouchableOpacity
                  onLayout={onLayoutMonth}
                  key={monthIndex} onPress={() => setMonthYear(new Date(monthYear.getFullYear(), monthIndex, 1))} style={isCurrent ? style.yearTO_Current : style.yearTO}>
                  <Text style={isCurrent ? style.yearTxt_Current : style.yearTxt}>{MonthName(monthIndex, false)}</Text>
                </TouchableOpacity>
              )
            })
          }
        </ScrollView>
      </View>

      {/* title */}

      <Text style={style.title}>{`${MonthName(monthYear.getMonth(), true)} ${monthYear.getFullYear()}`}</Text>

      {/* list day */}

      <View style={style.flatlistContainerView}>
        <FlatList
          data={daysToRender}
          renderItem={renderDay}
          numColumns={numColumnMonthItem}
        />
      </View>

      {/* main btn part */}

      < BottomBar
        items={bottomBarItems}
        category={category}
        id={idForShowMiniIapAndCountView}
      />

      {/* mini iap */}

      <MiniIAP postID={idForShowMiniIapAndCountView} />
    </View >
  )
}

export default UniverseMonthView