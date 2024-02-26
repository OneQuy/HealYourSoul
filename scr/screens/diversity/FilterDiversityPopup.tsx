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
import { DiversityItemFilter } from '../../constants/Types';

const listPopupIconSize = Size.IconBig
const listPopupGap = Outline.GapVertical

const FilterDiversityPopup = ({
    curFilter,
    setFilter
}: {
    curFilter: DiversityItemFilter,
    setFilter: (filter: DiversityItemFilter) => void,
}) => {
    const theme = useContext(ThemeContext)
    const navigation = useNavigation()
    const flatlistRef = useRef()

    const listScreen = useMemo(() => {
        return GetAllContentScreens(navigation)
    }, [])

    const renderItem = useCallback(({ item, index }: { item: ScreenName, index: number }) => {
        const isSelecting = item === curFilter
        const textColor = isSelecting ? theme.counterPrimary : theme.counterBackground

        return <TouchableOpacity onPress={undefined} style={[{ backgroundColor: isSelecting ? theme.primary : undefined, borderRadius: isSelecting ? BorderRadius.BR8 : 0, borderWidth: isSelecting ? 1 : 0 }, styleSheet.itemTO]}>
            <MaterialCommunityIcons name={GetIconOfScreen(item)} color={theme.background} size={Size.Icon} />
            <Text style={[styleSheet.text, { color: textColor }]}>{item}</Text>
        </TouchableOpacity>
    }, [curFilter, theme])

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
                    <Text style={[{ color: theme.counterBackground, }, styleSheet.name]}>{LocalText.best_short_films}</Text>
                    <TouchableOpacity onPress={() => setFilter(curFilter)}>
                        <MaterialCommunityIcons name={Icon.X} color={theme.counterBackground} size={Size.Icon} />
                    </TouchableOpacity>
                </View>
                <FlatList
                    // @ts-ignore
                    ref={flatlistRef}
                    data={listScreen}
                    keyExtractor={(item) => item.toString()}
                    contentContainerStyle={styleSheet.flatlist}
                    renderItem={renderItem}
                    getItemLayout={(_, index) => {
                        return { length: listPopupIconSize, offset: listPopupIconSize * index + listPopupGap * (index) - listPopupIconSize * 3, index }
                    }}
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
    image: { width: listPopupIconSize, height: listPopupIconSize, borderRadius: BorderRadius.BR8, overflow: 'hidden' },
    flatlist: { gap: listPopupGap },
    text: { fontSize: FontSize.Small_L, flex: 1 },
    name: { flex: 1, textAlign: 'center', fontWeight: FontWeight.B600, fontSize: FontSize.Big },
})