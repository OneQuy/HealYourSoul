import { StyleSheet, Text } from 'react-native'
import React, { useContext, useMemo } from 'react'
import ImageBackgroundWithLoading from './ImageBackgroundWithLoading'
import { ThemeContext } from '../../constants/Colors'
import { FontSize, Outline } from '../../constants/AppConstants'
import { HexToRgb } from '../../handle/UtilsTS'

const DiversityItem_ImageAndText = ({
    imgUri,
    text,
}: {
    imgUri?: string,
    text?: string,
}) => {
    const theme = useContext(ThemeContext)

    const style = useMemo(() => {
        return StyleSheet.create({
            percent100: { width: '100%', height: '100%' },
            text: {
                padding: Outline.GapHorizontal,
                fontSize: FontSize.Small_L,
                backgroundColor: HexToRgb(theme.background, 0.8),
                color: theme.counterBackground,
            },
        })
    }, [theme])

    return (
        <ImageBackgroundWithLoading source={{ uri: imgUri }} style={style.percent100} >
            <Text numberOfLines={2} adjustsFontSizeToFit style={style.text}>{text}</Text>
        </ImageBackgroundWithLoading>
    )
}

export default DiversityItem_ImageAndText