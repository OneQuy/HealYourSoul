// @ts-ignore
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native'
import React, { useContext, useMemo } from 'react'
import { ThemeContext } from '../../constants/Colors';
import { BorderRadius, FontSize, Outline, Size } from '../../constants/AppConstants';
import FavoriteButton, { FavoriteButtonProp } from './FavoriteButton';
import { heightPercentageToDP } from 'react-native-responsive-screen';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export type BottomBarItem = {
    icon?: string,
    onPress?: () => void,
    text?: string,
    scaleIcon?: number,

    favoriteBtn?: FavoriteButtonProp,
}

const BottomBar = ({ items }: { items: BottomBarItem[] }) => {
    const theme = useContext(ThemeContext);
    const safeArea = useSafeAreaInsets()

    const styleSheet = useMemo(() => {
        return StyleSheet.create({
            masterView: {
                marginBottom: safeArea.bottom > 0 ? safeArea.bottom : Outline.GapVertical,
                marginHorizontal: Outline.GapVertical,
                borderRadius: BorderRadius.BR,
                backgroundColor: theme.primary,
                flexDirection: 'row',
                justifyContent: 'space-between',
            },
            mainBtnTO: { paddingVertical: Outline.GapVertical_2, justifyContent: 'center', flex: 1, alignItems: 'center', gap: Outline.GapVertical },
            mainBtnTxt: { color: theme.counterPrimary, fontSize: FontSize.Small },
        })
    }, [theme, safeArea])

    const renderedItems = useMemo(() => {
        return items.map((item) => {
            if (item.favoriteBtn)
                return <FavoriteButton key={'favorite'} {...item.favoriteBtn} />
            else {
                return (
                    <TouchableOpacity key={item.text} onPress={item.onPress} style={styleSheet.mainBtnTO}>
                        <View style={{ transform: [{ scale: typeof item.scaleIcon === 'number' ? item.scaleIcon : 1 }] }}>
                            <MaterialCommunityIcons name={item.icon} color={theme.counterPrimary} size={Size.Icon} />
                        </View>
                        <Text style={styleSheet.mainBtnTxt}>{item.text}</Text>
                    </TouchableOpacity>
                )
            }
        })
    }, [items, theme, styleSheet])

    return (
        <View style={styleSheet.masterView}>
            {
                renderedItems
            }
        </View>
    )
}

export default BottomBar