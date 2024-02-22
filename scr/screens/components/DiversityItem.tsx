import { View, Text, StyleSheet, ActivityIndicator } from 'react-native'
import React, { useContext, useEffect, useMemo, useState } from 'react'
import { DiversityItemType } from '../../constants/Types'
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
    const [isHandling, setIsHandling] = useState(false)
    const [imgUri, setImgUri] = useState('')
    const [error, setError] = useState<NeedReloadReason>(NeedReloadReason.None)

    useEffect(() => {
        (async () => {
            setIsHandling(true)

            const id = item.id

            if (id !== undefined) { // ThePage item
                const fileList = await CheckAndGetFileListAsync(item.cat)

                if (typeof fileList === 'object') { // success get filetlist
                    const forPost = fileList.posts.find(p => p.id === item.id)

                    if (!forPost) { // error get filelist
                        setError(NeedReloadReason.FailToGetContent)
                        setIsHandling(false)
                        return
                    }

                    const uriOrReasonToReload = await CheckLocalFileAndGetURIAsync(item.cat, forPost, 0, (_) => { })

                    if (typeof uriOrReasonToReload === 'string') { // success uri
                        setImgUri(uriOrReasonToReload)
                    }
                    else {
                        setError(uriOrReasonToReload)
                    }

                    setIsHandling(false)
                }
                else { // error get filelist
                    setError(fileList)
                    setIsHandling(false)
                }

            }
        })()
    }, [item])

    const style = useMemo(() => {
        return StyleSheet.create({
            masterView: { flex: 1, aspectRatio: 1 },
            centerView: { flex: 1, aspectRatio: 1, alignItems: 'center', justifyContent: 'center' },
            // noItemTxt: { fontSize: FontSize.Normal, color: theme.counterBackground, },
        })
    }, [theme])

    // error

    if (error !== NeedReloadReason.None) {
        return (
            <View style={style.centerView} >
                <LoadingOrError reasonToReload={error} onPressedReload={() => { }} />
            </View>
        )
    }

    // loading

    if (isHandling) {
        return (
            <View style={style.centerView} >
                <ActivityIndicator color={theme.counterBackground} />
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

    return undefined
}

export default DiversityItem