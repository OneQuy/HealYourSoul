// @ts-ignore
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import { View, StyleSheet, Text, Image, TouchableOpacity, ActivityIndicator } from 'react-native'
import React, { useContext, useMemo, useState } from 'react'
import { BorderRadius, FontSize, Icon, LocalText, Outline, Size } from '../../constants/AppConstants'
import { ThemeContext } from '../../constants/Colors'

const UploadView = () => {
    const theme = useContext(ThemeContext);
    const [mediaUri, setMediaUri] = useState('https://images7.memedroid.com/images/UPLOADED809/5c32f47214be6.jpeg')
    const [toggleRules, setToggleRules] = useState(false)
    const [isUploading, setIsUploading] = useState(false)

    const style = useMemo(() => {
        return StyleSheet.create({
            masterView: { flex: 1, justifyContent: 'center', alignItems: 'center', gap: Outline.GapHorizontal, },
            rectEmptyView: { width: '70%', height: '50%', borderColor: theme.counterBackground, borderWidth: StyleSheet.hairlineWidth, borderRadius: BorderRadius.BR, justifyContent: 'center', alignItems: 'center' },
            bottomBtnsView: { marginTop: Outline.Vertical, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: Outline.GapHorizontal },
            uploadingView: { gap: Outline.GapHorizontal },
            image: { width: '70%', height: '50%', },
            checkboxTO: { marginHorizontal: Outline.GapVertical_2, flexDirection: 'row', alignItems: 'center', gap: Outline.GapHorizontal },
            readRuleTO: { marginTop: Outline.Vertical, borderRadius: BorderRadius.BR, borderColor: theme.counterBackground, borderWidth: StyleSheet.hairlineWidth, padding: Outline.GapVertical, alignItems: 'center', },
            bottomBtn: { minWidth: '30%', alignItems: 'center', justifyContent: 'center', borderRadius: BorderRadius.BR, borderColor: theme.counterBackground, borderWidth: StyleSheet.hairlineWidth, padding: Outline.GapVertical, },
            bottomBtn_Highlight: { minWidth: '30%', alignItems: 'center', justifyContent: 'center', borderRadius: BorderRadius.BR, backgroundColor: theme.primary, padding: Outline.GapVertical, },
            text: { color: theme.counterBackground, fontSize: FontSize.Small_L, },
            bottomBtnTxt_Highlight: { color: theme.counterPrimary, fontSize: FontSize.Small_L, },
            pickMediaTxt: { marginTop: Outline.GapVertical, textAlign: 'center', fontSize: FontSize.Normal, color: theme.counterBackground, },
        })
    }, [theme])

    // render list is empty

    if (!mediaUri) {
        return (
            <View style={style.masterView}>
                {/* rect emtpy */}

                <View style={style.rectEmptyView}>
                    <MaterialCommunityIcons name={Icon.Upload} color={theme.primary} size={Size.IconMedium} />
                    <Text style={style.pickMediaTxt}>{LocalText.pick_image}</Text>
                </View>
            </View>
        )
    }

    // main render

    return (
        <View style={style.masterView}>
            {/* image */}

            <Image resizeMode='contain' source={{ uri: mediaUri }} style={style.image} />

            {/* uploading indicator */}

            {
                isUploading &&
                <View style={style.uploadingView}>
                    <ActivityIndicator color={theme.primary} />
                    <Text style={style.text}>{LocalText.uploading}</Text>
                </View>
            }

            {/* read rules btn */}

            {
                !isUploading &&
                <TouchableOpacity onPress={() => setToggleRules(i => !i)} style={[style.readRuleTO]}>
                    <Text style={style.text}>{LocalText.read_rules}</Text>
                </TouchableOpacity>
            }

            {/* toggle rule */}

            {
                !isUploading &&
                <TouchableOpacity onPress={() => setToggleRules(i => !i)} style={[style.checkboxTO]}>
                    <MaterialCommunityIcons name={toggleRules ? Icon.CheckBox_Yes : Icon.CheckBox_No} color={theme.counterBackground} size={Size.Icon} />
                    <Text style={style.text}>{LocalText.follow_rules_upload}</Text>
                </TouchableOpacity>
            }
            {/* bottom btns */}

            {
                !isUploading &&
                <View style={style.bottomBtnsView}>
                    <TouchableOpacity onPress={() => setToggleRules(i => !i)} style={[style.bottomBtn]}>
                        <Text style={style.text}>{LocalText.cancel}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => setToggleRules(i => !i)} style={[style.bottomBtn_Highlight]}>
                        <Text style={style.bottomBtnTxt_Highlight}>{LocalText.upload}</Text>
                    </TouchableOpacity>
                </View>
            }
        </View>
    )
}

export default UploadView