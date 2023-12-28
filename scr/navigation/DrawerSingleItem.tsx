import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native'
import React from 'react'
import { DrawerContentComponentProps } from '@react-navigation/drawer'
import { CommonActions, DrawerActions } from '@react-navigation/native'
import { BorderRadius, Icon, Outline, ScreenName, Size } from '../constants/AppConstants'
import { CommonStyles } from '../constants/CommonConstants'
import { RandomColor } from '../handle/UtilsTS'

// @ts-ignore
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';


type Props = {
    route: DrawerContentComponentProps['state']['routes'][number],
    masterProps: DrawerContentComponentProps,
}

const thumbs = [
    [ScreenName.CatDog, ['https://preview.redd.it/wy925k0hmvk51.png?auto=webp&s=82a042d28b9ac65e3f3daac30c7cc2dc6490c7eb']],
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
            <Image source={{ uri: thumb ? thumb[1][0] : 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT8TWqUEI-LLgLVwKkSWdNqE5wFSLHAfs6jpQ&usqp=CAU' }} style={[style.iconView, { backgroundColor: RandomColor(), paddingHorizontal: Outline.GapHorizontal, borderBottomLeftRadius: BorderRadius.BR8, borderTopLeftRadius: BorderRadius.BR8 }]} />
            <Text style={[{ flex: 1, textAlign: 'center', color: isFocused ? 'red' : 'black' }]}>{route.name}</Text>
        </TouchableOpacity>
    )
}

export default DrawerSingleItem

const style = StyleSheet.create({
    masterTO: { flexDirection: 'row', flex: 1, borderWidth: StyleSheet.hairlineWidth, overflow: 'hidden' },
    iconView: { height: '100%', justifyContent: 'center', width: '25%' }
})

{/* <View style={[style.iconView, { backgroundColor: RandomColor(), paddingHorizontal: Outline.GapHorizontal, borderBottomLeftRadius: BorderRadius.BR8, borderTopLeftRadius: BorderRadius.BR8 }]}>
<MaterialCommunityIcons name={Icon.Check} color={'white'} size={Size.Icon} />
</View> */}