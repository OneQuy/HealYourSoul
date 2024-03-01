import { View, StyleSheet, Text, TouchableOpacity, ImageBackground } from 'react-native'
import React, { useCallback, useContext, useMemo, useState } from 'react'
import { BorderRadius, FontSize, FontWeight, LocalText, Outline } from '../../constants/AppConstants'
import { ThemeContext } from '../../constants/Colors'
import { ScrollView } from 'react-native-gesture-handler';
import HairLine from '../components/HairLine';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { DoubleCheckGetAppConfigAsync } from '../../handle/AppConfigHandler';
import { usePremium } from '../../hooks/usePremium';
import { GoToPremiumScreen } from '../components/HeaderXButton';
import { iapBg_1 } from '../IAP/IAPPage';
import { widthPercentageToDP } from 'react-native-responsive-screen';

const HairMarginVertical = 10

const UploadRulesView = () => {
    const theme = useContext(ThemeContext);
    const insets = useSafeAreaInsets()
    const [limitPerDay, setLimitPerDay] = useState(5)
    const [interval, setInterval] = useState(10)
    const { isPremium } = usePremium()
    const navigation = useNavigation()

    const style = useMemo(() => {
        return StyleSheet.create({
            masterView: { marginBottom: insets.bottom + Outline.GapHorizontal, marginHorizontal: Outline.GapVertical_2, flex: 1, gap: Outline.GapHorizontal, },
            titleTxt: { marginBottom: Outline.GapHorizontal, fontSize: FontSize.Small_L, fontWeight: FontWeight.B600, color: theme.counterBackground },
            contentTxt: { fontSize: FontSize.Small_L, color: theme.counterBackground },

            plsSubBtnsView: { marginVertical: Outline.GapVertical, justifyContent: 'center', alignItems: 'center', gap: Outline.GapHorizontal, flexDirection: 'row' },
            premiumIB: { padding: Outline.GapVertical, minWidth: widthPercentageToDP(30), borderRadius: BorderRadius.BR, overflow: 'hidden', justifyContent: 'center', alignItems: 'center', },
            agreeBtn: { padding: Outline.GapVertical, minWidth: widthPercentageToDP(30), borderColor: theme.counterBackground, borderRadius: BorderRadius.BR, borderWidth: StyleSheet.hairlineWidth, justifyContent: 'center', alignItems: 'center', },
            premiumText: { fontSize: FontSize.Small_L, color: 'black' },
            agreeTxt: { fontSize: FontSize.Small_L, color: theme.counterBackground },
        })
    }, [theme, insets])

    // can not upload now

    const onPressAgree = useCallback(async () => {

    }, [])

    const fetchAppConfig = useCallback(async () => {
        const config = await DoubleCheckGetAppConfigAsync()

        if (!config)
            return

        setInterval(config.userUploadLimit.intervalInMinute)
        setLimitPerDay(config.userUploadLimit.freeUserUploadsPerDay)
    }, [])

    useFocusEffect(() => { fetchAppConfig() })

    return (
        <View style={style.masterView}>
            <ScrollView>
                <Text adjustsFontSizeToFit numberOfLines={1} style={style.titleTxt}>{LocalText.Upload_Guidelines}</Text>
                <Text style={style.contentTxt}>{LocalText.guidelines_desc}</Text>
                <HairLine marginVertical={HairMarginVertical} />

                <Text adjustsFontSizeToFit numberOfLines={1} style={style.titleTxt}>{LocalText.Image_Content}</Text>
                <Text style={style.contentTxt}>{LocalText.Image_Content_desc}</Text>
                <HairLine marginVertical={HairMarginVertical} />

                <Text adjustsFontSizeToFit numberOfLines={1} style={style.titleTxt}>{LocalText.Forbidden_Content}</Text>
                <Text style={style.contentTxt}>{LocalText.Forbidden_Content_desc}</Text>
                <Text style={style.contentTxt}>{LocalText.content_no}</Text>
                <HairLine marginVertical={HairMarginVertical} />

                <Text adjustsFontSizeToFit numberOfLines={1} style={style.titleTxt}>{LocalText.Failure_to_comply}</Text>
                <Text style={style.contentTxt}>{LocalText.Failure_to_comply_desc}</Text>
                <HairLine marginVertical={HairMarginVertical} />

                <Text adjustsFontSizeToFit numberOfLines={1} style={style.titleTxt}>{LocalText.Other_Restrictions}</Text>
                <Text style={style.contentTxt}>{LocalText.Other_Restrictions_desc.replaceAll('@@', limitPerDay.toString()).replaceAll('##', interval.toString())}</Text>
                <HairLine marginVertical={HairMarginVertical} />

                <Text style={style.contentTxt}>{LocalText.By_following_these}</Text>
            </ScrollView>

            <View style={style.plsSubBtnsView}>
                <TouchableOpacity onPress={onPressAgree}>
                    <View style={style.agreeBtn}>
                        <Text numberOfLines={1} adjustsFontSizeToFit style={style.agreeTxt}>{LocalText.agree}</Text>
                    </View>
                </TouchableOpacity>

                {
                    !isPremium &&
                    <TouchableOpacity onPress={() => GoToPremiumScreen(navigation)}>
                        <ImageBackground resizeMode="cover" source={iapBg_1} style={style.premiumIB}>
                            <Text numberOfLines={1} adjustsFontSizeToFit style={style.premiumText}>{LocalText.upgrade}</Text>
                        </ImageBackground>
                    </TouchableOpacity>
                }
            </View>
        </View>
    )
}

export default UploadRulesView