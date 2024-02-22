// @ts-ignore
import Video from 'react-native-video';

import { View, Text, StyleSheet, ActivityIndicator, Alert } from 'react-native'
import React, { useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { DiversityItemType, MediaType } from '../../constants/Types'
import { ThemeContext } from '../../constants/Colors'
import ImageBackgroundWithLoading from './ImageBackgroundWithLoading'
import { CheckLocalFileAndGetURIAsync } from '../../handle/AppUtils'
import { CheckAndGetFileListAsync } from '../../handle/ThePageFileListManager'
import { NeedReloadReason } from '../../constants/AppConstants'
import LoadingOrError from './LoadingOrError'

type DiversityItemProps = {
    item: DiversityItemType,
    onPressed: (item: DiversityItemType) => void,
}

const DiversityItem = ({
    item,
    onPressed,
}: DiversityItemProps) => {
    const theme = useContext(ThemeContext);
    const [isHandling, setIsHandling] = useState(true)
    const [imgUri, setImgUri] = useState('')
    const [videoUri, setVideoUri] = useState('')
    const [error, setError] = useState<NeedReloadReason>(NeedReloadReason.None)

    const itemType = useMemo(() => {
        if (item.id !== undefined)
            return 'ThePage'
        else
            return '[ne]'
    }, [item])

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

    const loadItemAsync = useCallback(async () => {
        setIsHandling(true)

        if (itemType === 'ThePage')
            await loadItem_ThePageAsync()
        else
            console.error('[ne]', itemType);

        setIsHandling(false)
    }, [itemType, loadItem_ThePageAsync])

    const onVideoError = useCallback((_: any) => {
        setError(NeedReloadReason.FailToGetContent)
    }, [item]);

    useEffect(() => {
        (async () => {
            loadItemAsync()
        })()
    }, [item])

    const style = useMemo(() => {
        return StyleSheet.create({
            masterView: { flex: 1, aspectRatio: 1 },
            centerView: { flex: 1, aspectRatio: 1, alignItems: 'center', justifyContent: 'center' },
            // noItemTxt: { fontSize: FontSize.Normal, color: theme.counterBackground, },
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

    // image

    if (imgUri) {
        return (
            <ImageBackgroundWithLoading source={{ uri: imgUri }} style={style.masterView} >
                <Text>DiversityItem</Text>
            </ImageBackgroundWithLoading>
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