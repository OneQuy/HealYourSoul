// @ts-ignore
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import { View, Text, TouchableOpacity, ActivityIndicator, StyleSheet, Alert, GestureResponderEvent, Animated, NativeSyntheticEvent, ImageLoadEventData } from 'react-native'
import React, { useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'
import { ThemeContext } from '../../constants/Colors'
import { BorderRadius, Category, FontSize, FontWeight, Icon, LocalText, NeedReloadReason, Outline, Size, StorageKey_LocalFileVersion, StorageKey_SelectingShortFilmIdx } from '../../constants/AppConstants'
import Share from 'react-native-share';
import { NetLord } from '../../handle/NetLord'
import { useFocusEffect, useNavigation } from '@react-navigation/native'
import { SaveCurrentScreenForLoadNextTime, ToastNewItemsAsync } from '../../handle/AppUtils'
import { CommonStyles } from '../../constants/CommonConstants'
import { ShortFilm } from '../../constants/Types';
import { heightPercentageToDP, widthPercentageToDP } from 'react-native-responsive-screen';
import { ScrollView } from 'react-native-gesture-handler';
import { ToCanPrint, IsChar, IsNumChar, OpenYoutubeAsync, SafeValue } from '../../handle/UtilsTS';
import ImageBackgroundWithLoading from '../components/ImageBackgroundWithLoading';
import useCheckAndDownloadRemoteFile from '../../hooks/useCheckAndDownloadRemoteFile';
import { RandomInt, TempDirName } from '../../handle/Utils';
import { GetRemoteFileConfigVersion } from '../../handle/AppConfigHandler';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ListMovie from './SelectShortFilms';
import { DownloadFileAsync, GetFLPFromRLP } from '../../handle/FileUtils';
import WebView from 'react-native-webview';
import { track_PressNextPost, track_PressRandom, track_SimpleWithCat } from '../../handle/tracking/GoodayTracking';
import { SwipeResult, useSimpleGesture } from '../../hooks/useSimpleGesture';
import { playAnimLoadedMedia } from '../../handle/GoodayAnimation';
import BottomBar, { BottomBarItem } from '../others/BottomBar';
import HeaderRightButtons from '../components/HeaderRightButtons';
import useIntroduceCat from '../components/IntroduceCat';
import ViewCount from '../components/ViewCount';
import MiniIAP from '../components/MiniIAP';
import { useHeightOfImageWhenWidthFull } from '../../hooks/useHeightOfImageWhenWidthFull';

const category = Category.BestShortFilms
const fileURL = 'https://firebasestorage.googleapis.com/v0/b/warm-379a6.appspot.com/o/file_configs%2Fshort_films.json?alt=media&token=537eec8b-f774-4908-a5fa-45f8daf676d8'

const BestShortFilmsScreen = () => {
    const navigation = useNavigation();
    const reasonToReload = useRef<NeedReloadReason>(NeedReloadReason.None);
    const theme = useContext(ThemeContext);
    const [handling, setHandling] = useState(true)
    const [selectingItem, setSelectingItem] = useState<ShortFilm | undefined>(undefined)
    const [isShowList, setIsShowList] = useState(false)
    const [showFull, setShowFull] = useState(false);
    const favoriteCallbackRef = useRef<(() => void) | undefined>(undefined);
    const [showIntroduceCat, renderShowIntroduceCat] = useIntroduceCat(category)

    const { result: shortFilms, error: errorDownloadJson, reUpdateAsync } = useCheckAndDownloadRemoteFile<ShortFilm[]>(
        fileURL,
        TempDirName + '/short_films.json',
        true,
        GetRemoteFileConfigVersion('short_films'),
        'json',
        false,
        async () => AsyncStorage.getItem(StorageKey_LocalFileVersion(category)),
        async () => AsyncStorage.setItem(StorageKey_LocalFileVersion(category), GetRemoteFileConfigVersion('short_films').toString()))

    const { onLoad, heightInPixel } = useHeightOfImageWhenWidthFull(heightPercentageToDP(40))

    // animation

    const mediaViewScaleAnimRef = useRef(new Animated.Value(1)).current

    // play loaded media anim

    useEffect(() => {
        if (selectingItem?.img)
            playAnimLoadedMedia(mediaViewScaleAnimRef)
    }, [heightInPixel, selectingItem?.img])

    const idCurrent = useMemo(() => {
        if (!selectingItem)
            return undefined

        let id = ''

        const text = selectingItem.name + (selectingItem.author ?? '')

        for (let i = 0; i < text.length; i++) {
            if (IsChar(text[i]) || IsNumChar(text[i]))
                id += text[i]
        }

        return id
    }, [selectingItem])

    const getSelectingIdxAsync = useCallback(async () => {
        const s = await AsyncStorage.getItem(StorageKey_SelectingShortFilmIdx)
        return typeof s === 'string' ? Number.parseInt(s) : -1
    }, [])

    const setSelectingIdxAsync = useCallback(async (id: number) => {
        await AsyncStorage.setItem(StorageKey_SelectingShortFilmIdx, id.toString())
    }, [])

    const onPressNext = useCallback(async (toIdx: number = -1, trackingTarget: 'none' | 'menu' | 'next') => {
        track_PressNextPost(trackingTarget === 'next', category, true)

        setSelectingItem(undefined)
        setIsShowList(false)
        setShowFull(false)

        if (!Array.isArray(shortFilms)) {
            reUpdateAsync()
            setHandling(true)
            return
        }

        let idx = toIdx

        if (idx < 0) {
            idx = await getSelectingIdxAsync()
            idx++
        }

        if (idx >= shortFilms.length)
            idx = 0

        let movie = shortFilms[idx]

        setSelectingIdxAsync(idx)

        setSelectingItem(movie)
    }, [shortFilms, reUpdateAsync])

    const onPressOpenYoutubeApp = useCallback(async () => {
        if (!selectingItem)
            return

        let url = selectingItem.url
        let idx = url.indexOf('=')

        if (idx < 0)
            idx = url.lastIndexOf('/')

        if (idx < 0)
            return

        const id = url.substring(idx + 1)

        const can = await OpenYoutubeAsync(id)

        if (can)
            track_SimpleWithCat(category, 'open_ytb_app')
    }, [selectingItem])

    const onPressRandom = useCallback(async () => {
        track_PressRandom(true, category, undefined)

        if (!Array.isArray(shortFilms)) {
            onPressNext(-1, 'none')
            return
        }

        onPressNext(RandomInt(0, shortFilms.length - 1), 'none')
    }, [shortFilms, onPressNext])

    const onPressInAppWeb = useCallback(() => {
        if (!showFull)
            track_SimpleWithCat(category, 'open_inapp_web')

        setShowFull(!showFull)
    }, [showFull])

    const onPressShareText = useCallback(async () => {
        if (!selectingItem)
            return

        track_SimpleWithCat(category, 'share')

        const flp = GetFLPFromRLP(TempDirName + '/image.jpg', true)
        const res = await DownloadFileAsync(selectingItem.img, flp, false)

        if (res) {
            Alert.alert('Fail', ToCanPrint(res))
            return
        }

        const message =
            selectingItem.name +
            (selectingItem.author ? ' (' + selectingItem.author + '): ' : ': ') +
            selectingItem.desc + '\n\n' +
            selectingItem.url

        console.log(message);

        Share
            .open({
                message,
                url: flp,
            })
            .catch((err) => {
                const error = ToCanPrint(err)

                if (!error.includes('User did not share'))
                    Alert.alert('Fail', error)
            })
    }, [selectingItem, theme])

    const onLongPressed = useCallback(() => {
        console.log('long pressed');
    }, [])

    const onTapCounted = useCallback((count: number, _: GestureResponderEvent['nativeEvent']) => {
        if (count === 2) {
            if (favoriteCallbackRef.current)
                favoriteCallbackRef.current()
        }
    }, [])

    const onSwiped = useCallback((result: SwipeResult) => {
        if (result.primaryDirectionIsHorizontalOrVertical && !result.primaryDirectionIsPositive) {
            onPressNext(-1, 'next')
        }
    }, [onPressNext])

    const [onBigViewStartTouch, onBigViewEndTouch] = useSimpleGesture(onTapCounted, onLongPressed, onSwiped)

    const showOpenInYoutube = useMemo(() => {
        return SafeValue(selectingItem?.url, '').includes('youtu.be') || SafeValue(selectingItem?.url, '').includes('youtube')
    }, [selectingItem])

    const bottomBarItems = useMemo(() => {
        return [
            {
                text: showFull ? LocalText.close : LocalText.view,
                onPress: onPressInAppWeb,
                icon: showFull ? Icon.X : Icon.Eye
            },
            {
                text: LocalText.random,
                onPress: onPressRandom,
                icon: Icon.Dice,
            },
            {
                favoriteCallbackRef: favoriteCallbackRef,
            },
            {
                text: LocalText.next,
                onPress: () => onPressNext(-1, 'next'),
                icon: Icon.Right,
                scaleIcon: 1.5,
            },
            {
                text: LocalText.share,
                onPress: onPressShareText,
                icon: Icon.ShareText,
                countType: 'share',
            },
        ] as BottomBarItem[]
    }, [showFull, onPressNext, onPressRandom, onPressShareText])

    // for load data first time

    useEffect(() => {
        (async () => {
            reasonToReload.current = NeedReloadReason.None

            if (shortFilms) { // downloaded success
                setHandling(false)

                if (Array.isArray(shortFilms)) {
                    const res = await ToastNewItemsAsync(category, LocalText.new_item_short_film, shortFilms, theme)

                    if (res)
                        onPressNext(0, 'none')
                    else
                        onPressNext(-1, 'none')
                }
                else
                    onPressNext(-1, 'none')
            }
            else if (errorDownloadJson) { // download failed
                setHandling(false)

                if (NetLord.IsAvailableLatestCheck())
                    reasonToReload.current = NeedReloadReason.FailToGetContent
                else
                    reasonToReload.current = NeedReloadReason.NoInternet
            }
        })()
    }, [shortFilms, errorDownloadJson])

    // update header setting btn

    useEffect(() => {
        navigation.setOptions({
            headerRight: () => <HeaderRightButtons />
        });
    }, [])

    // save last visit category screen

    useFocusEffect(useCallback(() => SaveCurrentScreenForLoadNextTime(navigation), []))

    // introduce cat

    if (showIntroduceCat)
        return renderShowIntroduceCat()

    return (
        <View pointerEvents={handling ? 'none' : 'auto'} style={[styleSheet.masterView, { backgroundColor: theme.background }]}>
            <View style={CommonStyles.flex_1} >
                {
                    handling ?
                        <View style={CommonStyles.flex1_justifyContentCenter_AlignItemsCenter}>
                            <ActivityIndicator color={theme.counterBackground} style={{ marginRight: Outline.Horizontal }} />
                        </View> :
                        <View style={CommonStyles.flex1_justifyContentCenter_AlignItemsCenter}>
                            {
                                reasonToReload.current !== NeedReloadReason.None ?
                                    <TouchableOpacity onPress={() => onPressNext(-1, 'none')} style={[{ gap: Outline.GapVertical }, CommonStyles.flex1_justifyContentCenter_AlignItemsCenter]} >
                                        <MaterialCommunityIcons name={reasonToReload.current === NeedReloadReason.NoInternet ? Icon.NoInternet : Icon.HeartBroken} color={theme.counterBackground} size={Size.IconMedium} />
                                        <Text style={{ fontSize: FontSize.Normal, color: theme.counterBackground }}>{reasonToReload.current === NeedReloadReason.NoInternet ? LocalText.no_internet : LocalText.cant_get_content}</Text>
                                        <Text style={{ fontSize: FontSize.Small_L, color: theme.counterBackground }}>{LocalText.tap_to_retry}</Text>
                                    </TouchableOpacity>
                                    :
                                    <View onTouchStart={onBigViewStartTouch} onTouchEnd={onBigViewEndTouch} style={styleSheet.contentView}>
                                        <View onTouchEnd={() => setIsShowList(true)} style={[styleSheet.nameContainerView, CommonStyles.justifyContentCenter_AlignItemsCenter]}>
                                            <Text style={[{ color: theme.counterBackground, }, styleSheet.nameText]}>{selectingItem?.name}</Text>
                                            <View style={[{ borderColor: theme.counterBackground, }, styleSheet.showListIconView]}>
                                                <MaterialCommunityIcons name={Icon.List} color={theme.counterBackground} size={Size.Icon} />
                                            </View>
                                        </View>
                                        <Animated.View style={{
                                            width: widthPercentageToDP(100),
                                            height: heightInPixel,
                                            transform: [{ scale: mediaViewScaleAnimRef }]
                                        }}>
                                            <ImageBackgroundWithLoading onLoad={onLoad} resizeMode='contain' source={{ uri: selectingItem?.img }} style={styleSheet.image} indicatorProps={{ color: theme.counterBackground }} />
                                        </Animated.View>
                                        <Text selectable style={[styleSheet.nameView, { color: theme.counterBackground, }]}>{selectingItem?.name}</Text>
                                        {
                                            !selectingItem?.author ? undefined :
                                                <Text selectable style={[styleSheet.infoTextView, { color: theme.counterBackground, }]}>{LocalText.credit_to + ': ' + selectingItem.author}</Text>
                                        }
                                        <View style={styleSheet.contentScrollView}>
                                            <ScrollView >
                                                <Text selectable adjustsFontSizeToFit style={[{ flexWrap: 'wrap', color: theme.counterBackground, fontSize: FontSize.Small_L }]}>{selectingItem?.desc}</Text>
                                            </ScrollView>
                                        </View>
                                        {
                                            !showFull || !selectingItem?.url ? undefined :
                                                <View style={[CommonStyles.width100Percent_Height100Percent_PositionAbsolute_JustifyContentCenter_AlignItemsCenter]}>
                                                    <WebView
                                                        source={{ uri: selectingItem.url }}
                                                        containerStyle={{ width: '100%', height: '100%' }}
                                                    />
                                                </View>
                                        }
                                    </View>
                            }
                        </View>
                }
            </View>

            {
                <View style={styleSheet.openYtbAndView}>
                    <TouchableOpacity activeOpacity={showOpenInYoutube ? 0.2 : 0} onPress={showOpenInYoutube ? onPressOpenYoutubeApp : undefined} style={[styleSheet.openYtb, { opacity: showOpenInYoutube ? 1 : 0 }]}>
                        <MaterialCommunityIcons name={Icon.Youtube} color={theme.counterBackground} size={Size.IconSmaller} />
                        <Text style={{ color: theme.counterBackground, fontSize: FontSize.Small_L }}>{LocalText.open_youtube}</Text>
                    </TouchableOpacity>

                    <ViewCount fontSize={FontSize.Small_L} cat={category} id={idCurrent} />
                </View>
            }

            {/* main btn part */}

            <BottomBar
                items={bottomBarItems}
                id={idCurrent}
                category={category}
            />

            {
                isShowList && Array.isArray(shortFilms) ? <ListMovie getSelectingIdAsync={getSelectingIdxAsync} setIdx={(idx: number) => onPressNext(idx, 'menu')} list={shortFilms} /> : undefined
            }

            <MiniIAP triggerId={idCurrent} />
        </View>
    )
}

export default BestShortFilmsScreen

const styleSheet = StyleSheet.create({
    masterView: { flex: 1, gap: Outline.GapVertical, },
    headerOptionTO: { marginRight: 15 },
    image: { width: '100%', height: '100%' },
    contentView: { flex: 1, gap: Outline.GapVertical, paddingTop: Outline.GapHorizontal },
    contentScrollView: { flex: 1, marginHorizontal: Outline.GapVertical_2 },
    nameView: { marginLeft: Outline.Horizontal, fontSize: FontSize.Normal, fontWeight: FontWeight.B500 },
    infoTextView: { fontStyle: 'italic', paddingLeft: Outline.Horizontal, fontSize: FontSize.Small_L, },
    nameTO: { marginHorizontal: Outline.GapVertical_2, flexDirection: 'row', justifyContent: 'space-between' },
    nameText: { marginLeft: widthPercentageToDP(12), flex: 1, textAlign: 'center', fontSize: FontSize.Normal },
    nameContainerView: { paddingHorizontal: Outline.GapVertical, flexDirection: 'row', gap: Outline.GapHorizontal },
    showListIconView: { padding: Outline.GapHorizontal, borderWidth: StyleSheet.hairlineWidth, borderRadius: BorderRadius.BR8 },
    openYtbAndView: { alignItems: 'center', marginHorizontal: Outline.GapVertical, justifyContent: 'space-between', flexDirection: 'row' },
    openYtb: { alignItems: 'center', gap: Outline.GapHorizontal, borderRadius: BorderRadius.BR8, flexDirection: 'row' },
})