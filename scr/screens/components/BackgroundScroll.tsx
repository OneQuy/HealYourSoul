import React, { useCallback, useMemo } from 'react'
import { useAppDispatch } from '../../redux/Store';
import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { Category, Outline } from '../../constants/AppConstants';
import { heightPercentageToDP } from 'react-native-responsive-screen';
import { BackgroundForTextType } from '../../constants/Types';
import ImageBackgroundWithLoading from './ImageBackgroundWithLoading';
import { setBackgroundIdForText } from '../../redux/UserDataSlice';

const size = heightPercentageToDP(3.5)

var selectedBackgroundIdTracking: number | undefined = undefined

export const OnPressedBackgroundForText = (backgroundForText: BackgroundForTextType, cat: Category, dispatch: ReturnType<typeof useAppDispatch>) => {
    selectedBackgroundIdTracking = backgroundForText.id
    dispatch(setBackgroundIdForText([cat, backgroundForText.id]))
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
    cat,
    listAllBg,
}: {
    isLightBackground: number,
    currentBackgroundId: number,
    cat: Category,
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

        const onPress = () => OnPressedBackgroundForText(item, cat, dispatch)

        return (
            <TouchableOpacity onPress={onPress} key={index} >
                <ImageBackgroundWithLoading
                    source={{ uri: item.img }}
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
            </TouchableOpacity>
        )
    }, [currentBackgroundId, cat])

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