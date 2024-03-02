import { View, StyleSheet } from 'react-native'
import React, { useCallback, useContext, useMemo, useState } from 'react'
import { ThemeContext } from '../../../constants/Colors';
import { BorderRadius, FontSize, Outline } from '../../../constants/AppConstants';
import { widthPercentageToDP } from 'react-native-responsive-screen';

const SendInboxView = () => {
    const theme = useContext(ThemeContext);

    const onPressMarkAsRead = useCallback(() => {

    }, [])

    const style = useMemo(() => {
        return StyleSheet.create({
            masterView: { padding: Outline.GapVertical, gap: Outline.GapHorizontal, width: '100%', borderWidth: StyleSheet.hairlineWidth, borderColor: theme.counterBackground, borderRadius: BorderRadius.BR, },
            primaryBtnTO: { backgroundColor: theme.primary, minWidth: widthPercentageToDP(20), alignItems: 'center', justifyContent: 'center', padding: Outline.VerticalMini, borderWidth: StyleSheet.hairlineWidth, borderColor: theme.counterBackground, borderRadius: BorderRadius.BR, },
            primaryBtnTxt: { color: theme.counterPrimary, fontSize: FontSize.Small, },
            
            // btnsView: { flexDirection: 'row', gap: Outline.GapHorizontal, justifyContent: 'center', alignItems: 'center' },
            // btnTO: { minWidth: widthPercentageToDP(20), alignItems: 'center', justifyContent: 'center', padding: Outline.VerticalMini, borderWidth: StyleSheet.hairlineWidth, borderColor: theme.counterBackground, borderRadius: BorderRadius.BR, },
            // centerView: { justifyContent: 'center', alignItems: 'center' },
            // btnTxt: { color: theme.counterBackground, fontSize: FontSize.Small, },
            // contentTxt: { color: theme.counterBackground, fontSize: FontSize.Small, },
            // titleTxt: { fontWeight: FontWeight.B600, color: theme.counterBackground, fontSize: FontSize.Small_L, },
            // imageStyle: { height: heightPercentageToDP(20), aspectRatio: 1 },
            // imageStyleFull: { height: heightPercentageToDP(60), width: '100%' }
        })
    }, [theme])

    return (
        <View style={style.masterView}>
            
        </View>
    )
}

export default SendInboxView