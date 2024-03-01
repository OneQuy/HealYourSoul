// @ts-ignore

import { View, StyleSheet, Text, TouchableOpacity, ImageBackground } from 'react-native'
import React, { useCallback, useContext, useMemo } from 'react'
import { BorderRadius, FontSize, LocalText, Outline } from '../../constants/AppConstants'
import { ThemeContext } from '../../constants/Colors'
import { GoToPremiumScreen } from '../components/HeaderXButton';
import { useFocusEffect } from '@react-navigation/native';
import { widthPercentageToDP } from 'react-native-responsive-screen';
import { iapBg_1 } from '../IAP/IAPPage';


const UploadRulesView = () => {
    const theme = useContext(ThemeContext);

    // const { isPremium } = usePremium()
    // const navigation = useNavigation()

    const style = useMemo(() => {
        return StyleSheet.create({
            masterView: { flex: 1, justifyContent: 'center', alignItems: 'center', gap: Outline.GapHorizontal, },
            rectEmptyView: { width: '70%', height: '50%', borderColor: theme.counterBackground, borderWidth: StyleSheet.hairlineWidth, borderRadius: BorderRadius.BR, justifyContent: 'center', alignItems: 'center' },
            bottomBtnsView: { marginTop: Outline.Vertical, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: Outline.GapHorizontal },
            uploadingView: { gap: Outline.GapHorizontal },
            image: { width: '70%', height: '50%', },
            checkboxTO: { marginHorizontal: Outline.GapVertical_2, flexDirection: 'row', alignItems: 'center', gap: Outline.GapHorizontal },
            readRuleTO: { marginTop: Outline.Vertical, borderRadius: BorderRadius.BR, borderColor: theme.counterBackground, borderWidth: StyleSheet.hairlineWidth, padding: Outline.GapVertical, alignItems: 'center', },
            bottomBtn: { minWidth: '30%', alignItems: 'center', justifyContent: 'center', borderRadius: BorderRadius.BR, borderColor: theme.counterBackground, borderWidth: StyleSheet.hairlineWidth, padding: Outline.GapVertical, },
            bottomBtn_Highlight: { minWidth: '30%', alignItems: 'center', justifyContent: 'center', borderRadius: BorderRadius.BR, backgroundColor: theme.primary, padding: Outline.GapVertical, },
            text: { color: theme.counterBackground, fontSize: FontSize.Small_L, },
            bottomBtnTxt_Highlight: { color: theme.counterPrimary, fontSize: FontSize.Small_L, },
            pickMediaTxt: { marginTop: Outline.GapVertical, textAlign: 'center', fontSize: FontSize.Normal, color: theme.counterBackground, },

            reasonTxt: { margin: Outline.Vertical, textAlign: 'center', fontSize: FontSize.Normal, color: theme.counterBackground, },
            plsSubBtnsView: { gap: Outline.GapHorizontal, flexDirection: 'row' },
            premiumIB: { padding: Outline.GapVertical, minWidth: widthPercentageToDP(30), borderRadius: BorderRadius.BR, overflow: 'hidden', justifyContent: 'center', alignItems: 'center', },
            refreshBtn: { padding: Outline.GapVertical, minWidth: widthPercentageToDP(30), borderColor: theme.counterBackground, borderRadius: BorderRadius.BR, borderWidth: StyleSheet.hairlineWidth, justifyContent: 'center', alignItems: 'center', },
            premiumText: { fontSize: FontSize.Small_L, color: 'black' },
            refreshTxt: { fontSize: FontSize.Small_L, color: theme.counterBackground },
        })
    }, [theme])

    // can not upload now

    return (
        <View style={style.masterView}>
            {/* <Text style={style.reasonTxt}>{reasonCanNotUpload.reason}</Text> */}

            {/* <View style={style.plsSubBtnsView}>
                <TouchableOpacity onPress={refreshReasonCanNotUpload}>
                    <View style={style.refreshBtn}>
                        <Text numberOfLines={1} adjustsFontSizeToFit style={style.refreshTxt}>{LocalText.refresh}</Text>
                    </View>
                </TouchableOpacity>

                {
                    reasonCanNotUpload.showSubscribeButton === true &&
                    <TouchableOpacity onPress={() => GoToPremiumScreen(navigation)}>
                        <ImageBackground resizeMode="cover" source={iapBg_1} style={style.premiumIB}>
                            <Text numberOfLines={1} adjustsFontSizeToFit style={style.premiumText}>{LocalText.upgrade}</Text>
                        </ImageBackground>
                    </TouchableOpacity>
                }
            </View> */}
        </View>
    )
}

export default UploadRulesView