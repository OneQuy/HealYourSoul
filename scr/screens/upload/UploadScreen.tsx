// @ts-ignore
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import { View, StyleSheet, Text } from 'react-native'
import React, { useContext, useMemo } from 'react'
import { FontSize, FontWeight, Icon, Outline, Size } from '../../constants/AppConstants'
import { ThemeContext } from '../../constants/Colors'
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const UploadScreen = () => {
    const theme = useContext(ThemeContext);
    const insets = useSafeAreaInsets()

    const style = useMemo(() => {
        return StyleSheet.create({
            masterView: { flex: 1, paddingBottom: Outline.GapHorizontal, gap: Outline.GapHorizontal, },
            centerView: { flex: 1, justifyContent: 'center', alignItems: 'center' },
            noItemTxt: { marginTop: Outline.GapVertical, textAlign: 'center', marginHorizontal: Outline.GapVertical, fontSize: FontSize.Normal, color: theme.counterBackground, },
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