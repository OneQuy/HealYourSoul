// @ts-ignore

import { View, StyleSheet, Text } from 'react-native'
import React, { useCallback, useContext, useMemo, useState } from 'react'
import { FontSize, FontWeight, LocalText, Outline } from '../../constants/AppConstants'
import { ThemeContext } from '../../constants/Colors'
import { ScrollView } from 'react-native-gesture-handler';
import HairLine from '../components/HairLine';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { DoubleCheckGetAppConfigAsync } from '../../handle/AppConfigHandler';

const HairMarginVertical = 10

const UploadRulesView = () => {
    const theme = useContext(ThemeContext);
    const insets = useSafeAreaInsets()
    const [limitPerDay, setLimitPerDay] = useState(5)
    const [interval, setInterval] = useState(10)

    // const { isPremium } = usePremium()

    const style = useMemo(() => {
        return StyleSheet.create({
            masterView: { marginBottom: insets.bottom + Outline.GapHorizontal, marginHorizontal: Outline.GapVertical_2, flex: 1, gap: Outline.GapHorizontal, },
            titleTxt: { marginBottom: Outline.GapHorizontal, fontSize: FontSize.Small_L, fontWeight: FontWeight.B600, color: theme.counterBackground },
            contentTxt: { fontSize: FontSize.Small_L, color: theme.counterBackground },
        })
    }, [theme, insets])

    // can not upload now

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
        </View>
    )
}

export default UploadRulesView