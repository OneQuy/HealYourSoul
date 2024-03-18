import { View, Text, TouchableOpacity, ActivityIndicator, Alert, StyleSheet, Animated, NativeSyntheticEvent, ImageLoadEventData } from 'react-native'
import React, { useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'
import { ThemeContext } from '../../constants/Colors'
import { BorderRadius, Category, FontSize, Icon, LocalText, NeedReloadReason, Outline, Size } from '../../constants/AppConstants'
import Share from 'react-native-share';
import RNFS from "react-native-fs";

// @ts-ignore
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { NetLord } from '../../handle/NetLord'
import { useFocusEffect, useNavigation } from '@react-navigation/native'
import { TempDirName } from '../../handle/Utils'
import { SaveCurrentScreenForLoadNextTime, ToastTheme } from '../../handle/AppUtils'
import { CommonStyles } from '../../constants/CommonConstants'
import { DiversityItemType, RandomImage } from '../../constants/Types';
import { FilterOnlyLetterAndNumberFromString, IsValuableArrayOrString, ToCanPrint } from '../../handle/UtilsTS';
import { DownloadFileAsync, GetFLPFromRLP } from '../../handle/FileUtils';
import { SaveToGalleryAsync } from '../../handle/CameraRoll';
import { ToastOptions, toast } from '@baronha/ting';
import ImageAsMap from '../../handle/ImageAsMap';
import { track_PopupSelect, track_PressRandom, track_PressSaveMedia, track_SimpleWithCat } from '../../handle/tracking/GoodayTracking';
import { SwipeResult, useSimpleGesture } from '../../hooks/useSimpleGesture';
import { playAnimLoadedMedia } from '../../handle/GoodayAnimation';
import BottomBar, { BottomBarItem } from '../others/BottomBar';
import HeaderRightButtons from '../components/HeaderRightButtons';
import useDiversityItem from '../../hooks/useDiversityItem';
import { OnPressedNextItemDiversity } from '../diversity/TheDiversity';
import MiniIAP from '../components/MiniIAP';
import { widthPercentageToDP } from 'react-native-responsive-screen';
import PopupSelect, { PopupSelectItem } from '../components/PopupSelect';
import { GetNumberIntAsync, SetNumberAsync } from '../../handle/AsyncStorageUtils';

interface TheRandomImageProps {
    category: Category,
    getImageAsync?: () => Promise<RandomImage | undefined>,

    selectItems?: PopupSelectItem[],
    storageKeyCurrentItemIdxInPopupSelect?: string,
    getImageWithParamAsync?: (item: PopupSelectItem) => Promise<RandomImage | undefined>,
    popupSelectTitle?: string,
}

const TheRandomImage = ({
    category,
    getImageAsync,

    selectItems,
    storageKeyCurrentItemIdxInPopupSelect,
    getImageWithParamAsync,
    popupSelectTitle,
}: TheRandomImageProps) => {
    const navigation = useNavigation();
    const [currentItem, setCurrentItem] = useState<RandomImage | undefined>(undefined)
    const reasonToReload = useRef<NeedReloadReason>(NeedReloadReason.None);
    const theme = useContext(ThemeContext);
    const [handling, setHandling] = useState(false);
    const [isShowPopupSelect, setIsShowPopupSelect] = useState(false);
    const [currentPopupSelectedItem, setCurrentPopupSelectedItem] = useState<PopupSelectItem | undefined>(undefined);

    // animation

    const mediaViewScaleAnimRef = useRef(new Animated.Value(1)).current

    const diversityItem = useDiversityItem(() => onPressRandom(false), undefined, currentItem)

    // play loaded media anim

    const onLoadedImage = useCallback((_: NativeSyntheticEvent<ImageLoadEventData>) => {
        playAnimLoadedMedia(mediaViewScaleAnimRef)
    }, [])

    const getSavedCurrentPopupSelectItemIdx = useCallback(async () => {
        if (storageKeyCurrentItemIdxInPopupSelect)
            return await GetNumberIntAsync(storageKeyCurrentItemIdxInPopupSelect, 0)
        else
            return 0
    }, [])

    const saveCurrentPopupSelectItemIdxAndClose = useCallback(async (idx: number) => {
        if (!storageKeyCurrentItemIdxInPopupSelect || !selectItems || selectItems.length <= 0)
            return

        if (idx >= 0 && idx < selectItems.length) { }
        else
            idx = 0

        setCurrentPopupSelectedItem(selectItems[idx])

        await SetNumberAsync(storageKeyCurrentItemIdxInPopupSelect, idx)

        setIsShowPopupSelect(false)

        track_PopupSelect(category, FilterOnlyLetterAndNumberFromString(selectItems[idx].displayText))
    }, [])

    const onPressRandom = useCallback(async (shouldTracking: boolean) => {
        reasonToReload.current = NeedReloadReason.None
        setHandling(true)

        let item: RandomImage | undefined = undefined

        if (diversityItem)
            item = diversityItem.randomImage
        else {
            if (getImageAsync)
                item = await getImageAsync()
            else if (getImageWithParamAsync && currentPopupSelectedItem)
                item = await getImageWithParamAsync(currentPopupSelectedItem)
            else
                console.error('[ne] TheRandomImage-onPressRandom')
        }

        if (item) { // success
        }
        else { // fail
            if (NetLord.IsAvailableLatestCheck())
                reasonToReload.current = NeedReloadReason.FailToGetContent
            else
                reasonToReload.current = NeedReloadReason.NoInternet
        }

        track_PressRandom(shouldTracking, category, item !== undefined)

        setCurrentItem(item)
        setHandling(false)

    }, [diversityItem, currentPopupSelectedItem])

    const onPressSaveToPhoto = useCallback(async () => {
        if (!currentItem) {
            return
        }

        track_PressSaveMedia(category)

        const flp = RNFS.DocumentDirectoryPath + '/' + TempDirName + '/image.jpg'
        const res = await DownloadFileAsync(currentItem.uri, flp, false)

        if (res) {
            Alert.alert('Fail', ToCanPrint(res))
            return
        }

        const error = await SaveToGalleryAsync(flp)

        if (error !== null) { // error
            Alert.alert(LocalText.error, ToCanPrint(error));
        }
        else { // success
            const options: ToastOptions = {
                title: LocalText.saved,
                ...ToastTheme(theme, 'done')
            };

            toast(options);
        }
    }, [theme, currentItem])

    const onPressShareImage = useCallback(async () => {
        if (!currentItem)
            return

        track_SimpleWithCat(category, 'share')

        const flp = GetFLPFromRLP(TempDirName + '/image.jpg', true)
        const res = await DownloadFileAsync(currentItem.uri, flp, false)

        if (res) {
            Alert.alert('Fail', ToCanPrint(res))
            return
        }

        Share
            .open({
                url: flp,
                message: currentItem.title
            })
            .catch((err) => {
                const error = ToCanPrint(err)

                if (!error.includes('User did not share'))
                    Alert.alert('Fail', error)
            });
    }, [currentItem])

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

    // on init once (for load first post)

    useEffect(() => {
        if (!IsValuableArrayOrString(selectItems) || // popup select mode
            currentPopupSelectedItem) { // normal mode
            onPressRandom(false)
        }
    }, [currentPopupSelectedItem])

    // on init once (for set current selected item (if has select popup))

    useEffect(() => {
        (async () => {
            if (selectItems && selectItems.length > 0) {
                const idx = await getSavedCurrentPopupSelectItemIdx()
                if (idx >= 0 && idx < selectItems.length)
                    setCurrentPopupSelectedItem(selectItems[idx])
                else
                    setCurrentPopupSelectedItem(selectItems[0])
            }
        })()
    }, [])

    // on change theme

    useEffect(() => {
        let diversityItemData: DiversityItemType | undefined = undefined

        if (currentItem && !handling) {
            diversityItemData = {
                cat: category,
                randomImage: currentItem
            }
        }

        navigation.setOptions({
            headerRight: () => <HeaderRightButtons
                diversityItemData={diversityItemData} // for Saved btn
                diversityMode={diversityItem !== undefined}
            />
        })
    }, [handling, currentItem, diversityItem])

    // save last visit category screen

    useFocusEffect(useCallback(() => SaveCurrentScreenForLoadNextTime(navigation), []))

    const bottomBarItems = useMemo(() => {
        const btns = [
            {
                text: LocalText.share,
                onPress: onPressShareImage,
                icon: Icon.ShareImage
            },
            {
                text: LocalText.random,
                onPress: () => onPressRandom(true),
                icon: Icon.Dice
            },
            {
                text: LocalText.save,
                onPress: onPressSaveToPhoto,
                icon: Icon.Download
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
        }

        return btns
    }, [onPressRandom, onPressSaveToPhoto, onPressShareImage, diversityItem])

    const styleSheet = useMemo(() => {
        return StyleSheet.create({
            masterView: { flex: 1, gap: Outline.GapVertical, },
            titleText: { textAlign: 'center', fontSize: FontSize.Normal, paddingHorizontal: Outline.Horizontal, },
            contentView: { width: '100%', height: '100%', gap: Outline.GapVertical, paddingTop: Outline.GapHorizontal },
            headerOptionTO: { marginRight: 15 },
            imageTO: { flex: 1 },
            filterView: { marginHorizontal: Outline.GapVertical, justifyContent: 'center', alignItems: 'center', },
            filterCatTxt: { maxWidth: '100%', fontSize: FontSize.Small_L, color: theme.counterPrimary, },
            filterTO: { maxWidth: '100%', paddingHorizontal: 20, borderRadius: BorderRadius.BR8, justifyContent: 'center', alignItems: 'center', gap: Outline.GapHorizontal, padding: Outline.GapHorizontal, minWidth: widthPercentageToDP(20), flexDirection: 'row', backgroundColor: theme.primary },
            authorText: { marginLeft: Outline.GapVertical, fontSize: FontSize.Small, color: theme.counterBackground },
        })
    }, [theme])

    return (
        <View pointerEvents={handling ? 'none' : 'auto'} style={[styleSheet.masterView, { backgroundColor: theme.background }]}>
            {/* filter button */}
            {
                !diversityItem && Array.isArray(selectItems) && selectItems.length > 0 &&
                <View style={styleSheet.filterView}>
                    <TouchableOpacity onPress={() => setIsShowPopupSelect(true)} style={styleSheet.filterTO}>
                        <Text adjustsFontSizeToFit numberOfLines={1} style={styleSheet.filterCatTxt}>{currentPopupSelectedItem ? currentPopupSelectedItem.displayText : '...'}</Text>
                    </TouchableOpacity>
                </View>
            }

            <View style={CommonStyles.flex_1} >
                {
                    // true ?
                    handling ?
                        <View style={CommonStyles.flex1_justifyContentCenter_AlignItemsCenter}>
                            <ActivityIndicator color={theme.counterBackground} style={{ marginRight: Outline.Horizontal }} />
                        </View> :
                        <View style={CommonStyles.flex1_justifyContentCenter_AlignItemsCenter}>
                            {
                                // true ?
                                reasonToReload.current !== NeedReloadReason.None ?
                                    // error
                                    <TouchableOpacity onPress={() => onPressRandom(true)} style={[{ gap: Outline.GapVertical }, CommonStyles.flex1_justifyContentCenter_AlignItemsCenter]} >
                                        <MaterialCommunityIcons name={reasonToReload.current === NeedReloadReason.NoInternet ? Icon.NoInternet : Icon.HeartBroken} color={theme.counterBackground} size={Size.IconMedium} />
                                        <Text style={{ fontSize: FontSize.Normal, color: theme.counterBackground }}>{reasonToReload.current === NeedReloadReason.NoInternet ? LocalText.no_internet : LocalText.cant_get_content}</Text>
                                        <Text style={{ fontSize: FontSize.Small_L, color: theme.counterBackground }}>{LocalText.tap_to_retry}</Text>
                                    </TouchableOpacity>
                                    :
                                    // main
                                    <View style={styleSheet.contentView}>
                                        {/* title */}
                                        {
                                            !currentItem?.title ? undefined :
                                                <Text numberOfLines={3} style={[{ color: theme.counterBackground, }, styleSheet.titleText]}>{currentItem.title}</Text>
                                        }
                                        {/* image */}
                                        <Animated.View
                                            onTouchStart={onBigViewStartTouch}
                                            onTouchEnd={onBigViewEndTouch}
                                            style={[styleSheet.imageTO, { transform: [{ scale: mediaViewScaleAnimRef }] }]}
                                        >
                                            <ImageAsMap
                                                uri={currentItem?.uri}
                                                minScaleIsContainIfImageRatioOver={3}
                                                loadingIndicatorProps={{ color: theme.counterBackground }}
                                                notMinScaleCoverModeWhenImageIsLandscape={true}
                                                initialPointCenterByMapSizePercent={[0.5, 0]}
                                                onLoadedImage={onLoadedImage}
                                            />
                                        </Animated.View>
                                        {/* author */}
                                        <Text numberOfLines={1} style={styleSheet.authorText}>{LocalText.credit_to_author}</Text>
                                    </View>
                            }
                        </View>
                }
            </View>

            {/* main btn part */}

            <BottomBar
                items={bottomBarItems}
                category={category}
            />

            {/* popup select */}

            {
                isShowPopupSelect && selectItems &&
                <PopupSelect
                    title={popupSelectTitle ?? LocalText.select_type}
                    cat={category}
                    list={selectItems}
                    setSelectingIdxAndClose={saveCurrentPopupSelectItemIdxAndClose}
                    getSelectingIdxAsync={getSavedCurrentPopupSelectItemIdx}
                />
            }

            <MiniIAP postID={currentItem?.uri} />
        </View>
    )
}

export default TheRandomImage