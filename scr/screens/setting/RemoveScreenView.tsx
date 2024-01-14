// @ts-ignore
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useCallback, useContext, useMemo } from 'react'
import { ThemeContext } from '../../constants/Colors';
import { useNavigation } from '@react-navigation/native';
import { BorderRadius, FontSize, Icon, LocalText, Outline, ScreenName, Size } from '../../constants/AppConstants';
import { widthPercentageToDP } from 'react-native-responsive-screen';
import { RootState, useAppDispatch, useAppSelector } from '../../redux/Store';
import { enableAllScreen, toggleDisableScreen } from '../../redux/UserDataSlice';
import { GetIconOfScreen, IsContentScreen } from '../../handle/AppUtils';

const RemoveScreenView = () => {
  const theme = useContext(ThemeContext)
  const navigation = useNavigation()
  const disableScreens = useAppSelector((state: RootState) => state.userData.disableScreens)
  const dispatch = useAppDispatch()

  const allScreenNames: ScreenName[] = useMemo(() => {
    const routes = navigation.getState().routes.filter(i => IsContentScreen(i.name))

    return routes.map(i => i.name)
  }, [])

  const style = useMemo(() => {
    return StyleSheet.create({
      masterView: { flex: 1, backgroundColor: theme.background, alignItems: 'center' },
      buttonContainerTO: { margin: Outline.GapHorizontal, minWidth: widthPercentageToDP(40), padding: Outline.GapVertical, borderRadius: BorderRadius.BR8, borderWidth: StyleSheet.hairlineWidth, gap: Outline.GapHorizontal, flexDirection: 'row' },
      enableAllTO: { width: '80%', margin: Outline.Horizontal, padding: Outline.Horizontal, borderRadius: BorderRadius.BR8, borderWidth: StyleSheet.hairlineWidth, },
      enableAllButtonText: { textAlign: 'center', color: theme.text, fontSize: FontSize.Small },
      buttonText: { textAlign: 'center', color: theme.text, fontSize: FontSize.Small, flex: 1 },
      flatList: { flex: 1 },
    })
  }, [theme])

  const renderButton = useCallback(({ item }: { item: ScreenName }) => {
    const isVisible = !disableScreens || !disableScreens.includes(item)

    const onPress = () => {
      dispatch(toggleDisableScreen(item))
    }

    const icon = GetIconOfScreen(item)

    return <TouchableOpacity onPress={onPress} key={item} style={[style.buttonContainerTO, { backgroundColor: isVisible ? theme.primary : undefined }]}>
      <MaterialCommunityIcons name={icon} color={'black'} size={Size.IconTiny} />
      <Text style={style.buttonText}>{item}</Text>
    </TouchableOpacity>
  }, [disableScreens, style, theme])

  return (
    <View style={style.masterView}>
      <FlatList
        data={allScreenNames}
        numColumns={2}
        keyExtractor={(item) => item}
        renderItem={renderButton}
        contentContainerStyle={style.flatList}
      />
      <TouchableOpacity onPress={() => dispatch(enableAllScreen())} style={[style.enableAllTO, ]}>
        <Text style={style.enableAllButtonText}>{LocalText.enable_all}</Text>
      </TouchableOpacity>
    </View>
  )
}

export default RemoveScreenView