import { View, Text, StyleSheet } from 'react-native'
import React, { useContext, useMemo } from 'react'
import { DiversityItemType } from '../../constants/Types'
import { ThemeContext } from '../../constants/Colors'
import ImageBackgroundWithLoading from './ImageBackgroundWithLoading'

type DiversityItemProps = {
    data: DiversityItemType,
    onPressed: (item: DiversityItemType) => void,
}

const DiversityItem = ({
    data,
    onPressed,
}: DiversityItemProps) => {
    const theme = useContext(ThemeContext);

    const imgSrc = useMemo(() => {
        const id = data.id

        if (id !== undefined) { // the page item
            
        }
    }, [data])

    const style = useMemo(() => {
        return StyleSheet.create({
            masterView: { flex: 1, aspectRatio: 1, backgroundColor: 'red' },
            // noItemTxt: { fontSize: FontSize.Normal, color: theme.counterBackground, },
        })
    }, [theme])

    return (
        <ImageBackgroundWithLoading source={{ uri: ''}} style={style.masterView} >
            <Text>DiversityItem</Text>
        </ImageBackgroundWithLoading>
    )
}

export default DiversityItem