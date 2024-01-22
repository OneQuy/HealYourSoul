import { View, Text, TouchableOpacity, ActivityIndicator, Alert, StyleSheet, Animated, NativeSyntheticEvent, ImageLoadEventData } from 'react-native'
import React, { useCallback, useContext, useEffect, useLayoutEffect, useRef, useState } from 'react'
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
import { GetStreakAsync, SetStreakAsync } from '../../handle/Streak';
import { RandomImage, Streak } from '../../constants/Types';
import StreakPopup from '../components/StreakPopup';
import { ToCanPrint } from '../../handle/UtilsTS';
import { DownloadFileAsync, GetFLPFromRLP } from '../../handle/FileUtils';
import { SaveToGalleryAsync } from '../../handle/CameraRoll';
import { ToastOptions, toast } from '@baronha/ting';
import ImageAsMap from '../../handle/ImageAsMap';
import { track_PressRandom, track_PressSaveMedia, track_SimpleWithCat } from '../../handle/tracking/GoodayTracking';
import { SwipeResult, useSimpleGesture } from '../../hooks/useSimpleGesture';
import { playAnimLoadedMedia } from '../../handle/GoodayAnimation';

interface TheRandomImageProps {
    category: Category,
    getImageAsync: () => Promise<RandomImage | undefined>
}

const TheRandomImage = ({
    category,
    getImageAsync,
}: TheRandomImageProps) => {
    const navigation = useNavigation();
    const [currentItem, setCurrentItem] = useState<RandomImage | undefined>(undefined)
    const reasonToReload = useRef<NeedReloadReason>(NeedReloadReason.None);
    const theme = useContext(ThemeContext);
    const [handling, setHandling] = useState(false);
    const [streakData, setStreakData] = useState<Streak | undefined>(undefined);

    // animation

    const mediaViewScaleAnimRef = useRef(new Animated.Value(1)).current

    // play loaded media anim

    const onLoadedImage = useCallback((_: NativeSyntheticEvent<ImageLoadEventData>) => {
        playAnimLoadedMedia(mediaViewScaleAnimRef)
    }, [])

    const onPressRandom = useCallback(async (shouldTracking: boolean) => {
        reasonToReload.current = NeedReloadReason.None
        setHandling(true)

        const item = await getImageAsync()

        if (item) { // success
            SetStreakAsync(Category[category], -1)
        }
        else { // fail
            if (NetLord.IsAvailableLastestCheck())
                reasonToReload.current = NeedReloadReason.FailToGetContent
            else
                reasonToReload.current = NeedReloadReason.NoInternet
        }

        track_PressRandom(shouldTracking, category, item !== undefined)

        setCurrentItem(item)
        setHandling(false)

    }, [])

    const onPressHeaderOption = useCallback(async () => {
        if (streakData)
            setStreakData(undefined)
        else {
            const streak = await GetStreakAsync(Category[category])
            setStreakData(streak)
        }
    }, [streakData])

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
        if (result.primaryDirectionIsHorizontalOrVertical && !result.primaryDirectionIsPositive) {
            onPressRandom(true)
        }
    }, [])

    const [onBigViewStartTouch, onBigViewEndTouch] = useSimpleGesture(undefined, undefined, onSwiped)

    // on init once (for load first post)

    useEffect(() => {
        SetStreakAsync(Category[category])
        onPressRandom(false)
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
            <View style={CommonStyles.flex_1} >
                {
                    handling ?
                        // true ?
                        <View style={CommonStyles.flex1_justifyContentCenter_AlignItemsCenter}>
                            <ActivityIndicator color={theme.counterPrimary} style={{ marginRight: Outline.Horizontal }} />
                        </View> :
                        <View style={CommonStyles.flex1_justifyContentCenter_AlignItemsCenter}>
                            {
                                reasonToReload.current !== NeedReloadReason.None ?
                                    // true ?
                                    <TouchableOpacity onPress={() => onPressRandom(true)} style={[{ gap: Outline.GapVertical }, CommonStyles.flex1_justifyContentCenter_AlignItemsCenter]} >
                                        <MaterialCommunityIcons name={reasonToReload.current === NeedReloadReason.NoInternet ? Icon.NoInternet : Icon.HeartBroken} color={theme.primary} size={Size.IconBig} />
                                        <Text style={{ fontSize: FontSize.Normal, color: theme.counterPrimary }}>{reasonToReload.current === NeedReloadReason.NoInternet ? LocalText.no_internet : LocalText.cant_get_content}</Text>
                                        <Text style={{ fontSize: FontSize.Small_L, color: theme.counterPrimary }}>{LocalText.tap_to_retry}</Text>
                                    </TouchableOpacity>
                                    :
                                    <View style={styleSheet.contentView}>
                                        {
                                            !currentItem?.title ? undefined :
                                                <Text numberOfLines={3} style={[{ color: theme.text, }, styleSheet.titleText]}>{currentItem.title}</Text>
                                        }
                                        <Animated.View
                                            onTouchStart={onBigViewStartTouch}
                                            onTouchEnd={onBigViewEndTouch}
                                            style={[styleSheet.imageTO, { transform: [{ scale: mediaViewScaleAnimRef }] }]}
                                        // onTouchEnd={onPressRandom}
                                        >
                                            <ImageAsMap
                                                uri={currentItem?.uri}
                                                minScaleIsContainIfImageRatioOver={3}
                                                loadingIndicatorProps={{ color: theme.text }}
                                                notMinScaleCoverModeWhenImageIsLandscape={true}
                                                initialPointCenterByMapSizePercent={[0.5, 0]}
                                                onLoadedImage={onLoadedImage}
                                            />
                                        </Animated.View>
                                    </View>
                            }
                        </View>
                }
            </View>
            <View style={{ marginHorizontal: Outline.GapVertical_2 }}>
                <TouchableOpacity onPress={() => onPressRandom(true)} style={[{ gap: Outline.GapHorizontal, borderRadius: BorderRadius.BR8, padding: Outline.GapVertical_2, backgroundColor: theme.primary, }, styleSheet.randomTO]}>
                    <MaterialCommunityIcons name={Icon.Dice} color={theme.counterPrimary} size={Size.Icon} />
                    <Text style={{ color: theme.text, fontSize: FontSize.Normal }}>{LocalText.random}</Text>
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
                streakData ? <StreakPopup streak={streakData} /> : undefined
            }
        </View>
    )
}

export default TheRandomImage

const styleSheet = StyleSheet.create({
    masterView: { flex: 1, gap: Outline.GapVertical, },
    titleText: { textAlign: 'center', fontSize: FontSize.Normal, paddingHorizontal: Outline.Horizontal, },
    contentView: { width: '100%', height: '100%', gap: Outline.GapVertical, paddingTop: Outline.GapHorizontal },
    randomTO: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', width: '100%' },
    subBtnTO: { justifyContent: 'center', flexDirection: 'row', flex: 1, alignItems: 'center', },
    headerOptionTO: { marginRight: 15 },
    image: { width: '100%', height: '100%' },
    imageTO: { flex: 1 },
})