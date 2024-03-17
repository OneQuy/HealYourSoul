// @ts-ignore
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import { View, StyleSheet, FlatList, Text, TouchableOpacity } from 'react-native'
import React, { useCallback, useContext, useEffect, useMemo } from 'react'
import { ThemeContext } from '../../constants/Colors'
import { BorderRadius, Category, FontSize, FontWeight, Icon, LocalText, Outline, Size } from '../../constants/AppConstants'
import { useFocusEffect, useNavigation } from '@react-navigation/native'
import { SaveCurrentScreenForLoadNextTime } from '../../handle/AppUtils'
import { MonthName, SafeDateString } from '../../handle/UtilsTS';
import HeaderRightButtons from '../components/HeaderRightButtons';
import MiniIAP from '../components/MiniIAP';
import { RandomInt } from '../../handle/Utils';
import UniverseMonthItem from './UniverseMonthItem'
import { ScrollView } from 'react-native-gesture-handler'
import useScrollViewScrollTo from '../../hooks/useScrollViewScrollTo'
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import ViewCount from '../components/ViewCount';

const fullMonthIndex = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]

export const numColumnMonthItem = 6

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
  const { bottom: bottomSafe } = useSafeAreaInsets()

  const idForShowMiniIapAndCountView = useMemo(() => {
    return `month_view/${MonthName(monthYear.getMonth(), false)}_${monthYear.getFullYear()}`
  }, [monthYear])

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
    return getMonthIndexesOfYear(monthYear.getFullYear())
  }, [monthYear])

  const style = useMemo(() => {
    return StyleSheet.create({
      masterView: { flex: 1, backgroundColor: theme.background, gap: Outline.GapHorizontal, },
      flatlistContainerView: { flex: 1, alignItems: 'center' },
      viewCount: { marginRight: Outline.GapVertical, alignItems: 'flex-end', },

      yearsMasterView: { marginLeft: Outline.GapVertical, flexDirection: 'row', gap: Outline.GapHorizontal, alignItems: 'center' },
      yearsScrollContainerView: { gap: Outline.GapHorizontal },

      randomTO: { marginHorizontal: Outline.GapVertical, marginBottom: bottomSafe > 0 ? bottomSafe : Outline.GapVertical, gap: Outline.GapHorizontal, borderRadius: BorderRadius.BR, padding: Outline.GapVertical_2, backgroundColor: theme.primary, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', },
      randomTxt: { color: theme.counterPrimary, fontSize: FontSize.Normal },

      yearTO: { padding: Outline.GapHorizontal, alignItems: 'center', justifyContent: 'center', },
      yearTO_Current: { padding: Outline.GapHorizontal, alignItems: 'center', justifyContent: 'center', backgroundColor: theme.primary, borderRadius: BorderRadius.BR8, },

      yearTxt: { fontSize: FontSize.Small_L, color: theme.counterBackground },
      yearTxt_Current: { fontSize: FontSize.Small_L, color: theme.counterPrimary },

      headerTxt: { fontWeight: FontWeight.Bold, fontSize: FontSize.Small_L, color: theme.counterBackground },

      title: { textAlign: 'center', fontWeight: FontWeight.Bold, fontSize: FontSize.Big, color: theme.counterBackground },
    })
  }, [theme])

  const onPressYear = useCallback((year: number) => {
    const months = getMonthIndexesOfYear(year)

    if (months.includes(monthYear.getMonth()))
      setMonthYear(new Date(year, monthYear.getMonth(), 1))
    else
      setMonthYear(new Date(year, months[0], 1))
  }, [monthYear])

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
    scrollToItem: scrollToMonthIndex,
  } = useScrollViewScrollTo(true, monthIndexesToRender, monthIndexesToRender.includes(monthYear.getMonth()) ? monthYear.getMonth() : monthIndexesToRender[0], undefined, -50)

  const {
    ref: yearRef,
    onLayoutItem: onLayoutYear,
    keyForScollView: keyForScollViewYear,
    scrollToItem: scrollToYear,
  } = useScrollViewScrollTo(true, yearsToRender, monthYear.getFullYear(), undefined, -50)

  const onPressRandom = useCallback(async () => {
    // track_PressRandom(true, category, undefined)

    const minday = new Date(1995, 5, 20).getTime()
    const date = new Date(RandomInt(minday, Date.now()))
    setMonthYear(date)

    scrollToMonthIndex(date.getMonth())
    scrollToYear(date.getFullYear())
  }, [scrollToMonthIndex, scrollToYear])

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
                <TouchableOpacity onLayout={onLayoutYear} key={year} onPress={() => onPressYear(year)} style={isCurrent ? style.yearTO_Current : style.yearTO}>
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

      {/* view count */}

      <View style={style.viewCount}>
        <ViewCount cat={Category.Universe} id={idForShowMiniIapAndCountView} />
      </View>

      {/* random */}

      <TouchableOpacity onPress={onPressRandom} style={style.randomTO}>
        <MaterialCommunityIcons name={Icon.Dice} color={theme.counterPrimary} size={Size.Icon} />
        <Text style={style.randomTxt}>{LocalText.random}</Text>
      </TouchableOpacity>

      {/* mini iap */}

      <MiniIAP postID={idForShowMiniIapAndCountView} />
    </View >
  )
}

export default UniverseMonthView

const getMonthIndexesOfYear = (year: number) => {
  const arr = []
  let min = 0, max = 11

  if (year === 1995)
    min = 5
  else if (year === new Date().getFullYear())
    max = new Date().getMonth()

  if (min === 0 && max === 11)
    return fullMonthIndex

  for (let i = min; i <= max; i++)
    arr.push(i)

  return arr
}