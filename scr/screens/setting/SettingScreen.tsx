import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useCallback, useContext, useMemo, useState } from 'react'
import { BorderRadius, FontSize, Outline } from '../../constants/AppConstants'
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
      topButtonContainerView: { gap: Outline.GapHorizontal, flexDirection: 'row' },
      topButtonTO: { padding: Outline.GapVertical, borderRadius: BorderRadius.BR8, flex: 1, backgroundColor: theme.primary, justifyContent: 'center', alignItems: 'center' },
      topButtonText: { color: theme.text, fontSize: FontSize.Small },
    })
  }, [theme])

  return (
    <View style={style.masterView}>
      <View style={style.topButtonContainerView}>
        <TouchableOpacity onPress={() => onPressView(true)} style={style.topButtonTO}>
          <Text style={style.topButtonText}>Setting</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => onPressView(false)} style={style.topButtonTO}>
          <Text style={style.topButtonText}>Remove Screen</Text>
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