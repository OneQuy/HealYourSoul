// @ts-ignore

import { View, Text, StyleSheet, TouchableOpacity, ImageBackground, Alert } from 'react-native'
import React, { useCallback, useContext, useMemo } from 'react'
import BackgroundScroll from './BackgroundScroll'
import { BackgroundForTextType } from '../../constants/Types'
import { BorderRadius, Category, FontSize, LocalText, Outline } from '../../constants/AppConstants'
import { ThemeContext } from '../../constants/Colors'
import { GoToPremiumScreen } from './HeaderXButton'
import { useNavigation } from '@react-navigation/native'
import { iapBg_1 } from '../IAP/IAPPage'
import { useAppDispatch } from '../../redux/Store';
import { setBackgroundIdForText } from '../../redux/UserDataSlice';
import { usePremium } from '../../hooks/usePremium'

const BackgroundForTextSelector = ({
    currentBackgroundId,
    isBold,
    cat,
    listAllBg,
}: {
    currentBackgroundId: number,
    isBold: boolean,
    cat: Category,
    listAllBg: BackgroundForTextType[] | string | undefined,
}) => {
    const theme = useContext(ThemeContext);
    const navigation = useNavigation()
    const dispatch = useAppDispatch()
    const { isPremium } = usePremium()

    const onPressedUpgrade = useCallback(() => {
        GoToPremiumScreen(navigation)
    }, [navigation])

    const onPressedNoBackground = useCallback(() => {
        dispatch(setBackgroundIdForText([cat, -1, isBold]))
    }, [isBold])

    const onPressedBoldText = useCallback(() => {
        dispatch(setBackgroundIdForText([cat, currentBackgroundId, !isBold]))

        if (!isPremium && !isBold) {
            Alert.alert(
                LocalText.background_for_premium,
                LocalText.background_for_premium_content_bold,
                [
                    {
                        text: LocalText.later
                    },
                    {
                        text: LocalText.upgrade,
                        onPress: () => GoToPremiumScreen(navigation)
                    },
                ])
        }
    }, [currentBackgroundId, isPremium, isBold])

    const style = useMemo(() => {
        return StyleSheet.create({
            master: { gap: Outline.GapHorizontal, marginHorizontal: Outline.GapVertical },
            text: { color: theme.counterBackground, fontSize: FontSize.Small_L },
            plsSubBtnsView: { gap: Outline.GapHorizontal, flexDirection: 'row' },
            premiumIB: { padding: Outline.VerticalMini, borderRadius: BorderRadius.BR, overflow: 'hidden', justifyContent: 'center', alignItems: 'center', },
            btnTO: { padding: Outline.VerticalMini, borderColor: theme.counterBackground, borderRadius: BorderRadius.BR, borderWidth: StyleSheet.hairlineWidth, justifyContent: 'center', alignItems: 'center', },
            btnTOBold: { padding: Outline.VerticalMini, backgroundColor: isBold ? theme.primary : undefined, borderColor: theme.counterBackground, borderRadius: BorderRadius.BR, borderWidth: StyleSheet.hairlineWidth, justifyContent: 'center', alignItems: 'center', },
            textTxt: { textAlign: 'center', fontSize: FontSize.Small_L, color: theme.counterBackground, },
            premiumText: { fontSize: FontSize.Small_L, color: 'black' },
            btnTxt: { fontSize: FontSize.Small_L, color: theme.counterBackground },
            btnTxtBold: { fontSize: FontSize.Small_L, color: isBold ? theme.counterPrimary : theme.counterBackground },
        })
    }, [theme, isBold])

    if (!Array.isArray(listAllBg))
        return undefined

    return (
        <View style={style.master}>
            {/* light bgs */}

            <Text style={style.text}>{LocalText.bg_for_black_text}:</Text>
            <BackgroundScroll
                isBold={isBold}
                cat={cat}
                listAllBg={listAllBg}
                currentBackgroundId={currentBackgroundId}
                isLightBackground={1}
            />

            {/* dark bgs */}

            <Text style={style.text}>{LocalText.bg_for_white_text}:</Text>

            <BackgroundScroll
                isBold={isBold}
                cat={cat}
                listAllBg={listAllBg}
                currentBackgroundId={currentBackgroundId}
                isLightBackground={0}
            />

            <View style={style.plsSubBtnsView}>
                <TouchableOpacity onPress={onPressedNoBackground}>
                    <View style={style.btnTO}>
                        <Text numberOfLines={1} adjustsFontSizeToFit style={style.btnTxt}>{LocalText.remove_background}</Text>
                    </View>
                </TouchableOpacity>

                <TouchableOpacity onPress={onPressedBoldText}>
                    <View style={!isBold ? style.btnTO : style.btnTOBold}>
                        <Text numberOfLines={1} adjustsFontSizeToFit style={isBold ? style.btnTxtBold : style.btnTxt}>{LocalText.bold}</Text>
                    </View>
                </TouchableOpacity>

                {
                    !isPremium &&
                    < TouchableOpacity onPress={onPressedUpgrade}>
                        <ImageBackground resizeMode="cover" source={iapBg_1} style={style.premiumIB}>
                            <Text numberOfLines={1} adjustsFontSizeToFit style={style.premiumText}>{LocalText.upgrade}</Text>
                        </ImageBackground>
                    </TouchableOpacity>
                }
            </View>
        </View >
    )
}

export default BackgroundForTextSelector