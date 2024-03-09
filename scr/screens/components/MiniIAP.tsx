import { View, Text, StyleSheet, Image, TouchableOpacity, ImageBackground, ActivityIndicator } from 'react-native'
import React, { useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { ThemeContext } from '../../constants/Colors';
import { BorderRadius, FontSize, FontWeight, LocalText, Outline, Size, StorageKey_CachedIAP, StorageKey_LastMiniIapProductIdxShowed, StorageKey_MiniIAPCount } from '../../constants/AppConstants';
import { logoScr } from '../others/SplashScreen';
import { BuyPremiumAsync, allProducts, iapBg_1 } from '../IAP/IAPPage';
import { useMyIAP } from '../../hooks/useMyIAP';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { GetNumberIntAsync, IncreaseNumberAsync, SetNumberAsync } from '../../handle/AsyncStorageUtils';
import { useAppDispatch } from '../../redux/Store';
import { GetAppConfig } from '../../handle/AppConfigHandler';
import { SafeValue } from '../../handle/UtilsTS';
import { usePremium } from '../../hooks/usePremium';

const MiniIAP = ({
    postID,
}: {
    postID: number | string | undefined
}) => {
    const theme = useContext(ThemeContext);
    const [product, setProduct] = useState(allProducts[0])
    const [processing, setProcessing] = useState(false)
    const [showMiniIAP, setShowMiniIAP] = useState(false)
    const dispatch = useAppDispatch()
    const { isPremium } = usePremium()

    const { isReadyPurchase, localPrice } = useMyIAP(
        allProducts,
        async (s: string) => AsyncStorage.setItem(StorageKey_CachedIAP, s),
        async () => AsyncStorage.getItem(StorageKey_CachedIAP),
        product)

    const onPressed_Buy = useCallback(async () => {
        setProcessing(true)

        await BuyPremiumAsync(product.sku, dispatch)

        setProcessing(false)
    }, [product])

    const onPressed_Later = useCallback(() => {
        setShowMiniIAP(false)
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

    useEffect(() => {
        (async () => {
            if (isPremium)
                return

            if (!postID || !isReadyPurchase)
                return

            const count = await IncreaseNumberAsync(StorageKey_MiniIAPCount, 0)

            const triggerNum = SafeValue(GetAppConfig()?.count_trigger_mini_iap, 30)
            console.log('trigger ', triggerNum, count);

            if (count < triggerNum)
                return

            // show!

            let idxShowedBefore = await GetNumberIntAsync(StorageKey_LastMiniIapProductIdxShowed, -1)

            idxShowedBefore++

            if (idxShowedBefore >= allProducts.length)
                idxShowedBefore = 0
            
            SetNumberAsync(StorageKey_LastMiniIapProductIdxShowed, idxShowedBefore)
            SetNumberAsync(StorageKey_MiniIAPCount, 0)
            
            setProduct(allProducts[idxShowedBefore])
            setShowMiniIAP(true)
        })()
    }, [postID])

    if (!isReadyPurchase || !showMiniIAP) {
        return undefined
    }

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
                    <Text style={style.monthTxt}>{product.displayName}</Text>
                    <Text style={style.priceTxt}>{localPrice ?? '...'}{processing ? '  ' : ''}{processing ? <ActivityIndicator color={theme.counterBackground} size={'small'} /> : undefined}</Text>
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