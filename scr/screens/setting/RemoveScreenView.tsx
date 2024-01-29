// @ts-ignore
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useCallback, useContext, useMemo } from 'react'
import { ThemeContext } from '../../constants/Colors';
import { useNavigation } from '@react-navigation/native';
import { BorderRadius, FontSize, LocalText, Outline, ScreenName, Size } from '../../constants/AppConstants';
import { heightPercentageToDP, widthPercentageToDP } from 'react-native-responsive-screen';
import { RootState, useAppDispatch, useAppSelector } from '../../redux/Store';
import { enableAllScreen, toggleDisableScreen } from '../../redux/UserDataSlice';
import { GetIconOfScreen, IsContentScreen } from '../../handle/AppUtils';
import { track_SimpleWithParam } from '../../handle/tracking/GoodayTracking';
import { FilterOnlyLetterAndNumberFromString } from '../../handle/UtilsTS';
import { CommonStyles } from '../../constants/CommonConstants';

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
      buttonContainerTO: { margin: Outline.GapHorizontal, minHeight: heightPercentageToDP(5), minWidth: widthPercentageToDP(40), alignItems: 'center', padding: Outline.GapVertical, borderColor: theme.primary, borderRadius: BorderRadius.BR8, borderWidth: StyleSheet.hairlineWidth, gap: Outline.GapHorizontal, flexDirection: 'row' },
      enableAllTO: { borderColor: theme.counterBackground, width: '80%', margin: Outline.Horizontal, padding: Outline.Horizontal, borderRadius: BorderRadius.BR8, borderWidth: StyleSheet.hairlineWidth, },
      enableAllButtonText: { textAlign: 'center', color: theme.counterBackground, fontSize: FontSize.Small },
      intro_text: { textAlign: 'center', color: theme.counterBackground, fontSize: FontSize.Normal },
      buttonText: { textAlign: 'center', color: theme.counterPrimary, fontSize: FontSize.Small, flex: 1 },
      buttonText_Disable: { textAlign: 'center', color: theme.counterBackground, fontSize: FontSize.Small, flex: 1 },
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
      <MaterialCommunityIcons name={icon} color={isVisible ? theme.counterPrimary : theme.counterBackground} size={Size.IconTiny} />
      <Text style={isVisible ? style.buttonText : style.buttonText_Disable}>{item}</Text>
    </TouchableOpacity>
  }, [disableScreens, style, theme])

  return (
    <View style={style.masterView}>
      <Text style={style.intro_text}>{LocalText.remove_screen_intro}</Text>

      <View style={CommonStyles.flex_1}>
        <FlatList
          data={allScreenNames}
          numColumns={2}
          keyExtractor={(item) => item}
          renderItem={renderButton}
          showsVerticalScrollIndicator={false}
        />
      </View>

      <TouchableOpacity onPress={onPressEnableAll} style={[style.enableAllTO,]}>
        <Text style={style.enableAllButtonText}>{LocalText.enable_all}</Text>
      </TouchableOpacity>
    </View>
  )
}

export default RemoveScreenView