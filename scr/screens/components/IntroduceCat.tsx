import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import React, { useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { ThemeContext } from '../../constants/Colors'
import { BorderRadius, Category, FontSize, FontWeight, LocalText, Outline, StorageKey_ShowedIntroduceCat } from '../../constants/AppConstants'
import { GetBooleanAsync, SetBooleanAsync } from '../../handle/AsyncStorageUtils'
import { useNavigation } from '@react-navigation/native'
import { widthPercentageToDP } from 'react-native-responsive-screen'
import { track_SimpleWithCat } from '../../handle/tracking/GoodayTracking'

const useIntroduceCat = (category: Category) => {
    const theme = useContext(ThemeContext);
    const [isShow, setIsShow] = useState(true)
    const [content, setContent] = useState('')
    const navigation = useNavigation()

    const onPressOkay = useCallback(() => {
        setIsShow(false)
        SetBooleanAsync(StorageKey_ShowedIntroduceCat(category), true)
        track_SimpleWithCat(category, 'got_it_intro', false)
    }, [])

    const styleSheet = useMemo(() => {
        return StyleSheet.create({
            masterView: { justifyContent: 'center', alignItems: 'center', backgroundColor: theme.background, paddingHorizontal: Outline.GapVertical, flex: 1, gap: Outline.GapVertical, },
            titleTxt: { textAlign: 'center', color: theme.counterBackground, fontSize: FontSize.Big, fontWeight: FontWeight.Bold },
            text: { textAlign: 'center', color: theme.counterBackground, fontSize: FontSize.Normal, },

            randomTO: { minWidth: widthPercentageToDP(30), marginTop: Outline.Horizontal, gap: Outline.GapHorizontal, borderRadius: BorderRadius.BR, padding: Outline.Horizontal, backgroundColor: theme.primary, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' },
            btnText: { color: theme.counterPrimary, fontSize: FontSize.Normal },
        })
    }, [theme])

    const render = useCallback(() => {
        if (!content) {
            return <View style={styleSheet.masterView} />
        }

        const index = navigation.getState().index
        const screen = navigation.getState().routes[index].name

        return (
            <View style={styleSheet.masterView}>

                {/* header */}

                <Text selectable style={styleSheet.text}>{LocalText.introduce_text}</Text>

                {/* title */}

                <Text selectable style={styleSheet.titleTxt}>{screen}</Text>

                {/* content */}

                <Text selectable style={styleSheet.text}>{content}</Text>

                {/* btn okay */}

                <View>
                    <TouchableOpacity onPress={onPressOkay} style={styleSheet.randomTO}>
                        <Text style={styleSheet.btnText}>{LocalText.got_it}</Text>
                    </TouchableOpacity>
                </View>
            </View>
        )
    }, [content, styleSheet, onPressOkay, navigation?.getState().index])

    useEffect(() => {
        (async () => {
            const catS = 'introduce_' + Category[category]

            const content = LocalText[catS as keyof typeof LocalText]

            if (!content) { // no content to show
                setIsShow(false)
                return
            }

            const showed = await GetBooleanAsync(StorageKey_ShowedIntroduceCat(category))

            if (showed) { // already showed
                setIsShow(false)
                return
            }

            setContent(content)
        })()
    }, [])

    return [isShow, render] as const
}

export default useIntroduceCat