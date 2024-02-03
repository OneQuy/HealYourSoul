import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import React, { useCallback, useContext, useEffect, useMemo } from 'react'
import { ThemeContext } from '../../constants/Colors'
import { BorderRadius, Category, FontSize, FontWeight, LocalText, Outline } from '../../constants/AppConstants'
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface IntroduceCatProps {
    category: Category,
}

const IntroduceCat = ({ category }: IntroduceCatProps) => {
    const theme = useContext(ThemeContext);

    const onPressOkay = useCallback(() => {
    }, [])

    const styleSheet = useMemo(() => {
        return StyleSheet.create({
            masterView: { justifyContent: 'center', alignItems:'center', backgroundColor: theme.background, paddingHorizontal: Outline.GapVertical, flex: 1, gap: Outline.GapVertical, },
            titleTxt: { textAlign: 'center', color: theme.counterBackground, fontSize: FontSize.Big, fontWeight: FontWeight.Bold },
            text: { textAlign: 'center', color: theme.counterBackground, fontSize: FontSize.Normal, },
            
            randomTO: { gap: Outline.GapHorizontal, borderRadius: BorderRadius.BR, padding: Outline.GapVertical_2, backgroundColor: theme.primary, flexDirection: 'row', justifyContent: 'center', alignItems: 'center'},
            btnText: { color: theme.counterPrimary, fontSize: FontSize.Normal },
        })
    }, [theme])

    useEffect(() => {

    }, [])

    return (
        <View style={styleSheet.masterView}>
            <Text selectable style={styleSheet.titleTxt}>{'Warm'}</Text>
            <Text selectable style={styleSheet.text}>{'Discover cinematic excellence with our Short Film feature, showcasing award-winning gems on YouTube. Dive into captivating narratives, explore global talent, and experience the art of storytelling in bite-sized brilliance. Elevate your film journey now! 🌟 #ShortFilms #AwardWinners'}</Text>

            {/* btn okay */}

            <View>
                <TouchableOpacity onPress={onPressOkay} style={styleSheet.randomTO}>
                    <Text style={styleSheet.btnText}>{LocalText.got_it}</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}

export default IntroduceCat