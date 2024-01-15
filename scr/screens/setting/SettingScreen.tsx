import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useContext, useMemo, useState } from 'react'
import { BorderRadius, FontSize, Outline } from '../../constants/AppConstants'
import { ThemeContext } from '../../constants/Colors';
import RemoveScreenView from './RemoveScreenView';

const SettingScreen = () => {
  const theme = useContext(ThemeContext);
  const [showRemoveScreenView, setShowRemoveScreenView] = useState(false)

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
        <TouchableOpacity style={style.topButtonTO}>
          <Text style={style.topButtonText}>Setting</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setShowRemoveScreenView(!showRemoveScreenView)} style={style.topButtonTO}>
          <Text style={style.topButtonText}>Remove Screen</Text>
        </TouchableOpacity>
      </View>
      {
        !showRemoveScreenView ? undefined :
          <RemoveScreenView />
      }
    </View>
  )
}

export default SettingScreen