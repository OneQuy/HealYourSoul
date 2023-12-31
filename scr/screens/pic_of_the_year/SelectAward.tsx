import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image } from 'react-native'
import React, { useContext, useMemo } from 'react'
import { ThemeContext } from '../../constants/Colors';
import { CommonStyles } from '../../constants/CommonConstants';
import { ColorNameToRgb } from '../../handle/UtilsTS';
import { BorderRadius, Icon, Outline, Size } from '../../constants/AppConstants';
import { dataOfYears } from './PicturesOfTheYearScreen';

const SelectAward = ({ year, selectIdx }: { year: number, selectIdx: number }) => {
    const theme = useContext(ThemeContext);

    const curYearData = useMemo(() => {
        const f = dataOfYears.find(i => i.year === year)

        if (!f)
            throw '[ne]'

        return f
    }, [year, dataOfYears])

    return (
        <View style={[styleSheet.masterView, CommonStyles.justifyContentCenter_AlignItemsCenter]}>
            <View style={[{ backgroundColor: theme.background, }, styleSheet.bgView]}>
                <Text>{year}</Text>
                <FlatList
                    data={curYearData.list}
                    keyExtractor={(item) => item.title + item.author}
                    contentContainerStyle={styleSheet.flatlist}
                    renderItem={({ item, index }) => {
                        return <TouchableOpacity style={styleSheet.itemTO}>
                            <Image source={{ uri: item.imageUri }} style={styleSheet.image} />
                            <Text>{item?.reward + (item?.category ? ' - ' + item?.category : '')}</Text>
                        </TouchableOpacity>
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
    itemTO: { flexDirection: 'row' },
    image: { width: Size.IconBig, height: Size.IconBig },
    flatlist: { gap: Outline.GapVertical },
})