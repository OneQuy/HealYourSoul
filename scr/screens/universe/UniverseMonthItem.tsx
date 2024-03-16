// @ts-ignore
import { StyleSheet } from 'react-native'
import React, { useCallback, useContext, useEffect, useMemo } from 'react'
import { ThemeContext } from '../../constants/Colors'
import ImageBackgroundWithLoading from '../components/ImageBackgroundWithLoading'
import { prependZero } from '../../handle/Utils'

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
  }, [dayNum])


  const reloadAsync = useCallback(async () => {
  }, [dayNum, monthYear])

  const uri = useMemo(() => {
    const year = monthYear.getFullYear().toString().substring(2)
    return `https://apod.nasa.gov/apod/calendar/S_${year}${prependZero(monthYear.getMonth() + 1)}${prependZero(dayNum)}.jpg`
  }, [dayNum, monthYear])

  const style = useMemo(() => {
    return StyleSheet.create({
      masterView: { width: 50, height: 50, },
      flatlistContainerView: { flex: 1 },
    })
  }, [theme])

  useEffect(() => {
    reloadAsync()
  }, [dayNum, monthYear])

  return (
    <ImageBackgroundWithLoading key={dayNum} source={{ uri }} style={style.masterView}>


    </ImageBackgroundWithLoading>
  )
}

export default UniverseMonthItem