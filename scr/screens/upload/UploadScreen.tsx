// @ts-ignore
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import { View, StyleSheet, Text } from 'react-native'
import React, { useContext, useMemo } from 'react'
import { BorderRadius, FontSize, FontWeight, Icon, Outline, Size } from '../../constants/AppConstants'
import { ThemeContext } from '../../constants/Colors'
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { widthPercentageToDP } from 'react-native-responsive-screen';

const UploadScreen = () => {
    const theme = useContext(ThemeContext);
    const insets = useSafeAreaInsets()

    const style = useMemo(() => {
        return StyleSheet.create({
            masterView: { flex: 1, paddingBottom: Outline.GapHorizontal, gap: Outline.GapHorizontal, },
            centerView: { flex: 1, justifyContent: 'center', alignItems: 'center' },
            plsSubView: { gap: Outline.GapHorizontal, margin: Outline.GapVertical, marginBottom: insets.bottom + Outline.GapHorizontal, padding: Outline.GapVertical, borderRadius: BorderRadius.BR, borderWidth: StyleSheet.hairlineWidth, borderColor: theme.counterBackground, justifyContent: 'center', alignItems: 'center' },
            plsSubBtnsView: { gap: Outline.GapHorizontal, flexDirection: 'row' },
            filterView: { marginHorizontal: Outline.GapVertical, justifyContent: 'center', alignItems: 'center', },
            premiumIB: { padding: Outline.GapVertical, minWidth: widthPercentageToDP(30), borderRadius: BorderRadius.BR, overflow: 'hidden', justifyContent: 'center', alignItems: 'center', },
            gotItBtn: { padding: Outline.GapVertical, minWidth: widthPercentageToDP(30), borderColor: theme.counterBackground, borderRadius: BorderRadius.BR, borderWidth: StyleSheet.hairlineWidth, justifyContent: 'center', alignItems: 'center', },
            filterTO: { maxWidth: '100%', paddingHorizontal: 20, borderRadius: BorderRadius.BR8, justifyContent: 'center', alignItems: 'center', gap: Outline.GapHorizontal, padding: Outline.GapHorizontal, minWidth: widthPercentageToDP(20), flexDirection: 'row', backgroundColor: theme.primary },
            flatListContainer: { flex: 1, },
            filterCatTxt: { maxWidth: '100%', fontSize: FontSize.Small_L, color: theme.counterPrimary, },
            noItemTxt: { marginTop: Outline.GapVertical, textAlign: 'center', marginHorizontal: Outline.GapVertical, fontSize: FontSize.Normal, color: theme.counterBackground, },
            subscribeTxt: { textAlign: 'center', fontSize: FontSize.Small_L, color: theme.counterBackground, },
            premiumText: { fontSize: FontSize.Small_L, color: 'black' },
            commingSoonTxt: { fontWeight: FontWeight.B600, fontSize: FontSize.Big, color: theme.counterBackground },
        })
    }, [theme])

    // render list is empty

    if (true) {
        return (
            <View style={style.masterView}>
                <View style={style.centerView}>
                    <MaterialCommunityIcons name={Icon.Upload} color={theme.primary} size={Size.IconMedium} />
                    <Text style={style.commingSoonTxt}>Coming Soon</Text>
                    <Text style={style.noItemTxt}>You can upload your own memes (or other category images) for Gooday here. This feature will be available in the next version!</Text>
                </View>
            </View>
        )
    }

    // // main render

    // return (
    //     <View style={style.masterView}>
         
    //     </View>
    // )
}

export default UploadScreen