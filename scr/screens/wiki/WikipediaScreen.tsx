import { Share as RNShare, View, Text, TouchableOpacity, ActivityIndicator, StyleSheet, ShareContent, Linking, Animated } from 'react-native'
import React, { LegacyRef, useCallback, useContext, useDebugValue, useEffect, useMemo, useRef, useState } from 'react'
import { ThemeContext } from '../../constants/Colors'
import { Category, FontSize, FontWeight, Icon, LocalText, NeedReloadReason, Outline, Size } from '../../constants/AppConstants'


// @ts-ignore

// @ts-ignore
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { NetLord } from '../../handle/NetLord'
import { useFocusEffect, useNavigation } from '@react-navigation/native'
import { CopyAndToast, SaveCurrentScreenForLoadNextTime } from '../../handle/AppUtils'
import ViewShot from 'react-native-view-shot'
import { CommonStyles } from '../../constants/CommonConstants'
import { GetWikiAsync } from '../../handle/services/Wikipedia';
import { heightPercentageToDP } from 'react-native-responsive-screen';
import { ScrollView } from 'react-native-gesture-handler';
import WebView from 'react-native-webview';
import { ShareOptions } from 'react-native-share';
import ImageBackgroundWithLoading from '../components/ImageBackgroundWithLoading';
import { track_PressRandom, track_SimpleWithCat } from '../../handle/tracking/GoodayTracking';
import { SwipeResult, useSimpleGesture } from '../../hooks/useSimpleGesture';
import { playAnimLoadedMedia } from '../../handle/GoodayAnimation';
import BottomBar, { BottomBarItem } from '../others/BottomBar';
import HeaderRightButtons from '../components/HeaderRightButtons';
import useIntroduceCat from '../components/IntroduceCat';
import useDiversityItem from '../../hooks/useDiversityItem';
import { OnPressedNextItemDiversity } from '../diversity/TheDiversity';

const category = Category.Wikipedia

const WikipediaScreen = () => {
    const navigation = useNavigation();
    const reasonToReload = useRef<NeedReloadReason>(NeedReloadReason.None);
    const theme = useContext(ThemeContext);
    const [handling, setHandling] = useState(false);
    const [data, setData] = useState<object | undefined>(undefined);
    const [showFull, setShowFull] = useState(false);
    const viewShotRef = useRef<LegacyRef<ViewShot> | undefined>();
    const [showIntroduceCat, renderShowIntroduceCat] = useIntroduceCat(category)
    const mediaViewScaleAnimRef = useRef(new Animated.Value(1)).current

    const diversityItem = useDiversityItem(() => onPressRandom(false), undefined, undefined, undefined, data)

    const onImageLoaded = useCallback(() => {
        playAnimLoadedMedia(mediaViewScaleAnimRef)
    }, [])

    const currentContent = useMemo(() => {
        if (typeof data !== 'object')
            return undefined

        // @ts-ignore
        const text = data.extract

        if (typeof text === 'string')
            return text
        else
            return undefined
    }, [data])

    const currentTitle = useMemo(() => {
        if (typeof data !== 'object')
            return undefined

        return GetTitleFromWikipediaObject(data)
    }, [data])

    const currentThumbUri = useMemo(() => {
        if (typeof data !== 'object')
            return undefined

        return GetThumbUriFromWikipediaObject(data)
    }, [data])

    const currentLink = useMemo(() => {
        if (typeof data !== 'object')
            return undefined

        // @ts-ignore
        let text = data.content_urls?.mobile?.page

        if (typeof text === 'string')
            return text

        // @ts-ignore
        text = data.content_urls?.desktop?.page

        if (typeof text === 'string')
            return text
        else
            return undefined
    }, [data])

    const onPressLink = useCallback(async () => {
        if (!currentLink)
            return

        Linking.openURL(currentLink)
    }, [currentLink])

    const onPressRandom = useCallback(async (shouldTracking: boolean) => {
        reasonToReload.current = NeedReloadReason.None
        setHandling(true)
        setShowFull(false)

        let res: object | undefined

        if (diversityItem && diversityItem.wikipediaObject)
            res = diversityItem.wikipediaObject
        else
            res = await GetWikiAsync()

        setData(res)

        if (typeof res === 'object') { // success
        }
        else { // fail
            if (NetLord.IsAvailableLatestCheck())
                reasonToReload.current = NeedReloadReason.FailToGetContent
            else
                reasonToReload.current = NeedReloadReason.NoInternet
        }

        track_PressRandom(shouldTracking, category, res !== undefined)

        setHandling(false)
    }, [diversityItem])

    const onPressCopy = useCallback(() => {
        if (!currentContent)
            return

        track_SimpleWithCat(category, 'copy')

        const message = currentTitle + '\n\n' + currentContent + '\n\nLink: ' + currentLink
        CopyAndToast(message, theme)
    }, [currentTitle, currentLink, currentContent, theme])

    const onPressInAppWeb = useCallback(() => {
        if (!showFull)
            track_SimpleWithCat(category, 'open_inapp_web')

        setShowFull(!showFull)
    }, [showFull])

    const onPressShareText = useCallback(() => {
        if (!currentContent)
            return

        track_SimpleWithCat(category, 'share')

        RNShare.share({
            title: LocalText.fact_of_the_day,
            message: currentTitle + '\n\n' + currentContent + '\n\nLink: ' + currentLink,
        } as ShareContent,
            {
                tintColor: theme.primary,
            } as ShareOptions)
    }, [currentContent, currentTitle, currentLink, theme])

    // const onPressShareImage = useCallback(() => {
    //     if (!currentContent)
    //         return

    //     track_SimpleWithCat(category, 'share_as_image')

    //     const message = currentTitle + '\n\n' + currentContent + '\n\nLink: ' + currentLink

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
    // }, [currentTitle, currentContent, currentLink, theme])

    const onSwiped = useCallback((result: SwipeResult) => {
        if (!result.primaryDirectionIsHorizontalOrVertical)
            return

        const isNext = !result.primaryDirectionIsPositive

        if (diversityItem)
            OnPressedNextItemDiversity(isNext, diversityItem)
        else if (isNext)
            onPressRandom(true)
    }, [onPressRandom, diversityItem])

    const [onBigViewStartTouch, onBigViewEndTouch] = useSimpleGesture(undefined, undefined, onSwiped)

    const bottomBarItems = useMemo(() => {
        const btns = [
            // {
            //     text: LocalText.share_image,
            //     onPress: onPressShareImage,
            //     icon: Icon.ShareImage
            // },
            {
                text: LocalText.copy,
                onPress: onPressCopy,
                icon: Icon.Copy,
            },
            {
                text: showFull ? LocalText.close : LocalText.read_full,
                onPress: onPressInAppWeb,
                icon: showFull ? Icon.X : Icon.Eye
            },
            {
                text: LocalText.random,
                onPress: () => onPressRandom(true),
                icon: Icon.Dice,
            },
            {
                text: LocalText.share,
                onPress: onPressShareText,
                icon: Icon.ShareText,
            },
        ] as BottomBarItem[]

        // add navi btns when diversity mode

        if (diversityItem) {
            const naviBtns = [
                {
                    text: LocalText.previous,
                    onPress: () => OnPressedNextItemDiversity(false, diversityItem),
                    icon: Icon.Left,
                    scaleIcon: 1.5,
                },
                {
                    text: LocalText.next,
                    onPress: () => OnPressedNextItemDiversity(true, diversityItem),
                    icon: Icon.Right,
                    scaleIcon: 1.5,
                },
            ] as BottomBarItem[]

            const idxRandom = btns.findIndex(i => i.text === LocalText.random)

            btns.splice(idxRandom, 1, ...naviBtns)

            const readFull = btns[1]
            btns[1] = btns[2]
            btns[2] = readFull
        }

        // return 

        return btns
    }, [onPressRandom, diversityItem, onPressInAppWeb, onPressShareText, showFull, onPressCopy])

    // on init once (for load first post)

    useEffect(() => {
        onPressRandom(false)
    }, [])

    // update header setting btn

    useEffect(() => {
        navigation.setOptions({
            headerRight: () => <HeaderRightButtons
                diversityMode={diversityItem !== undefined}
                diversityItemData={handling ?
                    undefined :
                    {
                        cat: category,
                        wikipediaObject: data,
                    }}
            />
        });
    }, [handling, data, diversityItem])

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
                            // true ?
                            <View style={CommonStyles.flex1_justifyContentCenter_AlignItemsCenter}>
                                <ActivityIndicator color={theme.counterBackground} style={{ marginRight: Outline.Horizontal }} />
                            </View> :
                            <View style={CommonStyles.flex1_justifyContentCenter_AlignItemsCenter}>
                                {
                                    reasonToReload.current !== NeedReloadReason.None ?
                                        // true ?
                                        <TouchableOpacity onPress={() => onPressRandom(true)} style={[{ gap: Outline.GapVertical }, CommonStyles.flex1_justifyContentCenter_AlignItemsCenter]} >
                                            <MaterialCommunityIcons name={reasonToReload.current === NeedReloadReason.NoInternet ? Icon.NoInternet : Icon.HeartBroken} color={theme.counterBackground} size={Size.IconMedium} />
                                            <Text style={{ fontSize: FontSize.Normal, color: theme.counterBackground }}>{reasonToReload.current === NeedReloadReason.NoInternet ? LocalText.no_internet : LocalText.cant_get_content}</Text>
                                            <Text style={{ fontSize: FontSize.Small_L, color: theme.counterBackground }}>{LocalText.tap_to_retry}</Text>
                                        </TouchableOpacity>
                                        :
                                        <View onTouchStart={onBigViewStartTouch} onTouchEnd={onBigViewEndTouch} style={styleSheet.contentView}>
                                            <Animated.View style={[{ transform: [{ scale: mediaViewScaleAnimRef }] }, CommonStyles.justifyContentCenter_AlignItemsCenter]}>
                                                <ImageBackgroundWithLoading onLoad={onImageLoaded} resizeMode='contain' source={{ uri: currentThumbUri }} style={styleSheet.image} indicatorProps={{ color: theme.counterBackground }} />
                                            </Animated.View>
                                            <TouchableOpacity onPress={onPressLink} style={styleSheet.titleTO}>
                                                <Text selectable style={[styleSheet.titleView, { color: theme.counterBackground, }]}>{currentTitle}</Text>
                                                <MaterialCommunityIcons name={Icon.Link} color={theme.counterBackground} size={Size.IconSmaller} />
                                            </TouchableOpacity>
                                            <View style={styleSheet.contentScrollView}>
                                                <ScrollView >
                                                    <Text selectable adjustsFontSizeToFit style={[{ flexWrap: 'wrap', color: theme.counterBackground, fontSize: FontSize.Small_L }]}>{currentContent}</Text>
                                                </ScrollView>
                                            </View>
                                            <Text numberOfLines={1} style={[{ color: theme.counterBackground }, styleSheet.authorText]}>{LocalText.credit_to_author}</Text>
                                            {
                                                !showFull || !currentLink ? undefined :
                                                    <View style={[{ backgroundColor: 'green' }, CommonStyles.width100Percent_Height100Percent_PositionAbsolute_JustifyContentCenter_AlignItemsCenter]}>
                                                        <WebView
                                                            source={{ uri: currentLink }}
                                                            containerStyle={{ width: '100%', height: '100%', }}
                                                        />
                                                    </View>
                                            }
                                        </View>
                                }
                            </View>
                    }
                </View>
            </ViewShot>

            {/* main btns */}
            <BottomBar items={bottomBarItems} />
        </View>
    )
}

export default WikipediaScreen

const styleSheet = StyleSheet.create({
    masterView: { flex: 1, gap: Outline.GapVertical, },
    headerOptionTO: { marginRight: 15 },
    image: { width: '100%', height: heightPercentageToDP(30) },
    contentView: { flex: 1, gap: Outline.GapVertical },
    contentScrollView: { flex: 1, marginHorizontal: Outline.GapVertical_2 },
    authorText: { marginLeft: Outline.GapVertical, fontSize: FontSize.Small },
    titleView: { fontSize: FontSize.Normal, fontWeight: FontWeight.B500 },
    titleTO: { marginHorizontal: Outline.GapVertical_2, flexDirection: 'row', justifyContent: 'space-between' }
})

export const GetTitleFromWikipediaObject = (data: object) => {
    // @ts-ignore
    const text = data.title

    if (typeof text === 'string')
        return text
    else
        return undefined
}

export const GetThumbUriFromWikipediaObject = (data: object) => {
    // @ts-ignore
    const text = data.thumbnail?.source

    if (typeof text === 'string')
        return text
    else
        return undefined
}