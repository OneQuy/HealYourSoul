import { View, Text, StyleSheet, ScrollView } from 'react-native'
import React, { useContext, useMemo } from 'react'
import { Inbox } from '../../constants/Types'
import { ThemeContext } from '../../constants/Colors'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useNavigation } from '@react-navigation/native'
import { Outline } from '../../constants/AppConstants'
import InboxItem from './InboxItem'

const listInboxes: Inbox[] = [
    {
        title: 'Revenue',
        msg: 'Subscribe to unlock new features and if eligible, receive a share of ads revenue.',
        imgUri: 'https://www.socialpilot.co/wp-content/uploads/2023/02/MEME.webp',
    },

    {
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
    const navigation = useNavigation()

    const style = useMemo(() => {
        return StyleSheet.create({
            masterView: { marginBottom: insets.bottom + Outline.GapHorizontal, marginHorizontal: Outline.GapVertical_2, flex: 1, gap: Outline.GapHorizontal, },
            scrollViewContainer: { flex: 1 },
            scrollView: { gap: Outline.GapVertical_2 },
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
        </View>
    )
}

export default InboxScreen