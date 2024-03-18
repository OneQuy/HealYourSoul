import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { BorderRadius, FontSize, FontWeight, LocalText, Outline } from '../../constants/AppConstants'
import { ThemeContext } from '../../constants/Colors';
import { track_SimpleWithParam } from '../../handle/tracking/GoodayTracking';
import UniversePicOfDayView from './UniversePicOfDayView';
import UniverseMonthView from './UniverseMonthView';

type SubView = 'day' | 'month'

const UniverseScreen = () => {
  const theme = useContext(ThemeContext);
  const [subview, setSubView] = useState<SubView>('day')
  const [currentDate, setCurrentDate] = useState(new Date())
  const [currentDateOfMonthView, setCurrentDateOfMonthView] = useState(new Date())

  const onPressDayOfMonth = useCallback((dayNum: number) => {
    setCurrentDate(new Date(
      currentDateOfMonthView.getFullYear(),
      currentDateOfMonthView.getMonth(),
      dayNum))

    setSubView('day')
  }, [currentDateOfMonthView])

  const onPressView = useCallback((view: SubView) => {
    track_SimpleWithParam('universe', 'view_' + view)

    setSubView(view)
  }, [])

  const style = useMemo(() => {
    return StyleSheet.create({
      masterView: { flex: 1, backgroundColor: theme.background, },
      topButtonContainerView: { padding: Outline.GapVertical, paddingHorizontal: Outline.GapVertical_2, gap: Outline.GapHorizontal, flexDirection: 'row' },
      topButtonTO: { borderColor: theme.primary, borderWidth: StyleSheet.hairlineWidth, padding: Outline.GapVertical, borderRadius: BorderRadius.BR8, flex: 1, backgroundColor: theme.primary, justifyContent: 'center', alignItems: 'center' },
      topButtonTO_Inactive: { borderColor: theme.primary, borderWidth: StyleSheet.hairlineWidth, padding: Outline.GapVertical, borderRadius: BorderRadius.BR8, flex: 1, justifyContent: 'center', alignItems: 'center' },
      topButtonText: { color: theme.counterPrimary, fontWeight: FontWeight.B600, fontSize: FontSize.Small },
      topButtonText_Inactive: { color: theme.counterBackground, fontWeight: FontWeight.B600, fontSize: FontSize.Small },
    })
  }, [theme])

  // auto swith to current selected month when go to month view

  useEffect(() => {
    setCurrentDateOfMonthView(new Date(currentDate.getFullYear(), currentDate.getMonth(), 1))
  }, [currentDate])

  return (
    <View style={style.masterView}>

      {
        <View style={style.topButtonContainerView}>
          <TouchableOpacity onPress={() => onPressView('day')} style={subview === 'day' ? style.topButtonTO : style.topButtonTO_Inactive}>
            <Text adjustsFontSizeToFit numberOfLines={1} style={subview === 'day' ? style.topButtonText : style.topButtonText_Inactive}>{LocalText.pic_of_day}</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => onPressView('month')} style={subview === 'month' ? style.topButtonTO : style.topButtonTO_Inactive}>
            <Text adjustsFontSizeToFit numberOfLines={1} style={subview === 'month' ? style.topButtonText : style.topButtonText_Inactive}>{LocalText.select_month}</Text>
          </TouchableOpacity>
        </View>
      }

      {
        subview === 'day' &&
        <UniversePicOfDayView
          date={currentDate}
          setDate={setCurrentDate}
        />
      }


      {
        subview === 'month' &&
        <UniverseMonthView
          onPressDayOfMonth={onPressDayOfMonth}
          monthYear={currentDateOfMonthView}
          setMonthYear={setCurrentDateOfMonthView}
        />
      }
    </View>
  )
}

export default UniverseScreen