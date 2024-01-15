// @ts-ignore

import { StyleSheet, Text, View } from 'react-native'
import React, { useContext, useMemo } from 'react'
import { ThemeContext } from '../../constants/Colors';
import { BorderRadius, FontSize, LocalText, Outline } from '../../constants/AppConstants';
import { widthPercentageToDP } from 'react-native-responsive-screen';
import { ScrollView } from 'react-native-gesture-handler';

const SettingView = () => {
  const theme = useContext(ThemeContext)
  // const navigation = useNavigation()
  // const disableScreens = useAppSelector((state: RootState) => state.userData.disableScreens)
  // const dispatch = useAppDispatch()

  const style = useMemo(() => {
    return StyleSheet.create({
      masterView: { flex: 1, backgroundColor: theme.background },
      scrollView: { },
      // buttonContainerTO: { margin: Outline.GapHorizontal, minWidth: widthPercentageToDP(40), padding: Outline.GapVertical, borderRadius: BorderRadius.BR8, borderWidth: StyleSheet.hairlineWidth, gap: Outline.GapHorizontal, flexDirection: 'row' },
      // enableAllTO: { width: '80%', margin: Outline.Horizontal, padding: Outline.Horizontal, borderRadius: BorderRadius.BR8, borderWidth: StyleSheet.hairlineWidth, },
      titleText: { textAlign: 'center', color: theme.text, fontSize: FontSize.Small },
      // buttonText: { textAlign: 'center', color: theme.text, fontSize: FontSize.Small, flex: 1 },
    })
  }, [theme])

  // const onPressEnableAll = useCallback(() => {
  //   track_SimpleWithParam('toggle_screen', 'enable_all')
  //   dispatch(enableAllScreen())
  // }, [])

  return (
    <View style={style.masterView}>
      <ScrollView style={style.scrollView}>
        <Text style={style.titleText}>{LocalText.Contact}</Text>
        {/* <TouchableOpacity onPress={onPressEnableAll} style={[style.enableAllTO,]}>
        <Text style={style.titleText}>{LocalText.enable_all}</Text>
      </TouchableOpacity> */}
      </ScrollView>
    </View>
  )
}

export default SettingView