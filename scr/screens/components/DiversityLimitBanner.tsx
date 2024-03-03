import { View, Text, StyleSheet, TouchableOpacity, ImageBackground } from 'react-native'
import React, { useCallback, useContext, useMemo } from 'react'
import { ThemeContext } from '../../constants/Colors';
import { iapBg_1 } from '../IAP/IAPPage';
import { BorderRadius, FontSize, LocalText, Outline } from '../../constants/AppConstants';
import { widthPercentageToDP } from 'react-native-responsive-screen';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { GoToPremiumScreen } from './HeaderXButton';
import { useNavigation } from '@react-navigation/native';

const DiversityLimitBanner = ({
    text,
    onPressedClose,
}: {
    text: string,
    onPressedClose?: () => void,
}) => {
    const theme = useContext(ThemeContext);
    const insets = useSafeAreaInsets()
    const navigation = useNavigation()

    const onPressedUpgrade = useCallback(() => {
        GoToPremiumScreen(navigation)
    }, [navigation])

    const style = useMemo(() => {
        return StyleSheet.create({
            plsSubView: { gap: Outline.GapHorizontal, margin: Outline.GapVertical, marginBottom: insets.bottom + Outline.GapHorizontal, padding: Outline.GapVertical, borderRadius: BorderRadius.BR, borderWidth: StyleSheet.hairlineWidth, borderColor: theme.counterBackground, justifyContent: 'center', alignItems: 'center' },
            plsSubBtnsView: { gap: Outline.GapHorizontal, flexDirection: 'row' },
            premiumIB: { padding: Outline.GapVertical, minWidth: widthPercentageToDP(30), borderRadius: BorderRadius.BR, overflow: 'hidden', justifyContent: 'center', alignItems: 'center', },
            gotItBtn: { padding: Outline.GapVertical, minWidth: widthPercentageToDP(30), borderColor: theme.counterBackground, borderRadius: BorderRadius.BR, borderWidth: StyleSheet.hairlineWidth, justifyContent: 'center', alignItems: 'center', },
            textTxt: { textAlign: 'center', fontSize: FontSize.Small_L, color: theme.counterBackground, },
            premiumText: { fontSize: FontSize.Small_L, color: 'black' },
            gotItText: { fontSize: FontSize.Small_L, color: theme.counterBackground },
        })
    }, [theme, insets])

    return (
        <View style={style.plsSubView}>
            <Text style={style.textTxt}>{text}</Text>

            <View style={style.plsSubBtnsView}>
                {
                    onPressedClose &&
                    <TouchableOpacity onPress={onPressedClose}>
                        <View style={style.gotItBtn}>
                            <Text numberOfLines={1} adjustsFontSizeToFit style={style.gotItText}>{LocalText.got_it}</Text>
                        </View>
                    </TouchableOpacity>
                }

                <TouchableOpacity onPress={onPressedUpgrade}>
                    <ImageBackground resizeMode="cover" source={iapBg_1} style={style.premiumIB}>
                        <Text numberOfLines={1} adjustsFontSizeToFit style={style.premiumText}>{LocalText.upgrade}</Text>
                    </ImageBackground>
                </TouchableOpacity>
            </View>
        </View>
    )
}

export default DiversityLimitBanner