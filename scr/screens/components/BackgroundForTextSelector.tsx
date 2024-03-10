import { View, Text } from 'react-native'
import React from 'react'
import BackgroundScroll from './BackgroundScroll'
import { BackgroundForTextType } from '../../constants/Types'

const BackgroundForTextSelector = ({
    currentBackgroundId,
    listAllBg,
}: {
    currentBackgroundId: number,
    listAllBg: BackgroundForTextType[] | string | undefined,
}) => {

    if (!Array.isArray(listAllBg))
        return undefined

    return (
        <View>
            <BackgroundScroll
                listAllBg={listAllBg}
                currentBackgroundId={currentBackgroundId}
                isLightBackground={1}
            />
        </View>
    )
}

export default BackgroundForTextSelector