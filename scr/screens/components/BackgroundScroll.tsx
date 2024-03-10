import React, { useCallback, useMemo } from 'react'
import { RootState, useAppDispatch, useAppSelector } from '../../redux/Store';
import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { Outline } from '../../constants/AppConstants';
import { heightPercentageToDP } from 'react-native-responsive-screen';
import { track_SimpleWithParam } from '../../handle/tracking/GoodayTracking';
import { BackgroundForTextType } from '../../constants/Types';
import ImageBackgroundWithLoading from './ImageBackgroundWithLoading';

const size = heightPercentageToDP(3.5)

var selectedBackgroundForTextForTracking: string | undefined = undefined

export const OnPressedBackgroundForText = (backgroundForText: BackgroundForTextType, dispatch: ReturnType<typeof useAppDispatch>) => {
    // selectedBackgroundForTextForTracking = backgroundForText
    // dispatch(setBackgroundForText(backgroundForText as string))
}

export const TrackSelectedBackgroundForText = () => {
    // if (selectedBackgroundForTextForTracking === undefined)
    //     return

    // track_SimpleWithParam('selected_backgroundForText', selectedBackgroundForTextForTracking)

    // selectedBackgroundForTextForTracking = undefined
}

const BackgroundScroll = ({
    isLightBackground,
    currentBackgroundId,
    listAllBg,
}: {
    isLightBackground: number,
    currentBackgroundId: number,
    listAllBg: BackgroundForTextType[],
}) => {
    const dispatch = useAppDispatch();

    const listToDraw = useMemo(() => {
        return listAllBg.filter(i => i.isLightBg === isLightBackground)
    }, [isLightBackground, listAllBg])

    const style = useMemo(() => {
        return StyleSheet.create({
            scrollView: { gap: Outline.GapVertical, }
        })
    }, [])

    const renderItem = useCallback((item: BackgroundForTextType, index: number) => {
        const isCurrentBackgroundForText = item.id === currentBackgroundId

        const onPress = () => OnPressedBackgroundForText(item, dispatch)

        return (
            <ImageBackgroundWithLoading
                // onPress={onPress}
                source={{ uri: item.img }}
                key={index}
                style={{
                    width: size,
                    height: size,
                    borderRadius: size / 2,
                    justifyContent: 'center',
                    alignItems: 'center',
                    overflow: 'hidden',
                }}>
                {
                    !isCurrentBackgroundForText ? undefined :
                        <View
                            style={{
                                width: size / 4,
                                height: size / 4,
                                borderRadius: size / 4 / 2,
                                backgroundColor: 'red'
                            }} />
                }
            </ImageBackgroundWithLoading>
        )
    }, [currentBackgroundId])

    return (
        <ScrollView
            horizontal
            contentContainerStyle={style.scrollView}
            showsHorizontalScrollIndicator={false}>
            {
                listToDraw.map(renderItem)
            }
        </ScrollView>
    )
}

export default BackgroundScroll