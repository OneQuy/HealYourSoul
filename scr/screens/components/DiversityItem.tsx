import { View, Text, StyleSheet, ActivityIndicator } from 'react-native'
import React, { useContext, useEffect, useMemo, useState } from 'react'
import { DiversityItemType } from '../../constants/Types'
import { ThemeContext } from '../../constants/Colors'
import ImageBackgroundWithLoading from './ImageBackgroundWithLoading'
import { CheckLocalFileAndGetURIAsync } from '../../handle/AppUtils'
import { CheckAndGetFileListAsync } from '../../handle/ThePageFileListManager'

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

    useEffect(() => {
        (async () => {
            setIsHandling(true)

            const id = item.id

            if (id !== undefined) { // ThePage item
                // const fileList = await CheckAndGetFileListAsync(item.cat)

                // const uriOrReasonToReload = await CheckLocalFileAndGetURIAsync(item.cat, forPost, 0, fileList.current, (process: DownloadProgressCallbackResult) => {
                //     const percent = RoundNumber(process.bytesWritten / process.contentLength * 100, 0);
                //     setDownloadPercent(percent);
                // });

                // if (typeof uriOrReasonToReload === 'string') { // success
                //     // update media

                //     mediaURI.current = uriOrReasonToReload;
                // }
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