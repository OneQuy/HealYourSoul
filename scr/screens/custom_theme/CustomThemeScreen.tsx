import { StyleSheet, View } from 'react-native'
import React, { useCallback, useContext, useMemo } from 'react'
import { Outline } from '../../constants/AppConstants'
import { ThemeContext } from '../../constants/Colors';

const CustomThemeScreen = () => {
    const theme = useContext(ThemeContext);
    
    const onPressView = useCallback(() => {
    }, [])

    const style = useMemo(() => {
        return StyleSheet.create({
            masterView: { flex: 1, backgroundColor: theme.background, gap: Outline.GapHorizontal },
            // topButtonContainerView: { padding: Outline.GapVertical, paddingHorizontal: Outline.GapVertical_2, gap: Outline.GapHorizontal, flexDirection: 'row' },
            // topButtonTO: { borderColor: theme.primary, borderWidth: StyleSheet.hairlineWidth, padding: Outline.GapVertical, borderRadius: BorderRadius.BR8, flex: 1, backgroundColor: theme.primary, justifyContent: 'center', alignItems: 'center' },
            // topButtonTO_Inactive: { borderColor: theme.primary, borderWidth: StyleSheet.hairlineWidth, padding: Outline.GapVertical, borderRadius: BorderRadius.BR8, flex: 1, justifyContent: 'center', alignItems: 'center' },
            // topButtonText: { color: theme.counterPrimary, fontWeight: FontWeight.B600, fontSize: FontSize.Small },
            // topButtonText_Inactive: { color: theme.counterBackground, fontWeight: FontWeight.B600, fontSize: FontSize.Small },
        })
    }, [theme])

    return (
        <View style={style.masterView}>

        </View>
    )
}

export default CustomThemeScreen