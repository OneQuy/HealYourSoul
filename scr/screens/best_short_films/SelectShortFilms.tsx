// @ts-ignore
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native'
import React, { useCallback, useContext, useEffect, useRef, useState } from 'react'
import { ThemeContext } from '../../constants/Colors';
import { CommonStyles } from '../../constants/CommonConstants';
import { ColorNameToRgb } from '../../handle/UtilsTS';
import { BorderRadius, FontSize, FontWeight, Icon, LocalText, Outline, Size } from '../../constants/AppConstants';
import { ShortFilm } from '../../constants/Types';
import ImageBackgroundWithLoading from '../components/ImageBackgroundWithLoading';

const listPopupIconSize = Size.IconBig
const listPopupGap = Outline.GapVertical

const BestShortFilms = ({ list, setIdx, getSelectingIdAsync: getSelectingIdxAsync }: { list: ShortFilm[], setIdx: (idx: number) => void, getSelectingIdAsync: () => Promise<number> }) => {
    const theme = useContext(ThemeContext);
    const flatlistRef = useRef()
    const [selectIdx, setSelectIdx] = useState(0)

    const renderItem = useCallback(({ item, index }: { item: ShortFilm, index: number }) => {
        const isSelecting = index === selectIdx
        
        return <TouchableOpacity onPress={() => setIdx(index)} style={[{ backgroundColor: isSelecting ? theme.primary : undefined, borderRadius: isSelecting ? BorderRadius.BR8 : 0, borderWidth: isSelecting ? 1 : 0 }, styleSheet.itemTO]}>
            <ImageBackgroundWithLoading source={{ uri: item.img }} resizeMode='cover' style={styleSheet.image} />
            <Text style={[styleSheet.text, { color: theme.text }]}>{item.name}</Text>
        </TouchableOpacity>
    }, [selectIdx, theme])

    useEffect(() => {
        (async () => {
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
                    <Text style={[{ color: theme.text, }, styleSheet.name]}>{LocalText.top_movies}</Text>
                    <TouchableOpacity onPress={() => setIdx(selectIdx)}>
                        <MaterialCommunityIcons name={Icon.X} color={theme.text} size={Size.Icon} />
                    </TouchableOpacity>
                </View>
                <FlatList
                    // @ts-ignore
                    ref={flatlistRef}
                    data={list}
                    keyExtractor={(item) => item.img}
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

export default BestShortFilms

const styleSheet = StyleSheet.create({
    masterView: { backgroundColor: ColorNameToRgb('black', 0.8), width: '100%', height: '100%', position: 'absolute' },
    bgView: { gap: Outline.GapVertical, padding: Outline.GapVertical, width: '80%', height: '70%', borderRadius: BorderRadius.BR },
    itemTO: { flexDirection: 'row', alignItems: 'center', gap: Outline.GapHorizontal },
    image: { width: listPopupIconSize, height: listPopupIconSize,  borderRadius: BorderRadius.BR8, overflow: 'hidden' },
    flatlist: { gap: listPopupGap },
    text: { fontSize: FontSize.Small_L, flex: 1 },
    name: { flex: 1, textAlign: 'center', fontWeight: FontWeight.B600, fontSize: FontSize.Big },
})