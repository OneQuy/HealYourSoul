import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { BorderRadius, FontSize, FontWeight, LocalText, Outline, StorageKey_ReadRulesUpload } from '../../constants/AppConstants'
import { ThemeContext } from '../../constants/Colors';
import { GetBooleanAsync, SetBooleanAsync } from '../../handle/AsyncStorageUtils';
import SendInboxView from './SendInboxView';

type SubView = 'send_inbox' | 'approve_uploads'

const AdminScreen = () => {
    const theme = useContext(ThemeContext);
    const [subview, setSubView] = useState<SubView>('send_inbox')
    const [readRules, setReadRules] = useState(false)

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

    useEffect(() => {
        (async () => {

        })()
    }, [])

    return (
        <View style={style.masterView}>

            {
                readRules &&
                <View style={style.topButtonContainerView}>
                    <TouchableOpacity onPress={() => onPressView('send_inbox')} style={subview === 'send_inbox' ? style.topButtonTO : style.topButtonTO_Inactive}>
                        <Text adjustsFontSizeToFit numberOfLines={1} style={subview === 'send_inbox' ? style.topButtonText : style.topButtonText_Inactive}>{LocalText.upload}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => onPressView('approve_uploads')} style={subview === 'approve_uploads' ? style.topButtonTO : style.topButtonTO_Inactive}>
                        <Text adjustsFontSizeToFit numberOfLines={1} style={subview === 'approve_uploads' ? style.topButtonText : style.topButtonText_Inactive}>{LocalText.approved}</Text>
                    </TouchableOpacity>
                </View>
            }

            {
                subview === 'send_inbox' &&
                <SendInboxView />
            }

        </View>
    )
}

export default AdminScreen