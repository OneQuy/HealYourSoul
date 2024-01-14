import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useContext, useMemo } from 'react'
import { BorderRadius, FontSize, Outline } from '../../constants/AppConstants'
import { ThemeContext } from '../../constants/Colors';
import { CommonStyles } from '../../constants/CommonConstants';

const SettingScreen = () => {
  const theme = useContext(ThemeContext);

  const style = useMemo(() => {
    return StyleSheet.create({
      masterView: { backgroundColor: theme.background, padding: Outline.Horizontal, gap: Outline.GapVertical_2 },
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
        <TouchableOpacity style={style.topButtonTO}>
          <Text style={style.topButtonText}>Setting</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

export default SettingScreen