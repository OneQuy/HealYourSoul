// @ts-ignore
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import { View, StyleSheet, Text, Image, TouchableOpacity, ActivityIndicator, Platform, Alert, AppConfig } from 'react-native'
import React, { useCallback, useContext, useMemo, useState } from 'react'
import { BorderRadius, FileSizeLimitUploadInMb_Image, FileSizeLimitUploadInMb_Video, FontSize, Icon, LocalText, NotLimitUploadsValue, Outline, Size, StorageKey_LastTimeUpload, StorageKey_TodayUploadsCount } from '../../constants/AppConstants'
import { ThemeContext } from '../../constants/Colors'
import { openPicker } from '@baronha/react-native-multiple-image-picker';
import { LocalTextType, MediaType, User, UserUploadInfo } from '../../constants/Types';
import { DateDiff_InMinute, DistanceFrom2Dates, GetFileExtensionByFilepath, IsValuableArrayOrString, SafeValue, ToCanPrint } from '../../handle/UtilsTS';
import { usePremium } from '../../hooks/usePremium';
import { FileSizeInMB } from '../../handle/FileUtils';
import { UserID } from '../../handle/UserID';
import { FirebaseStorage_UploadAsync } from '../../firebase/FirebaseStorage';
import { AlertWithError } from '../../handle/AppUtils';
import { FirebaseDatabase_SetValueAsync } from '../../firebase/FirebaseDatabase';
import { DoubleCheckGetAppConfigAsync } from '../../handle/AppConfigHandler';
import { GetUserAsync } from '../../handle/tracking/UserMan';
import { GetDateAsync_IsValueNotExistedOrEqualOverMinFromNow, GetNumberIntAsync_WithCheckAndResetNewDay } from '../../handle/AsyncStorageUtils';


const UploadView = () => {
    const theme = useContext(ThemeContext);

    const [mediaUri, setMediaUri] = useState('')
    const [toggleRules, setToggleRules] = useState(false)
    const [uploadingStatusText, setUploadingStatusText] = useState('')
    const { isPremium } = usePremium()

    const reset = useCallback(async () => {
        setMediaUri('')
        setToggleRules(false)
        setUploadingStatusText('')
    }, [])

    const onPressPickImage = useCallback(async () => {
        GetCanNotUploadReasonAsync(isPremium)
        return
        let response

        try {
            response = await openPicker({
                maxSelectedAssets: 1,
                usedCameraButton: false,
            })
        }
        catch { }

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
        else if ((type === MediaType.Image && sizeMBOrError > FileSizeLimitUploadInMb_Image) ||
            (type === MediaType.Video && sizeMBOrError > FileSizeLimitUploadInMb_Video)) { // exceed limit file size
            Alert.alert(
                LocalText.unsupport_filesize_over_limit,
                `Limit: ${type === MediaType.Image ? FileSizeLimitUploadInMb_Image : FileSizeLimitUploadInMb_Video} MB\nYour file size: ${sizeMBOrError.toFixed(1)} MB`)

            return
        }

        setMediaUri(path)
    }, [isPremium])

    const onPressUpload = useCallback(async () => {
        setUploadingStatusText(LocalText.uploading)

        // check user permission here

        const allowedUpload = await GetCanNotUploadReasonAsync(isPremium)

        if (allowedUpload) {
            return
        }

        // upload!

        const filename = `${Date.now()}_${UserID()}.${GetFileExtensionByFilepath(mediaUri)}`

        var fbpath = 'user_upload/' + filename

        // upload file to firebase

        const uploadRes = await FirebaseStorage_UploadAsync(fbpath, mediaUri);

        if (uploadRes === null) { // step upload file success
            console.log('step upload file done: ' + fbpath)
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
            console.log('step update info success: ' + infoDbPath, info)
        }
        else { // upload failed
            AlertWithError(res)
            setUploadingStatusText('')
            return
        }

        // success!!

        Alert.alert(
            LocalText.upload_success,
            LocalText.upload_success_desc
        )

        reset()
    }, [mediaUri, isPremium])

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
                <TouchableOpacity onPress={() => setToggleRules(i => !i)} style={[style.readRuleTO]}>
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
        canUploadDate?: number,
        limit?: number,
        currentCount?: number,
        expiredBannedDate?: number,
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
            return {
                reason: banned,
                expiredBannedDate,
            }
        }
    }

    // check limit per day

    const limitUploadsPerDay_AppConfig = appConfig.userUploadLimit.freeUserUploadsPerDay
    const limitUploadsPerDay_User = SafeValue(user?.uploadLimit?.uploadsPerDay, NotLimitUploadsValue)

    let limitUploadsPerDay_Final: number

    if (isPremium) { // premium user only restricted user limit
        if (limitUploadsPerDay_User !== NotLimitUploadsValue)
            limitUploadsPerDay_Final = limitUploadsPerDay_User
        else
            limitUploadsPerDay_Final = NotLimitUploadsValue
    }
    else {
        if (limitUploadsPerDay_User === NotLimitUploadsValue)
            limitUploadsPerDay_Final = limitUploadsPerDay_AppConfig
        else
            limitUploadsPerDay_Final = limitUploadsPerDay_User
    }

    const currentUploadsCount = await GetNumberIntAsync_WithCheckAndResetNewDay(StorageKey_TodayUploadsCount)

    if (currentUploadsCount >= limitUploadsPerDay_Final) {
        return {
            reason: LocalText.reached_limit_uploads,
            limit: limitUploadsPerDay_Final,
            currentCount: currentUploadsCount,
        }
    }

    // check interval (app config)

    const interval = appConfig.userUploadLimit.intervalInMinute

    if (!(await GetDateAsync_IsValueNotExistedOrEqualOverMinFromNow(StorageKey_LastTimeUpload, interval))) {
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