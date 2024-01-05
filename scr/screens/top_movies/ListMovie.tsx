// @ts-ignore
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image } from 'react-native'
import React, { useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'
import { ThemeContext } from '../../constants/Colors';
import { CommonStyles } from '../../constants/CommonConstants';
import { ColorNameToRgb } from '../../handle/UtilsTS';
import { BorderRadius, FontSize, FontWeight, Icon, LocalText, Outline, Size } from '../../constants/AppConstants';
import { FunWebsite } from '../../constants/Types';

const listPopupIconSize = Size.IconBig
const listPopupGap = Outline.GapVertical

const ListMovie = ({ list, setIdx, getSelectingIdAsync }: { list: FunWebsite[], setIdx: (idx: number) => void, getSelectingIdAsync: () => Promise<number> }) => {
    const theme = useContext(ThemeContext);
    const flatlistRef = useRef()
    const [selectIdx, setSelectIdx] = useState(0)

    const renderItem = useCallback(({ item, index }: { item: FunWebsite, index: number }) => {
        const isSelecting = index === selectIdx
        
        let urlShort = item.url.replaceAll('https://', '')
        urlShort = urlShort.replaceAll('www.', '')
        
        return <TouchableOpacity onPress={() => setIdx(item.id)} style={[{ backgroundColor: isSelecting ? theme.primary : undefined, borderRadius: isSelecting ? BorderRadius.BR8 : 0, borderWidth: isSelecting ? 1 : 0 }, styleSheet.itemTO]}>
            <Image source={{ uri: item.img }} resizeMode='cover' style={styleSheet.image} />
            <Text style={[styleSheet.text, { color: theme.text }]}>{urlShort}</Text>
        </TouchableOpacity>
    }, [selectIdx, theme])

    useEffect(() => {
        (async () => {
            const id = await getSelectingIdAsync()
            const idx = list.findIndex(item => item.id === id)

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
                    <Text style={[{ color: theme.text, }, styleSheet.title]}>{LocalText.fun_websites}</Text>
                    <TouchableOpacity onPress={() => setIdx(selectIdx)}>
                        <MaterialCommunityIcons name={Icon.X} color={theme.text} size={Size.Icon} />
                    </TouchableOpacity>
                </View>
                <FlatList
                    // @ts-ignore
                    ref={flatlistRef}
                    data={list}
                    keyExtractor={(item) => item.url}
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

export default ListMovie

const styleSheet = StyleSheet.create({
    masterView: { backgroundColor: ColorNameToRgb('black', 0.8), width: '100%', height: '100%', position: 'absolute' },
    bgView: { gap: Outline.GapVertical, padding: Outline.GapVertical, width: '80%', height: '70%', borderRadius: BorderRadius.BR },
    itemTO: { flexDirection: 'row', alignItems: 'center', gap: Outline.GapHorizontal },
    image: { width: listPopupIconSize, height: listPopupIconSize,  borderRadius: BorderRadius.BR8 },
    flatlist: { gap: listPopupGap },
    text: { fontSize: FontSize.Small_L, flex: 1 },
    title: { flex: 1, textAlign: 'center', fontWeight: FontWeight.B600, fontSize: FontSize.Big },
})