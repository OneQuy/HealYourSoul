// @ts-ignore
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import React, { useContext, useMemo } from 'react'
import { ThemeContext } from '../../constants/Colors';
import { BorderRadius, FontSize, Outline, Size } from '../../constants/AppConstants';
import FavoriteButton, { FavoriteButtonProp } from './FavoriteButton';

export type BottomBarItem = {
    icon?: string,
    onPress?: () => void,
    text?: string,
    scaleIcon?: number,

    favoriteBtn?: FavoriteButtonProp,
}

const BottomBar = ({ items }: { items: BottomBarItem[] }) => {
    const theme = useContext(ThemeContext);

    const styleSheet = useMemo(() => {
        return StyleSheet.create({
            masterView: { marginBottom: Outline.GapVertical, borderRadius: BorderRadius.BR8, marginHorizontal: Outline.GapVertical, backgroundColor: theme.primary, flexDirection: 'row', justifyContent: 'space-between', },
            mainBtnTO: { paddingVertical: Outline.GapVertical_2, justifyContent: 'center', flex: 1, alignItems: 'center', gap: Outline.GapVertical },
            mainBtnTxt: { color: theme.counterPrimary, fontSize: FontSize.Small },
        })
    }, [theme])

    return (
        <View style={styleSheet.masterView}>
            {
                items.map((item) => {
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
            }
        </View>
    )
}

export default BottomBar