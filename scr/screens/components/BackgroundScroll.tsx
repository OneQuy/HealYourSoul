// @ts-ignore
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import React, { useCallback, useContext, useMemo } from 'react'
import { useAppDispatch } from '../../redux/Store';
import { Alert, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { Icon, LocalText, Outline } from '../../constants/AppConstants';
import { heightPercentageToDP } from 'react-native-responsive-screen';
import { BackgroundForTextCurrent, BackgroundForTextType } from '../../constants/Types';
import ImageBackgroundWithLoading from './ImageBackgroundWithLoading';
import { setBackgroundIdForText } from '../../redux/UserDataSlice';
import { ThemeContext } from '../../constants/Colors';
import { usePremium } from '../../hooks/usePremium';
import { GoToPremiumScreen } from './HeaderXButton';
import { useNavigation } from '@react-navigation/native';

const size = heightPercentageToDP(3.5)

const BackgroundScroll = ({
    isLightBackground,
    currentBackground,
    listAllBg,
}: {
    isLightBackground: number,
    currentBackground: BackgroundForTextCurrent,
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

        dispatch(setBackgroundIdForText({ ...currentBackground, id: item.id }))

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
    }, [isPremium, currentBackground])

    const renderItem = useCallback((item: BackgroundForTextType, index: number) => {
        const isCurrentBg = item.id === currentBackground.id

        let dotColor: string

        if (item.isLightBg) {
            if (theme.shouldStatusBarLight)
                dotColor = theme.background
            else
                dotColor = theme.counterBackground
        }
        else {
            if (theme.shouldStatusBarLight)
                dotColor = theme.counterBackground
            else
                dotColor = theme.background
        }

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
    }, [currentBackground, onPressItem, theme, isPremium])

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