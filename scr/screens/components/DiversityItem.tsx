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

type DiversityItemProps = {
    item: DiversityItemType,
}

const DiversityItem = ({
    item,
}: DiversityItemProps) => {
    const navigation = useNavigation<DrawerNavigationProp<DrawerParamList>>();
    const theme = useContext(ThemeContext);
    const [isHandling, setIsHandling] = useState(true)
    const [imgUri, setImgUri] = useState('')
    const [videoUri, setVideoUri] = useState('')
    const [text, setText] = useState('Bourbon was first made by a Baptist minsister from Bourbon County in Kentucky in 1789. That is where it got its name')
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

    const loadItemAsync = useCallback(async () => {
        setIsHandling(true)

        if (item.randomImage)
            await loadItem_RandomImageAsync()
        else if (item.text)
            await loadItem_TextAsync()
        else if (item.id)
            await loadItem_ThePageAsync()
        else
            console.error('[ne]', item);

        setIsHandling(false)
    }, [
        item,
        loadItem_ThePageAsync,
        loadItem_TextAsync,
        loadItem_RandomImageAsync])

    // load funcs (end) ------------------------------

    const onVideoError = useCallback((_: any) => {
        setError(NeedReloadReason.FailToGetContent)
    }, [item]);

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
            text: { margin: Outline.GapHorizontal, fontSize: FontSize.Small, color: theme.counterBackground, },
        })
    }, [theme])

    // error | loading

    if (error !== NeedReloadReason.None || isHandling) {
        return (
            <View style={style.centerView} >
                <LoadingOrError reasonToReload={error} onPressedReload={() => { }} />
            </View>
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
                <ImageBackgroundWithLoading source={{ uri: imgUri }} style={style.percent100} >
                </ImageBackgroundWithLoading>
            </TouchableOpacity>
        )
    }

    // video

    if (videoUri) {
        return (
            <Video
                onError={onVideoError}
                source={{ uri: videoUri }}
                resizeMode={'cover'}
                muted={true}
                paused={true}
                style={style.masterView} />
        )
    }

    return undefined
}

export default DiversityItem