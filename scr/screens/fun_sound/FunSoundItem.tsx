import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native'
import React, { useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { FunSound } from '../../constants/Types'
import { ThemeContext } from '../../constants/Colors'
import { BorderRadius, Outline, Size } from '../../constants/AppConstants'
import { heightPercentageToDP } from 'react-native-responsive-screen'

// @ts-ignore
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

// @ts-ignore
import SoundPlayer from 'react-native-sound-player'
import { AlertNoInternet } from '../../handle/AppUtils'

type FunSoundItemProps = {
    data: FunSound,
    index?: number,
}

const FunSoundItem = ({ data, index }: FunSoundItemProps) => {
    const theme = useContext(ThemeContext);
    const [isHandling, setIsHandling] = useState(false);

    const onPressed = useCallback(async () => {
        setIsHandling(true)

        try {
            SoundPlayer.playUrl(data.mp3)
        }
        catch (e) {
            AlertNoInternet()
        }
    }, [data])

    const style = useMemo(() => {
        return StyleSheet.create({
            masterView: {
                borderRadius: BorderRadius.BR8, flex: 1,
                height: heightPercentageToDP(7),
                backgroundColor: theme.primary,
                margin: Outline.GapHorizontal / 2
            },
            mainView: { flex: 1, paddingHorizontal: Outline.GapHorizontal, justifyContent: 'center', },
            btnBarView: { flexDirection: 'row', flex: 1, },
            btnPinTO: { flex: 1, justifyContent: 'center', alignItems: 'center' },
            btnLikeTO: { flexDirection: 'row', flex: 1, gap: Outline.GapHorizontal, justifyContent: 'center', alignItems: 'center' },
            nameTxt: { color: theme.counterPrimary, textAlign: 'center', verticalAlign: 'middle' },
            likeTxt: { color: theme.counterPrimary },
        })
    }, [theme])

    useEffect(() => {
        const _onFinishedPlayingSubscription = SoundPlayer.addEventListener('FinishedPlaying', ({ success }) => {
            // console.log('finished playing', success)
        })

        // const _onFinishedLoadingSubscription = SoundPlayer.addEventListener('FinishedLoading', ({ success }) => {
        //     console.log('finished loading', success)
        //     setIsHandling(false)
        // })

        const _onFinishedLoadingURLSubscription = SoundPlayer.addEventListener('FinishedLoadingURL', ({ success, url }) => {
            // console.log('finished loading url', success, url)
            setIsHandling(false)
        })

        return () => {
            _onFinishedPlayingSubscription.remove()
            // _onFinishedLoadingSubscription.remove()
            _onFinishedLoadingURLSubscription.remove()
        }
    }, [])

    return (
        <TouchableOpacity onPress={onPressed} style={style.masterView}>
            <View style={style.mainView}>
                {
                    isHandling ?
                        <ActivityIndicator size={Size.Icon} color={theme.counterPrimary} /> :
                        <Text numberOfLines={3} adjustsFontSizeToFit style={style.nameTxt}>{data.name}</Text>
                }
            </View>
            <View style={style.btnBarView}>
                <TouchableOpacity style={style.btnPinTO}>
                    <MaterialCommunityIcons name={'pin'} color={theme.counterBackground} size={Size.IconTiny} />
                </TouchableOpacity>
                <TouchableOpacity style={style.btnLikeTO}>
                    <MaterialCommunityIcons name={!true ? "cards-heart-outline" : 'cards-heart'} color={theme.counterPrimary} size={Size.IconTiny} />
                    <Text numberOfLines={1} adjustsFontSizeToFit style={style.likeTxt}>{7}</Text>
                </TouchableOpacity>
            </View>
        </TouchableOpacity>
    )
}

export default FunSoundItem