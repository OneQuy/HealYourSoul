import { Text, StyleSheet, TouchableOpacity, Image } from 'react-native'
import React from 'react'
import { DrawerContentComponentProps } from '@react-navigation/drawer'
import { CommonActions, DrawerActions } from '@react-navigation/native'
import { BorderRadius, Outline, ScreenName } from '../constants/AppConstants'
import { CommonStyles } from '../constants/CommonConstants'
import { RandomColor } from '../handle/UtilsTS'

// @ts-ignore


type Props = {
    route: DrawerContentComponentProps['state']['routes'][number],
    masterProps: DrawerContentComponentProps,
}

const thumbs = [
    [ScreenName.Meme, require('../../assets/images/category_icon/meme.jpg')],
    [ScreenName.Art, require('../../assets/images/category_icon/art.webp')],
    [ScreenName.ShortFact, require('../../assets/images/category_icon/fact.jpeg')],
    [ScreenName.Love, require('../../assets/images/category_icon/love.jpg')],
    [ScreenName.Quote, require('../../assets/images/category_icon/motivation.jpg')],
    [ScreenName.NSFW, require('../../assets/images/category_icon/nsfw.jpg')],
    [ScreenName.Sarcasm, require('../../assets/images/category_icon/sarcasm.jpg')],
    [ScreenName.Satisfying, require('../../assets/images/category_icon/satisfying.jpg')],
    [ScreenName.Comic, require('../../assets/images/category_icon/warm.jpg')],
    [ScreenName.Trivia, require('../../assets/images/category_icon/trivia.png')],
    [ScreenName.QuoteText, require('../../assets/images/category_icon/quote.png')],
    [ScreenName.Picture, require('../../assets/images/category_icon/picture.jpg')],
    [ScreenName.Joke, require('../../assets/images/category_icon/joke.jpg')],
    [ScreenName.CatDog, require('../../assets/images/category_icon/cat.jpg')],
    [ScreenName.Cute, require('../../assets/images/category_icon/wholesome.jpeg')],
]

const DrawerSingleItem = ({
    route,
    masterProps,
}: Props) => {
    const focusingRoute = masterProps.state.routes[masterProps.state.index];
    const isFocused = route === focusingRoute
    const navigation = masterProps.navigation

    const thumb = thumbs.find(i => i[0] === route.name)

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
    };

    return (
        <TouchableOpacity onPress={onPress} style={[style.masterTO, CommonStyles.justifyContentCenter_AlignItemsCenter, { borderRadius: BorderRadius.BR8 }]}>
            <Image source={thumb ? thumb[1] : thumbs[0][1]} resizeMode='stretch' style={[style.iconView, { backgroundColor: RandomColor(), paddingHorizontal: Outline.GapHorizontal, borderBottomLeftRadius: BorderRadius.BR8, borderTopLeftRadius: BorderRadius.BR8 }]} />
            <Text style={[{ flex: 1, textAlign: 'center', color: isFocused ? 'red' : 'black' }]}>{route.name}</Text>
        </TouchableOpacity>
    )
}

export default DrawerSingleItem

const style = StyleSheet.create({
    masterTO: { flexDirection: 'row', flex: 1, borderWidth: StyleSheet.hairlineWidth, overflow: 'hidden' },
    iconView: { height: '100%', justifyContent: 'center', width: '30%' }
})

{/* <View style={[style.iconView, { backgroundColor: RandomColor(), paddingHorizontal: Outline.GapHorizontal, borderBottomLeftRadius: BorderRadius.BR8, borderTopLeftRadius: BorderRadius.BR8 }]}>
<MaterialCommunityIcons name={Icon.Check} color={'white'} size={Size.Icon} />
</View> */}