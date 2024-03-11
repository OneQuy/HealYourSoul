/**
 ** USAGE:
 * <ImageBackgroundOrView 
 *      resizeMode='contain' 
 *      source={{ uri: 'wwww' }} 
 *      style={styleSheet.image} 
 *      indicatorProps={{ color: 'red' }} />
 */

import { ImageBackground, ActivityIndicator, ActivityIndicatorProps, View } from 'react-native'
import React, { useCallback, useMemo, useState } from 'react'

interface Props extends React.ComponentProps<typeof ImageBackground> {
    indicatorProps?: ActivityIndicatorProps
}

const ImageBackgroundOrView = (props: Props) => {
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

    // @ts-ignore
    if (props.source.uri) {
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
    else {
        return (
            <View
                // key={key}
                style={[props.style]} >
                {
                    props.children
                }
            </View>
        )
    }
}

export default ImageBackgroundOrView