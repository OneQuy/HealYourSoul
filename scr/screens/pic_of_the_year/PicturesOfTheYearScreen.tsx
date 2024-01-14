// @ts-ignore
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { View, Text, TouchableOpacity, Alert, StyleSheet, TouchableWithoutFeedback, ScrollView, NativeSyntheticEvent, ImageErrorEventData, ImageLoadEventData, StyleProp, ImageStyle, Dimensions, ActivityIndicator, ImageBackground, Linking, GestureResponderEvent } from 'react-native'
import React, { useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { ThemeContext } from '../../constants/Colors'
import { BorderRadius, Category, FontSize, FontWeight, Icon, LocalText, NeedReloadReason, Outline, Size, StorageKey_AwardPictureLastSeenIdxOfYear } from '../../constants/AppConstants'
import Share from 'react-native-share';
import RNFS from "react-native-fs";
import { useFocusEffect, useNavigation } from '@react-navigation/native'
import { TempDirName } from '../../handle/Utils'
import { SaveCurrentScreenForLoadNextTime, ToastTheme } from '../../handle/AppUtils'
import { CommonStyles } from '../../constants/CommonConstants'
import { GetStreakAsync, SetStreakAsync } from '../../handle/Streak';
import { PhotosOfTheYear, Streak } from '../../constants/Types';
import StreakPopup from '../components/StreakPopup';
import { ToCanPrint } from '../../handle/UtilsTS';
import { DownloadFileAsync, GetFLPFromRLP } from '../../handle/FileUtils';
import { SaveToGalleryAsync } from '../../handle/CameraRoll';
import { ToastOptions, toast } from '@baronha/ting';
import { NetLord } from '../../handle/NetLord';
import SelectAward from './SelectAward';
import useIsFavorited from '../../hooks/useIsFavorited';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { track_PressFavorite, track_PressNextPost, track_PressSaveMedia, track_PressYearOfAwardPicture, track_SimpleWithCat } from '../../handle/tracking/GoodayTracking';
import { SwipeResult, useSimpleGesture } from '../../hooks/useSimpleGesture';

const screen = Dimensions.get('screen')

const category = Category.AwardPicture
export const dataOfYears: PhotosOfTheYear[] = require('../../../assets/json/photos_of_the_year.json')

const PicturesOfTheYearScreen = () => {
    const navigation = useNavigation();
    const theme = useContext(ThemeContext);
    const [reasonToReload, setReasonToReload] = useState(NeedReloadReason.None);
    const [streakData, setStreakData] = useState<Streak | undefined>(undefined);
    const [selectingYear, setSelectingYear] = useState(dataOfYears[dataOfYears.length - 1].year)
    const [selectingPhotoIndex, setSelectingPhotoIndex] = useState(0)
    const [isShowAwardList, setIsShowLisShowAwardList] = useState(false)
    const [isShowLoadImageIndicator, setShowLoadImageIndicator] = useState(false)

    const selectingPhoto = useMemo(() => {
        const year = dataOfYears.find(y => y.year === selectingYear)
        return year?.list[selectingPhotoIndex]
    }, [selectingPhotoIndex, selectingYear])

    const selectingPhotoID = useMemo(() => {
        return Number.parseInt(selectingYear.toString() + selectingPhotoIndex.toString())
    }, [selectingPhotoIndex, selectingYear])

    const [isFavorited, likeCount, onPressFavoriteFromHook] = useIsFavorited(category, selectingPhotoID)

    const onPressFavorite = useCallback(() => {
        track_PressFavorite(category, !isFavorited)
        onPressFavoriteFromHook()
    }, [onPressFavoriteFromHook, isFavorited])

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
                    <MaterialCommunityIcons name={'crown'} color={theme.counterPrimary} size={Size.Icon} />
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

    const onPressHeaderOption = useCallback(async () => {
        if (streakData)
            setStreakData(undefined)
        else {
            const streak = await GetStreakAsync(Category[category])
            setStreakData(streak)
        }
    }, [streakData])

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
    }, [])

    const onImageError = useCallback((_: NativeSyntheticEvent<ImageErrorEventData>) => {
        setShowLoadImageIndicator(false)

        if (NetLord.IsAvailableLastestCheck())
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
            onPressFavorite()
        }
    }, [onPressFavorite])

    const [onBigViewStartTouch, onBigViewEndTouch] = useSimpleGesture(onTapCounted, onLongPressed, onSwiped)

    // auto select idx when update year

    useEffect(() => {
        (async () => {
            setSelectingPhotoIndex(await getLastSeenIdxOfYearAsync(selectingYear))
        })()
    }, [selectingYear])

    // on init once (for streak)

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
        <View style={[styleSheet.masterView, { backgroundColor: theme.background }]}>
            <View style={CommonStyles.flex_1} >
                <View style={CommonStyles.width100PercentHeight100Percent}>
                    {
                        reasonToReload !== NeedReloadReason.None ?
                            // error
                            <TouchableOpacity onPress={() => onPressNext(-1, 'none')} style={[{ gap: Outline.GapVertical }, CommonStyles.flex1_justifyContentCenter_AlignItemsCenter]} >
                                <MaterialCommunityIcons name={reasonToReload === NeedReloadReason.NoInternet ? Icon.NoInternet : Icon.HeartBroken} color={theme.primary} size={Size.IconBig} />
                                <Text style={{ fontSize: FontSize.Normal, color: theme.counterPrimary }}>{reasonToReload === NeedReloadReason.NoInternet ? LocalText.no_internet : LocalText.cant_get_content}</Text>
                                <Text style={{ fontSize: FontSize.Small_L, color: theme.counterPrimary }}>{LocalText.tap_to_retry}</Text>
                            </TouchableOpacity>
                            :
                            // content
                            <View style={[{ gap: Outline.GapHorizontal }, CommonStyles.width100PercentHeight100Percent]}>
                                <View>
                                    <ScrollView horizontal contentContainerStyle={[styleSheet.scrollYear]}>
                                        {
                                            dataOfYears.map((year) => {
                                                return <TouchableOpacity onPress={() => onPressYear(year.year)} style={[styleSheet.yearView, { backgroundColor: selectingYear === year.year ? theme.primary : undefined }]} key={year.year}>
                                                    <Text style={{ color: theme.text }}>{year.year}</Text>
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
                                    <Text style={[{ color: theme.text, }, styleSheet.rewardText]}>{selectingPhoto?.reward + (selectingPhoto?.category ? ' - ' + selectingPhoto?.category : '')}</Text>
                                    <View style={styleSheet.showListIconView}>
                                        <MaterialCommunityIcons name={Icon.List} color={theme.counterPrimary} size={Size.Icon} />
                                    </View>
                                </View>
                                {/* image */}
                                <TouchableWithoutFeedback onPressIn={onBigViewStartTouch} onPressOut={onBigViewEndTouch}
                                // onPress={() => onPressNext(-1, 'next')}
                                >
                                    <ImageBackground
                                        style={imageStyle}
                                        onLoadStart={onImageStartLoad}
                                        onLoad={onImageLoad}
                                        resizeMode='contain' onError={onImageError} source={{ uri: selectingPhoto?.imageUri }} >
                                        {
                                            !isShowLoadImageIndicator ? undefined :
                                                <View style={[{ backgroundColor: theme.background, }, CommonStyles.flex1_justifyContentCenter_AlignItemsCenter]}>
                                                    <ActivityIndicator color={theme.counterPrimary} style={{ marginRight: Outline.Horizontal }} />
                                                </View>
                                        }
                                    </ImageBackground>
                                </TouchableWithoutFeedback>
                                {/* title */}
                                <Text selectable style={[{ color: theme.text }, styleSheet.titleText]}>{selectingPhoto?.title}</Text>
                                {/* author */}
                                <Text onPress={onPressCredit} style={[{ color: theme.text }, styleSheet.authorText]}>📷 {selectingPhoto?.author + (selectingPhoto?.country ? ' (' + selectingPhoto?.country + ')' : '')}</Text>
                                {/* descitpion */}
                                {
                                    selectingPhoto?.description ?
                                        <ScrollView contentContainerStyle={styleSheet.descScrollView}>
                                            <Text selectable style={[{ color: theme.text }, styleSheet.descText]}>{selectingPhoto?.description}</Text>
                                        </ScrollView>
                                        :
                                        undefined
                                }
                            </View>
                    }
                </View>
            </View>
            <View style={styleSheet.mainButtonsView}>
                <TouchableOpacity onPress={onPressFavorite} style={{ flexDirection: 'row', gap: Outline.GapHorizontal, borderRadius: BorderRadius.BR8, paddingVertical: Outline.VerticalMini, flex: 1, backgroundColor: theme.primary, justifyContent: 'center', alignItems: 'center' }} >
                    <MaterialCommunityIcons name={!isFavorited ? "cards-heart-outline" : 'cards-heart'} color={theme.counterPrimary} size={Size.IconSmaller} />
                    {
                        Number.isNaN(likeCount) ? undefined :
                            <Text style={{ color: theme.text, fontSize: FontSize.Normal }}>{likeCount}</Text>
                    }
                </TouchableOpacity>
                <TouchableOpacity onPress={() => onPressNext(-1, 'next')} style={[{ gap: Outline.GapHorizontal, borderRadius: BorderRadius.BR8, backgroundColor: theme.primary, }, styleSheet.mainBtnTO]}>
                    <MaterialCommunityIcons name={Icon.Right} color={theme.counterPrimary} size={Size.Icon} />
                    <Text style={{ color: theme.text, fontSize: FontSize.Normal }}>{LocalText.next}</Text>
                </TouchableOpacity>
            </View>
            <View style={[{ marginBottom: Outline.GapVertical, gap: Outline.GapHorizontal }, CommonStyles.row_width100Percent]}>
                <TouchableOpacity onPress={onPressSaveToPhoto} style={[styleSheet.subBtnTO, { flex: 1.5, gap: Outline.GapHorizontal, borderRadius: BorderRadius.BR8 }]}>
                    <MaterialCommunityIcons name={Icon.Download} color={theme.counterPrimary} size={Size.IconSmaller} />
                    <Text style={{ color: theme.text, fontSize: FontSize.Small_L }}>{LocalText.save}</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={onPressShareImage} style={[styleSheet.subBtnTO, { flex: 1.5, gap: Outline.GapHorizontal, borderRadius: BorderRadius.BR8 }]}>
                    <MaterialCommunityIcons name={Icon.ShareImage} color={theme.counterPrimary} size={Size.IconSmaller} />
                    <Text style={{ color: theme.text, fontSize: FontSize.Small_L }}>{LocalText.share}</Text>
                </TouchableOpacity>
            </View>
            {
                isShowAwardList ? <SelectAward setIdx={(idx: number) => onPressNext(idx, 'menu')} year={selectingYear} selectIdx={selectingPhotoIndex} /> : undefined
            }
            {
                streakData ? <StreakPopup streak={streakData} /> : undefined
            }
        </View>
    )
}

export default PicturesOfTheYearScreen

const styleSheet = StyleSheet.create({
    masterView: { flex: 1, gap: Outline.GapVertical, },
    mainButtonsView: { gap: Outline.GapHorizontal, marginHorizontal: Outline.GapVertical_2, flexDirection: 'row' },
    mainBtnTO: { paddingVertical: Outline.GapVertical, flex: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', },
    subBtnTO: { justifyContent: 'center', flexDirection: 'row', flex: 1, alignItems: 'center', },
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