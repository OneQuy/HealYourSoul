import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native'
import React, { useCallback, useContext, useEffect, useMemo } from 'react'
import { Inbox } from '../../constants/Types'
import { ThemeContext } from '../../constants/Colors'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { BorderRadius, FontSize, LocalText, Outline } from '../../constants/AppConstants'
import InboxItem from './InboxItem'
import { widthPercentageToDP } from 'react-native-responsive-screen'

const listInboxes: Inbox[] = [
    {
        tickAsId: 33333,
        title: 'Revenue',
        msg: 'Subscribe to unlock new features and if eligible, receive a share of ads revenue.',
        imgUri: 'https://www.socialpilot.co/wp-content/uploads/2023/02/MEME.webp',
    },

    {
        tickAsId: 78987978979,
        title: 'This is the title',
        msg: 'Subscribe to unlock new features and if eligible, receive a share of ads revenue.',
        // imgUri: 'https://i.pinimg.com/236x/6b/eb/9c/6beb9c44d9cfed918fbb82568acd051b.jpg',
        primaryBtnTxt: 'Go!',
        // primaryBtnGoToScreen: 'Cute',
        primaryBtnUrl: 'https://i.pinimg.com/236x/6b/eb/9c/6beb9c44d9cfed918fbb82568acd051b.jpg',
    }
]

const InboxScreen = () => {
    const theme = useContext(ThemeContext);
    const insets = useSafeAreaInsets()

    const onPressClearAll = useCallback(() => {

    }, [])

    const style = useMemo(() => {
        return StyleSheet.create({
            masterView: { marginTop: Outline.GapHorizontal, marginBottom: insets.bottom + Outline.GapHorizontal, marginHorizontal: Outline.GapVertical_2, flex: 1, gap: Outline.GapHorizontal, },
            scrollViewContainer: { flex: 1 },
            scrollView: { gap: Outline.GapVertical_2 },

            clearAllTO: { backgroundColor: theme.primary, minWidth: widthPercentageToDP(20), alignItems: 'center', justifyContent: 'center', padding: Outline.GapVertical_2, borderWidth: StyleSheet.hairlineWidth, borderRadius: BorderRadius.BR, },
            clearAllTxt: { color: theme.counterPrimary, fontSize: FontSize.Small_L, },
        })
    }, [theme, insets])

    return (
        <View style={style.masterView}>
            <View style={style.scrollViewContainer}>
                <ScrollView contentContainerStyle={style.scrollView}>
                    {
                        listInboxes.map((inbox, index) => {
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