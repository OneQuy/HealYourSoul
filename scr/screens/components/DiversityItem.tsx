import { View, Text, StyleSheet } from 'react-native'
import React, { useContext, useEffect, useMemo } from 'react'
import { DiversityItemType } from '../../constants/Types'
import { ThemeContext } from '../../constants/Colors'
import ImageBackgroundWithLoading from './ImageBackgroundWithLoading'
import { CheckLocalFileAndGetURIAsync } from '../../handle/AppUtils'

type DiversityItemProps = {
    item: DiversityItemType,
    onPressed: (item: DiversityItemType) => void,
}

const DiversityItem = ({
    item,
    onPressed,
}: DiversityItemProps) => {
    const theme = useContext(ThemeContext);

    useEffect(() => {
        (async () => {
            const id = item.id

            // if (id !== undefined) { // ThePage item
            //     const uriOrReasonToReload = await CheckLocalFileAndGetURIAsync(item.cat, forPost, 0, fileList.current, (process: DownloadProgressCallbackResult) => {
            //         const percent = RoundNumber(process.bytesWritten / process.contentLength * 100, 0);
            //         setDownloadPercent(percent);
            //     });

            //     if (typeof uriOrReasonToReload === 'string') { // success
            //         // update media

            //         mediaURI.current = uriOrReasonToReload;
            //     }
            // }
        })()
    }, [item])

    const style = useMemo(() => {
        return StyleSheet.create({
            masterView: { flex: 1, aspectRatio: 1, backgroundColor: 'red' },
            // noItemTxt: { fontSize: FontSize.Normal, color: theme.counterBackground, },
        })
    }, [theme])

    return (
        <ImageBackgroundWithLoading source={{ uri: '' }} style={style.masterView} >
            <Text>DiversityItem</Text>
        </ImageBackgroundWithLoading>
    )
}

export default DiversityItem