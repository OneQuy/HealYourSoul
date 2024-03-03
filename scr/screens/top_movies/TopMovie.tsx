import { View, Text, TouchableOpacity, ActivityIndicator, StyleSheet, Alert, GestureResponderEvent, Animated } from 'react-native'
import React, { LegacyRef, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'
import { ThemeContext } from '../../constants/Colors'
import { BorderRadius, Category, FontSize, FontWeight, Icon, LocalText, NeedReloadReason, Outline, Size, StorageKey_LocalFileVersion, StorageKey_SelectingTopMovieIdx } from '../../constants/AppConstants'
import Share from 'react-native-share';
// @ts-ignore
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { NetLord } from '../../handle/NetLord'
import { useFocusEffect, useNavigation } from '@react-navigation/native'
import { SaveCurrentScreenForLoadNextTime } from '../../handle/AppUtils'
import { CommonStyles } from '../../constants/CommonConstants'
import { TopMovie } from '../../constants/Types';
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
import BottomBar, { BottomBarItem } from '../others/BottomBar';
import HeaderRightButtons from '../components/HeaderRightButtons';
import ViewCount from '../components/ViewCount';

const category = Category.TopMovie
const fileURL = 'https://firebasestorage.googleapis.com/v0/b/warm-379a6.appspot.com/o/file_configs%2Ftop_movies.json?alt=media&token=4203c962-58bb-41c3-a1a0-ab3b1b3359f8'

const TopMovieScreen = () => {
    const navigation = useNavigation();
    const reasonToReload = useRef<NeedReloadReason>(NeedReloadReason.None);
    const theme = useContext(ThemeContext);
    const [handling, setHandling] = useState(true)
    const [selectingItem, setSelectingItem] = useState<TopMovie | undefined>(undefined)
    const [isShowList, setIsShowList] = useState(false)
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
    }, [topMovies, reUpdateData])

    const onPressRandom = useCallback(async () => {
        track_PressRandom(true, category, undefined)

        if (!Array.isArray(topMovies)) {
            onPressNext(-1, 'none')
            return
        }

        onPressNext(RandomInt(0, topMovies.length - 1), 'none')
    }, [topMovies, onPressNext])

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

    const bottomBarItems = useMemo(() => {
        return [
            {
                text: LocalText.share,
                onPress: onPressShareText,
                icon: Icon.ShareText,
                countType: 'share',
            },
            {
                favoriteCallbackRef: favoriteCallbackRef,
            },
            {
                text: LocalText.random,
                onPress: onPressRandom,
                icon: Icon.Dice,
            },
            {
                text: LocalText.next,
                onPress: () => onPressNext(-1, 'next'),
                icon: Icon.Right,
                scaleIcon: 1.5,
            },
        ] as BottomBarItem[]
    }, [onPressNext, onPressRandom, onPressShareText])

    // for load data first time

    useEffect(() => {
        reasonToReload.current = NeedReloadReason.None

        if (topMovies) { // downloaded success
            setHandling(false)
            onPressNext(-1, 'none')
        }
        else if (errorDownloadJson) { // download failed
            setHandling(false)

            if (NetLord.IsAvailableLatestCheck())
                reasonToReload.current = NeedReloadReason.FailToGetContent
            else
                reasonToReload.current = NeedReloadReason.NoInternet
        }
    }, [topMovies, errorDownloadJson])

    // update header setting btn

    useEffect(() => {
        navigation.setOptions({
            headerRight: () => <HeaderRightButtons />
        });
    }, [])

    // save last visit category screen

    useFocusEffect(useCallback(() => SaveCurrentScreenForLoadNextTime(navigation), []))

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
                                        <View onTouchEnd={() => setIsShowList(true)} style={[styleSheet.titleContainerView, CommonStyles.justifyContentCenter_AlignItemsCenter]}>
                                            <Text style={[{ color: theme.counterBackground }, styleSheet.titleText]}>{selectingItem ? '#' + selectingItem.rank : ''}</Text>
                                            <View style={[{ borderColor: theme.counterBackground, }, styleSheet.showListIconView]}>
                                                <MaterialCommunityIcons name={Icon.List} color={theme.counterBackground} size={Size.Icon} />
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
                                        {/* view count */}
                                        <View style={{ marginRight: Outline.GapVertical, alignItems: 'flex-end', }}>
                                            <ViewCount cat={category} id={idNumber} />
                                        </View>
                                    </View>
                            }
                        </View>
                }
            </View>

            {/* main btn part */}
            <BottomBar
                items={bottomBarItems}
                category={category}
                id={idNumber}
            />

            {
                isShowList && Array.isArray(topMovies) ? <ListMovie getSelectingIdAsync={getSelectingIdxAsync} setIdx={(idx: number) => onPressNext(idx, 'menu')} list={topMovies} /> : undefined
            }
        </View>
    )
}

export default TopMovieScreen

const styleSheet = StyleSheet.create({
    masterView: { flex: 1, gap: Outline.GapVertical, },
    headerOptionTO: { marginRight: 15 },
    image: { width: widthPercentageToDP(100), height: heightPercentageToDP(40) },
    contentView: { flex: 1, gap: Outline.GapVertical, paddingTop: Outline.GapHorizontal },
    contentScrollView: { flex: 1, marginHorizontal: Outline.GapVertical_2 },
    titleView: { marginLeft: Outline.Horizontal, fontSize: FontSize.Normal, fontWeight: FontWeight.B500 },
    infoTextView: { paddingLeft: Outline.Horizontal, fontSize: FontSize.Small_L, },
    titleTO: { marginHorizontal: Outline.GapVertical_2, flexDirection: 'row', justifyContent: 'space-between' },
    titleText: { marginLeft: widthPercentageToDP(12), flex: 1, textAlign: 'center', fontWeight: FontWeight.Bold, fontSize: FontSize.Big },
    titleContainerView: { paddingHorizontal: Outline.GapVertical, flexDirection: 'row', gap: Outline.GapHorizontal },
    showListIconView: { padding: Outline.GapHorizontal, borderWidth: StyleSheet.hairlineWidth, borderRadius: BorderRadius.BR8 },
})