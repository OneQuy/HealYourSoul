// @ts-ignore
import { StyleSheet, Text, TouchableOpacity } from 'react-native'
import React, { useCallback, useContext, useEffect, useMemo } from 'react'
import { ThemeContext } from '../../constants/Colors'
import ImageBackgroundWithLoading from '../components/ImageBackgroundWithLoading'
import { prependZero } from '../../handle/Utils'
import { FontSize, FontWeight, Outline } from '../../constants/AppConstants'
import { widthPercentageToDP } from 'react-native-responsive-screen'
import { numColumnMonthItem } from './UniverseMonthView'

const UniverseMonthItem = ({
  dayNum,
  monthYear,
  onPressDate
}: {
  dayNum: number,
  monthYear: Date,
  onPressDate: (dayNum: number) => void,
}) => {
  const theme = useContext(ThemeContext);

  const onPressToday = useCallback(async () => {
    onPressDate(dayNum)
  }, [dayNum, onPressDate])


  const reloadAsync = useCallback(async () => {
  }, [dayNum, monthYear])

  const uri = useMemo(() => {
    const year = monthYear.getFullYear().toString().substring(2)
    return `https://apod.nasa.gov/apod/calendar/S_${year}${prependZero(monthYear.getMonth() + 1)}${prependZero(dayNum)}.jpg`
  }, [dayNum, monthYear])

  const style = useMemo(() => {
    return StyleSheet.create({
      masterView: { width: (widthPercentageToDP(100) - Outline.GapVertical * 2) / numColumnMonthItem, aspectRatio: 1, },
      flatlistContainerView: { flex: 1 },
      textDay: { color: 'white', fontSize: FontSize.Small_L, fontWeight: FontWeight.B500 },
    })
  }, [theme])

  useEffect(() => {
    reloadAsync()
  }, [dayNum, monthYear])

  return (
    <TouchableOpacity key={dayNum} onPress={onPressToday}>
      <ImageBackgroundWithLoading source={{ uri }} style={style.masterView}>
        <Text style={style.textDay}>{dayNum}</Text>
      </ImageBackgroundWithLoading>
    </TouchableOpacity>
  )
}

export default UniverseMonthItem