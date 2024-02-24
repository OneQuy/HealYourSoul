/**
 * USAGE:
 * <ImageBackgroundWithLoading 
 *      resizeMode='contain' 
 *      source={{ uri: 'wwww' }} 
 *      style={styleSheet.image} 
 *      indicatorProps={{ color: 'red' }} />
 */

import { ImageBackground, ActivityIndicator, ActivityIndicatorProps } from 'react-native'
import React, { useCallback, useMemo, useState } from 'react'

interface Props extends React.ComponentProps<typeof ImageBackground> {
    indicatorProps?: ActivityIndicatorProps
}

const ImageBackgroundWithLoading = (props: Props) => {
    const [showIndicator, setShowIndicator] = useState(true)

    const key = useMemo(() => {
        return Math.random()
        // @ts-ignore
    }, [props.source.uri])

    const onStartLoad = useCallback(() => {
        setShowIndicator(true)
    }, [])

    const onEndLoad = useCallback(() => {
        setShowIndicator(false)
    }, [])

    return (
        <ImageBackground
            key={key}
            onLoadStart={onStartLoad}
            onLoadEnd={onEndLoad}
            {...props}
            style={[props.style, { justifyContent: 'center', alignItems: 'center' }]} >
            {
                !showIndicator ? props.children :
                    <ActivityIndicator {...props.indicatorProps} />
            }
        </ImageBackground>
    )
}

export default ImageBackgroundWithLoading