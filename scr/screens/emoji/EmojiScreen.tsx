// @ts-ignore
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import { View, StyleSheet, Text, Image, TouchableOpacity, ActivityIndicator, Platform, Alert, AlertButton, ImageBackground } from 'react-native'
import React, { useCallback, useContext, useMemo, useState } from 'react'
import { BorderRadius, FileSizeLimitUploadInMb_Image, FileSizeLimitUploadInMb_Video, FontSize, Icon, LocalText, NotLimitUploadsValue, Outline, Size, StorageKey_LastTimeUpload, StorageKey_TodayUploadsCount } from '../../constants/AppConstants'
import { ThemeContext } from '../../constants/Colors'
import { openPicker } from '@baronha/react-native-multiple-image-picker';
import { MediaType, UserUploadInfo } from '../../constants/Types';
import { GetFileExtensionByFilepath, IsValuableArrayOrString, SafeValue, ToCanPrint } from '../../handle/UtilsTS';
import { usePremium } from '../../hooks/usePremium';
import { UserID } from '../../handle/UserID';
import { FirebaseStorage_UploadAsync } from '../../firebase/FirebaseStorage';
import { AlertWithError } from '../../handle/AppUtils';
import { FirebaseDatabase_SetValueAsync } from '../../firebase/FirebaseDatabase';
import { DoubleCheckGetAppConfigAsync } from '../../handle/AppConfigHandler';
import { GetUserAsync } from '../../handle/tracking/UserMan';
import { GetDateAsync_IsValueNotExistedOrEqualOverMinFromNow, GetNumberIntAsync_WithCheckAndResetNewDay, IncreaseNumberAsync_WithCheckAndResetNewDay, SetDateAsync_Now } from '../../handle/AsyncStorageUtils';
import { GoToPremiumScreen } from '../components/HeaderXButton';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { FileSizeInMB } from '../../handle/FileUtils';
import { widthPercentageToDP } from 'react-native-responsive-screen';
import { iapBg_1 } from '../IAP/IAPPage';
import { Cheat } from '../../handle/Cheat';
import { DelayAsync } from '../../handle/Utils';
import { track_SimpleWithParam } from '../../handle/tracking/GoodayTracking';


const EmojiScreen = () => {
  const theme = useContext(ThemeContext);
  const [reasonCanNotUpload, setReasonCanNotUpload] = useState<undefined | { reason: string, showSubscribeButton?: boolean }>(undefined)
  const [isHandling, setIsHandling] = useState(true)
  const { isPremium } = usePremium()
  const navigation = useNavigation()

  const reset = useCallback(async () => {
  }, [])

  const style = useMemo(() => {
    return StyleSheet.create({
      masterView: { flex: 1, justifyContent: 'center', alignItems: 'center', gap: Outline.GapHorizontal, },

      // rectEmptyView: { width: '70%', height: '50%', borderColor: theme.counterBackground, borderWidth: StyleSheet.hairlineWidth, borderRadius: BorderRadius.BR, justifyContent: 'center', alignItems: 'center' },
      // bottomBtnsView: { marginTop: Outline.Vertical, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: Outline.GapHorizontal },
      // uploadingView: { gap: Outline.GapHorizontal },
      // image: { width: '70%', height: '50%', },
      // checkboxTO: { marginHorizontal: Outline.GapVertical_2, flexDirection: 'row', alignItems: 'center', gap: Outline.GapHorizontal },
      // readRuleTO: { marginTop: Outline.Vertical, borderRadius: BorderRadius.BR, borderColor: theme.counterBackground, borderWidth: StyleSheet.hairlineWidth, padding: Outline.GapVertical, alignItems: 'center', },
      // bottomBtn: { minWidth: '30%', alignItems: 'center', justifyContent: 'center', borderRadius: BorderRadius.BR, borderColor: theme.counterBackground, borderWidth: StyleSheet.hairlineWidth, padding: Outline.GapVertical, },
      // bottomBtn_Highlight: { minWidth: '30%', alignItems: 'center', justifyContent: 'center', borderRadius: BorderRadius.BR, backgroundColor: theme.primary, padding: Outline.GapVertical, },
      // text: { color: theme.counterBackground, fontSize: FontSize.Small_L, },
      // bottomBtnTxt_Highlight: { color: theme.counterPrimary, fontSize: FontSize.Small_L, },
      // pickMediaTxt: { marginTop: Outline.GapVertical, textAlign: 'center', fontSize: FontSize.Normal, color: theme.counterBackground, },
      // reasonTxt: { margin: Outline.Vertical, textAlign: 'center', fontSize: FontSize.Normal, color: theme.counterBackground, },
      // plsSubBtnsView: { gap: Outline.GapHorizontal, flexDirection: 'row' },
      // premiumIB: { padding: Outline.GapVertical, minWidth: widthPercentageToDP(30), borderRadius: BorderRadius.BR, overflow: 'hidden', justifyContent: 'center', alignItems: 'center', },
      // refreshBtn: { padding: Outline.GapVertical, minWidth: widthPercentageToDP(30), borderColor: theme.counterBackground, borderRadius: BorderRadius.BR, borderWidth: StyleSheet.hairlineWidth, justifyContent: 'center', alignItems: 'center', },
      // premiumText: { fontSize: FontSize.Small_L, color: 'black' },
      // refreshTxt: { fontSize: FontSize.Small_L, color: theme.counterBackground },
    })
  }, [theme])

  // handling something

  // if (isHandling) {
  //   return (
  //     <View style={style.masterView}>
  //       <ActivityIndicator color={theme.primary} />
  //     </View>
  //   )
  // }

  // main render

  return (
    <View style={style.masterView}>

    </View>
  )
}

export default EmojiScreen