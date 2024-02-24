// @ts-ignore
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import { View, StyleSheet, TouchableOpacity, Text } from 'react-native'
import React, { useContext, useMemo } from 'react'
import { BorderRadius, FontSize, Icon, Outline, Size } from '../../constants/AppConstants'
import { ThemeContext } from '../../constants/Colors'
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const PageNavigatorBar = ({
  curPageIdx,
  maxPage,
  onPressedMiddlePage,
  onPressedTopPage,
  onPressedNextPage
}: {
  curPageIdx: number,
  maxPage: number,
  onPressedMiddlePage: () => void,
  onPressedTopPage: (isNext: boolean) => void,
  onPressedNextPage: (isNext: boolean) => void,
}) => {
  const theme = useContext(ThemeContext);
  const insets = useSafeAreaInsets()

  const style = useMemo(() => {
    return StyleSheet.create({
      naviContainer: { backgroundColor: theme.primary, borderRadius: BorderRadius.BR, marginBottom: insets.bottom + Outline.GapHorizontal, marginHorizontal: Outline.GapVertical, justifyContent: 'space-between', flexDirection: 'row', alignItems: 'center' },
      naviTO: { padding: Outline.GapVertical_2, flex: 1, alignItems: 'center', justifyContent: 'center', },
      pageTxt: { fontSize: FontSize.Normal, color: theme.counterPrimary, },
    })
  }, [theme, insets])

  // main render

  return (
    <View style={style.naviContainer}>
      <TouchableOpacity onPress={() => onPressedTopPage(false)} style={style.naviTO}>
        <MaterialCommunityIcons name={Icon.MaxLeft} color={theme.counterPrimary} size={Size.Icon} />
      </TouchableOpacity>
      <TouchableOpacity onPress={() => onPressedNextPage(false)} style={style.naviTO}>
        <MaterialCommunityIcons name={Icon.Left} color={theme.counterPrimary} size={Size.Icon} />
      </TouchableOpacity>
      <Text onPress={onPressedMiddlePage} style={style.pageTxt}>{curPageIdx + 1}/{maxPage}</Text>
      <TouchableOpacity onPress={() => onPressedNextPage(true)} style={style.naviTO}>
        <MaterialCommunityIcons name={Icon.Right} color={theme.counterPrimary} size={Size.Icon} />
      </TouchableOpacity>
      <TouchableOpacity onPress={() => onPressedTopPage(true)} style={style.naviTO}>
        <MaterialCommunityIcons name={Icon.MaxRight} color={theme.counterPrimary} size={Size.Icon} />
      </TouchableOpacity>
    </View>
  )
}

export default PageNavigatorBar