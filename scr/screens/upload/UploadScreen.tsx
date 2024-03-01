import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useCallback, useContext, useMemo, useState } from 'react'
import { BorderRadius, FontSize, FontWeight, LocalText, Outline } from '../../constants/AppConstants'
import { ThemeContext } from '../../constants/Colors';
import UploadView from './UploadView';
import UploadRulesView from './RulesView';

type SubView = 'upload' | 'approved' | 'rules'

const UploadScreen = () => {
    const theme = useContext(ThemeContext);
    const [subview, setSubView] = useState<SubView>('upload')

    const onPressView = useCallback((view: SubView) => {
        setSubView(view)
    }, [])

    const style = useMemo(() => {
        return StyleSheet.create({
            masterView: { flex: 1, backgroundColor: theme.background, gap: Outline.GapHorizontal },
            topButtonContainerView: { padding: Outline.GapVertical, paddingHorizontal: Outline.GapVertical_2, gap: Outline.GapHorizontal, flexDirection: 'row' },
            topButtonTO: { borderColor: theme.primary, borderWidth: StyleSheet.hairlineWidth, padding: Outline.GapVertical, borderRadius: BorderRadius.BR8, flex: 1, backgroundColor: theme.primary, justifyContent: 'center', alignItems: 'center' },
            topButtonTO_Inactive: { borderColor: theme.primary, borderWidth: StyleSheet.hairlineWidth, padding: Outline.GapVertical, borderRadius: BorderRadius.BR8, flex: 1, justifyContent: 'center', alignItems: 'center' },
            topButtonText: { color: theme.counterPrimary, fontWeight: FontWeight.B600, fontSize: FontSize.Small },
            topButtonText_Inactive: { color: theme.counterBackground, fontWeight: FontWeight.B600, fontSize: FontSize.Small },
        })
    }, [theme])

    return (
        <View style={style.masterView}>
            <View style={style.topButtonContainerView}>
                <TouchableOpacity onPress={() => onPressView('upload')} style={subview === 'upload' ? style.topButtonTO : style.topButtonTO_Inactive}>
                    <Text adjustsFontSizeToFit numberOfLines={1} style={subview === 'upload' ? style.topButtonText : style.topButtonText_Inactive}>{LocalText.upload}</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => onPressView('approved')} style={subview === 'approved' ? style.topButtonTO : style.topButtonTO_Inactive}>
                    <Text adjustsFontSizeToFit numberOfLines={1} style={subview === 'approved' ? style.topButtonText : style.topButtonText_Inactive}>{LocalText.approved}</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => onPressView('rules')} style={subview === 'rules' ? style.topButtonTO : style.topButtonTO_Inactive}>
                    <Text adjustsFontSizeToFit numberOfLines={1} style={subview === 'rules' ? style.topButtonText : style.topButtonText_Inactive}>{LocalText.rules}</Text>
                </TouchableOpacity>
            </View>
            {
                subview === 'upload' &&
                <UploadView />
            }
            {
                subview === 'rules' &&
                <UploadRulesView />
            }
        </View>
    )
}

export default UploadScreen