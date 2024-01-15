// @ts-ignore

import { StyleSheet, View } from 'react-native'
import React, { useContext, useMemo } from 'react'
import { ThemeContext } from '../../constants/Colors';
import { BorderRadius, FontSize, Outline } from '../../constants/AppConstants';
import { widthPercentageToDP } from 'react-native-responsive-screen';

const SettingView = () => {
  const theme = useContext(ThemeContext)
  // const navigation = useNavigation()
  // const disableScreens = useAppSelector((state: RootState) => state.userData.disableScreens)
  // const dispatch = useAppDispatch()

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

  // const onPressEnableAll = useCallback(() => {
  //   track_SimpleWithParam('toggle_screen', 'enable_all')
  //   dispatch(enableAllScreen())
  // }, [])

  return (
    <View style={style.masterView}>
{/*       
      <TouchableOpacity onPress={onPressEnableAll} style={[style.enableAllTO,]}>
        <Text style={style.enableAllButtonText}>{LocalText.enable_all}</Text>
      </TouchableOpacity> */}
    </View>
  )
}

export default SettingView