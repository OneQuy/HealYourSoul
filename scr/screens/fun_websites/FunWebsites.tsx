import { Share as RNShare, View, Text, TouchableOpacity, ActivityIndicator, StyleSheet, Image, ShareContent, Alert, Linking } from 'react-native'
import React, { LegacyRef, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'
import { ThemeContext } from '../../constants/Colors'
import { BorderRadius, Category, FontSize, FontWeight, Icon, LocalText, NeedReloadReason, Outline, Size, StorageKey_LocalFileVersion, StorageKey_SelectingFunWebsiteId, StorageKey_Streak } from '../../constants/AppConstants'
import Share from 'react-native-share';


// @ts-ignore
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

// @ts-ignore
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { NetLord } from '../../handle/NetLord'
import { useFocusEffect, useNavigation } from '@react-navigation/native'
import { CopyAndToast, SaveCurrentScreenForLoadNextTime } from '../../handle/AppUtils'
import ViewShot from 'react-native-view-shot'
import { CommonStyles } from '../../constants/CommonConstants'
import { GetStreakAsync, SetStreakAsync } from '../../handle/Streak';
import { FunWebsite, Streak } from '../../constants/Types';
import StreakPopup from '../components/StreakPopup';
import { GetWikiAsync } from '../../handle/services/Wikipedia';
import { heightPercentageToDP, widthPercentageToDP } from 'react-native-responsive-screen';
import { ScrollView } from 'react-native-gesture-handler';
import WebView from 'react-native-webview';
import { ShareOptions } from 'react-native-share';
import { ToCanPrint } from '../../handle/UtilsTS';
import ImageBackgroundWithLoading from '../components/ImageBackgroundWithLoading';
import useCheckAndDownloadRemoteFile from '../../hooks/useCheckAndDownloadRemoteFile';
import { TempDirName } from '../../handle/Utils';
import { GetRemoteFileConfigVersion } from '../../handle/AppConfigHandler';
import AsyncStorage from '@react-native-async-storage/async-storage';
import useIsFavorited from '../../hooks/useIsFavorited';
import ListWebsite from './ListWebsite';

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

    const [funWebsites, errorDownloadJson, _, reUpdateData] = useCheckAndDownloadRemoteFile<FunWebsite[]>(
        fileURL,
        TempDirName + '/fun_website.json',
        true,
        GetRemoteFileConfigVersion('fun_websites'),
        'json',
        false,
        async () => AsyncStorage.getItem(StorageKey_LocalFileVersion(category)),
        async () => AsyncStorage.setItem(StorageKey_LocalFileVersion(category), GetRemoteFileConfigVersion('fun_websites').toString()))

    const [isFavorited, likeCount, onPressFavorite] = useIsFavorited(category, selectingItem?.id)

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

    const onPressNext = useCallback(async (toId: number = -1) => {
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
            id++
        }

        let web = funWebsites.find(w => w.id === id)

        if (!web) {
            web = funWebsites[0]
            id = 0
        }

        setSelectingIdAsync(id)

        setSelectingItem(web)
        setShowFull(false)

        SetStreakAsync(Category[category], -1)
    }, [funWebsites, reUpdateData])

    const onPressCopy = useCallback(() => {
        if (!selectingItem)
            return

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

        const message = selectingItem.desc + '\n\n' + selectingItem.url

        RNShare.share({
            title: LocalText.fact_of_the_day,
            message,
        } as ShareContent,
            {
                tintColor: theme.primary,
            } as ShareOptions)
    }, [selectingItem, theme])

    const onPressShareImage = useCallback(() => {
        if (!selectingItem)
            return

        const message = selectingItem.desc + '\n\n' + selectingItem.url
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

        if (funWebsites) { // downloaded success
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
    }, [funWebsites, errorDownloadJson])

    // on init once

    useEffect(() => {
        SetStreakAsync(Category[category])
        // onPressRandom()
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
                                            <View onTouchEnd={() => setIsShowList(true)} style={[styleSheet.rewardContainerView, CommonStyles.justifyContentCenter_AlignItemsCenter]}>
                                                <Text style={[{ color: theme.text, }, styleSheet.rewardText]}>{shortUrl}</Text>
                                                <View style={styleSheet.showListIconView}>
                                                    <MaterialCommunityIcons name={Icon.List} color={theme.counterPrimary} size={Size.Icon} />
                                                </View>
                                            </View>
                                            <ImageBackgroundWithLoading resizeMode='contain' source={{ uri: selectingItem?.img }} style={styleSheet.image} indicatorProps={{ color: theme.text }} />
                                            <TouchableOpacity onPress={onPressLink} style={styleSheet.titleTO}>
                                                <Text selectable style={[styleSheet.titleView, { color: theme.text, }]}>{selectingItem?.url}</Text>
                                                <MaterialCommunityIcons name={Icon.Link} color={theme.text} size={Size.IconSmaller} />
                                            </TouchableOpacity>
                                            <View style={styleSheet.contentScrollView}>
                                                <ScrollView >
                                                    <Text selectable adjustsFontSizeToFit style={[{ flexWrap: 'wrap', color: theme.text, fontSize: FontSize.Small_L }]}>{selectingItem?.desc}</Text>
                                                </ScrollView>
                                            </View>
                                            {
                                                !showFull || !selectingItem?.url ? undefined :
                                                    <View style={[{ backgroundColor: 'green' }, CommonStyles.width100Percent_Height100Percent_PositionAbsolute_JustifyContentCenter_AlignItemsCenter]}>
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
            {/* main btn */}
            <View style={styleSheet.mainButtonsView}>
                <TouchableOpacity onPress={onPressFavorite} style={[{ gap: Outline.GapHorizontal, borderRadius: BorderRadius.BR8, backgroundColor: theme.primary, }, styleSheet.mainBtnTO]}>
                    <MaterialCommunityIcons name={!isFavorited ? "cards-heart-outline" : 'cards-heart'} color={theme.counterPrimary} size={Size.IconSmaller} />
                    {
                        Number.isNaN(likeCount) ? undefined :
                            <Text style={{ color: theme.text, fontSize: FontSize.Normal }}>{likeCount}</Text>
                    }
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setShowFull(!showFull)} style={[{ gap: Outline.GapHorizontal, borderRadius: BorderRadius.BR8, backgroundColor: theme.primary, }, styleSheet.mainBtnTO]}>
                    <MaterialCommunityIcons name={showFull ? Icon.X : Icon.Eye} color={theme.counterPrimary} size={Size.Icon} />
                    <Text style={{ color: theme.text, fontSize: FontSize.Normal }}>{showFull ? '' : LocalText.go}</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => onPressNext()} style={[{ gap: Outline.GapHorizontal, borderRadius: BorderRadius.BR8, backgroundColor: theme.primary, }, styleSheet.mainBtnTO]}>
                    <MaterialCommunityIcons name={Icon.Dice} color={theme.counterPrimary} size={Size.Icon} />
                    <Text style={{ color: theme.text, fontSize: FontSize.Normal }}>{LocalText.next}</Text>
                </TouchableOpacity>
            </View>
            {/* sub btns */}
            <View style={[{ gap: Outline.GapHorizontal }, CommonStyles.row_width100Percent]}>
                <TouchableOpacity onPress={onPressCopy} style={[{ gap: Outline.GapHorizontal, borderRadius: BorderRadius.BR8 }, styleSheet.subBtnTO]}>
                    <MaterialIcons name={Icon.Copy} color={theme.counterPrimary} size={Size.IconSmaller} />
                    <Text style={{ color: theme.text, fontSize: FontSize.Small_L }}>{LocalText.copy}</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={onPressShareText} style={[{ gap: Outline.GapHorizontal, borderRadius: BorderRadius.BR8 }, styleSheet.subBtnTO]}>
                    <MaterialCommunityIcons name={Icon.ShareText} color={theme.counterPrimary} size={Size.IconSmaller} />
                    <Text style={{ color: theme.text, fontSize: FontSize.Small_L }}>{LocalText.share}</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={onPressShareImage} style={[styleSheet.subBtnTO, { flex: 1.5, gap: Outline.GapHorizontal, borderRadius: BorderRadius.BR8 }]}>
                    <MaterialCommunityIcons name={Icon.ShareImage} color={theme.counterPrimary} size={Size.IconSmaller} />
                    <Text style={{ color: theme.text, fontSize: FontSize.Small_L }}>{LocalText.share_image}</Text>
                </TouchableOpacity>

            </View>
            {
                isShowList && Array.isArray(funWebsites) ? <ListWebsite getSelectingIdAsync={getSelectingIdAsync} setIdx={onPressNext} list={funWebsites} /> : undefined
            }
            {
                streakData ? <StreakPopup streak={streakData} /> : undefined
            }
        </View>
    )
}

export default FunWebsitesScreen

const styleSheet = StyleSheet.create({
    masterView: { paddingBottom: Outline.Horizontal, flex: 1, gap: Outline.GapVertical, },
    mainButtonsView: { gap: Outline.GapHorizontal, marginHorizontal: Outline.GapVertical_2, flexDirection: 'row' },
    mainBtnTO: { paddingVertical: Outline.GapVertical, flex: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', },
    subBtnTO: { justifyContent: 'center', flexDirection: 'row', flex: 1, alignItems: 'center', },
    headerOptionTO: { marginRight: 15 },
    image: { width: widthPercentageToDP(100), height: heightPercentageToDP(50) },
    contentView: { flex: 1, gap: Outline.GapVertical, paddingTop: Outline.GapHorizontal },
    contentScrollView: { flex: 1, marginHorizontal: Outline.GapVertical_2 },
    titleView: { fontSize: FontSize.Normal, fontWeight: FontWeight.B500 },
    titleTO: { marginHorizontal: Outline.GapVertical_2, flexDirection: 'row', justifyContent: 'space-between' },
    rewardText: { flex: 1, fontWeight: FontWeight.B600, textAlign: 'center', fontSize: FontSize.Normal },
    rewardContainerView: { paddingHorizontal: Outline.GapVertical, flexDirection: 'row', gap: Outline.GapHorizontal },
    showListIconView: { padding: Outline.GapHorizontal, borderWidth: StyleSheet.hairlineWidth, borderRadius: BorderRadius.BR8 },
})