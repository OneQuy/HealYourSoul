// @ts-ignore
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native'
import React, { useCallback, useContext, useEffect, useRef, useState } from 'react'
import { ThemeContext } from '../../constants/Colors';
import { CommonStyles } from '../../constants/CommonConstants';
import { ColorNameToRgb } from '../../handle/UtilsTS';
import { BorderRadius, Category, FontSize, FontWeight, Icon, LocalText, Outline, Size } from '../../constants/AppConstants';
import ImageBackgroundWithLoading from './ImageBackgroundWithLoading';
import { track_SimpleWithCat } from '../../handle/tracking/GoodayTracking';

const listPopupIconSize = Size.IconBig
const listPopupGap = Outline.GapVertical

export type PopupSelectItem = {
    displayText: string,
    thumbUri?: string,
}

const PopupSelect = ({
    cat,
    list,
    setIdx,
    getSelectingIdxAsync,

    getThumbUriAsync,
}: {
    cat: Category,
    list: PopupSelectItem[],
    setIdx: (idx: number) => void,
    getSelectingIdxAsync: () => Promise<number>,

    getThumbUriAsync?: (item: PopupSelectItem) => Promise<string | undefined>,
}) => {
    const theme = useContext(ThemeContext);
    const flatlistRef = useRef()
    const [selectIdx, setSelectIdx] = useState(0)

    const renderItem = useCallback(({ item, index }: { item: PopupSelectItem, index: number }) => {
        const isSelecting = index === selectIdx
        const textColor = isSelecting ? theme.counterPrimary : theme.counterBackground

        return <TouchableOpacity onPress={() => setIdx(index)} style={[{ backgroundColor: isSelecting ? theme.primary : undefined, borderRadius: isSelecting ? BorderRadius.BR8 : 0, borderWidth: isSelecting ? 1 : 0 }, styleSheet.itemTO]}>
            <ImageBackgroundWithLoading indicatorProps={{ color: textColor }} source={{ uri: item.thumbUri }} resizeMode='cover' style={styleSheet.image} />
            <Text style={[styleSheet.text, { color: textColor }]}>{item.displayText}</Text>
        </TouchableOpacity>
    }, [selectIdx, theme])

    useEffect(() => {
        (async () => {
            track_SimpleWithCat(cat, 'press_menu_list')

            const idx = await getSelectingIdxAsync()

            setSelectIdx(idx)

            // @ts-ignore
            flatlistRef?.current?.scrollToIndex({
                animated: true,
                index: idx,
            })
        })()
    }, [])

    return (
        <View style={[styleSheet.masterView, CommonStyles.justifyContentCenter_AlignItemsCenter]}>
            <View style={[{ backgroundColor: theme.background, }, styleSheet.bgView]}>
                <View style={[{ flexDirection: 'row' }, CommonStyles.justifyContentCenter_AlignItemsCenter]}>
                    <MaterialCommunityIcons name={Icon.ThreeDots} color={theme.background} size={Size.Icon} />
                    <Text style={[{ color: theme.counterBackground, }, styleSheet.name]}>{LocalText.best_short_films}</Text>
                    <TouchableOpacity onPress={() => setIdx(selectIdx)}>
                        <MaterialCommunityIcons name={Icon.X} color={theme.counterBackground} size={Size.Icon} />
                    </TouchableOpacity>
                </View>
                <FlatList
                    // @ts-ignore
                    ref={flatlistRef}
                    data={list}
                    keyExtractor={(item) => item.displayText}
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

export default PopupSelect

const styleSheet = StyleSheet.create({
    masterView: { backgroundColor: ColorNameToRgb('black', 0.8), width: '100%', height: '100%', position: 'absolute' },
    bgView: { gap: Outline.GapVertical, padding: Outline.GapVertical, width: '80%', height: '70%', borderRadius: BorderRadius.BR },
    itemTO: { flexDirection: 'row', alignItems: 'center', gap: Outline.GapHorizontal },
    image: { width: listPopupIconSize, height: listPopupIconSize, borderRadius: BorderRadius.BR8, overflow: 'hidden' },
    flatlist: { gap: listPopupGap },
    text: { fontSize: FontSize.Small_L, flex: 1 },
    name: { flex: 1, textAlign: 'center', fontWeight: FontWeight.B600, fontSize: FontSize.Big },
})