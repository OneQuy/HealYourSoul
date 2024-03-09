// @ts-ignore
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { View, Text, TouchableOpacity, Alert, StyleSheet, TouchableWithoutFeedback, ScrollView, NativeSyntheticEvent, ImageErrorEventData, ImageLoadEventData, StyleProp, ImageStyle, Dimensions, ActivityIndicator, ImageBackground, Linking, GestureResponderEvent, Animated } from 'react-native'
import React, { useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'
import { ThemeContext } from '../../constants/Colors'
import { BorderRadius, Category, FontSize, FontWeight, Icon, LocalText, NeedReloadReason, Outline, Size, StorageKey_AwardPictureLastSeenIdxOfYear } from '../../constants/AppConstants'
import Share from 'react-native-share';
import RNFS from "react-native-fs";
import { useFocusEffect, useNavigation } from '@react-navigation/native'
import { TempDirName } from '../../handle/Utils'
import { SaveCurrentScreenForLoadNextTime, ToastTheme } from '../../handle/AppUtils'
import { CommonStyles } from '../../constants/CommonConstants'
import { PhotosOfTheYear } from '../../constants/Types';
import { ToCanPrint } from '../../handle/UtilsTS';
import { DownloadFileAsync, GetFLPFromRLP } from '../../handle/FileUtils';
import { SaveToGalleryAsync } from '../../handle/CameraRoll';
import { ToastOptions, toast } from '@baronha/ting';
import { NetLord } from '../../handle/NetLord';
import SelectAward from './SelectAward';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { track_PressNextPost, track_PressSaveMedia, track_PressYearOfAwardPicture, track_SimpleWithCat } from '../../handle/tracking/GoodayTracking';
import { SwipeResult, useSimpleGesture } from '../../hooks/useSimpleGesture';
import { playAnimLoadedMedia } from '../../handle/GoodayAnimation';
import BottomBar, { BottomBarItem } from '../others/BottomBar';
import HeaderRightButtons from '../components/HeaderRightButtons';
import useIntroduceCat from '../components/IntroduceCat';
import ViewCount from '../components/ViewCount';
import MiniIAP from '../components/MiniIAP';

const BGAnim = Animated.createAnimatedComponent(ImageBackground)

const screen = Dimensions.get('screen')

const category = Category.AwardPicture
export const dataOfYears: PhotosOfTheYear[] = require('../../../assets/json/photos_of_the_year.json')

const PicturesOfTheYearScreen = () => {
    const navigation = useNavigation();
    const theme = useContext(ThemeContext);
    const [reasonToReload, setReasonToReload] = useState(NeedReloadReason.None);
    const [selectingYear, setSelectingYear] = useState(dataOfYears[dataOfYears.length - 1].year)
    const [selectingPhotoIndex, setSelectingPhotoIndex] = useState(0)
    const [isShowAwardList, setIsShowLisShowAwardList] = useState(false)
    const [isShowLoadImageIndicator, setShowLoadImageIndicator] = useState(false)
    const favoriteCallbackRef = useRef<(() => void) | undefined>(undefined);
    const [showIntroduceCat, renderShowIntroduceCat] = useIntroduceCat(category)

    const selectingPhoto = useMemo(() => {
        const year = dataOfYears.find(y => y.year === selectingYear)
        return year?.list[selectingPhotoIndex]
    }, [selectingPhotoIndex, selectingYear])

    const mediaViewScaleAnimRef = useRef(new Animated.Value(1)).current

    const selectingPhotoID = useMemo(() => {
        return Number.parseInt(selectingYear.toString() + selectingPhotoIndex.toString())
    }, [selectingPhotoIndex, selectingYear])

    const renderIconReward = useCallback(() => {
        if (!selectingPhoto)
            return undefined

        if (!selectingPhoto.reward.includes('Grand') &&
            !selectingPhoto.reward.includes('Place'))
            return undefined

        let positionText = '1'
        let color = 'gold'

        if (selectingPhoto.reward.includes('First Place')) {
            positionText = '1'
            color = 'tomato'
        }
        else if (selectingPhoto.reward.includes('Second Place')) {
            positionText = '2'
            color = 'yellowgreen'
        }
        else if (selectingPhoto.reward.includes('Third Place')) {
            positionText = '3'
            color = 'sandybrown'
        }

        return <View style={[{ backgroundColor: color }, styleSheet.rewardIconView, CommonStyles.justifyContentCenter_AlignItemsCenter]}>
            {
                selectingPhoto?.reward.includes('Grand') ?
                    <MaterialCommunityIcons name={'crown'} color={'black'} size={Size.Icon} />
                    :
                    <Text style={[styleSheet.rewaredPositionText]}>{positionText}</Text>
            }
        </View>
    }, [selectingPhoto])

    const onPressYear = useCallback(async (year: number) => {
        track_PressYearOfAwardPicture(year.toString())
        setSelectingYear(year)
    }, [])

    const onPressNext = useCallback(async (idx: number = -1, trackingTarget: 'none' | 'next' | 'menu') => {
        if (trackingTarget === 'next')
            track_PressNextPost(true, category, true)

        setReasonToReload(NeedReloadReason.None)

        const year = dataOfYears.find(y => y.year === selectingYear)

        if (!year)
            return

        let targetIdx = selectingPhotoIndex

        if (idx < 0) {
            if (selectingPhotoIndex < year.list.length - 1)
                targetIdx++
            else
                targetIdx = 0
        }
        else
            targetIdx = idx

        setSelectingPhotoIndex(targetIdx)
        AsyncStorage.setItem(StorageKey_AwardPictureLastSeenIdxOfYear(selectingYear), targetIdx.toString())

        if (isShowAwardList)
            setIsShowLisShowAwardList(false)
    }, [selectingYear, selectingPhotoIndex, isShowAwardList])

    const onPressSaveToPhoto = useCallback(async () => {
        if (!selectingPhoto) {
            return
        }

        track_PressSaveMedia(category)

        const flp = RNFS.DocumentDirectoryPath + '/' + TempDirName + '/image.jpg'
        const res = await DownloadFileAsync(selectingPhoto.imageUri, flp, false)

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
    }, [theme, selectingPhoto])

    const onImageStartLoad = useCallback(() => {
        setShowLoadImageIndicator(true)
    }, [])

    const onPressCredit = useCallback(() => {
        Linking.openURL(`https://www.nature.org/en-us/get-involved/how-to-help/photo-contest/${selectingYear}-winners/`)
    }, [selectingYear])

    const onImageLoad = useCallback((_: NativeSyntheticEvent<ImageLoadEventData>) => {
        setShowLoadImageIndicator(false)

        playAnimLoadedMedia(mediaViewScaleAnimRef)
    }, [])

    const onImageError = useCallback((_: NativeSyntheticEvent<ImageErrorEventData>) => {
        setShowLoadImageIndicator(false)

        if (NetLord.IsAvailableLatestCheck())
            setReasonToReload(NeedReloadReason.FailToGetContent)
        else
            setReasonToReload(NeedReloadReason.NoInternet)
    }, [])

    const imageStyle = useMemo<StyleProp<ImageStyle>>(() => {
        if (!selectingPhoto || !selectingPhoto.description)
            return { flex: 1 }

        const wordCount = selectingPhoto.description.split(' ').length
        const estLines = Math.ceil(wordCount / 12)

        return { width: '100%', height: screen.height * (estLines > 2 ? 0.35 : 0.4) }
    }, [selectingPhoto])

    const onPressShareImage = useCallback(async () => {
        if (!selectingPhoto)
            return

        track_SimpleWithCat(category, 'share')

        const flp = GetFLPFromRLP(TempDirName + '/image.jpg', true)
        const res = await DownloadFileAsync(selectingPhoto.imageUri, flp, false)

        if (res) {
            Alert.alert('Fail', ToCanPrint(res))
            return
        }

        let msg = '"' + selectingPhoto.title + '"'

        msg += '\n'
        msg += '📷 ' + selectingPhoto?.author + (selectingPhoto?.country ? ' (' + selectingPhoto?.country + ')' : '')

        msg += '\n\n'
        msg += "[" + selectingPhoto.reward + (selectingPhoto?.category ? ' - ' + selectingPhoto?.category : '') + "]"

        msg += '\n\n'
        msg += selectingPhoto.description

        console.log(msg);

        Share
            .open({
                message: msg,
                url: flp,
            })
            .catch((err) => {
                const error = ToCanPrint(err)

                if (!error.includes('User did not share'))
                    Alert.alert('Fail', error)
            });
    }, [selectingPhoto])

    const onSwiped = useCallback((result: SwipeResult) => {
        if (result.primaryDirectionIsHorizontalOrVertical && !result.primaryDirectionIsPositive) {
            onPressNext(-1, 'next')
        }
    }, [onPressNext])

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
                text: LocalText.share,
                onPress: onPressShareImage,
                icon: Icon.ShareImage,
                countType: 'share',
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
                text: LocalText.save,
                onPress: onPressSaveToPhoto,
                icon: Icon.Download,
                countType: 'download',
            }
        ] as BottomBarItem[]
    }, [onPressShareImage, onPressSaveToPhoto, selectingPhotoID, onPressNext])

    // auto select idx when update year

    useEffect(() => {
        (async () => {
            setSelectingPhotoIndex(await getLastSeenIdxOfYearAsync(selectingYear))
        })()
    }, [selectingYear])

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

    // main render

    return (
        <View style={[styleSheet.masterView, { backgroundColor: theme.background }]}>
            <View style={CommonStyles.flex_1} >
                <View style={CommonStyles.width100PercentHeight100Percent}>
                    {
                        reasonToReload !== NeedReloadReason.None ?
                            // error
                            <TouchableOpacity onPress={() => onPressNext(-1, 'none')} style={[{ gap: Outline.GapVertical }, CommonStyles.flex1_justifyContentCenter_AlignItemsCenter]} >
                                <MaterialCommunityIcons name={reasonToReload === NeedReloadReason.NoInternet ? Icon.NoInternet : Icon.HeartBroken} color={theme.counterBackground} size={Size.IconMedium} />
                                <Text style={{ fontSize: FontSize.Normal, color: theme.counterBackground }}>{reasonToReload === NeedReloadReason.NoInternet ? LocalText.no_internet : LocalText.cant_get_content}</Text>
                                <Text style={{ fontSize: FontSize.Small_L, color: theme.counterBackground }}>{LocalText.tap_to_retry}</Text>
                            </TouchableOpacity>
                            :
                            // content
                            <View style={[{ gap: Outline.GapHorizontal }, CommonStyles.width100PercentHeight100Percent]}>
                                <View>
                                    <ScrollView horizontal contentContainerStyle={[styleSheet.scrollYear]}>
                                        {
                                            dataOfYears.map((year) => {
                                                const isFocus = selectingYear === year.year

                                                return <TouchableOpacity onPress={() => onPressYear(year.year)} style={[styleSheet.yearView, { borderColor: theme.primary, backgroundColor: isFocus ? theme.primary : undefined }]} key={year.year}>
                                                    <Text style={{ color: isFocus ? theme.counterPrimary : theme.counterBackground }}>{year.year}</Text>
                                                </TouchableOpacity>
                                            })
                                        }
                                    </ScrollView>
                                </View>
                                {/* reward name */}
                                <View onTouchEnd={() => setIsShowLisShowAwardList(true)} style={[styleSheet.rewardContainerView, CommonStyles.justifyContentCenter_AlignItemsCenter]}>
                                    {
                                        renderIconReward()
                                    }
                                    <Text style={[{ color: theme.counterBackground, }, styleSheet.rewardText]}>{selectingPhoto?.reward + (selectingPhoto?.category ? ' - ' + selectingPhoto?.category : '')}</Text>
                                    <View style={[{ borderColor: theme.counterBackground }, styleSheet.showListIconView]}>
                                        <MaterialCommunityIcons name={Icon.List} color={theme.counterBackground} size={Size.Icon} />
                                    </View>
                                </View>
                                {/* image */}
                                <TouchableWithoutFeedback onPressIn={onBigViewStartTouch} onPressOut={onBigViewEndTouch}
                                // onPress={() => onPressNext(-1, 'next')}
                                >
                                    <BGAnim
                                        style={[{ transform: [{ scale: mediaViewScaleAnimRef }] }, imageStyle]}
                                        onLoadStart={onImageStartLoad}
                                        onLoad={onImageLoad}
                                        resizeMode='contain' onError={onImageError} source={{ uri: selectingPhoto?.imageUri }} >
                                        {
                                            !isShowLoadImageIndicator ? undefined :
                                                <View style={[{ backgroundColor: theme.background, }, CommonStyles.flex1_justifyContentCenter_AlignItemsCenter]}>
                                                    <ActivityIndicator color={theme.counterBackground} style={{ marginRight: Outline.Horizontal }} />
                                                </View>
                                        }
                                    </BGAnim>
                                </TouchableWithoutFeedback>
                                {/* title */}
                                <Text selectable style={[{ color: theme.counterBackground }, styleSheet.titleText]}>{selectingPhoto?.title}</Text>
                                {/* author */}
                                <Text onPress={onPressCredit} style={[{ color: theme.counterBackground }, styleSheet.authorText]}>📷 {selectingPhoto?.author + (selectingPhoto?.country ? ' (' + selectingPhoto?.country + ')' : '')}</Text>
                                {/* descitpion */}
                                {
                                    selectingPhoto?.description ?
                                        <ScrollView contentContainerStyle={styleSheet.descScrollView}>
                                            <Text selectable style={[{ color: theme.counterBackground }, styleSheet.descText]}>{selectingPhoto?.description}</Text>
                                        </ScrollView>
                                        :
                                        undefined
                                }
                                {/* view count */}
                                <View style={{ marginRight: Outline.GapVertical, alignItems: 'flex-end', }}>
                                    <ViewCount cat={category} id={selectingPhotoID} />
                                </View>
                            </View>
                    }
                </View>
            </View>

            {/* main btn part */}
            <BottomBar
                items={bottomBarItems}
                id={selectingPhotoID}
                category={category}
            />

            {
                isShowAwardList ? <SelectAward setIdx={(idx: number) => onPressNext(idx, 'menu')} year={selectingYear} selectIdx={selectingPhotoIndex} /> : undefined
            }

            <MiniIAP postID={selectingPhotoID} />
        </View>
    )
}

export default PicturesOfTheYearScreen

const styleSheet = StyleSheet.create({
    masterView: { flex: 1, gap: Outline.GapVertical, },
    headerOptionTO: { marginRight: 15 },
    rewardText: { flex: 1, fontWeight: FontWeight.B600, textAlign: 'center', fontSize: FontSize.Normal },
    rewardContainerView: { paddingHorizontal: Outline.GapVertical, flexDirection: 'row', gap: Outline.GapHorizontal },
    titleText: { fontWeight: FontWeight.B600, textAlign: 'center', fontSize: FontSize.Small_L },
    rewaredPositionText: { fontWeight: FontWeight.B600, textAlign: 'center', fontSize: FontSize.Normal, color: 'white' },
    authorText: { textAlign: 'center', fontSize: FontSize.Small_L },
    descText: { textAlign: 'center', fontSize: FontSize.Small },
    scrollYear: { gap: Outline.Horizontal, paddingLeft: Outline.GapVertical, paddingTop: Outline.GapVertical, },
    yearView: { padding: Outline.GapHorizontal, borderRadius: BorderRadius.BR8, borderWidth: StyleSheet.hairlineWidth },
    rewardIconView: { padding: Outline.VerticalMini },
    descScrollView: { paddingHorizontal: Outline.GapVertical },
    showListIconView: { padding: Outline.GapHorizontal, borderWidth: StyleSheet.hairlineWidth, borderRadius: BorderRadius.BR8 },
})

const getLastSeenIdxOfYearAsync = async (year: number) => {
    const res = await AsyncStorage.getItem(StorageKey_AwardPictureLastSeenIdxOfYear(year))
    return res === null ? 0 : Number.parseInt(res)
}