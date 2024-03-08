import { View, Text, StyleSheet, Image, TouchableOpacity, ImageBackground, ActivityIndicator } from 'react-native'
import React, { useCallback, useContext, useMemo } from 'react'
import { ThemeContext } from '../../constants/Colors';
import { BorderRadius, FontSize, FontWeight, LocalText, Outline, Size } from '../../constants/AppConstants';
import { logoScr } from '../others/SplashScreen';
import { iapBg_1 } from '../IAP/IAPPage';

const MiniIAP = () => {
    const theme = useContext(ThemeContext);
    const price = '333'
    const month = 12
    const processing = false

    const onPressed_Buy = useCallback(() => {

    }, [])

    const onPressed_Later = useCallback(() => {

    }, [])

    const style = useMemo(() => {
        return StyleSheet.create({
            master: { gap: Outline.GapVertical, padding: Outline.GapVertical, justifyContent: 'center', alignItems: 'center', backgroundColor: theme.background, width: '100%', height: '100%', position: 'absolute' },
            title: { color: theme.primary, fontSize: FontSize.Normal, fontWeight: FontWeight.Bold },
            logoImg: { height: Size.IconBig, aspectRatio: 1, },
            iapTO: { borderRadius: BorderRadius.BR, overflow: 'hidden' },
            laterTO: { borderColor: theme.counterBackground, borderWidth: StyleSheet.hairlineWidth, borderRadius: BorderRadius.BR, minWidth: '60%', alignItems: 'center', padding: Outline.GapVertical_2, justifyContent: 'center', },
            iapIB: { minWidth: '60%', alignItems: 'center', padding: Outline.GapVertical, justifyContent: 'center', },
            monthTxt: { color: 'black', fontSize: FontSize.Normal, fontWeight: FontWeight.Bold },
            priceTxt: { color: 'black', fontSize: FontSize.Small_L },
            benefitsTxt: { color: theme.counterBackground, fontSize: FontSize.Small_L },
        })
    }, [theme])

    return (
        <View style={style.master} >
            <Image source={logoScr} resizeMode='contain' style={[style.logoImg]} />
            <Text style={style.title}>Gooday Premium</Text>
            <Text style={style.benefitsTxt}>{LocalText.unlock_all_info + '\n' + LocalText.support_me_info}</Text>

            {/* iap btn */}

            <TouchableOpacity onPress={onPressed_Buy} style={style.iapTO}>
                <ImageBackground
                    resizeMode='cover'
                    source={iapBg_1}
                    style={style.iapIB}>
                    <Text style={style.monthTxt}>{month} month{month > 1 ? 's' : ''}</Text>
                    <Text style={style.priceTxt}>{price}{processing ? '  ' : ''}{processing ? <ActivityIndicator color={theme.counterBackground} size={'small'} /> : undefined}</Text>
                </ImageBackground>
            </TouchableOpacity>

            {/* later btn */}

            <TouchableOpacity onPress={onPressed_Later} style={style.laterTO}>
                <Text style={style.benefitsTxt}>{LocalText.later}</Text>
            </TouchableOpacity>
        </View>
    )
}

export default MiniIAP