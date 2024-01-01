import { Share as RNShare, View, Text, TouchableOpacity, ActivityIndicator, StyleSheet, Image, ShareContent, Alert, Linking } from 'react-native'
import React, { LegacyRef, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'
import { ThemeContext } from '../../constants/Colors'
import { BorderRadius, Category, FontSize, FontWeight, Icon, LocalText, NeedReloadReason, Outline, Size } from '../../constants/AppConstants'
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
import { Streak } from '../../constants/Types';
import StreakPopup from '../components/StreakPopup';
import { GetWikiAsync } from '../../handle/services/Wikipedia';
import { heightPercentageToDP } from 'react-native-responsive-screen';
import { ScrollView } from 'react-native-gesture-handler';
import WebView from 'react-native-webview';
import { ShareOptions } from 'react-native-share';
import { ToCanPrint } from '../../handle/UtilsTS';
import ImageBackgroundWithLoading from '../components/ImageBackgroundWithLoading';

const category = Category.Wikipedia

const WikipediaScreen = () => {
    const navigation = useNavigation();
    const reasonToReload = useRef<NeedReloadReason>(NeedReloadReason.None);
    const theme = useContext(ThemeContext);
    const [handling, setHandling] = useState(false);
    const [streakData, setStreakData] = useState<Streak | undefined>(undefined);
    const [data, setData] = useState<object | undefined>(undefined);
    const [showFull, setShowFull] = useState(false);
    const viewShotRef = useRef<LegacyRef<ViewShot> | undefined>();

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

        // @ts-ignore
        const text = data.title

        if (typeof text === 'string')
            return text
        else
            return undefined
    }, [data])

    const currentThumbUri = useMemo(() => {
        if (typeof data !== 'object')
            return undefined

        // @ts-ignore
        const text = data.thumbnail?.source

        if (typeof text === 'string')
            return text
        else
            return undefined
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

    const onPressRandom = useCallback(async () => {
        reasonToReload.current = NeedReloadReason.None
        setHandling(true)
        setShowFull(false)

        const res = await GetWikiAsync()

        setData(res)

        if (typeof res === 'object') { // success
            SetStreakAsync(Category[category], -1)
        }
        else { // fail
            if (NetLord.IsAvailableLastestCheck())
                reasonToReload.current = NeedReloadReason.FailToGetContent
            else
                reasonToReload.current = NeedReloadReason.NoInternet
        }

        setHandling(false)
    }, [])

    const onPressCopy = useCallback(() => {
        if (!currentContent)
            return

        const message = currentTitle + '\n\n' + currentContent + '\n\nLink: ' + currentLink
        CopyAndToast(message, theme)
    }, [currentTitle, currentLink, currentContent, theme])

    const onPressHeaderOption = useCallback(async () => {
        if (streakData)
            setStreakData(undefined)
        else {
            const streak = await GetStreakAsync(Category[category])
            setStreakData(streak)
        }
    }, [streakData])

    const onPressShareText = useCallback(() => {
        if (!currentContent)
            return

        RNShare.share({
            title: LocalText.fact_of_the_day,
            message: currentTitle + '\n\n' + currentContent + '\n\nLink: ' + currentLink,
        } as ShareContent,
            {
                tintColor: theme.primary,
            } as ShareOptions)
    }, [currentContent, currentTitle, currentLink, theme])

    const onPressShareImage = useCallback(() => {
        if (!currentContent)
            return

        const message = currentTitle + '\n\n' + currentContent + '\n\nLink: ' + currentLink

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
    }, [currentTitle, currentContent, currentLink, theme])

    // on init once (for load first post)

    useEffect(() => {
        SetStreakAsync(Category[category])
        onPressRandom()
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
                            // true ?
                            <View style={CommonStyles.flex1_justifyContentCenter_AlignItemsCenter}>
                                <ActivityIndicator color={theme.counterPrimary} style={{ marginRight: Outline.Horizontal }} />
                            </View> :
                            <View style={CommonStyles.flex1_justifyContentCenter_AlignItemsCenter}>
                                {
                                    reasonToReload.current !== NeedReloadReason.None ?
                                        // true ?
                                        <TouchableOpacity onPress={onPressRandom} style={[{ gap: Outline.GapVertical }, CommonStyles.flex1_justifyContentCenter_AlignItemsCenter]} >
                                            <MaterialCommunityIcons name={reasonToReload.current === NeedReloadReason.NoInternet ? Icon.NoInternet : Icon.HeartBroken} color={theme.primary} size={Size.IconBig} />
                                            <Text style={{ fontSize: FontSize.Normal, color: theme.counterPrimary }}>{reasonToReload.current === NeedReloadReason.NoInternet ? LocalText.no_internet : LocalText.cant_get_content}</Text>
                                            <Text style={{ fontSize: FontSize.Small_L, color: theme.counterPrimary }}>{LocalText.tap_to_retry}</Text>
                                        </TouchableOpacity>
                                        :
                                        <View style={styleSheet.contentView}>
                                            <View style={CommonStyles.justifyContentCenter_AlignItemsCenter}>
                                                {/* <Image resizeMode='contain' source={{ uri: currentThumbUri }} style={styleSheet.image} /> */}
                                                <ImageBackgroundWithLoading resizeMode='contain' source={{ uri: currentThumbUri }} style={styleSheet.image} indicatorProps={{ color: theme.text }} />
                                            </View>
                                            <TouchableOpacity onPress={onPressLink} style={styleSheet.titleTO}>
                                                <Text selectable style={[styleSheet.titleView, { color: theme.text, }]}>{currentTitle}</Text>
                                                <MaterialCommunityIcons name={Icon.Link} color={theme.text} size={Size.IconSmaller} />
                                            </TouchableOpacity>
                                            <View style={styleSheet.contentScrollView}>
                                                <ScrollView >
                                                    <Text selectable adjustsFontSizeToFit style={[{ flexWrap: 'wrap', color: theme.text, fontSize: FontSize.Small_L }]}>{currentContent}</Text>
                                                </ScrollView>
                                            </View>
                                            {
                                                !showFull || !currentLink ? undefined :
                                                    <View style={[{ backgroundColor: 'green' }, CommonStyles.width100Percent_Height100Percent_PositionAbsolute_JustifyContentCenter_AlignItemsCenter]}>
                                                        <WebView
                                                            source={{ uri: currentLink }}
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
                <TouchableOpacity onPress={() => setShowFull(!showFull)} style={[{ gap: Outline.GapHorizontal, borderRadius: BorderRadius.BR8, backgroundColor: theme.primary, }, styleSheet.mainBtnTO]}>
                    <MaterialCommunityIcons name={showFull ? Icon.X : Icon.Book} color={theme.counterPrimary} size={Size.Icon} />
                    <Text style={{ color: theme.text, fontSize: FontSize.Normal }}>{showFull ? '' : LocalText.read_full}</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={onPressRandom} style={[{ gap: Outline.GapHorizontal, borderRadius: BorderRadius.BR8, backgroundColor: theme.primary, }, styleSheet.mainBtnTO]}>
                    <MaterialCommunityIcons name={Icon.Dice} color={theme.counterPrimary} size={Size.Icon} />
                    <Text style={{ color: theme.text, fontSize: FontSize.Normal }}>{LocalText.random}</Text>
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
                streakData ? <StreakPopup streak={streakData} /> : undefined
            }
        </View>
    )
}

export default WikipediaScreen

const styleSheet = StyleSheet.create({
    masterView: { paddingVertical: Outline.Horizontal, flex: 1, gap: Outline.GapVertical, },
    mainButtonsView: { gap: Outline.GapHorizontal, marginHorizontal: Outline.GapVertical_2, flexDirection: 'row' },
    mainBtnTO: { paddingVertical: Outline.GapVertical, flex: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', },
    subBtnTO: { justifyContent: 'center', flexDirection: 'row', flex: 1, alignItems: 'center', },
    headerOptionTO: { marginRight: 15 },
    image: { width: heightPercentageToDP(30), height: heightPercentageToDP(30) },
    contentView: { flex: 1, gap: Outline.GapVertical },
    contentScrollView: { flex: 1, marginHorizontal: Outline.GapVertical_2 },
    titleView: { fontSize: FontSize.Normal, fontWeight: FontWeight.B500 },
    titleTO: { marginHorizontal: Outline.GapVertical_2, flexDirection: 'row', justifyContent: 'space-between' }
})