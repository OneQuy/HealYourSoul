// @ts-ignore
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import { View, Text, TouchableOpacity, ActivityIndicator, Share as RNShare, ShareContent, ShareOptions, StyleSheet, Animated, ImageBackground } from 'react-native'
import React, { useCallback, useContext, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { ThemeContext } from '../../constants/Colors'
import { Category, FontSize, Icon, LocalText, NeedReloadReason, Outline, Size, StorageKey_LocalFileVersion_ShortText } from '../../constants/AppConstants'
import { NetLord } from '../../handle/NetLord'
import { useFocusEffect, useNavigation } from '@react-navigation/native'
import { CopyAndToast, SaveCurrentScreenForLoadNextTime } from '../../handle/AppUtils'
import { CommonStyles } from '../../constants/CommonConstants'
import { track_PressRandom, track_SimpleWithCat } from '../../handle/tracking/GoodayTracking';
import { SwipeResult, useSimpleGesture } from '../../hooks/useSimpleGesture';
import { playAnimLoadedMedia } from '../../handle/GoodayAnimation';
import BottomBar, { BottomBarItem } from '../others/BottomBar';
import HeaderRightButtons from '../components/HeaderRightButtons';
import useDiversityItem from '../../hooks/useDiversityItem';
import { OnPressedNextItemDiversity } from '../diversity/TheDiversity';
import MiniIAP from '../components/MiniIAP';
import useCheckAndDownloadRemoteFile from '../../hooks/useCheckAndDownloadRemoteFile';
import { BackgroundForTextType } from '../../constants/Types';
import { TempDirName } from '../../handle/Utils';
import { GetRemoteFileConfigVersion } from '../../handle/AppConfigHandler';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAppSelector } from '../../redux/Store';
import BackgroundForTextSelector from '../components/BackgroundForTextSelector';

const fileURL = 'https://firebasestorage.googleapis.com/v0/b/warm-379a6.appspot.com/o/file_configs%2Fbackground_for_text.json?alt=media&token=5ceaac14-13b0-4027-a863-3b8387e7b949'

interface TheRandomShortTextProps {
    category: Category,
    getTextAsync: () => Promise<string | undefined>
}

const TheRandomShortText = ({
    category,
    getTextAsync,
}: TheRandomShortTextProps) => {
    const navigation = useNavigation();
    const [text, setText] = useState<string | undefined>('undefined')
    const reasonToReload = useRef<NeedReloadReason>(NeedReloadReason.None);
    const theme = useContext(ThemeContext);
    const [handling, setHandling] = useState(false);
    const diversityItem = useDiversityItem(() => onPressRandom(false), undefined, undefined, text)

    const backgroundId = useAppSelector(state => {
        const list = state.userData.backgroundIdForText

        if (list === undefined)
            return -1

        const find = list.find(i => i[0] === category)

        if (find)
            return find[1]
        else
            return -1
    })

    const { result: backgrounds, didDownload, } = useCheckAndDownloadRemoteFile<BackgroundForTextType[]>(
        fileURL,
        TempDirName + '/background_for_text.json',
        true,
        GetRemoteFileConfigVersion('background_for_text'),
        'json',
        true,
        async () => AsyncStorage.getItem(StorageKey_LocalFileVersion_ShortText),
        async () => AsyncStorage.setItem(StorageKey_LocalFileVersion_ShortText, GetRemoteFileConfigVersion('background_for_text').toString()))

    const backgroundUri = useMemo(() => {
        if (backgroundId === -1 || !Array.isArray(backgrounds))
            return undefined

        const find = backgrounds.find(i => i.id === backgroundId)

        return find?.img
    }, [backgroundId, backgrounds])

    // animation

    const mediaViewScaleAnimRef = useRef(new Animated.Value(1)).current

    // play loaded anim

    useLayoutEffect(() => {
        if (!text)
            return

        playAnimLoadedMedia(mediaViewScaleAnimRef)
    }, [text])

    const onPressRandom = useCallback(async (shouldTracking: boolean) => {
        reasonToReload.current = NeedReloadReason.None
        setHandling(true)

        let text: string | undefined

        if (diversityItem && diversityItem.text)
            text = diversityItem.text
        else
            text = await getTextAsync()

        setText(text)

        if (text) { // success
        }
        else { // fail
            if (NetLord.IsAvailableLatestCheck())
                reasonToReload.current = NeedReloadReason.FailToGetContent
            else
                reasonToReload.current = NeedReloadReason.NoInternet
        }

        track_PressRandom(shouldTracking, category, text !== undefined)

        setHandling(false)
    }, [diversityItem])

    const onPressCopy = useCallback(() => {
        if (!text)
            return

        track_SimpleWithCat(category, 'copy')

        CopyAndToast(text, theme)
    }, [text, theme])

    const onPressShareText = useCallback(() => {
        if (!text)
            return

        track_SimpleWithCat(category, 'share')

        RNShare.share({
            title: LocalText.fact_of_the_day,
            message: text,
        } as ShareContent,
            {
                tintColor: theme.primary,
            } as ShareOptions)
    }, [text, theme])

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
            {
                text: LocalText.copy,
                onPress: onPressCopy,
                icon: Icon.Copy,
            },
            {
                text: LocalText.random,
                onPress: () => onPressRandom(true),
                icon: Icon.Dice
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
        }

        // return 

        return btns
    }, [onPressRandom, onPressShareText, onPressCopy, diversityItem])

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
                        text: text
                    }}
            />
        });
    }, [text, handling, diversityItem])

    // save last visit category screen

    useFocusEffect(useCallback(() => SaveCurrentScreenForLoadNextTime(navigation), []))

    return (
        <View pointerEvents={handling ? 'none' : 'auto'} style={[styleSheet.masterView, { backgroundColor: theme.background }]}>
            <ImageBackground
                source={{ uri: backgroundUri }}
                resizeMode='cover'
                style={CommonStyles.flex_1} >
                {
                    handling ?
                        // true ?
                        <View style={CommonStyles.flex1_justifyContentCenter_AlignItemsCenter}>
                            <ActivityIndicator color={theme.counterBackground} style={{ marginRight: Outline.Horizontal }} />
                        </View> :
                        <View
                            onTouchStart={onBigViewStartTouch}
                            onTouchEnd={onBigViewEndTouch}
                            style={CommonStyles.flex1_justifyContentCenter_AlignItemsCenter}>
                            {
                                reasonToReload.current !== NeedReloadReason.None ?
                                    // true ?
                                    <TouchableOpacity onPress={() => onPressRandom(false)} style={[{ gap: Outline.GapVertical }, CommonStyles.flex1_justifyContentCenter_AlignItemsCenter]} >
                                        <MaterialCommunityIcons name={reasonToReload.current === NeedReloadReason.NoInternet ? Icon.NoInternet : Icon.HeartBroken} color={theme.counterBackground} size={Size.IconMedium} />
                                        <Text style={{ fontSize: FontSize.Normal, color: theme.counterBackground }}>{reasonToReload.current === NeedReloadReason.NoInternet ? LocalText.no_internet : LocalText.cant_get_content}</Text>
                                        <Text style={{ fontSize: FontSize.Small_L, color: theme.counterBackground }}>{LocalText.tap_to_retry}</Text>
                                    </TouchableOpacity>
                                    :
                                    <Animated.Text adjustsFontSizeToFit numberOfLines={20} selectable style={[{ transform: [{ scale: mediaViewScaleAnimRef }] }, { verticalAlign: 'middle', marginHorizontal: Outline.Horizontal, color: theme.counterBackground, fontSize: FontSize.Big }]}>{text ? text : ''}</Animated.Text>
                            }
                        </View>
                }
            </ImageBackground>

            <BackgroundForTextSelector
                cat={category}
                currentBackgroundId={backgroundId}
                listAllBg={backgrounds}
            />

            {
                handling || reasonToReload.current !== NeedReloadReason.None ? undefined :
                    <Text numberOfLines={1} style={[{ color: theme.counterBackground }, styleSheet.authorText]}>{LocalText.credit_to_author}</Text>
            }

            <BottomBar
                items={bottomBarItems}
                category={category}
            />

            <MiniIAP postID={text} />

        </View >
    )
}

export default TheRandomShortText

const styleSheet = StyleSheet.create({
    masterView: { flex: 1, gap: Outline.GapVertical, },
    headerOptionTO: { marginRight: 15 },
    authorText: { marginLeft: Outline.GapVertical, fontSize: FontSize.Small },
})