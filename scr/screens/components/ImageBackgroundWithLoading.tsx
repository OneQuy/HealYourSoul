/**
 * USAGE:
 * <ImageBackgroundWithLoading 
 *      resizeMode='contain' 
 *      source={{ uri: 'wwww' }} 
 *      style={styleSheet.image} 
 *      indicatorProps={{ color: 'red' }} />
 */

import { ImageBackground, ActivityIndicator, ActivityIndicatorProps } from 'react-native'
import React, { useCallback, useState } from 'react'

interface Props extends React.ComponentProps<typeof ImageBackground> {
    indicatorProps?: ActivityIndicatorProps
}

const ImageBackgroundWithLoading = (props: Props) => {
    const [showIndicator, setShowIndicator] = useState(true)

    const onStartLoad = useCallback(() => {
        setShowIndicator(true)
    }, [])
    
    const onEndLoad = useCallback(() => {
        setShowIndicator(false)
    }, [])

    return (
        <ImageBackground
            onLoadStart={onStartLoad}
            onLoadEnd={onEndLoad}
            {...props}
            style={[props.style, { justifyContent: 'center', alignItems: 'center' }]} >
            {
                !showIndicator ? undefined :
                <ActivityIndicator {...props.indicatorProps} />
            }
        </ImageBackground>
    )
}

export default ImageBackgroundWithLoading