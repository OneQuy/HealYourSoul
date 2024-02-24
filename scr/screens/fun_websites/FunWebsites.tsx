import { Share as RNShare, View, Text, TouchableOpacity, ActivityIndicator, StyleSheet, ShareContent, Linking, GestureResponderEvent, Animated } from 'react-native'
import React, { LegacyRef, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'
import { ThemeContext } from '../../constants/Colors'
import { BorderRadius, Category, FontSize, FontWeight, Icon, LocalText, NeedReloadReason, Outline, Size, StorageKey_LocalFileVersion, StorageKey_SelectingFunWebsiteId } from '../../constants/AppConstants'
// import Share from 'react-native-share';

// @ts-ignore
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { NetLord } from '../../handle/NetLord'
import { useFocusEffect, useNavigation } from '@react-navigation/native'
import { CopyAndToast, SaveCurrentScreenForLoadNextTime, ToastNewItemsAsync } from '../../handle/AppUtils'
import ViewShot from 'react-native-view-shot'
import { CommonStyles } from '../../constants/CommonConstants'
import { GetStreakAsync, SetStreakAsync } from '../../handle/Streak';
import { FunWebsite, Streak } from '../../constants/Types';
import StreakPopup from '../components/StreakPopup';
import { heightPercentageToDP, widthPercentageToDP } from 'react-native-responsive-screen';
import { ScrollView } from 'react-native-gesture-handler';
import WebView from 'react-native-webview';
import { ShareOptions } from 'react-native-share';
import ImageBackgroundWithLoading from '../components/ImageBackgroundWithLoading';
import useCheckAndDownloadRemoteFile from '../../hooks/useCheckAndDownloadRemoteFile';
import { TempDirName } from '../../handle/Utils';
import { GetRemoteFileConfigVersion } from '../../handle/AppConfigHandler';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ListWebsite from './ListWebsite';
import { track_PressNextPost, track_SimpleWithCat } from '../../handle/tracking/GoodayTracking';
import { SwipeResult, useSimpleGesture } from '../../hooks/useSimpleGesture';
import { playAnimLoadedMedia } from '../../handle/GoodayAnimation';
import BottomBar, { BottomBarItem } from '../others/BottomBar';
import HeaderRightButtons from '../components/HeaderRightButtons';
import useIntroduceCat from '../components/IntroduceCat';

const category = Category.FunWebsites
const fileURL = 'https://firebasestorage.googleapis.com/v0/b/warm-379a6.appspot.com/o/file_configs%2Ffun_websites.json?alt=media&token=10ecb626-e576-49d4-b124-a9ba148a93a6'

const FunWebsitesScreen = () => {
    const navigation = useNavigation();
    const reasonToReload = useRef<NeedReloadReason>(NeedReloadReason.None);
    const theme = useContext(ThemeContext);
    const [handling, setHandling] = useState(true)
    const [streakData, setStreakData] = useState<Streak | undefined>(undefined)
    const [showFull, setShowFull] = useState(false)
    const [selectingItem, setSelectingItem] = useState<FunWebsite | undefined>(undefined)
    const [isShowList, setIsShowList] = useState(false)
    const viewShotRef = useRef<LegacyRef<ViewShot> | undefined>();
    const favoriteCallbackRef = useRef<(() => void) | undefined>(undefined);
    const [showIntroduceCat, renderShowIntroduceCat] = useIntroduceCat(category)

    // animation

    const mediaViewScaleAnimRef = useRef(new Animated.Value(1)).current

    // play loaded media anim

    const onImageLoaded = useCallback(() => {
        playAnimLoadedMedia(mediaViewScaleAnimRef)
    }, [])

    const [funWebsites, errorDownloadJson, _, reUpdateData] = useCheckAndDownloadRemoteFile<FunWebsite[]>(
        fileURL,
        TempDirName + '/fun_website.json',
        true,
        GetRemoteFileConfigVersion('fun_websites'),
        'json',
        false,
        async () => AsyncStorage.getItem(StorageKey_LocalFileVersion(category)),
        async () => AsyncStorage.setItem(StorageKey_LocalFileVersion(category), GetRemoteFileConfigVersion('fun_websites').toString()))

    const shortUrl = useMemo(() => {
        if (!selectingItem)
            return ''

        const urlShort = selectingItem.url.replaceAll('https://', '')
        return urlShort.replaceAll('www.', '')
    }, [selectingItem])

    const getSelectingIdAsync = useCallback(async () => {
        const s = await AsyncStorage.getItem(StorageKey_SelectingFunWebsiteId)
        return typeof s === 'string' ? Number.parseInt(s) : -1
    }, [])

    const setSelectingIdAsync = useCallback(async (id: number) => {
        await AsyncStorage.setItem(StorageKey_SelectingFunWebsiteId, id.toString())
    }, [])

    const onPressLink = useCallback(async () => {
        if (!selectingItem)
            return

        Linking.openURL(selectingItem.url)
    }, [selectingItem])

    const onPressNext = useCallback(async (toId: number = -1, trackingTarget: 'none' | 'menu' | 'next') => {
        track_PressNextPost(trackingTarget === 'next', category, true)

        setSelectingItem(undefined)
        setIsShowList(false)

        if (!Array.isArray(funWebsites)) {
            reUpdateData()
            setHandling(true)
            return
        }

        let id = toId

        if (id < 0) {
            id = await getSelectingIdAsync()
            id--
        }

        let web = funWebsites.find(w => w.id === id)

        if (!web) {
            web = funWebsites[funWebsites.length - 1]
            id = web.id
        }

        setSelectingIdAsync(id)

        setSelectingItem(web)
        setShowFull(false)

        SetStreakAsync(Category[category], -1)
    }, [funWebsites, reUpdateData])

    const onPressCopy = useCallback(() => {
        if (!selectingItem)
            return

        track_SimpleWithCat(category, 'copy')

        const message = selectingItem.desc + '\n\n' + selectingItem.url
        CopyAndToast(message, theme)
    }, [selectingItem, theme])

    const onPressHeaderOption = useCallback(async () => {
        if (streakData)
            setStreakData(undefined)
        else {
            const streak = await GetStreakAsync(Category[category])
            setStreakData(streak)
        }
    }, [streakData])

    const onPressShareText = useCallback(() => {
        if (!selectingItem)
            return

        track_SimpleWithCat(category, 'share')

        const message = selectingItem.desc + '\n\n' + selectingItem.url

        RNShare.share({
            title: LocalText.fact_of_the_day,
            message,
        } as ShareContent,
            {
                tintColor: theme.primary,
            } as ShareOptions)
    }, [selectingItem, theme])

    const onPressInAppWeb = useCallback(() => {
        if (!showFull)
            track_SimpleWithCat(category, 'open_inapp_web')

        setShowFull(!showFull)
    }, [showFull])

    // const onPressShareImage = useCallback(() => {
    //     if (!selectingItem)
    //         return

    //     track_SimpleWithCat(category, 'share_as_image')

    //     const message = selectingItem.desc + '\n\n' + selectingItem.url
    //     // @ts-ignore
    //     viewShotRef.current.capture().then(async (uri: string) => {
    //         Share
    //             .open({
    //                 message,
    //                 url: uri,
    //             })
    //             .catch((err) => {
    //                 const error = ToCanPrint(err)

    //                 if (!error.includes('User did not share'))
    //                     Alert.alert('Fail', error)
    //             });
    //     })
    // }, [selectingItem, theme])

    const onSwiped = useCallback((result: SwipeResult) => {
        if (result.primaryDirectionIsHorizontalOrVertical && !result.primaryDirectionIsPositive) {
            onPressNext(-1, 'next')
        }
    }, [])

    const onLongPressed = useCallback(() => {
        console.log('long pressed');
    }, [])

    const onTapCounted = useCallback((count: number, _: GestureResponderEvent['nativeEvent']) => {
        if (count === 2) {
            if (favoriteCallbackRef.current)
                favoriteCallbackRef.current()
        }
    }, [])

    const [onBigViewStartTouch, onBigViewEndTouch] = useSimpleGesture(onTapCounted, onLongPressed, onSwiped)

    const bottomBarItems = useMemo(() => {
        return [
            {
                text: LocalText.copy,
                onPress: onPressCopy,
                icon: Icon.Copy
            },
            {
                text: showFull ? LocalText.close : LocalText.view,
                onPress: onPressInAppWeb,
                icon: showFull ? Icon.X : Icon.Eye,
            },
            {
                favoriteBtn: {
                    callbackRef: favoriteCallbackRef,
                    id: selectingItem?.id,
                    category,
                }
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
                icon: Icon.ShareText
            },
        ] as BottomBarItem[]
    }, [showFull, onPressInAppWeb, selectingItem?.id, onPressNext, onPressCopy, onPressShareText])

    // for load data first time

    useEffect(() => {
        (async () => {
            reasonToReload.current = NeedReloadReason.None

            if (funWebsites) { // downloaded success
                setHandling(false)

                if (Array.isArray(funWebsites)) {
                    const res = await ToastNewItemsAsync(category, LocalText.new_item_website, funWebsites, theme)

                    if (res)
                        onPressNext(funWebsites[0].id, 'none')
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
    }, [funWebsites, errorDownloadJson])

    // on init once

    useEffect(() => {
        SetStreakAsync(Category[category])
    }, [])

    // update header setting btn

    useEffect(() => {
        navigation.setOptions({
            headerRight: () => <HeaderRightButtons />
        });
    }, [onPressHeaderOption])

    // save last visit category screen

    useFocusEffect(useCallback(() => SaveCurrentScreenForLoadNextTime(navigation), []))


    // introduce cat

    if (showIntroduceCat)
        return renderShowIntroduceCat()

    // main render

    return (
        <View pointerEvents={handling ? 'none' : 'auto'} style={[styleSheet.masterView, { backgroundColor: theme.background }]}>
            {/* @ts-ignore */}
            <ViewShot style={CommonStyles.flex_1} ref={viewShotRef} options={{ fileName: "Your-File-Name", format: "jpg", quality: 1 }}>
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
                                                <Text style={[{ color: theme.counterBackground, }, styleSheet.titleText]}>{shortUrl}</Text>
                                                <View style={[{ borderColor: theme.counterBackground, }, styleSheet.showListIconView]}>
                                                    <MaterialCommunityIcons name={Icon.List} color={theme.counterBackground} size={Size.Icon} />
                                                </View>
                                            </View>
                                            <Animated.View style={[{ transform: [{ scale: mediaViewScaleAnimRef }] }]}>
                                                <ImageBackgroundWithLoading
                                                    resizeMode='contain'
                                                    onLoad={onImageLoaded}
                                                    source={{ uri: selectingItem?.img }}
                                                    style={styleSheet.image}
                                                    indicatorProps={{ color: theme.counterBackground }} />
                                            </Animated.View>
                                            <TouchableOpacity onPress={onPressLink} style={styleSheet.titleTO}>
                                                <Text selectable style={[styleSheet.titleView, { color: theme.counterBackground, }]}>{selectingItem?.url}</Text>
                                                <MaterialCommunityIcons name={Icon.Link} color={theme.counterBackground} size={Size.IconSmaller} />
                                            </TouchableOpacity>
                                            {/* content */}
                                            <View style={styleSheet.contentScrollView}>
                                                <ScrollView >
                                                    <Text selectable adjustsFontSizeToFit style={[{ flexWrap: 'wrap', color: theme.counterBackground, fontSize: FontSize.Small_L }]}>{selectingItem?.desc}</Text>
                                                </ScrollView>
                                            </View>
                                            {/* author */}
                                            <Text numberOfLines={1} style={[{ color: theme.counterBackground }, styleSheet.authorText]}>{LocalText.credit_to_author}</Text>
                                            {
                                                !showFull || !selectingItem?.url ? undefined :
                                                    <View style={[CommonStyles.width100Percent_Height100Percent_PositionAbsolute_JustifyContentCenter_AlignItemsCenter]}>
                                                        <WebView
                                                            source={{ uri: selectingItem?.url }}
                                                            containerStyle={{ width: '100%', height: '100%' }}
                                                        />
                                                    </View>
                                            }
                                        </View>
                                }
                            </View>
                    }
                </View>
            </ViewShot>

            {/* main btn part */}
            <BottomBar items={bottomBarItems} />

            {
                isShowList && Array.isArray(funWebsites) ? <ListWebsite getSelectingIdAsync={getSelectingIdAsync} setIdx={(idx: number) => onPressNext(idx, 'menu')} list={funWebsites} /> : undefined
            }
            {
                streakData ? <StreakPopup streak={streakData} /> : undefined
            }
        </View>
    )
}

export default FunWebsitesScreen

const styleSheet = StyleSheet.create({
    masterView: { flex: 1, gap: Outline.GapVertical, },
    headerOptionTO: { marginRight: 15 },
    image: { width: widthPercentageToDP(100), height: heightPercentageToDP(50) },
    contentView: { flex: 1, gap: Outline.GapVertical, paddingTop: Outline.GapHorizontal },
    contentScrollView: { flex: 1, marginHorizontal: Outline.GapVertical_2 },
    authorText: { marginLeft: Outline.GapVertical, fontSize: FontSize.Small },
    titleView: { fontSize: FontSize.Normal, fontWeight: FontWeight.B500 },
    titleTO: { marginHorizontal: Outline.GapVertical_2, flexDirection: 'row', justifyContent: 'space-between' },
    titleText: { flex: 1, textAlign: 'center', fontSize: FontSize.Normal },
    titleContainerView: { paddingHorizontal: Outline.GapVertical, flexDirection: 'row', gap: Outline.GapHorizontal },
    showListIconView: { padding: Outline.GapHorizontal, borderWidth: StyleSheet.hairlineWidth, borderRadius: BorderRadius.BR8 },
})