// @ts-ignore
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native'
import React, { useCallback, useContext, useEffect, useMemo, useRef } from 'react'
import { ThemeContext } from '../../constants/Colors';
import { CommonStyles } from '../../constants/CommonConstants';
import { ColorNameToRgb } from '../../handle/UtilsTS';
import { BorderRadius, ScreenName, FontSize, FontWeight, Icon, LocalText, Outline, Size } from '../../constants/AppConstants';
import { GetAllContentScreens, GetIconOfScreen } from '../../handle/AppUtils';
import { useNavigation } from '@react-navigation/native';
import HairLine from '../components/HairLine';

const FilterDiversityPopup = ({
    curFilters,
    setFilters
}: {
    curFilters: undefined | ScreenName[],
    setFilters: (filter: undefined | ScreenName[]) => void,
}) => {
    const theme = useContext(ThemeContext)
    const navigation = useNavigation()
    const flatlistRef = useRef()

    const listScreen = useMemo(() => {
        return GetAllContentScreens(navigation)
    }, [])

    const renderItem = useCallback(({ item, index }: { item: ScreenName | undefined, index: number }) => {
        const isAllItem = item === undefined
        const textColor = theme.counterBackground
        const icon = !isAllItem ? GetIconOfScreen(item) : Icon.Bookmark

        let isSelecting

        if (isAllItem) {
            isSelecting = !curFilters || curFilters.length === listScreen.length
        }
        else {
            isSelecting = !curFilters || (item && curFilters.includes(item))
        }

        return <TouchableOpacity onPress={undefined} style={[styleSheet.itemTO]}>
            <MaterialCommunityIcons name={icon} color={isAllItem ? theme.background : theme.counterBackground} size={Size.Icon} />
            <Text style={[styleSheet.text, { fontSize: FontSize.Normal, color: textColor, fontWeight: isAllItem ? FontWeight.Bold : 'normal' }]}>{isAllItem ? LocalText.all : item}</Text>
            <MaterialCommunityIcons name={isSelecting ? Icon.CheckBox_Yes : Icon.CheckBox_No} color={theme.counterBackground} size={Size.Icon} />
        </TouchableOpacity>
    }, [curFilters, theme, listScreen])

    useEffect(() => {
        (async () => {
            // setSelectIdx(idx)

            // // @ts-ignore
            // flatlistRef?.current?.scrollToIndex({
            //     animated: true,
            //     index: idx,
            // })
        })()
    }, [])

    return (
        <View style={[styleSheet.masterView, CommonStyles.justifyContentCenter_AlignItemsCenter]}>
            <View style={[{ backgroundColor: theme.background, }, styleSheet.bgView]}>
                <View style={[{ flexDirection: 'row' }, CommonStyles.justifyContentCenter_AlignItemsCenter]}>
                    <MaterialCommunityIcons name={Icon.ThreeDots} color={theme.background} size={Size.Icon} />
                    <Text style={[{ color: theme.counterBackground, }, styleSheet.name]}>{LocalText.filter}</Text>
                    <TouchableOpacity onPress={() => setFilters(curFilters)}>
                        <MaterialCommunityIcons name={Icon.X} color={theme.counterBackground} size={Size.Icon} />
                    </TouchableOpacity>
                </View>

                {/* all */}

                {
                    renderItem({
                        item: undefined,
                        index: 0
                    })
                }

                <HairLine />

                {/* list */}

                <FlatList
                    // @ts-ignore
                    ref={flatlistRef}
                    data={listScreen}
                    keyExtractor={(item) => item.toString()}
                    contentContainerStyle={styleSheet.flatlist}
                    renderItem={renderItem}
                />
            </View>
        </View>
    )
}

export default FilterDiversityPopup

const styleSheet = StyleSheet.create({
    masterView: { backgroundColor: ColorNameToRgb('black', 0.8), width: '100%', height: '100%', position: 'absolute' },
    bgView: { gap: Outline.GapVertical, padding: Outline.GapVertical, width: '80%', height: '70%', borderRadius: BorderRadius.BR },
    itemTO: { flexDirection: 'row', alignItems: 'center', gap: Outline.GapHorizontal },
    image: { width: Size.Icon, height: Size.Icon, borderRadius: BorderRadius.BR8, overflow: 'hidden' },
    flatlist: { gap: Outline.GapHorizontal },
    text: { fontSize: FontSize.Small_L, flex: 1 },
    name: { flex: 1, textAlign: 'center', fontWeight: FontWeight.B600, fontSize: FontSize.Big },
})