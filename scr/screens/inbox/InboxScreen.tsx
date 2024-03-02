// @ts-ignore
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native'
import React, { useCallback, useContext, useMemo, useState } from 'react'
import { ThemeContext } from '../../constants/Colors'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { BorderRadius, FontSize, Icon, LocalText, Outline, Size } from '../../constants/AppConstants'
import InboxItem from './InboxItem'
import { widthPercentageToDP } from 'react-native-responsive-screen'
import { useAppDispatch, useAppSelector } from '../../redux/Store'
import { clearAllInboxes } from '../../redux/UserDataSlice'
import { Inbox } from '../../constants/Types';
import { useFocusEffect } from '@react-navigation/native';

const InboxScreen = () => {
    const theme = useContext(ThemeContext);
    const insets = useSafeAreaInsets()
    const allInboxes = useAppSelector(state => state.userData.inboxes)
    const dispatch = useAppDispatch()
    const [sortedAllInboxes, setSortedAllInboxes] = useState<Inbox[] | undefined>(undefined)

    const onPressClearAll = useCallback(() => {
        dispatch(clearAllInboxes())
    }, [])

    const style = useMemo(() => {
        return StyleSheet.create({
            masterView: { marginTop: Outline.GapHorizontal, marginBottom: insets.bottom + Outline.GapHorizontal, marginHorizontal: Outline.GapVertical_2, flex: 1, gap: Outline.GapHorizontal, },
            scrollViewContainer: { flex: 1 },
            scrollView: { gap: Outline.GapVertical_2 },
            clearAllTO: { backgroundColor: theme.primary, minWidth: widthPercentageToDP(20), alignItems: 'center', justifyContent: 'center', padding: Outline.GapVertical_2, borderWidth: StyleSheet.hairlineWidth, borderRadius: BorderRadius.BR, },
            clearAllTxt: { color: theme.counterPrimary, fontSize: FontSize.Small_L, },
            centerView: { flex: 1, justifyContent: 'center', alignItems: 'center' },
            noItemTxt: { textAlign: 'center', marginHorizontal: Outline.GapVertical, fontSize: FontSize.Normal, color: theme.counterBackground, },
        })
    }, [theme, insets])

    useFocusEffect(useCallback(() => {
        if (!allInboxes) {
            setSortedAllInboxes(undefined)
            return
        }

        let arr = allInboxes.slice()

        arr = arr.sort((a, b) => {
            return a.didRead === true ? 1 : -1
        })

        setSortedAllInboxes(arr)
    }, [allInboxes]))

    // render list is empty

    if (!sortedAllInboxes || sortedAllInboxes.length === 0) {
        return (
            <View style={style.masterView}>
                <View style={style.centerView}>
                    <MaterialCommunityIcons name={Icon.BellNoMsg} color={theme.primary} size={Size.IconMedium} />
                    <Text style={style.noItemTxt}>{LocalText.you_have_no_item}</Text>
                </View>
            </View>
        )
    }

    return (
        <View style={style.masterView}>
            <View style={style.scrollViewContainer}>
                <ScrollView contentContainerStyle={style.scrollView}>
                    {
                        sortedAllInboxes.map((inbox, index) => {
                            return (
                                <InboxItem key={index} inbox={inbox} />
                            )
                        })
                    }
                </ScrollView>
            </View>

            {/* clear all */}

            <TouchableOpacity onPress={onPressClearAll} style={style.clearAllTO}>
                <Text adjustsFontSizeToFit numberOfLines={1} style={style.clearAllTxt}>{LocalText.clear_all}</Text>
            </TouchableOpacity>
        </View>
    )
}

export default InboxScreen