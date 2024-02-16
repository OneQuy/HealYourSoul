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
import { useAppDispatch } from '../../redux/Store'
import { togglePinFunSound } from '../../redux/UserDataSlice'

type FunSoundItemProps = {
    data: FunSound,
    pinnedSounds: string[],
    onPressedLike: (item: FunSound) => void,
    isFavorited: (item: FunSound) => boolean,
    index?: number,
}

const FunSoundItem = ({
    data,
    pinnedSounds,
    onPressedLike,
    isFavorited,
    index }: FunSoundItemProps) => {
    const theme = useContext(ThemeContext);
    const [isHandling, setIsHandling] = useState(false);
    const isPinned = pinnedSounds && pinnedSounds.includes(data.name)
    const dispatch = useAppDispatch()

    const onPressedFavorite = useCallback(() => {
        onPressedLike(data)
    }, [data, onPressedLike])

    const onPressedPin = useCallback(async () => {
        dispatch(togglePinFunSound(data.name))
    }, [data])

    const onPressedPlay = useCallback(async () => {
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
                margin: Outline.GapHorizontal / 2,
                maxWidth: '20%',
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
            setIsHandling(false)
        })

        const _onFinishedLoadingSubscription = SoundPlayer.addEventListener('FinishedLoading', ({ success }) => {
            // console.log('finished loading', success)
            setIsHandling(false)
        })

        const _onFinishedLoadingURLSubscription = SoundPlayer.addEventListener('FinishedLoadingURL', ({ success, url }) => {
            // console.log('finished loading url', success, url)
            setIsHandling(false)
        })

        return () => {
            _onFinishedPlayingSubscription.remove()
            _onFinishedLoadingSubscription.remove()
            _onFinishedLoadingURLSubscription.remove()
        }
    }, [])

    return (
        <TouchableOpacity onPress={onPressedPlay} style={style.masterView}>
            <View style={style.mainView}>
                {
                    isHandling ?
                        <ActivityIndicator size={Size.Icon} color={theme.counterPrimary} /> :
                        <Text numberOfLines={3} adjustsFontSizeToFit style={style.nameTxt}>{data.name}</Text>
                }
            </View>
            <View style={style.btnBarView}>
                {/* pin btn */}
                <TouchableOpacity onPress={onPressedPin} style={style.btnPinTO}>
                    <MaterialCommunityIcons name={'pin'} color={isPinned ? theme.counterPrimary : theme.counterBackground} size={Size.IconTiny} />
                </TouchableOpacity>

                {/* like btn */}
                <TouchableOpacity onPress={onPressedFavorite} style={style.btnLikeTO}>
                    <MaterialCommunityIcons name={!isFavorited(data) ? "cards-heart-outline" : 'cards-heart'} color={theme.counterPrimary} size={Size.IconTiny} />
                    <Text numberOfLines={1} adjustsFontSizeToFit style={style.likeTxt}>{7}</Text>
                </TouchableOpacity>
            </View>
        </TouchableOpacity>
    )
}

export default FunSoundItem