// @ts-ignore
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useCallback, useContext, useMemo } from 'react'
import { ThemeContext } from '../../constants/Colors';
import { useNavigation } from '@react-navigation/native';
import { BorderRadius, FontSize, Icon, Outline, ScreenName, Size } from '../../constants/AppConstants';
import { widthPercentageToDP } from 'react-native-responsive-screen';
import { RootState, useAppDispatch, useAppSelector } from '../../redux/Store';
import { toggleDisableScreen } from '../../redux/UserDataSlice';

const RemoveScreenView = () => {
  const theme = useContext(ThemeContext)
  const navigation = useNavigation()
  const disableScreens = useAppSelector((state: RootState) => state.userData.disableScreens)
  const dispatch = useAppDispatch()

  const allScreenNames: ScreenName[] = useMemo(() => {
    return navigation.getState().routes.map(i => i.name)
  }, [])

  const style = useMemo(() => {
    return StyleSheet.create({
      masterView: { flex: 1, backgroundColor: theme.background, alignItems: 'center' },
      buttonContainerTO: { margin: Outline.GapHorizontal, minWidth: widthPercentageToDP(40), padding: Outline.GapVertical, borderRadius: BorderRadius.BR8, borderWidth: StyleSheet.hairlineWidth, gap: Outline.GapHorizontal, flexDirection: 'row' },
      buttonText: { textAlign: 'center', color: theme.text, fontSize: FontSize.Small, flex: 1 },
    })
  }, [theme])

  const renderButton = useCallback(({ item } : { item: ScreenName}) => {
    const isVisible = !disableScreens || !disableScreens.includes(item)

    const onPress = ()  => {
      dispatch(toggleDisableScreen(item))
    }

    return <TouchableOpacity onPress={onPress} key={item} style={[style.buttonContainerTO, { backgroundColor: isVisible ? theme.primary : undefined}]}>
      <MaterialCommunityIcons name={Icon.Coffee} color={'black'} size={Size.IconSmaller} />
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
      />
    </View>
  )
}

export default RemoveScreenView