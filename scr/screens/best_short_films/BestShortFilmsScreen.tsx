import { Share as RNShare, View, Text, TouchableOpacity, ActivityIndicator, StyleSheet, ShareContent, Alert, Linking } from 'react-native'
import React, { LegacyRef, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'
import { ThemeContext } from '../../constants/Colors'
import { BorderRadius, Category, FontSize, FontWeight, Icon, LocalText, NeedReloadReason, Outline, Size, StorageKey_AwardPictureLastSeenIdxOfYear, StorageKey_LocalFileVersion, StorageKey_SelectingShortFilmIdx } from '../../constants/AppConstants'
import Share from 'react-native-share';


// @ts-ignore
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

// @ts-ignore
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { NetLord } from '../../handle/NetLord'
import { Link, useFocusEffect, useNavigation } from '@react-navigation/native'
import { CopyAndToast, SaveCurrentScreenForLoadNextTime } from '../../handle/AppUtils'
import ViewShot from 'react-native-view-shot'
import { CommonStyles } from '../../constants/CommonConstants'
import { GetStreakAsync, SetStreakAsync } from '../../handle/Streak';
import { Streak, ShortFilm } from '../../constants/Types';
import StreakPopup from '../components/StreakPopup';
import { heightPercentageToDP, widthPercentageToDP } from 'react-native-responsive-screen';
import { ScrollView } from 'react-native-gesture-handler';
import { ShareOptions } from 'react-native-share';
import { Clamp, ToCanPrint, GetFirstLetters, ExtractAllNumbersInText, RGBToRGBAText, IsChar, IsNumChar } from '../../handle/UtilsTS';
import ImageBackgroundWithLoading from '../components/ImageBackgroundWithLoading';
import useCheckAndDownloadRemoteFile from '../../hooks/useCheckAndDownloadRemoteFile';
import { RandomInt, TempDirName } from '../../handle/Utils';
import { GetRemoteFileConfigVersion } from '../../handle/AppConfigHandler';
import AsyncStorage from '@react-native-async-storage/async-storage';
import useIsFavorited from '../../hooks/useIsFavorited';
import ListMovie from './SelectShortFilms';
import { DownloadFileAsync, GetFLPFromRLP } from '../../handle/FileUtils';
import WebView from 'react-native-webview';
import { track_PressRandom } from '../../handle/tracking/GoodayTracking';

const category = Category.BestShortFilms
const fileURL = 'https://firebasestorage.googleapis.com/v0/b/warm-379a6.appspot.com/o/file_configs%2Fshort_films.json?alt=media&token=537eec8b-f774-4908-a5fa-45f8daf676d8'

const BestShortFilmsScreen = () => {
    const navigation = useNavigation();
    const reasonToReload = useRef<NeedReloadReason>(NeedReloadReason.None);
    const theme = useContext(ThemeContext);
    const [handling, setHandling] = useState(true)
    const [streakData, setStreakData] = useState<Streak | undefined>(undefined)
    const [selectingItem, setSelectingItem] = useState<ShortFilm | undefined>(undefined)
    const [isShowList, setIsShowList] = useState(false)
    const viewShotRef = useRef<LegacyRef<ViewShot> | undefined>();
    const [showFull, setShowFull] = useState(false);

    const [shortFilms, errorDownloadJson, _, reUpdateData] = useCheckAndDownloadRemoteFile<ShortFilm[]>(
        fileURL,
        TempDirName + '/short_films.json',
        true,
        GetRemoteFileConfigVersion('short_films'),
        'json',
        false,
        async () => AsyncStorage.getItem(StorageKey_LocalFileVersion(category)),
        async () => AsyncStorage.setItem(StorageKey_LocalFileVersion(category), GetRemoteFileConfigVersion('short_films').toString()))

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

    const [isFavorited, likeCount, onPressFavorite] = useIsFavorited(category, idCurrent)

    const getSelectingIdxAsync = useCallback(async () => {
        const s = await AsyncStorage.getItem(StorageKey_SelectingShortFilmIdx)
        return typeof s === 'string' ? Number.parseInt(s) : -1
    }, [])

    const setSelectingIdxAsync = useCallback(async (id: number) => {
        await AsyncStorage.setItem(StorageKey_SelectingShortFilmIdx, id.toString())
    }, [])

    const onPressNext = useCallback(async (toIdx: number = -1) => {
        setSelectingItem(undefined)
        setIsShowList(false)
        setShowFull(false)

        if (!Array.isArray(shortFilms)) {
            reUpdateData()
            setHandling(true)
            return
        }

        let idx = toIdx

        if (idx < 0) {
            idx = await getSelectingIdxAsync()
            idx++
        }

        idx = Clamp(idx, 0, shortFilms.length - 1)

        let movie = shortFilms[idx]

        setSelectingIdxAsync(idx)

        setSelectingItem(movie)

        SetStreakAsync(Category[category], -1)
    }, [shortFilms, reUpdateData])

    const onPressOpenYoutubeApp = useCallback(async () => {
        if (!selectingItem)
            return

        let url = selectingItem.url
        let idx = url.indexOf('=')

        if (idx < 0)
            idx = url.lastIndexOf('/')

        if (idx < 0)
            return

        url = 'youtube://' + url.substring(idx + 1)
        const can = await Linking.canOpenURL(url)

        if (can)
            Linking.openURL(url)

        console.log(url);

    }, [selectingItem])
    
    const onPressRandom = useCallback(async () => {
        track_PressRandom(true, category, undefined)

        if (!Array.isArray(shortFilms)) {
            onPressNext()
            return
        }

        onPressNext(RandomInt(0, shortFilms.length - 1))
    }, [shortFilms, onPressNext])

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

    const onPressShareImage = useCallback(() => {
        if (!selectingItem)
            return


        const message =
            selectingItem.name +
            (selectingItem.author ? ' (' + selectingItem.author + '): ' : ': ') +
            selectingItem.desc + '\n\n' +
            selectingItem.url

        console.log(message);

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

    // for load data

    useEffect(() => {
        reasonToReload.current = NeedReloadReason.None

        if (shortFilms) { // downloaded success
            setHandling(false)
            onPressNext()
        }
        else if (errorDownloadJson) { // download failed
            setHandling(false)

            if (NetLord.IsAvailableLastestCheck())
                reasonToReload.current = NeedReloadReason.FailToGetContent
            else
                reasonToReload.current = NeedReloadReason.NoInternet
        }
    }, [shortFilms, errorDownloadJson])

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
                                        <TouchableOpacity onPress={() => onPressNext()} style={[{ gap: Outline.GapVertical }, CommonStyles.flex1_justifyContentCenter_AlignItemsCenter]} >
                                            <MaterialCommunityIcons name={reasonToReload.current === NeedReloadReason.NoInternet ? Icon.NoInternet : Icon.HeartBroken} color={theme.primary} size={Size.IconBig} />
                                            <Text style={{ fontSize: FontSize.Normal, color: theme.counterPrimary }}>{reasonToReload.current === NeedReloadReason.NoInternet ? LocalText.no_internet : LocalText.cant_get_content}</Text>
                                            <Text style={{ fontSize: FontSize.Small_L, color: theme.counterPrimary }}>{LocalText.tap_to_retry}</Text>
                                        </TouchableOpacity>
                                        :
                                        <View style={styleSheet.contentView}>
                                            <View onTouchEnd={() => setIsShowList(true)} style={[styleSheet.nameContainerView, CommonStyles.justifyContentCenter_AlignItemsCenter]}>
                                                <Text style={[{ color: theme.text, }, styleSheet.nameText]}>{selectingItem?.name}</Text>
                                                <View style={styleSheet.showListIconView}>
                                                    <MaterialCommunityIcons name={Icon.List} color={theme.counterPrimary} size={Size.Icon} />
                                                </View>
                                            </View>
                                            <ImageBackgroundWithLoading resizeMode='contain' source={{ uri: selectingItem?.img }} style={styleSheet.image} indicatorProps={{ color: theme.text }} />
                                            <Text selectable style={[styleSheet.nameView, { color: theme.text, }]}>{selectingItem?.name}</Text>
                                            {
                                                !selectingItem?.author ? undefined :
                                                    <Text selectable style={[styleSheet.infoTextView, { color: theme.text, }]}>{LocalText.credit_to + ': ' + selectingItem.author}</Text>
                                            }
                                            <View style={styleSheet.contentScrollView}>
                                                <ScrollView >
                                                    <Text selectable adjustsFontSizeToFit style={[{ flexWrap: 'wrap', color: theme.text, fontSize: FontSize.Small_L }]}>{selectingItem?.desc}</Text>
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
            </ViewShot>
            {/* main btn */}
            <View style={styleSheet.mainButtonsView}>
                <TouchableOpacity onPress={onPressFavorite} style={[{ gap: Outline.GapHorizontal, borderRadius: BorderRadius.BR8, backgroundColor: theme.primary, }, styleSheet.mainBtnTO]}>
                    <MaterialCommunityIcons name={!isFavorited ? "cards-heart-outline" : 'cards-heart'} color={theme.counterPrimary} size={Size.IconSmaller} />
                    {
                        Number.isNaN(likeCount) ? undefined :
                            <Text style={{ color: theme.text, fontSize: FontSize.Normal }}>{likeCount}</Text>
                    }
                </TouchableOpacity>
                <TouchableOpacity onPress={onPressRandom} style={[{ gap: Outline.GapHorizontal, borderRadius: BorderRadius.BR8, backgroundColor: theme.primary, }, styleSheet.mainBtnTO]}>
                    <MaterialCommunityIcons name={Icon.Dice} color={theme.counterPrimary} size={Size.Icon} />
                    {/* <Text style={{ color: theme.text, fontSize: FontSize.Normal }}>{LocalText.random}</Text> */}
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setShowFull(!showFull)} style={[{ gap: Outline.GapHorizontal, borderRadius: BorderRadius.BR8, backgroundColor: theme.primary, }, styleSheet.mainBtnTO]}>
                    <MaterialCommunityIcons name={showFull ? Icon.X : Icon.Eye} color={theme.counterPrimary} size={Size.Icon} />
                    {/* <Text style={{ color: theme.text, fontSize: FontSize.Normal }}>{showFull ? '' : LocalText.read_full}</Text> */}
                </TouchableOpacity>
                <TouchableOpacity onPress={() => onPressNext()} style={[{ gap: Outline.GapHorizontal, borderRadius: BorderRadius.BR8, backgroundColor: theme.primary, }, styleSheet.mainBtnTO]}>
                    <MaterialCommunityIcons name={Icon.Right} color={theme.counterPrimary} size={Size.Icon} />
                    {/* <Text style={{ color: theme.text, fontSize: FontSize.Normal }}>{LocalText.next}</Text> */}
                </TouchableOpacity>
            </View>
            {/* sub btns */}
            <View style={[{ gap: Outline.GapHorizontal }, CommonStyles.row_width100Percent]}>
                <TouchableOpacity onPress={onPressShareText} style={[{ gap: Outline.GapHorizontal, borderRadius: BorderRadius.BR8 }, styleSheet.subBtnTO]}>
                    <MaterialCommunityIcons name={Icon.ShareText} color={theme.counterPrimary} size={Size.IconSmaller} />
                    <Text style={{ color: theme.text, fontSize: FontSize.Small_L }}>{LocalText.share}</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={onPressOpenYoutubeApp} style={[{ gap: Outline.GapHorizontal, borderRadius: BorderRadius.BR8 }, styleSheet.subBtnTO]}>
                    <MaterialCommunityIcons name={Icon.Youtube} color={theme.counterPrimary} size={Size.IconSmaller} />
                    <Text style={{ color: theme.text, fontSize: FontSize.Small_L }}>{LocalText.open_youtube}</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={onPressShareImage} style={[styleSheet.subBtnTO, { gap: Outline.GapHorizontal, borderRadius: BorderRadius.BR8 }]}>
                    <MaterialCommunityIcons name={Icon.ShareImage} color={theme.counterPrimary} size={Size.IconSmaller} />
                    <Text style={{ color: theme.text, fontSize: FontSize.Small_L }}>{LocalText.share_image}</Text>
                </TouchableOpacity>

            </View>
            {
                isShowList && Array.isArray(shortFilms) ? <ListMovie getSelectingIdAsync={getSelectingIdxAsync} setIdx={onPressNext} list={shortFilms} /> : undefined
            }
            {
                streakData ? <StreakPopup streak={streakData} /> : undefined
            }
        </View>
    )
}

export default BestShortFilmsScreen

const styleSheet = StyleSheet.create({
    masterView: { paddingBottom: Outline.Horizontal, flex: 1, gap: Outline.GapVertical, },
    mainButtonsView: { gap: Outline.GapHorizontal, marginHorizontal: Outline.GapVertical_2, flexDirection: 'row' },
    mainBtnTO: { paddingVertical: Outline.GapVertical, flex: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', },
    subBtnTO: { justifyContent: 'center', flexDirection: 'row', flex: 1, alignItems: 'center', },
    headerOptionTO: { marginRight: 15 },
    image: { width: widthPercentageToDP(100), height: heightPercentageToDP(40) },
    contentView: { flex: 1, gap: Outline.GapVertical, paddingTop: Outline.GapHorizontal },
    contentScrollView: { flex: 1, marginHorizontal: Outline.GapVertical_2 },
    nameView: { marginLeft: Outline.Horizontal, fontSize: FontSize.Normal, fontWeight: FontWeight.B500 },
    infoTextView: { fontStyle: 'italic', paddingLeft: Outline.Horizontal, fontSize: FontSize.Small_L, },
    nameTO: { marginHorizontal: Outline.GapVertical_2, flexDirection: 'row', justifyContent: 'space-between' },
    nameText: { marginLeft: widthPercentageToDP(12), flex: 1, textAlign: 'center', fontSize: FontSize.Normal },
    nameContainerView: { paddingHorizontal: Outline.GapVertical, flexDirection: 'row', gap: Outline.GapHorizontal },
    showListIconView: { padding: Outline.GapHorizontal, borderWidth: StyleSheet.hairlineWidth, borderRadius: BorderRadius.BR8 },
})