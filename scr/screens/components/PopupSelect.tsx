// @ts-ignore
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native'
import React, { useCallback, useContext, useEffect, useRef, useState } from 'react'
import { ThemeContext } from '../../constants/Colors';
import { CommonStyles } from '../../constants/CommonConstants';
import { ColorNameToRgb } from '../../handle/UtilsTS';
import { BorderRadius, Category, FontSize, FontWeight, Icon, Outline, Size } from '../../constants/AppConstants';
import { track_SimpleWithCat } from '../../handle/tracking/GoodayTracking';
import ImageBackgroundOrView from './ImageBackgroundOrView';

const listPopupIconSize = Size.IconBig
const listPopupGap = Outline.GapVertical

export type PopupSelectItem = {
    displayText: string,
    thumbUri?: string,
}

const PopupSelect = ({
    title,
    cat,
    list,
    setSelectingIdxAndClose,
    getSelectingIdxAsync
}: {
    title: string,
    cat: Category,
    list: PopupSelectItem[],
    setSelectingIdxAndClose: (idx: number) => void,
    getSelectingIdxAsync: () => Promise<number>,
}) => {
    const theme = useContext(ThemeContext);
    const flatlistRef = useRef()
    const [selectingIdxInPopup, setSelectIdxInPopup] = useState(0)

    const renderItem = useCallback(({ item, index }: { item: PopupSelectItem, index: number }) => {
        const isSelecting = index === selectingIdxInPopup
        const textColor = isSelecting ? theme.counterPrimary : theme.counterBackground

        return <TouchableOpacity onPress={() => setSelectingIdxAndClose(index)} style={[{ backgroundColor: isSelecting ? theme.primary : undefined, borderRadius: isSelecting ? BorderRadius.BR8 : 0, borderWidth: isSelecting ? 1 : 0 }, styleSheet.itemTO]}>
            {
                item.thumbUri &&
                <ImageBackgroundOrView indicatorProps={{ color: textColor }} source={{ uri: item.thumbUri }} resizeMode='cover' style={styleSheet.image} />
            }
            <Text style={[styleSheet.text, { color: textColor }]}>{item.displayText}</Text>
        </TouchableOpacity>
    }, [selectingIdxInPopup, theme])

    useEffect(() => {
        (async () => {
            track_SimpleWithCat(cat, 'press_menu_list')

            let idx = await getSelectingIdxAsync()

            if (idx < 0 || idx >= list.length)
                idx = 0

            setSelectIdxInPopup(idx)

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
                    {/* invisible */}
                    <MaterialCommunityIcons name={Icon.X} color={theme.background} size={Size.Icon} />
                    
                    {/* title */}
                    <Text adjustsFontSizeToFit numberOfLines={1} style={[{ color: theme.counterBackground, }, styleSheet.name]}>{title}</Text>
                    
                    {/* close x btn */}
                    <TouchableOpacity onPress={() => setSelectingIdxAndClose(selectingIdxInPopup)}>
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
    itemTO: { padding: Outline.GapVertical, flexDirection: 'row', alignItems: 'center', gap: Outline.GapHorizontal },
    image: { width: listPopupIconSize, height: listPopupIconSize, borderRadius: BorderRadius.BR8, overflow: 'hidden' },
    flatlist: { gap: listPopupGap },
    text: { fontSize: FontSize.Small_L, flex: 1 },
    name: { flex: 1, textAlign: 'center', fontWeight: FontWeight.B600, fontSize: FontSize.Big },
})