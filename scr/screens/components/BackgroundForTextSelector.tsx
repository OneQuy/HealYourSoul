import { View, Text, StyleSheet } from 'react-native'
import React, { useContext, useMemo } from 'react'
import BackgroundScroll from './BackgroundScroll'
import { BackgroundForTextType } from '../../constants/Types'
import { Category, FontSize, LocalText, Outline } from '../../constants/AppConstants'
import { ThemeContext } from '../../constants/Colors'

const BackgroundForTextSelector = ({
    currentBackgroundId,
    cat,
    listAllBg,
}: {
    currentBackgroundId: number,
    cat: Category,
    listAllBg: BackgroundForTextType[] | string | undefined,
}) => {
    const theme = useContext(ThemeContext);

    const style = useMemo(() => {
        return StyleSheet.create({
            master: { gap: Outline.GapHorizontal, },
            text: { color: theme.counterBackground, fontSize: FontSize.Small_L }
        })
    }, [theme])

    if (!Array.isArray(listAllBg))
        return undefined

    return (
        <View style={style.master}>
            {/* light bgs */}

            <Text style={style.text}>{LocalText.bg_for_black_text}:</Text>
            <BackgroundScroll
                cat={cat}
                listAllBg={listAllBg}
                currentBackgroundId={currentBackgroundId}
                isLightBackground={1}
            />

            {/* dark bgs */}

            <Text style={style.text}>{LocalText.bg_for_white_text}:</Text>
            <BackgroundScroll
                cat={cat}
                listAllBg={listAllBg}
                currentBackgroundId={currentBackgroundId}
                isLightBackground={0}
            />
        </View>
    )
}

export default BackgroundForTextSelector