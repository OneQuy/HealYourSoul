// @ts-ignore
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import React, { useContext, useMemo } from 'react'
import { ThemeContext } from '../../constants/Colors';
import { BorderRadius, FontSize, Outline, Size } from '../../constants/AppConstants';

export type BottomBarItem = {
    icon: string,
    onPress: () => void,
    text: string,
}

const BottomBar = ({ items }: { items: BottomBarItem[] }) => {
    const theme = useContext(ThemeContext);

    const styleSheet = useMemo(() => {
        return StyleSheet.create({
            mainBtnsView: { marginBottom: Outline.GapVertical, borderRadius: BorderRadius.BR8, paddingVertical: Outline.GapVertical_2, marginHorizontal: Outline.GapVertical, backgroundColor: theme.primary, flexDirection: 'row', justifyContent: 'space-between', },
            mainBtnsTO: { justifyContent: 'center', flex: 1, alignItems: 'center', gap: Outline.GapVertical },
            mainBtnTxt: { color: theme.counterPrimary, fontSize: FontSize.Small },
        })
    }, [theme])

    return (
        <View style={styleSheet.mainBtnsView}>
            {
                items.map((item) => {                    
                    return (
                        <TouchableOpacity key={item.text} onPress={item.onPress} style={styleSheet.mainBtnsTO}>
                            <MaterialCommunityIcons name={item.icon} color={theme.counterPrimary} size={Size.Icon} />
                            <Text style={styleSheet.mainBtnTxt}>{item.text}</Text>
                        </TouchableOpacity>
                    )
                })
            }
        </View>
    )
}

export default BottomBar