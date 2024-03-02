// @ts-ignore
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import { View, StyleSheet, Text, Image, TouchableOpacity, ActivityIndicator, Platform, Alert, AlertButton, ImageBackground } from 'react-native'
import React, { useCallback, useContext, useMemo, useState } from 'react'
import { BorderRadius, FileSizeLimitUploadInMb_Image, FileSizeLimitUploadInMb_Video, FontSize, Icon, LocalText, NotLimitUploadsValue, Outline, Size, StorageKey_LastTimeUpload, StorageKey_TodayUploadsCount } from '../../constants/AppConstants'
import { ThemeContext } from '../../constants/Colors'
import { openPicker } from '@baronha/react-native-multiple-image-picker';
import { MediaType, UserUploadInfo } from '../../constants/Types';
import { GetFileExtensionByFilepath, IsValuableArrayOrString, SafeValue, ToCanPrint } from '../../handle/UtilsTS';
import { usePremium } from '../../hooks/usePremium';
import { UserID } from '../../handle/UserID';
import { FirebaseStorage_UploadAsync } from '../../firebase/FirebaseStorage';
import { AlertWithError } from '../../handle/AppUtils';
import { FirebaseDatabase_SetValueAsync } from '../../firebase/FirebaseDatabase';
import { DoubleCheckGetAppConfigAsync } from '../../handle/AppConfigHandler';
import { GetUserAsync } from '../../handle/tracking/UserMan';
import { GetDateAsync_IsValueNotExistedOrEqualOverMinFromNow, GetNumberIntAsync_WithCheckAndResetNewDay, IncreaseNumberAsync_WithCheckAndResetNewDay, SetDateAsync_Now } from '../../handle/AsyncStorageUtils';
import { GoToPremiumScreen } from '../components/HeaderXButton';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { FileSizeInMB } from '../../handle/FileUtils';
import { widthPercentageToDP } from 'react-native-responsive-screen';
import { iapBg_1 } from '../IAP/IAPPage';
import { Cheat } from '../../handle/Cheat';
import { SubView } from './UploadScreen';


const UploadView = ({ setSubView }: { setSubView: (view: SubView) => void }) => {
    const theme = useContext(ThemeContext);

    const [mediaUri, setMediaUri] = useState('')
    const [toggleRules, setToggleRules] = useState(false)
    const [uploadingStatusText, setUploadingStatusText] = useState('')
    const [reasonCanNotUpload, setReasonCanNotUpload] = useState<undefined | { reason: string, showSubscribeButton?: boolean }>(undefined)
    const [isHandling, setIsHandling] = useState(true)
    const { isPremium } = usePremium()
    const navigation = useNavigation()

    const reset = useCallback(async () => {
        setMediaUri('')
        setToggleRules(false)
        setUploadingStatusText('')
    }, [])

    const onPressPickImage = useCallback(async () => {
        let response

        try {
            response = await openPicker({
                maxSelectedAssets: 1,
                usedCameraButton: false,
            })
        }
        catch (e) {
            if (e && !ToCanPrint(e).toString().includes('cancel')) {
                AlertWithError(e)
            }
        }

        if (!response || response.length == 0)
            return

        let path: string
        if (Platform.OS === 'android')
            path = 'file://' + response[0].realPath;
        else
            path = response[0].path;

        const type = GetMediaTypeByFileExtension(GetFileExtensionByFilepath(path))

        if (type === undefined) { // unsupported file ext
            Alert.alert(
                LocalText.unsupport_file,
                LocalText.unsupport_file_desc + '\n\nPath: ' + path)

            return
        }

        // video only for premium

        if (type === MediaType.Video && !isPremium) {
            Alert.alert(
                LocalText.popup_title_error,
                LocalText.unsupport_video_for_premium)

            return
        }

        // file size

        const sizeMBOrError = await FileSizeInMB(path, false)

        if (sizeMBOrError instanceof Error) { // error get file size
            Alert.alert(
                LocalText.popup_title_error,
                ToCanPrint(sizeMBOrError))

            return
        }
        else if ((sizeMBOrError > FileSizeLimitUploadInMb_Image && type === MediaType.Image) ||
            (type === MediaType.Video && sizeMBOrError > FileSizeLimitUploadInMb_Video)) { // exceed limit file size
            Alert.alert(
                LocalText.unsupport_filesize_over_limit,
                `Limit: ${type === MediaType.Image ? FileSizeLimitUploadInMb_Image : FileSizeLimitUploadInMb_Video} MB\nYour file size: ${sizeMBOrError.toFixed(1)} MB`)

            return
        }

        setMediaUri(path)
    }, [isPremium])

    const refreshReasonCanNotUpload = useCallback(async () => {
        setIsHandling(true)
        setReasonCanNotUpload(await GetCanNotUploadReasonAsync(isPremium))
        setIsHandling(false)
    }, [isPremium])

    const onUploadedSuccess = useCallback(async () => {
        IncreaseNumberAsync_WithCheckAndResetNewDay(StorageKey_TodayUploadsCount)
        SetDateAsync_Now(StorageKey_LastTimeUpload)

        Alert.alert(
            LocalText.upload_success,
            LocalText.upload_success_desc)

        reset()
        refreshReasonCanNotUpload()
    }, [refreshReasonCanNotUpload])

    const onPressUpload = useCallback(async () => {
        if (!toggleRules) {
            AlertWithError(LocalText.agree_rules)
            setUploadingStatusText('')
            return
        }

        // check user permission here

        setUploadingStatusText(LocalText.checking)

        const reason = await GetCanNotUploadReasonAsync(isPremium)
        setReasonCanNotUpload(reason)

        if (reason) { // can not upload
            const btns: AlertButton[] = [
                {
                    text: 'OK'
                }
            ]

            if (reason.showSubscribeButton === true) {
                btns.push({
                    text: LocalText.subscribe,
                    onPress: () => GoToPremiumScreen(navigation)
                })
            }

            Alert.alert(
                LocalText.popup_title_error,
                reason.reason,
                btns
            )

            setUploadingStatusText('')

            return
        }

        // upload!

        setUploadingStatusText(LocalText.uploading)

        const filename = `${Date.now()}_${UserID()}.${GetFileExtensionByFilepath(mediaUri)}`

        var fbpath = 'user_upload/' + filename

        // upload file to firebase

        const uploadRes = await FirebaseStorage_UploadAsync(fbpath, mediaUri);

        if (uploadRes === null) { // step upload file success
            // console.log('step upload file done: ' + fbpath)
        }
        else { // upload failed
            AlertWithError(uploadRes)
            setUploadingStatusText('')
            return
        }

        // update info db: user_data/uploads

        setUploadingStatusText(LocalText.update_info)

        const infoDbPath = `user_data/uploads/${UserID()}/t${Date.now()}`

        const info: UserUploadInfo = {
            filename,
            isPremium,
            status: '',
        }

        const res = await FirebaseDatabase_SetValueAsync(infoDbPath, info)

        if (res === null) { // step update info success
            // console.log('step update info success: ' + infoDbPath, info)
        }
        else { // upload failed
            AlertWithError(res)
            setUploadingStatusText('')
            return
        }

        // success!!

        onUploadedSuccess()
    }, [onUploadedSuccess, toggleRules, mediaUri, isPremium, navigation])

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

            reasonTxt: { margin: Outline.Vertical, textAlign: 'center', fontSize: FontSize.Normal, color: theme.counterBackground, },
            plsSubBtnsView: { gap: Outline.GapHorizontal, flexDirection: 'row' },
            premiumIB: { padding: Outline.GapVertical, minWidth: widthPercentageToDP(30), borderRadius: BorderRadius.BR, overflow: 'hidden', justifyContent: 'center', alignItems: 'center', },
            refreshBtn: { padding: Outline.GapVertical, minWidth: widthPercentageToDP(30), borderColor: theme.counterBackground, borderRadius: BorderRadius.BR, borderWidth: StyleSheet.hairlineWidth, justifyContent: 'center', alignItems: 'center', },
            premiumText: { fontSize: FontSize.Small_L, color: 'black' },
            refreshTxt: { fontSize: FontSize.Small_L, color: theme.counterBackground },
        })
    }, [theme])

    useFocusEffect(useCallback(() => {
        refreshReasonCanNotUpload()
    }, []))

    // handling something

    if (isHandling) {
        return (
            <View style={style.masterView}>
                <ActivityIndicator color={theme.primary} />
            </View>
        )
    }

    // can not upload now

    if (reasonCanNotUpload) {
        return (
            <View style={style.masterView}>
                <Text style={style.reasonTxt}>{reasonCanNotUpload.reason}</Text>

                <View style={style.plsSubBtnsView}>
                    <TouchableOpacity onPress={refreshReasonCanNotUpload}>
                        <View style={style.refreshBtn}>
                            <Text numberOfLines={1} adjustsFontSizeToFit style={style.refreshTxt}>{LocalText.refresh}</Text>
                        </View>
                    </TouchableOpacity>

                    {
                        reasonCanNotUpload.showSubscribeButton === true &&
                        <TouchableOpacity onPress={() => GoToPremiumScreen(navigation)}>
                            <ImageBackground resizeMode="cover" source={iapBg_1} style={style.premiumIB}>
                                <Text numberOfLines={1} adjustsFontSizeToFit style={style.premiumText}>{LocalText.upgrade}</Text>
                            </ImageBackground>
                        </TouchableOpacity>
                    }
                </View>
            </View>
        )
    }

    // not pick image yet

    if (!mediaUri) {
        return (
            <View style={style.masterView}>
                {/* rect emtpy */}

                <TouchableOpacity onPress={onPressPickImage} style={style.rectEmptyView}>
                    <MaterialCommunityIcons name={Icon.Upload} color={theme.primary} size={Size.IconMedium} />
                    <Text style={style.pickMediaTxt}>{LocalText.pick_image}</Text>
                </TouchableOpacity>
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
                uploadingStatusText &&
                <View style={style.uploadingView}>
                    <ActivityIndicator color={theme.primary} />
                    <Text style={style.text}>{uploadingStatusText}</Text>
                </View>
            }

            {/* read rules btn */}

            {
                !uploadingStatusText &&
                <TouchableOpacity onPress={() => setSubView('rules')} style={[style.readRuleTO]}>
                    <Text style={style.text}>{LocalText.read_rules}</Text>
                </TouchableOpacity>
            }

            {/* toggle rule */}

            {
                !uploadingStatusText &&
                <TouchableOpacity onPress={() => setToggleRules(i => !i)} style={[style.checkboxTO]}>
                    <MaterialCommunityIcons name={toggleRules ? Icon.CheckBox_Yes : Icon.CheckBox_No} color={theme.counterBackground} size={Size.Icon} />
                    <Text style={style.text}>{LocalText.follow_rules_upload}</Text>
                </TouchableOpacity>
            }

            {/* bottom btns */}

            {
                !uploadingStatusText &&
                <View style={style.bottomBtnsView}>
                    <TouchableOpacity onPress={reset} style={[style.bottomBtn]}>
                        <Text style={style.text}>{LocalText.cancel}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={onPressUpload} style={[style.bottomBtn_Highlight]}>
                        <Text style={style.bottomBtnTxt_Highlight}>{LocalText.upload}</Text>
                    </TouchableOpacity>
                </View>
            }
        </View>
    )
}

export default UploadView

/**
 * 
 * @returns MediaType if this file is supported. Otherwise undefined
 */
function GetMediaTypeByFileExtension(extension: string): MediaType | undefined {
    extension = extension.toLowerCase();

    if (extension == 'jpg' ||
        extension == 'jpeg' ||
        extension == 'gif' ||
        extension == 'bmp' ||
        extension == 'webp' ||
        extension == 'png')
        return MediaType.Image;
    else if (extension == 'mp4')
        return MediaType.Video;
    else
        return undefined
}

/**
 * 
 * @returns undefined if can upload
 * @returns '{...}' if can not
 */
export const GetCanNotUploadReasonAsync = async (isPremium: boolean): Promise<
    {
        reason: string,
        showSubscribeButton?: boolean,
    } | undefined> => {

    const [appConfig, user] = await Promise.all([
        DoubleCheckGetAppConfigAsync(),
        GetUserAsync()])

    // error get config

    if (appConfig === undefined) {
        return {
            reason: LocalText.can_not_get_app_config
        }
    }

    // error get user

    if (user instanceof Error) {
        return {
            reason: LocalText.can_not_get_user
        }
    }

    // check ban (user info)

    const banned = SafeValue(user?.uploadLimit?.uploadBannedReason, '')

    if (IsValuableArrayOrString(banned)) {
        const expiredBannedDate = SafeValue(user?.uploadLimit?.uploadExpirdedDate, -1)

        if (expiredBannedDate >= 0 && Date.now() >= expiredBannedDate) { } // expired banned, can upload now hihi
        else {
            if (expiredBannedDate < 0) { //permanented
                return {
                    reason: banned,
                }
            }
            else { // with exp date
                return {
                    reason: LocalText.banned_with_exp
                        .replaceAll('@@', banned)
                        .replaceAll('##', new Date(expiredBannedDate).toLocaleString())
                }
            }
        }
    }

    // check limit per day

    const limitUploadsPerDay_AppConfig = appConfig.userUploadLimit.freeUserUploadsPerDay
    const limitUploadsPerDay_User = SafeValue(user?.uploadLimit?.uploadsPerDay, NotLimitUploadsValue)

    let limitUploadsPerDay_Final: number

    if (isPremium) { // premium user not limit
        limitUploadsPerDay_Final = NotLimitUploadsValue
    }
    else { // free user
        if (limitUploadsPerDay_User === NotLimitUploadsValue)
            limitUploadsPerDay_Final = limitUploadsPerDay_AppConfig
        else
            limitUploadsPerDay_Final = limitUploadsPerDay_User
    }

    const currentUploadsCount = await GetNumberIntAsync_WithCheckAndResetNewDay(StorageKey_TodayUploadsCount)

    if (limitUploadsPerDay_Final !== NotLimitUploadsValue && currentUploadsCount >= limitUploadsPerDay_Final) {
        return {
            reason: LocalText.reached_limit_uploads
                .replaceAll('##', limitUploadsPerDay_Final.toString())
                .replaceAll('@@', currentUploadsCount.toString()),

            showSubscribeButton: true,
        }
    }

    // check interval (app config)

    const interval = appConfig.userUploadLimit.intervalInMinute

    if (!Cheat('NotLimitUpload') && !(await GetDateAsync_IsValueNotExistedOrEqualOverMinFromNow(StorageKey_LastTimeUpload, interval))) {
        return {
            reason: LocalText.reached_limit_uploads_interval.replaceAll('##', interval.toString()),
        }
    }

    // allowed upload

    return undefined
}

// function IsSupportURI(flp: string): boolean {
//     return GetMediaTypeByFileExtension(GetFileExtensionByFilepath(flp)) !== undefined
// }