import { View, Text, TouchableOpacity, ActivityIndicator, StyleSheet, Alert, GestureResponderEvent, Animated } from 'react-native'
import React, { LegacyRef, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'
import { ThemeContext } from '../../constants/Colors'
import { BorderRadius, Category, FontSize, FontWeight, Icon, LocalText, NeedReloadReason, Outline, Size, StorageKey_LocalFileVersion, StorageKey_SelectingTopMovieIdx } from '../../constants/AppConstants'
import Share from 'react-native-share';


// @ts-ignore

// @ts-ignore
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { NetLord } from '../../handle/NetLord'
import { useFocusEffect, useNavigation } from '@react-navigation/native'
import { SaveCurrentScreenForLoadNextTime } from '../../handle/AppUtils'
import ViewShot from 'react-native-view-shot'
import { CommonStyles } from '../../constants/CommonConstants'
import { GetStreakAsync, SetStreakAsync } from '../../handle/Streak';
import { Streak, TopMovie } from '../../constants/Types';
import StreakPopup from '../components/StreakPopup';
import { heightPercentageToDP, widthPercentageToDP } from 'react-native-responsive-screen';
import { ScrollView } from 'react-native-gesture-handler';
import { Clamp, ToCanPrint, ExtractAllNumbersInText, IsChar, IsNumChar } from '../../handle/UtilsTS';
import ImageBackgroundWithLoading from '../components/ImageBackgroundWithLoading';
import useCheckAndDownloadRemoteFile from '../../hooks/useCheckAndDownloadRemoteFile';
import { RandomInt, TempDirName } from '../../handle/Utils';
import { GetRemoteFileConfigVersion } from '../../handle/AppConfigHandler';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ListMovie from './ListMovie';
import { DownloadFileAsync, GetFLPFromRLP } from '../../handle/FileUtils';
import { track_PressNextPost, track_PressRandom, track_SimpleWithCat } from '../../handle/tracking/GoodayTracking';
import { SwipeResult, useSimpleGesture } from '../../hooks/useSimpleGesture';
import { playAnimLoadedMedia } from '../../handle/GoodayAnimation';
import FavoriteButton from '../others/FavoriteButton';

const category = Category.TopMovie
const fileURL = 'https://firebasestorage.googleapis.com/v0/b/warm-379a6.appspot.com/o/file_configs%2Ftop_movies.json?alt=media&token=4203c962-58bb-41c3-a1a0-ab3b1b3359f8'

const TopMovieScreen = () => {
    const navigation = useNavigation();
    const reasonToReload = useRef<NeedReloadReason>(NeedReloadReason.None);
    const theme = useContext(ThemeContext);
    const [handling, setHandling] = useState(true)
    const [streakData, setStreakData] = useState<Streak | undefined>(undefined)
    const [selectingItem, setSelectingItem] = useState<TopMovie | undefined>(undefined)
    const [isShowList, setIsShowList] = useState(false)
    const viewShotRef = useRef<LegacyRef<ViewShot> | undefined>();
    const favoriteCallbackRef = useRef<(() => void) | undefined>(undefined);

    const [topMovies, errorDownloadJson, _, reUpdateData] = useCheckAndDownloadRemoteFile<TopMovie[]>(
        fileURL,
        TempDirName + '/top_movies.json',
        true,
        GetRemoteFileConfigVersion('top_movies'),
        'json',
        false,
        async () => AsyncStorage.getItem(StorageKey_LocalFileVersion(category)),
        async () => AsyncStorage.setItem(StorageKey_LocalFileVersion(category), GetRemoteFileConfigVersion('top_movies').toString()))

    const mediaViewScaleAnimRef = useRef(new Animated.Value(1)).current

    const onImageLoaded = useCallback(() => {
        playAnimLoadedMedia(mediaViewScaleAnimRef)
    }, [])

    const idNumber = useMemo(() => {
        if (!selectingItem)
            return undefined

        let id = ''

        for (let i = 0; i < selectingItem.title.length; i++) {
            if (IsChar(selectingItem.title[i]) || IsNumChar(selectingItem.title[i]))
                id += selectingItem.title[i]
        }

        const arr = ExtractAllNumbersInText(selectingItem.info)

        if (arr && arr.length > 0 && arr[0] > 1000)
            id += arr[0]

        return id
    }, [selectingItem])

    const getSelectingIdxAsync = useCallback(async () => {
        const s = await AsyncStorage.getItem(StorageKey_SelectingTopMovieIdx)
        return typeof s === 'string' ? Number.parseInt(s) : -1
    }, [])

    const setSelectingIdxAsync = useCallback(async (id: number) => {
        await AsyncStorage.setItem(StorageKey_SelectingTopMovieIdx, id.toString())
    }, [])

    const onPressNext = useCallback(async (toIdx: number = -1, trackingTarget: 'none' | 'menu' | 'next') => {
        track_PressNextPost(trackingTarget === 'next', category, true)

        setSelectingItem(undefined)
        setIsShowList(false)

        if (!Array.isArray(topMovies)) {
            reUpdateData()
            setHandling(true)
            return
        }

        let idx = toIdx

        if (idx < 0) {
            idx = await getSelectingIdxAsync()
            idx++
        }

        idx = Clamp(idx, 0, topMovies.length - 1)

        let movie = topMovies[idx]

        setSelectingIdxAsync(idx)

        setSelectingItem(movie)

        SetStreakAsync(Category[category], -1)
    }, [topMovies, reUpdateData])

    const onPressRandom = useCallback(async () => {
        track_PressRandom(true, category, undefined)

        if (!Array.isArray(topMovies)) {
            onPressNext(-1, 'none')
            return
        }

        onPressNext(RandomInt(0, topMovies.length - 1), 'none')
    }, [topMovies, onPressNext])

    const onPressHeaderOption = useCallback(async () => {
        if (streakData)
            setStreakData(undefined)
        else {
            const streak = await GetStreakAsync(Category[category])
            setStreakData(streak)
        }
    }, [streakData])

    const onPressShareText = useCallback(async () => {
        if (!selectingItem)
            return

        track_SimpleWithCat(category, 'share')

        const flp = GetFLPFromRLP(TempDirName + '/image.jpg', true)
        const res = await DownloadFileAsync(selectingItem.thumbnailUri, flp, false)

        if (res) {
            Alert.alert('Fail', ToCanPrint(res))
            return
        }

        const message =
            '#' + selectingItem.rank + '. ' +
            selectingItem.title + ': ' +
            selectingItem.desc + '\n' +
            selectingItem.info + '\n' +
            '★ ' + selectingItem.rate + ' on IMDb'

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

    const onPressShareImage = useCallback(() => {
        if (!selectingItem)
            return

        track_SimpleWithCat(category, 'share_as_image')

        const message =
            '#' + selectingItem.rank + '. ' +
            selectingItem.title + ': ' +
            selectingItem.desc + '\n' +
            selectingItem.info + '\n' +
            '★ ' + selectingItem.rate + ' on IMDb'

        // @ts-ignore
        viewShotRef.current.capture().then(async (uri: string) => {
            Share
                .open({
                    message,
                    url: uri,
                })
                .catch((err) => {
                    const error = ToCanPrint(err)

                    if (!error.includes('User did not share'))
                        Alert.alert('Fail', error)
                });
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

    // for load data first time

    useEffect(() => {
        reasonToReload.current = NeedReloadReason.None

        if (topMovies) { // downloaded success
            setHandling(false)
            onPressNext(-1, 'none')
        }
        else if (errorDownloadJson) { // download failed
            setHandling(false)

            if (NetLord.IsAvailableLastestCheck())
                reasonToReload.current = NeedReloadReason.FailToGetContent
            else
                reasonToReload.current = NeedReloadReason.NoInternet
        }
    }, [topMovies, errorDownloadJson])

    // on init once

    useEffect(() => {
        SetStreakAsync(Category[category])
    }, [])

    // on change theme

    useEffect(() => {
        navigation.setOptions({
            headerRight: () =>
                <TouchableOpacity onPress={onPressHeaderOption} style={styleSheet.headerOptionTO}>
                    <MaterialCommunityIcons name={Icon.ThreeDots} color={theme.counterPrimary} size={Size.Icon} />
                </TouchableOpacity>
        });
    }, [theme, onPressHeaderOption])

    // save last visit category screen

    useFocusEffect(useCallback(() => SaveCurrentScreenForLoadNextTime(navigation), []))

    return (
        <View pointerEvents={handling ? 'none' : 'auto'} style={[styleSheet.masterView, { backgroundColor: theme.background }]}>
            {/* @ts-ignore */}
            <ViewShot style={CommonStyles.flex_1} ref={viewShotRef} options={{ fileName: "Your-File-Name", format: "jpg", quality: 1 }}>
                <View style={CommonStyles.flex_1} >
                    {
                        handling ?
                            <View style={CommonStyles.flex1_justifyContentCenter_AlignItemsCenter}>
                                <ActivityIndicator color={theme.counterPrimary} style={{ marginRight: Outline.Horizontal }} />
                            </View> :
                            <View style={CommonStyles.flex1_justifyContentCenter_AlignItemsCenter}>
                                {
                                    reasonToReload.current !== NeedReloadReason.None ?
                                        <TouchableOpacity onPress={() => onPressNext(-1, 'none')} style={[{ gap: Outline.GapVertical }, CommonStyles.flex1_justifyContentCenter_AlignItemsCenter]} >
                                            <MaterialCommunityIcons name={reasonToReload.current === NeedReloadReason.NoInternet ? Icon.NoInternet : Icon.HeartBroken} color={theme.primary} size={Size.IconBig} />
                                            <Text style={{ fontSize: FontSize.Normal, color: theme.counterPrimary }}>{reasonToReload.current === NeedReloadReason.NoInternet ? LocalText.no_internet : LocalText.cant_get_content}</Text>
                                            <Text style={{ fontSize: FontSize.Small_L, color: theme.counterPrimary }}>{LocalText.tap_to_retry}</Text>
                                        </TouchableOpacity>
                                        :
                                        <View onTouchStart={onBigViewStartTouch} onTouchEnd={onBigViewEndTouch} style={styleSheet.contentView}>
                                            <View onTouchEnd={() => setIsShowList(true)} style={[styleSheet.titleContainerView, CommonStyles.justifyContentCenter_AlignItemsCenter]}>
                                                <Text style={[{ color: theme.counterBackground, }, styleSheet.titleText]}>{selectingItem?.title}</Text>
                                                <View style={styleSheet.showListIconView}>
                                                    <MaterialCommunityIcons name={Icon.List} color={theme.counterPrimary} size={Size.Icon} />
                                                </View>
                                            </View>
                                            <Animated.View style={[{ transform: [{ scale: mediaViewScaleAnimRef }] }]}>
                                                <ImageBackgroundWithLoading onLoad={onImageLoaded} resizeMode='contain' source={{ uri: selectingItem?.thumbnailUri }} style={styleSheet.image} indicatorProps={{ color: theme.counterBackground }} />
                                            </Animated.View>
                                            <Text selectable style={[styleSheet.titleView, { color: theme.counterBackground, }]}>{selectingItem?.title}</Text>
                                            <Text selectable style={[styleSheet.infoTextView, { color: theme.counterBackground, }]}>{selectingItem?.info}</Text>
                                            <Text selectable style={[styleSheet.infoTextView, { color: theme.counterBackground, }]}>★ {selectingItem?.rate} on IMDb</Text>
                                            <View style={styleSheet.contentScrollView}>
                                                <ScrollView >
                                                    <Text selectable adjustsFontSizeToFit style={[{ flexWrap: 'wrap', color: theme.counterBackground, fontSize: FontSize.Small_L }]}>{selectingItem?.desc}</Text>
                                                </ScrollView>
                                            </View>
                                            <View style={[styleSheet.rankView]}>
                                                <View style={styleSheet.rankBGView} />
                                                {
                                                    !selectingItem?.rank ? undefined :
                                                        <Text style={[{ color: theme.counterBackground }, styleSheet.rankText]}>#{'\n' + selectingItem.rank}</Text>
                                                }
                                            </View>
                                        </View>
                                }
                            </View>
                    }
                </View>
            </ViewShot>
            {/* main btn */}
            <View style={styleSheet.mainButtonsView}>
                <FavoriteButton callbackRef={favoriteCallbackRef} id={idNumber} category={category} />
                <TouchableOpacity onPress={onPressRandom} style={[{ gap: Outline.GapHorizontal, borderRadius: BorderRadius.BR8, backgroundColor: theme.primary, }, styleSheet.mainBtnTO]}>
                    <MaterialCommunityIcons name={Icon.Dice} color={theme.counterPrimary} size={Size.Icon} />
                    <Text style={{ color: theme.counterBackground, fontSize: FontSize.Normal }}>{LocalText.random}</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => onPressNext(-1, 'next')} style={[{ gap: Outline.GapHorizontal, borderRadius: BorderRadius.BR8, backgroundColor: theme.primary, }, styleSheet.mainBtnTO]}>
                    <MaterialCommunityIcons name={Icon.Right} color={theme.counterPrimary} size={Size.Icon} />
                    <Text style={{ color: theme.counterBackground, fontSize: FontSize.Normal }}>{LocalText.next}</Text>
                </TouchableOpacity>
            </View>
            {/* sub btns */}
            <View style={[{ gap: Outline.GapHorizontal }, CommonStyles.row_width100Percent]}>
                <TouchableOpacity onPress={onPressShareText} style={[{ gap: Outline.GapHorizontal, borderRadius: BorderRadius.BR8 }, styleSheet.subBtnTO]}>
                    <MaterialCommunityIcons name={Icon.ShareText} color={theme.counterPrimary} size={Size.IconSmaller} />
                    <Text style={{ color: theme.counterBackground, fontSize: FontSize.Small_L }}>{LocalText.share}</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={onPressShareImage} style={[styleSheet.subBtnTO, { gap: Outline.GapHorizontal, borderRadius: BorderRadius.BR8 }]}>
                    <MaterialCommunityIcons name={Icon.ShareImage} color={theme.counterPrimary} size={Size.IconSmaller} />
                    <Text style={{ color: theme.counterBackground, fontSize: FontSize.Small_L }}>{LocalText.share_image}</Text>
                </TouchableOpacity>

            </View>
            {
                isShowList && Array.isArray(topMovies) ? <ListMovie getSelectingIdAsync={getSelectingIdxAsync} setIdx={(idx: number) => onPressNext(idx, 'menu')} list={topMovies} /> : undefined
            }
            {
                streakData ? <StreakPopup streak={streakData} /> : undefined
            }
        </View>
    )
}

export default TopMovieScreen

const styleSheet = StyleSheet.create({
    masterView: { paddingBottom: Outline.Horizontal, flex: 1, gap: Outline.GapVertical, },
    mainButtonsView: { gap: Outline.GapHorizontal, marginHorizontal: Outline.GapVertical_2, flexDirection: 'row' },
    mainBtnTO: { paddingVertical: Outline.GapVertical, flex: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', },
    subBtnTO: { justifyContent: 'center', flexDirection: 'row', flex: 1, alignItems: 'center', },
    headerOptionTO: { marginRight: 15 },
    image: { width: widthPercentageToDP(100), height: heightPercentageToDP(40) },
    contentView: { flex: 1, gap: Outline.GapVertical, paddingTop: Outline.GapHorizontal },
    contentScrollView: { flex: 1, marginHorizontal: Outline.GapVertical_2 },
    titleView: { marginLeft: Outline.Horizontal, fontSize: FontSize.Normal, fontWeight: FontWeight.B500 },
    infoTextView: { paddingLeft: Outline.Horizontal, fontSize: FontSize.Small_L, },
    titleTO: { marginHorizontal: Outline.GapVertical_2, flexDirection: 'row', justifyContent: 'space-between' },
    titleText: { marginLeft: widthPercentageToDP(12), flex: 1, textAlign: 'center', fontSize: FontSize.Normal },
    titleContainerView: { paddingHorizontal: Outline.GapVertical, flexDirection: 'row', gap: Outline.GapHorizontal },
    showListIconView: { padding: Outline.GapHorizontal, borderWidth: StyleSheet.hairlineWidth, borderRadius: BorderRadius.BR8 },
    rankView: { position: 'absolute' },
    rankText: { fontSize: FontSize.Small_L, padding: Outline.GapHorizontal, fontWeight: FontWeight.B600, textAlign: 'center' },
    rankBGView: { position: 'absolute', left: -widthPercentageToDP(11), top: -heightPercentageToDP(3), width: widthPercentageToDP(30), height: heightPercentageToDP(10), backgroundColor: 'gold', transform: [{ rotateZ: '-45deg' }] },
})