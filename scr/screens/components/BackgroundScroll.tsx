// @ts-ignore
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import React, { useCallback, useContext, useMemo } from 'react'
import { useAppDispatch } from '../../redux/Store';
import { Alert, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { Category, Icon, LocalText, Outline } from '../../constants/AppConstants';
import { heightPercentageToDP } from 'react-native-responsive-screen';
import { BackgroundForTextType } from '../../constants/Types';
import ImageBackgroundWithLoading from './ImageBackgroundWithLoading';
import { setBackgroundIdForText } from '../../redux/UserDataSlice';
import { ThemeContext } from '../../constants/Colors';
import { usePremium } from '../../hooks/usePremium';
import { GoToPremiumScreen } from './HeaderXButton';
import { useNavigation } from '@react-navigation/native';

const size = heightPercentageToDP(3.5)

var selectedBackgroundIdTracking: number | undefined = undefined

export const TrackSelectedBackgroundForText = () => {
    // if (selectedBackgroundForTextForTracking === undefined)
    //     return

    // track_SimpleWithParam('selected_backgroundForText', selectedBackgroundForTextForTracking)

    // selectedBackgroundForTextForTracking = undefined
}

const BackgroundScroll = ({
    isLightBackground,
    currentBackgroundId,
    isBold,
    cat,
    listAllBg,
}: {
    isLightBackground: number,
    currentBackgroundId: number,
    isBold: boolean,
    cat: Category,
    listAllBg: BackgroundForTextType[],
}) => {
    const dispatch = useAppDispatch();
    const theme = useContext(ThemeContext)
    const navigation = useNavigation()
    const { isPremium } = usePremium()

    const listToDraw = useMemo(() => {
        const arr = listAllBg.filter(i => i.isLightBg === isLightBackground)
        return arr.sort((a, b) => a.isPremium - b.isPremium)
    }, [isLightBackground, listAllBg])

    const style = useMemo(() => {
        return StyleSheet.create({
            scrollView: { gap: Outline.GapVertical, }
        })
    }, [])

    const onPressItem = useCallback((item: BackgroundForTextType) => {
        selectedBackgroundIdTracking = item.id

        dispatch(setBackgroundIdForText([cat, item.id, isBold]))

        if (!isPremium && item.isPremium) {
            Alert.alert(
                LocalText.background_for_premium,
                LocalText.background_for_premium_content,
                [
                    {
                        text: LocalText.later
                    },
                    {
                        text: LocalText.upgrade,
                        onPress: () => GoToPremiumScreen(navigation)
                    },
                ])
        }
    }, [isPremium, isBold])

    const renderItem = useCallback((item: BackgroundForTextType, index: number) => {
        const isCurrentBg = item.id === currentBackgroundId

        const dotColor = theme.primary
        // const dotColor = item.isLightBg === 1 ? theme.background : theme.counterBackground

        return (
            <TouchableOpacity onPress={() => onPressItem(item)} key={index} >
                <ImageBackgroundWithLoading
                    source={{ uri: item.thumb, cache: 'force-cache' }}
                    style={{
                        width: size,
                        height: size,
                        borderRadius: size / 2,
                        justifyContent: 'center',
                        alignItems: 'center',
                        overflow: 'hidden',
                    }}>
                    {
                        !isCurrentBg ?
                            <View>
                                {
                                    !item.isPremium || isPremium ? undefined :
                                        <MaterialCommunityIcons name={Icon.Lock} color={dotColor} size={size / 2} />
                                }
                            </View> :
                            <View
                                style={{
                                    width: size / 4,
                                    height: size / 4,
                                    borderRadius: size / 4 / 2,
                                    backgroundColor: dotColor,
                                }} />
                    }
                </ImageBackgroundWithLoading>
            </TouchableOpacity>
        )
    }, [currentBackgroundId, cat, theme, isPremium])

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