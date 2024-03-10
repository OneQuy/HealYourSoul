// @ts-ignore
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import { View, Text, StyleSheet, TouchableOpacity, ImageBackground } from 'react-native'
import React, { useCallback, useContext, useMemo, useState } from 'react'
import BackgroundScroll from './BackgroundScroll'
import { BackgroundForTextType } from '../../constants/Types'
import { BorderRadius, Category, FontSize, Icon, LocalText, Outline, Size } from '../../constants/AppConstants'
import { ThemeContext } from '../../constants/Colors'
import { GoToPremiumScreen } from './HeaderXButton'
import { useNavigation } from '@react-navigation/native'
import { iapBg_1 } from '../IAP/IAPPage'
import { useAppDispatch } from '../../redux/Store';
import { setBackgroundIdForText } from '../../redux/UserDataSlice';

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
    const navigation = useNavigation()
    const dispatch = useAppDispatch()

    const onPressedUpgrade = useCallback(() => {
        GoToPremiumScreen(navigation)
    }, [navigation])

    const onPressedNoBackground = useCallback(() => {
        dispatch(setBackgroundIdForText([cat, -1]))
    }, [])

    const style = useMemo(() => {
        return StyleSheet.create({
            master: { gap: Outline.GapHorizontal, },
            text: { color: theme.counterBackground, fontSize: FontSize.Small_L },
            plsSubBtnsView: { gap: Outline.GapHorizontal, flexDirection: 'row' },
            premiumIB: { padding: Outline.VerticalMini, borderRadius: BorderRadius.BR, overflow: 'hidden', justifyContent: 'center', alignItems: 'center', },
            btnTO: { padding: Outline.VerticalMini, borderColor: theme.counterBackground, borderRadius: BorderRadius.BR, borderWidth: StyleSheet.hairlineWidth, justifyContent: 'center', alignItems: 'center', },
            textTxt: { textAlign: 'center', fontSize: FontSize.Small_L, color: theme.counterBackground, },
            premiumText: { fontSize: FontSize.Small_L, color: 'black' },
            gotItText: { fontSize: FontSize.Small_L, color: theme.counterBackground },
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

            <View style={style.plsSubBtnsView}>
                <TouchableOpacity onPress={onPressedNoBackground}>
                    <View style={style.btnTO}>
                        <Text numberOfLines={1} adjustsFontSizeToFit style={style.gotItText}>{LocalText.remove_background}</Text>
                    </View>
                </TouchableOpacity>

                {
                    <TouchableOpacity onPress={onPressedUpgrade}>
                        <ImageBackground resizeMode="cover" source={iapBg_1} style={style.premiumIB}>
                            <Text numberOfLines={1} adjustsFontSizeToFit style={style.premiumText}>{LocalText.upgrade}</Text>
                        </ImageBackground>
                    </TouchableOpacity>
                }
            </View>
        </View>
    )
}

export default BackgroundForTextSelector