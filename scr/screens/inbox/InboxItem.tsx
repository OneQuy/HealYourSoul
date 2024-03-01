import { View, Text, StyleSheet, TouchableOpacity, Linking } from 'react-native'
import React, { useCallback, useContext, useMemo } from 'react'
import { Inbox } from '../../constants/Types'
import { ThemeContext } from '../../constants/Colors';
import { BorderRadius, FontSize, FontWeight, LocalText, Outline } from '../../constants/AppConstants';
import ImageBackgroundWithLoading from '../components/ImageBackgroundWithLoading';
import { heightPercentageToDP, widthPercentageToDP } from 'react-native-responsive-screen';
import { GoToScreen } from '../../handle/GoodayAppState';
import { RegexUrl } from '../../handle/UtilsTS';

const InboxItem = ({
    inbox: {
        msg,
        imgUri,
        title,
        primaryBtnGoToScreen,
        primaryBtnTxt,
        primaryBtnUrl
    }
}: { inbox: Inbox }) => {
    const theme = useContext(ThemeContext);

    const onPressMarkAsRead = useCallback(() => {

    }, [])

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
            masterView: { padding: Outline.GapVertical, gap: Outline.GapHorizontal, width: '100%', borderWidth: StyleSheet.hairlineWidth, borderColor: theme.counterBackground, borderRadius: BorderRadius.BR, },
            btnsView: { flexDirection: 'row', gap: Outline.GapHorizontal, justifyContent: 'center', alignItems: 'center' },
            primaryBtnTO: { backgroundColor: theme.primary, minWidth: widthPercentageToDP(20), alignItems: 'center', justifyContent: 'center', padding: Outline.VerticalMini, borderWidth: StyleSheet.hairlineWidth, borderColor: theme.counterBackground, borderRadius: BorderRadius.BR, },
            btnTO: { minWidth: widthPercentageToDP(20), alignItems: 'center', justifyContent: 'center', padding: Outline.VerticalMini, borderWidth: StyleSheet.hairlineWidth, borderColor: theme.counterBackground, borderRadius: BorderRadius.BR, },
            centerView: { justifyContent: 'center', alignItems: 'center' },
            primaryBtnTxt: { color: theme.counterPrimary, fontSize: FontSize.Small, },
            btnTxt: { color: theme.counterBackground, fontSize: FontSize.Small, },
            contentTxt: { color: theme.counterBackground, fontSize: FontSize.Small, },
            titleTxt: { fontWeight: FontWeight.B600, color: theme.counterBackground, fontSize: FontSize.Small_L, },
            imageStyle: { height: heightPercentageToDP(20), aspectRatio: 1 }
        })
    }, [theme])

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
                <View style={style.centerView}>
                    <ImageBackgroundWithLoading resizeMode='contain' style={style.imageStyle} source={{ uri: imgUri }} />
                </View>
            }

            {/* content */}

            <Text style={style.contentTxt}>{msg}</Text>

            {/* buttons */}

            <View style={style.btnsView}>
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

            </View>
        </View>
    )
}

export default InboxItem