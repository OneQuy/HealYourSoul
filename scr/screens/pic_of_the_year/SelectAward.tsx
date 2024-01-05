// @ts-ignore
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native'
import React, { useCallback, useContext, useEffect, useMemo, useRef } from 'react'
import { ThemeContext } from '../../constants/Colors';
import { CommonStyles } from '../../constants/CommonConstants';
import { ColorNameToRgb } from '../../handle/UtilsTS';
import { BorderRadius, FontSize, FontWeight, Icon, LocalText, Outline, Size } from '../../constants/AppConstants';
import { dataOfYears } from './PicturesOfTheYearScreen';
import { AwardPicture } from '../../constants/Types';
import ImageBackgroundWithLoading from '../components/ImageBackgroundWithLoading';

const listPopupIconSize = Size.IconBig
const listPopupGap = Outline.GapVertical

const SelectAward = ({ year, selectIdx, setIdx }: { year: number, selectIdx: number, setIdx: (idx: number) => void }) => {
    const theme = useContext(ThemeContext);
    const flatlistRef = useRef()

    const curYearData = useMemo(() => {
        const f = dataOfYears.find(i => i.year === year)

        if (!f)
            throw '[ne]'

        return f
    }, [year, dataOfYears])

    const renderItem = useCallback(({ item, index }: { item: AwardPicture, index: number }) => {
        const isSelecting = index === selectIdx
        const showSeparator = index > 0 &&
            ((curYearData.list[index].category !== curYearData.list[index - 1].category) ||
                (curYearData.list[index].category === undefined && curYearData.list[index - 1].category === undefined))

        return <TouchableOpacity onPress={() => setIdx(index)} style={[{ backgroundColor: isSelecting ? theme.primary : undefined, borderRadius: isSelecting ? BorderRadius.BR8 : 0, borderWidth: isSelecting ? 1 : 0 }, styleSheet.itemTO]}>
            {
                !showSeparator ? undefined :
                    <View style={{ position: 'absolute', alignSelf: 'flex-start', top: -listPopupGap / 2, backgroundColor: 'gray', width: '100%', height: StyleSheet.hairlineWidth }} />
            }
            <ImageBackgroundWithLoading source={{ uri: item.imageUri }} resizeMode='cover' style={styleSheet.image} />
            <Text style={[styleSheet.text, { color: theme.text }]}>{item?.reward + (item?.category ? ' - ' + item?.category : '')}</Text>
        </TouchableOpacity>
    }, [selectIdx, theme])

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
                <View style={[{ flexDirection: 'row' }, CommonStyles.justifyContentCenter_AlignItemsCenter]}>
                    <MaterialCommunityIcons name={Icon.ThreeDots} color={theme.background} size={Size.Icon} />
                    <Text style={[{ color: theme.text, }, styleSheet.title]}>{year + ' ' + LocalText.winners}</Text>
                    <TouchableOpacity onPress={() => setIdx(selectIdx)}>
                        <MaterialCommunityIcons name={Icon.X} color={theme.text} size={Size.Icon} />
                    </TouchableOpacity>
                </View>
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
    bgView: { gap: Outline.GapVertical, padding: Outline.GapVertical, width: '80%', height: '70%', borderRadius: BorderRadius.BR },
    itemTO: { flexDirection: 'row', alignItems: 'center', gap: Outline.GapHorizontal },
    image: { width: listPopupIconSize, height: listPopupIconSize, borderRadius: BorderRadius.BR8, overflow: 'hidden' },
    flatlist: { gap: listPopupGap },
    text: { fontWeight: FontWeight.B500, fontSize: FontSize.Small_L, flex: 1 },
    title: { flex: 1, textAlign: 'center', fontWeight: FontWeight.B600, fontSize: FontSize.Big },
})