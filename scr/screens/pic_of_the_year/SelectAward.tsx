import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image } from 'react-native'
import React, { useCallback, useContext, useEffect, useMemo, useRef } from 'react'
import { ThemeContext } from '../../constants/Colors';
import { CommonStyles } from '../../constants/CommonConstants';
import { ColorNameToRgb } from '../../handle/UtilsTS';
import { BorderRadius, FontSize, FontWeight, LocalText, Outline, Size } from '../../constants/AppConstants';
import { dataOfYears } from './PicturesOfTheYearScreen';
import { AwardPicture } from '../../constants/Types';

const listPopupIconSize = Size.IconBig
const listPopupGap = Outline.GapVertical

const SelectAward = ({ year, selectIdx, setIdx }: { year: number, selectIdx: number, setIdx: (idx: number) => void }) => {
    const theme = useContext(ThemeContext);
    const flatlistRef = useRef()

    const renderItem = useCallback(({ item, index }: { item: AwardPicture, index: number }) => {
        const isSelecting = index === selectIdx

        return <TouchableOpacity onPress={() => setIdx(index)} style={[{ backgroundColor: isSelecting ? theme.primary : undefined, borderRadius: isSelecting ? BorderRadius.BR8 : 0, borderWidth: isSelecting ? 1 : 0 }, styleSheet.itemTO]}>
            <Image source={{ uri: item.imageUri }} resizeMode='cover' style={styleSheet.image} />
            <Text style={[styleSheet.text, { color: theme.text }]}>{item?.reward + (item?.category ? ' - ' + item?.category : '')}</Text>
        </TouchableOpacity>
    }, [selectIdx])

    const curYearData = useMemo(() => {
        const f = dataOfYears.find(i => i.year === year)

        if (!f)
            throw '[ne]'

        return f
    }, [year, dataOfYears])

    useEffect(() => {
        // @ts-ignore
        flatlistRef?.current?.scrollToIndex({
            animated: true,
            index: selectIdx,
        })
    }, [])

    return (
        <View style={[styleSheet.masterView, CommonStyles.justifyContentCenter_AlignItemsCenter]}>
            <View style={[{ backgroundColor: theme.background, }, styleSheet.bgView]}>
                <Text style={styleSheet.title}>{year + ' ' + LocalText.winners}</Text>
                <FlatList
                    // @ts-ignore
                    ref={flatlistRef}
                    data={curYearData.list}
                    keyExtractor={(item) => item.title + item.author}
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

export default SelectAward

const styleSheet = StyleSheet.create({
    masterView: { backgroundColor: ColorNameToRgb('black', 0.8), width: '100%', height: '100%', position: 'absolute' },
    bgView: { padding: Outline.GapVertical, width: '80%', height: '70%', borderRadius: BorderRadius.BR },
    itemTO: { flexDirection: 'row', alignItems: 'center', gap: Outline.GapHorizontal },
    image: { width: listPopupIconSize, height: listPopupIconSize, },
    flatlist: { gap: listPopupGap },
    text: { fontWeight: FontWeight.B500, fontSize: FontSize.Small_L, flex: 1 },
    title: { textAlign: 'center', fontWeight: FontWeight.B600, fontSize: FontSize.Big },
})