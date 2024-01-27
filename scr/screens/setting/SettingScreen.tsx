import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useCallback, useContext, useMemo, useState } from 'react'
import { BorderRadius, FontSize, FontWeight, Outline } from '../../constants/AppConstants'
import { ThemeContext } from '../../constants/Colors';
import RemoveScreenView from './RemoveScreenView';
import SettingView from './SettingView';

const SettingScreen = () => {
  const theme = useContext(ThemeContext);
  const [showRemoveScreenView, setShowRemoveScreenView] = useState(false)
  const [showMainView, setShowMainView] = useState(true)

  const onPressView = useCallback((isMainView: boolean) => {
    setShowMainView(isMainView)
    setShowRemoveScreenView(!isMainView)
  }, [])

  const style = useMemo(() => {
    return StyleSheet.create({
      masterView: { flex: 1, backgroundColor: theme.background, gap: Outline.GapHorizontal },
      topButtonContainerView: { padding: Outline.GapVertical, paddingHorizontal: Outline.GapVertical_2, gap: Outline.GapHorizontal, flexDirection: 'row' },
      topButtonTO: { borderColor: theme.counterBackground, borderWidth: StyleSheet.hairlineWidth, padding: Outline.GapVertical, borderRadius: BorderRadius.BR8, flex: 1, backgroundColor: theme.primary, justifyContent: 'center', alignItems: 'center' },
      topButtonTO_Inactive: { borderColor: theme.counterBackground, borderWidth: StyleSheet.hairlineWidth, padding: Outline.GapVertical, borderRadius: BorderRadius.BR8, flex: 1, justifyContent: 'center', alignItems: 'center' },
      topButtonText: { color: theme.counterPrimary, fontWeight: FontWeight.B600, fontSize: FontSize.Small },
      topButtonText_Inactive: { color: theme.counterBackground, fontWeight: FontWeight.B600, fontSize: FontSize.Small },
    })
  }, [theme])

  return (
    <View style={style.masterView}>
      <View style={style.topButtonContainerView}>
        <TouchableOpacity onPress={() => onPressView(true)} style={showMainView ? style.topButtonTO : style.topButtonTO_Inactive}>
          <Text style={showMainView ? style.topButtonText : style.topButtonText_Inactive}>Setting</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => onPressView(false)} style={showRemoveScreenView ? style.topButtonTO : style.topButtonTO_Inactive}>
          <Text style={!showMainView ? style.topButtonText : style.topButtonText_Inactive}>Remove Screen</Text>
        </TouchableOpacity>
      </View>
      {
        !showMainView ? undefined :
          <SettingView />
      }
      {
        !showRemoveScreenView ? undefined :
          <RemoveScreenView />
      }
    </View>
  )
}

export default SettingScreen