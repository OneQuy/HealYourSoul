import { Text, StyleSheet, TouchableOpacity, View } from 'react-native'
import React, { useCallback, useContext, useMemo } from 'react'
import { DrawerContentComponentProps } from '@react-navigation/drawer'
import { CommonActions, DrawerActions } from '@react-navigation/native'
import { BorderRadius, Icon, Outline, ScreenName, Size } from '../constants/AppConstants'
import { CommonStyles } from '../constants/CommonConstants'

// @ts-ignore
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { ThemeContext } from '../constants/Colors'
import useDrawerMenuItemUtils from '../hooks/useDrawerMenuItemUtils'

type Props = {
    route: DrawerContentComponentProps['state']['routes'][number],
    masterProps: DrawerContentComponentProps,
}

const DrawerSingleItem = ({
    route,
    masterProps,
}: Props) => {
    const theme = useContext(ThemeContext);
    const [isFocused, onPress] = useDrawerMenuItemUtils(route.name, masterProps)

    const icon = useMemo(() => {
        if (route.name === ScreenName.Meme)
            return 'emoticon-poop'
        else if (route.name === ScreenName.Comic)
            return 'fire'
        else if (route.name === ScreenName.CatDog)
            return 'dog-side'
        else if (route.name === ScreenName.NSFW)
            return 'emoticon-devil'
        else if (route.name === ScreenName.Quote)
            return 'format-quote-open'
        else if (route.name === ScreenName.Satisfying)
            return 'head-heart'
        else if (route.name === ScreenName.Love)
            return 'cards-heart'
        else if (route.name === ScreenName.Sarcasm)
            return 'duck'
        else if (route.name === ScreenName.Cute)
            return 'assistant'
        else if (route.name === ScreenName.Art)
            return 'palette'
        else if (route.name === ScreenName.Trivia)
            return 'message-question'
        else if (route.name === ScreenName.ShortFact)
            return 'newspaper-variant'
        else if (route.name === ScreenName.Joke)
            return 'dolphin'
        else if (route.name === ScreenName.Picture)
            return 'file-image'
        else if (route.name === ScreenName.QuoteText)
            return 'comment-quote'
        else if (route.name === ScreenName.AwardPicture)
            return 'crown'
        else if (route.name === ScreenName.WikiFact)
            return 'book-open-variant'
        else
            return Icon.HeartBroken
    }, [])

    return (
        <TouchableOpacity onPress={onPress} style={[style.masterTO, CommonStyles.justifyContentCenter_AlignItemsCenter, { paddingHorizontal: Outline.GapVertical, backgroundColor: isFocused ? theme.primary : undefined, borderRadius: BorderRadius.BR8, borderColor: theme.text }]}>
            <View style={[style.iconView, { marginRight: Outline.GapVertical, }]}>
                <MaterialCommunityIcons name={icon} color={theme.text} size={Size.IconSmaller} />
            </View>
            <Text style={[style.labelText, { color: theme.text, }]}>{route.name}</Text>
        </TouchableOpacity>
    )
}

export default DrawerSingleItem

const style = StyleSheet.create({
    masterTO: { flexDirection: 'row', flex: 1, borderWidth: StyleSheet.hairlineWidth, },
    iconView: { height: '100%', justifyContent: 'center', },
    labelText: { flex: 1, textAlign: 'center', }
})
