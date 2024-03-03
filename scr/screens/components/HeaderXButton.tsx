// @ts-ignore
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import { TouchableOpacity, StyleSheet, View } from 'react-native'
import React, { useCallback, useContext, useMemo } from 'react'
import { Icon, Outline, ScreenName, Size } from '../../constants/AppConstants';
import { ThemeContext } from '../../constants/Colors';
import { NavigationProp } from '@react-navigation/native';
import { DrawerNavigationProp } from '@react-navigation/drawer';
import { DrawerParamList } from '../../navigation/Navigator';
import { track_Simple } from '../../handle/tracking/GoodayTracking';
import { GetScreenBackWhenPressXGlobal } from '../diversity/TheDiversity';
import { GoToScreen } from '../../handle/GoodayAppState';
import { DiversityItemType } from '../../constants/Types';
import { Cheat } from '../../handle/Cheat';
import { GetLastCatOfGallery } from '../gallery/GalleryScreen';
import { CatToScreenName } from '../../handle/AppUtils';

const HeaderXButton = ({
    pressGoToDiversityScreenOrThePage
}: {
    pressGoToDiversityScreenOrThePage?: boolean
}
) => {
    const theme = useContext(ThemeContext);

    const style = useMemo(() => {
        return StyleSheet.create({
            master: { gap: Outline.GapHorizontal, flexDirection: 'row', marginLeft: 15 },
        })
    }, [])

    const onPress = useCallback(() => {
        if (pressGoToDiversityScreenOrThePage)
            OnPressedXInDiversityMode()
        else {
            const screenOf = CatToScreenName(GetLastCatOfGallery())

            if (screenOf)
                GoToScreen(screenOf)
        }
    }, [pressGoToDiversityScreenOrThePage])

    return (
        <View style={style.master}>
            {/* x button */}
            <TouchableOpacity onPress={onPress} >
                <MaterialCommunityIcons name={pressGoToDiversityScreenOrThePage ? Icon.Close : Icon.Left} color={theme.primary} size={Size.Icon} />
            </TouchableOpacity>
        </View>
    )
}

export const GoToPremiumScreen = (navigation: DrawerNavigationProp<DrawerParamList> | NavigationProp<ReactNavigation.RootParamList>) => {
    track_Simple('pressed_go_to_premium')

    // @ts-ignore
    navigation.navigate(ScreenName.IAPPage)
}

export const OnPressedXInDiversityMode = () => {
    // go to diversity screen
    GoToScreen(GetScreenBackWhenPressXGlobal())
}

export const UpdateHeaderXButton = (
    navigation: DrawerNavigationProp<DrawerParamList> | NavigationProp<ReactNavigation.RootParamList>,
    diversityItem: DiversityItemType | undefined,
    pressBackToThePage: boolean | undefined,
) => {
    const index = navigation.getState().index
    const screen = navigation.getState().routes[index].name

    let title: string = screen

    if (diversityItem !== undefined) {
        title += ` (${GetScreenBackWhenPressXGlobal()})`
    }

    if (diversityItem && Cheat('IsLog_CurrentPost'))
        title += ` ID=${diversityItem.id}`

    if (title === ScreenName.Gallery as string) {
        const screenOf = CatToScreenName(GetLastCatOfGallery())

        title += ' of ' + screenOf
    }

    navigation.setOptions({
        headerLeft: pressBackToThePage === true || diversityItem !== undefined ? () => <HeaderXButton pressGoToDiversityScreenOrThePage={pressBackToThePage !== true} /> : undefined,
        headerTitle: title,
    })
}