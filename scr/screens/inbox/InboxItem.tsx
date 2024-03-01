import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import React, { useCallback, useContext, useMemo } from 'react'
import { Inbox } from '../../constants/Types'
import { ThemeContext } from '../../constants/Colors';
import { BorderRadius, FontSize, FontWeight, Outline } from '../../constants/AppConstants';
import ImageBackgroundWithLoading from '../components/ImageBackgroundWithLoading';
import { heightPercentageToDP, widthPercentageToDP } from 'react-native-responsive-screen';

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

    const onPressPrimaryBtn = useCallback(() => {
        if (primaryBtnGoToScreen) {
            
        }
    }, [primaryBtnGoToScreen, primaryBtnUrl])

    const style = useMemo(() => {
        return StyleSheet.create({
            masterView: { padding: Outline.GapVertical, gap: Outline.GapHorizontal, width: '100%', borderWidth: StyleSheet.hairlineWidth, borderColor: theme.counterBackground, borderRadius: BorderRadius.BR, },
            btnTO: { minWidth: widthPercentageToDP(20), alignItems: 'center', justifyContent: 'center', padding: Outline.VerticalMini, borderWidth: StyleSheet.hairlineWidth, borderColor: theme.counterBackground, borderRadius: BorderRadius.BR, },
            centerView: { justifyContent: 'center', alignItems: 'center' },
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

            <View style={style.centerView}>
                <TouchableOpacity style={style.btnTO}>
                    <Text adjustsFontSizeToFit numberOfLines={1} style={style.contentTxt}>{'OKKKK'}</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}

export default InboxItem