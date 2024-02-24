// @ts-ignore
import Video from 'react-native-video';

import { View, StyleSheet, TouchableOpacity, Text } from 'react-native'
import React, { useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { DiversityItemType, MediaType } from '../../constants/Types'
import { ThemeContext } from '../../constants/Colors'
import ImageBackgroundWithLoading from './ImageBackgroundWithLoading'
import { CatToScreenName, CheckLocalFileAndGetURIAsync } from '../../handle/AppUtils'
import { CheckAndGetFileListAsync } from '../../handle/ThePageFileListManager'
import { FontSize, NeedReloadReason, Outline } from '../../constants/AppConstants'
import LoadingOrError from './LoadingOrError'
import { useNavigation } from '@react-navigation/native';
import { DrawerNavigationProp } from '@react-navigation/drawer';
import { DrawerParamList } from '../../navigation/Navigator';
import { widthPercentageToDP } from 'react-native-responsive-screen';
import { GetThumbUriFromWikipediaObject, GetTitleFromWikipediaObject } from '../wiki/WikipediaScreen';
import { HexToRgb } from '../../handle/UtilsTS';
import DiversityItem_ImageAndText from './DiversityItem_ImageAndText';
import { NetLord } from '../../handle/NetLord';

type DiversityItemProps = {
    item: DiversityItemType,
}

const DiversityItem = ({
    item,
}: DiversityItemProps) => {
    const navigation = useNavigation<DrawerNavigationProp<DrawerParamList>>();
    const theme = useContext(ThemeContext);
    const [isHandling, setIsHandling] = useState(true)
    const [imgUri, setImgUri] = useState('') // random image
    const [videoUri, setVideoUri] = useState('') // the page
    const [text, setText] = useState('') // short text
    const [wikipediaObject, setWikipediaObject] = useState<object | undefined>(undefined) // wikipedia,...
    const [error, setError] = useState<NeedReloadReason>(NeedReloadReason.None)

    // load funcs ------------------------------

    const loadItem_ThePageAsync = useCallback(async () => {
        const fileList = await CheckAndGetFileListAsync(item.cat)

        if (typeof fileList === 'object') { // success get filetlist
            const post = fileList.posts.find(p => p.id === item.id)

            if (!post) { // not found post in filelist
                setError(NeedReloadReason.FailToGetContent)
                return
            }

            const uriOrReasonToReload = await CheckLocalFileAndGetURIAsync(item.cat, post, 0, (_) => { })

            if (typeof uriOrReasonToReload === 'string') { // success uri
                const currentMediaIsImage: boolean = post.media[0] === MediaType.Image;

                if (currentMediaIsImage)
                    setImgUri(uriOrReasonToReload)
                else
                    setVideoUri(uriOrReasonToReload)
            }
            else { // fail get img uri
                setError(uriOrReasonToReload)
            }
        }
        else { // error get filelist
            setError(fileList)
        }
    }, [item])

    const loadItem_RandomImageAsync = useCallback(async () => {
        if (!item.randomImage)
            return

        setImgUri(item.randomImage.uri)
    }, [item])

    const loadItem_TextAsync = useCallback(async () => {
        if (!item.text)
            return

        setText(item.text)
    }, [item])

    const loadItem_WikiAsync = useCallback(async () => {
        if (!item.wikipediaObject)
            return

        setWikipediaObject(item.wikipediaObject)
    }, [item])

    const loadItemAsync = useCallback(async () => {
        setIsHandling(true)

        if (item.randomImage)
            await loadItem_RandomImageAsync()
        else if (item.text)
            await loadItem_TextAsync()
        else if (item.wikipediaObject)
            await loadItem_WikiAsync()
        else if (item.id)
            await loadItem_ThePageAsync()
        else
            console.error('[ne]', item);

        setIsHandling(false)
    }, [
        item,
        loadItem_ThePageAsync,
        loadItem_TextAsync,
        loadItem_WikiAsync,
        loadItem_RandomImageAsync])

    // load funcs (end) ------------------------------

    const onLoadError = useCallback((_: any) => {
        if (NetLord.IsAvailableLatestCheck())
            setError(NeedReloadReason.FailToGetContent)
        else
            setError(NeedReloadReason.NoInternet)
    }, []);

    const onPressed = useCallback(() => {
        const screen = CatToScreenName(item.cat)

        // switch screen

        if (!screen)
            return

        // @ts-ignore
        navigation.navigate(screen, { item })
    }, [item])

    useEffect(() => {
        (async () => {
            loadItemAsync()
        })()
    }, [item])

    const style = useMemo(() => {
        return StyleSheet.create({
            masterView: { flex: 1, aspectRatio: 1, maxWidth: widthPercentageToDP(25) },
            centerView: { flex: 1, aspectRatio: 1, maxWidth: widthPercentageToDP(25), alignItems: 'center', justifyContent: 'center' },
            percent100: { width: '100%', height: '100%' },
            text: { borderColor: theme.primary, borderWidth: StyleSheet.hairlineWidth, width: '100%', height: '100%', padding: Outline.GapHorizontal, fontSize: FontSize.Small, color: theme.counterBackground, },
        })
    }, [theme])

    // error | loading

    if (error !== NeedReloadReason.None || isHandling) {
        return (
            <View style={style.centerView} >
                <LoadingOrError reasonToReload={error} onPressedReload={loadItemAsync} />
            </View>
        )
    }

    // wikipedia

    if (wikipediaObject) {
        const imgUri = GetThumbUriFromWikipediaObject(wikipediaObject)
        const title = GetTitleFromWikipediaObject(wikipediaObject)

        return (
            <TouchableOpacity onPress={onPressed} style={style.masterView}>
                <DiversityItem_ImageAndText onLoadError={onLoadError} imgUri={imgUri} text={title} />
            </TouchableOpacity>
        )
    }

    // text

    if (text) {
        return (
            <TouchableOpacity onPress={onPressed} style={style.masterView}>
                <Text style={style.text}>{text}</Text>
            </TouchableOpacity>
        )
    }

    // image

    if (imgUri) {
        return (
            <TouchableOpacity onPress={onPressed} style={style.masterView}>
                <ImageBackgroundWithLoading onError={onLoadError} source={{ uri: imgUri }} style={style.percent100} />
            </TouchableOpacity>
        )
    }

    // video

    if (videoUri) {
        return (
            <TouchableOpacity onPress={onPressed} style={style.masterView}>
                <Video
                    onError={onLoadError}
                    source={{ uri: videoUri }}
                    resizeMode={'cover'}
                    muted={true}
                    paused={true}
                    style={style.percent100} />
            </TouchableOpacity>
        )
    }

    return undefined
}

export default DiversityItem