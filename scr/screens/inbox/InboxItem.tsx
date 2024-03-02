// @ts-ignore
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import { View, Text, StyleSheet, TouchableOpacity, Linking } from 'react-native'
import React, { useCallback, useContext, useMemo, useState } from 'react'
import { Inbox } from '../../constants/Types'
import { ThemeContext } from '../../constants/Colors';
import { BorderRadius, FontSize, FontWeight, LocalText, Outline, Size } from '../../constants/AppConstants';
import ImageBackgroundWithLoading from '../components/ImageBackgroundWithLoading';
import { heightPercentageToDP, widthPercentageToDP } from 'react-native-responsive-screen';
import { GoToScreen } from '../../handle/GoodayAppState';
import { HexToRgb, RegexUrl } from '../../handle/UtilsTS';
import { useAppDispatch } from '../../redux/Store';
import { clearInbox, toggleLovedInbox, toggleMarkAsReadInbox } from '../../redux/UserDataSlice';

const DidReadOpacity = 0.2

const InboxItem = ({
    inbox: {
        tickAsId,
        msg,
        imgUri,
        title,
        primaryBtnGoToScreen,
        primaryBtnTxt,
        primaryBtnUrl,
        isLoved,
        didRead,
    }
}: { inbox: Inbox }) => {
    const theme = useContext(ThemeContext);
    const [minimal, setMinimal] = useState(true)
    const dispatch = useAppDispatch()

    const onPressImage = useCallback(() => {
        setMinimal(i => !i)
    }, [])

    const onPressLove = useCallback(() => {
        dispatch(toggleLovedInbox(tickAsId))
    }, [tickAsId])

    const onPressClear = useCallback(() => {
        dispatch(clearInbox(tickAsId))
    }, [tickAsId])

    const onPressMarkAsRead = useCallback(() => {
        dispatch(toggleMarkAsReadInbox(tickAsId))
    }, [tickAsId])

    const onPressPrimaryBtn = useCallback(() => {
        if (primaryBtnGoToScreen) {
            GoToScreen(primaryBtnGoToScreen)
        }
        else if (primaryBtnUrl && RegexUrl(primaryBtnUrl)) {
            Linking.openURL(primaryBtnUrl)
        }
    }, [primaryBtnGoToScreen, primaryBtnUrl])

    const style = useMemo(() => {
        return StyleSheet.create({
            masterView: { padding: Outline.GapVertical, gap: Outline.GapHorizontal, width: '100%', borderWidth: StyleSheet.hairlineWidth, borderColor: HexToRgb(theme.counterBackground, didRead ? DidReadOpacity : 1), borderRadius: BorderRadius.BR, },
            btnsView: { flexDirection: 'row', gap: Outline.GapHorizontal, justifyContent: 'center', alignItems: 'center' },
            primaryBtnTO: { backgroundColor: HexToRgb(theme.primary, didRead ? DidReadOpacity : 1), minWidth: widthPercentageToDP(20), alignItems: 'center', justifyContent: 'center', padding: Outline.VerticalMini, borderWidth: StyleSheet.hairlineWidth, borderColor: HexToRgb(theme.counterBackground, didRead ? DidReadOpacity : 1), borderRadius: BorderRadius.BR, },
            btnTO: { minWidth: widthPercentageToDP(20), alignItems: 'center', justifyContent: 'center', padding: Outline.VerticalMini, borderWidth: StyleSheet.hairlineWidth, borderColor: HexToRgb(theme.counterBackground, didRead ? DidReadOpacity : 1), borderRadius: BorderRadius.BR, },
            centerView: { justifyContent: 'center', alignItems: 'center' },
            primaryBtnTxt: { color: HexToRgb(theme.counterPrimary, didRead ? DidReadOpacity : 1), fontSize: FontSize.Small, },
            btnTxt: { color: HexToRgb(theme.counterBackground, didRead ? DidReadOpacity : 1), fontSize: FontSize.Small, },
            titleTxt: { fontWeight: FontWeight.B600, color: HexToRgb(theme.counterBackground, didRead ? DidReadOpacity : 1), fontSize: FontSize.Small_L, },
            contentTxt: { color: HexToRgb(theme.counterBackground, didRead ? DidReadOpacity : 1), fontSize: FontSize.Small, },
            imageStyle: { height: heightPercentageToDP(20), aspectRatio: 1 },
            imageStyleFull: { height: heightPercentageToDP(60), width: '100%' }
        })
    }, [theme, didRead])

    return (
        <View style={style.masterView}>
            {/* title */}

            {
                title &&
                <View style={style.centerView}>
                    <Text adjustsFontSizeToFit numberOfLines={2} style={style.titleTxt}>{title}</Text>
                </View>
            }

            {/* image */}

            {
                imgUri &&
                <TouchableOpacity onPress={onPressImage} style={style.centerView}>
                    <ImageBackgroundWithLoading resizeMode='contain' style={minimal ? style.imageStyle : style.imageStyleFull} source={{ uri: imgUri }} />
                </TouchableOpacity>
            }

            {/* content */}

            <Text style={style.contentTxt}>{msg}</Text>

            {/* buttons */}

            <View style={style.btnsView}>
                {/* clear */}

                <TouchableOpacity onPress={onPressClear} style={style.btnTO}>
                    <Text adjustsFontSizeToFit numberOfLines={1} style={style.btnTxt}>{LocalText.clear}</Text>
                </TouchableOpacity>

                {/* mark as read */}

                <TouchableOpacity onPress={onPressMarkAsRead} style={style.btnTO}>
                    <Text adjustsFontSizeToFit numberOfLines={1} style={style.btnTxt}>{LocalText.mark_read}</Text>
                </TouchableOpacity>

                {/* primary */}

                {
                    primaryBtnTxt && (primaryBtnUrl || primaryBtnGoToScreen) &&
                    <TouchableOpacity onPress={onPressPrimaryBtn} style={style.primaryBtnTO}>
                        <Text adjustsFontSizeToFit numberOfLines={1} style={style.primaryBtnTxt}>{primaryBtnTxt}</Text>
                    </TouchableOpacity>
                }

                {/* love */}

                <TouchableOpacity onPress={onPressLove} style={{}}>
                    <MaterialCommunityIcons name={!isLoved ? "cards-heart-outline" : 'cards-heart'} color={isLoved ? HexToRgb(theme.primary, didRead ? DidReadOpacity : 1) : HexToRgb(theme.counterBackground, didRead ? DidReadOpacity : 1)} size={Size.IconSmaller} />
                </TouchableOpacity>
            </View>
        </View>
    )
}

export default InboxItem