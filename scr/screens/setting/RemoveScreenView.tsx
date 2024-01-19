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
import { track_SimpleWithParam } from '../../handle/tracking/GoodayTracking';
import { FilterOnlyLetterAndNumberFromString } from '../../handle/UtilsTS';

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
      masterView: { gap: Outline.GapVertical, flex: 1, backgroundColor: theme.background, alignItems: 'center' },
      buttonContainerTO: { margin: Outline.GapHorizontal, minWidth: widthPercentageToDP(40), padding: Outline.GapVertical, borderRadius: BorderRadius.BR8, borderWidth: StyleSheet.hairlineWidth, gap: Outline.GapHorizontal, flexDirection: 'row' },
      enableAllTO: { width: '80%', margin: Outline.Horizontal, padding: Outline.Horizontal, borderRadius: BorderRadius.BR8, borderWidth: StyleSheet.hairlineWidth, },
      enableAllButtonText: { textAlign: 'center', color: theme.text, fontSize: FontSize.Small },
      intro_text: { textAlign: 'center', color: theme.text, fontSize: FontSize.Normal },
      buttonText: { textAlign: 'center', color: theme.text, fontSize: FontSize.Small, flex: 1 },
      flatList: { flex: 1 },
    })
  }, [theme])

  const onPressEnableAll = useCallback(() => {
    track_SimpleWithParam('toggle_screen', 'enable_all')
    dispatch(enableAllScreen())
  }, [])

  const renderButton = useCallback(({ item }: { item: ScreenName }) => {
    const isVisible = !disableScreens || !disableScreens.includes(item)

    const onPress = () => {
      track_SimpleWithParam('toggle_screen', (isVisible ? 'disable_' : 'enable_') + FilterOnlyLetterAndNumberFromString(item))
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
      <Text style={style.intro_text}>{LocalText.remove_screen_intro}</Text>

      <FlatList
        data={allScreenNames}
        numColumns={2}
        keyExtractor={(item) => item}
        renderItem={renderButton}
        contentContainerStyle={style.flatList}
      />
      <TouchableOpacity onPress={onPressEnableAll} style={[style.enableAllTO,]}>
        <Text style={style.enableAllButtonText}>{LocalText.enable_all}</Text>
      </TouchableOpacity>
    </View>
  )
}

export default RemoveScreenView