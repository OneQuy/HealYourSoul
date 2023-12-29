import { Text, StyleSheet, TouchableOpacity, View } from 'react-native'
import React, { useMemo } from 'react'
import { DrawerContentComponentProps } from '@react-navigation/drawer'
import { CommonActions, DrawerActions } from '@react-navigation/native'
import { BorderRadius, Icon, Outline, ScreenName, Size } from '../constants/AppConstants'
import { CommonStyles } from '../constants/CommonConstants'

// @ts-ignore
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

type Props = {
    route: DrawerContentComponentProps['state']['routes'][number],
    masterProps: DrawerContentComponentProps,
}

const DrawerSingleItem = ({
    route,
    masterProps,
}: Props) => {
    const focusingRoute = masterProps.state.routes[masterProps.state.index];
    const isFocused = route === focusingRoute
    const navigation = masterProps.navigation

    const icon = useMemo(() => {
        if (route.name === ScreenName.Meme)
            return 'alpha-m-box'
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
            return 'assistant'
        else if (route.name === ScreenName.Cute)
            return 'duck'
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
        else
            return Icon.HeartBroken
    }, [])

    const onPress = () => {
        const event = navigation.emit({
            type: 'drawerItemPress',
            target: route.key,
            canPreventDefault: true,
        });

        if (!event.defaultPrevented) {
            navigation.dispatch({
                ...(isFocused
                    ? DrawerActions.closeDrawer()
                    : CommonActions.navigate({ name: route.name, merge: true })),
                target: masterProps.state.key,
            });
        }
    }

    return (
        <TouchableOpacity onPress={onPress} style={[style.masterTO, CommonStyles.justifyContentCenter_AlignItemsCenter, { borderRadius: BorderRadius.BR8 }]}>
            <View style={[style.iconView, { paddingLeft: Outline.GapVertical, borderBottomLeftRadius: BorderRadius.BR8, borderTopLeftRadius: BorderRadius.BR8 }]}>
                <MaterialCommunityIcons name={icon} color={'black'} size={Size.IconSmaller} />
            </View>
            <Text style={[{ flex: 1, textAlign: 'center', color: isFocused ? 'red' : 'black' }]}>{route.name}</Text>
        </TouchableOpacity>
    )
}

export default DrawerSingleItem

const style = StyleSheet.create({
    masterTO: { flexDirection: 'row', flex: 1, borderWidth: StyleSheet.hairlineWidth, overflow: 'hidden' },
    iconView: { height: '100%', justifyContent: 'center', }
})
