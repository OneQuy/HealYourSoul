import { View, Text, TouchableOpacity, ActivityIndicator, Share as RNShare, ShareContent, ShareOptions, Alert, StyleSheet, Image } from 'react-native'
import React, { LegacyRef, useCallback, useContext, useEffect, useRef, useState } from 'react'
import { ThemeContext } from '../../constants/Colors'
import { BorderRadius, Category, FontSize, Icon, LocalText, NeedReloadReason, Outline, Size } from '../../constants/AppConstants'
import Share from 'react-native-share';
import RNFS, { DownloadProgressCallbackResult } from "react-native-fs";

// @ts-ignore
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

// @ts-ignore
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { NetLord } from '../../handle/NetLord'
import { useFocusEffect, useNavigation } from '@react-navigation/native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { Cheat } from '../../handle/Cheat'
import { DelayAsync, PickRandomElement } from '../../handle/Utils'
import { CopyAndToast, SaveCurrentScreenForLoadNextTime } from '../../handle/AppUtils'
import ViewShot from 'react-native-view-shot'
import { CommonStyles } from '../../constants/CommonConstants'
import { GetStreakAsync, SetStreakAsync } from '../../handle/Streak';
import { Streak } from '../../constants/Types';
import StreakPopup from '../components/StreakPopup';
import { DownloadImageAsync } from '../../handle/UtilsTS';
import { DownloadFileAsync } from '../../handle/FileUtils';

interface TheRandomImageProps {
    category: Category,
    getImageAsync: () => Promise<string | undefined>
}

const TheRandomImage = ({
    category,
    getImageAsync,
}: TheRandomImageProps) => {
    const navigation = useNavigation();
    const [imageUri, setImageUri] = useState<string | undefined>(undefined)
    const reasonToReload = useRef<NeedReloadReason>(NeedReloadReason.None);
    const theme = useContext(ThemeContext);
    const [handling, setHandling] = useState(false);
    const [streakData, setStreakData] = useState<Streak | undefined>(undefined);

    const onPressRandom = useCallback(async () => {
        reasonToReload.current = NeedReloadReason.None
        setHandling(true)

        const uri = await getImageAsync()

        if (uri) { // success
            SetStreakAsync(Category[category], -1)
        }
        else { // fail
            if (NetLord.IsAvailableLastestCheck())
                reasonToReload.current = NeedReloadReason.FailToGetContent
            else
                reasonToReload.current = NeedReloadReason.NoInternet
        }

        setImageUri(uri)
        setHandling(false)
    }, [])

    const onPressHeaderOption = useCallback(async () => {
        if (streakData)
            setStreakData(undefined)
        else {
            const streak = await GetStreakAsync(Category[category])
            setStreakData(streak)
        }
    }, [streakData])

    const onPressSaveToPhoto = useCallback(async () => {
    }, [])

    const onPressShareImage = useCallback(async () => {
        if (!imageUri)
            return

        const res = await DownloadFileAsync(imageUri, 'data/image.jpg', true)

        Share
            .open({
                url: RNFS.DocumentDirectoryPath + '/data/image.jpg',
            })
            .catch((err) => {
                Alert.alert('Fail', '' + err)
            });
    }, [imageUri])

    // on init once (for load first post)

    useEffect(() => {
        SetStreakAsync(Category[category])
        onPressRandom()
    }, [])

    // on change theme

    useEffect(() => {
        navigation.setOptions({
            headerRight: () =>
                <TouchableOpacity onPress={onPressHeaderOption} style={styleSheet.headerOptionTO}>
                    <MaterialCommunityIcons name={Icon.ThreeDots} color={theme.counterPrimary} size={Size.Icon} />
                </TouchableOpacity>
        });
    }, [theme, onPressHeaderOption])

    // save last visit category screen

    useFocusEffect(useCallback(() => SaveCurrentScreenForLoadNextTime(navigation), []))

    return (
        <View pointerEvents={handling ? 'none' : 'auto'} style={[styleSheet.masterView, { backgroundColor: theme.background }]}>
            <View style={CommonStyles.flex_1} >
                {
                    handling ?
                        // true ?
                        <View style={CommonStyles.flex1_justifyContentCenter_AlignItemsCenter}>
                            <ActivityIndicator color={theme.counterPrimary} style={{ marginRight: Outline.Horizontal }} />
                        </View> :
                        <View style={CommonStyles.flex1_justifyContentCenter_AlignItemsCenter}>
                            {
                                reasonToReload.current !== NeedReloadReason.None ?
                                    // true ?
                                    <TouchableOpacity onPress={onPressRandom} style={[{ gap: Outline.GapVertical }, CommonStyles.flex1_justifyContentCenter_AlignItemsCenter]} >
                                        <MaterialCommunityIcons name={reasonToReload.current === NeedReloadReason.NoInternet ? Icon.NoInternet : Icon.HeartBroken} color={theme.primary} size={Size.IconBig} />
                                        <Text style={{ fontSize: FontSize.Normal, color: theme.counterPrimary }}>{reasonToReload.current === NeedReloadReason.NoInternet ? LocalText.no_internet : LocalText.cant_get_content}</Text>
                                        <Text style={{ fontSize: FontSize.Small_L, color: theme.counterPrimary }}>{LocalText.tap_to_retry}</Text>
                                    </TouchableOpacity>
                                    :
                                    <Image resizeMode='contain' source={{ uri: imageUri }} style={styleSheet.image} />
                            }
                        </View>
                }
            </View>
            <View>
                <TouchableOpacity onPress={onPressRandom} style={[{ gap: Outline.GapHorizontal, borderRadius: BorderRadius.BR8, padding: Outline.GapVertical_2, backgroundColor: theme.primary, }, styleSheet.randomTO]}>
                    <MaterialCommunityIcons name={Icon.Dice} color={theme.counterPrimary} size={Size.Icon} />
                    <Text style={{ color: theme.text, fontSize: FontSize.Normal }}>{LocalText.random}</Text>
                </TouchableOpacity>
            </View>
            <View style={[{ gap: Outline.GapHorizontal }, CommonStyles.row_width100Percent]}>
                <TouchableOpacity onPress={onPressSaveToPhoto} style={[styleSheet.subBtnTO, { flex: 1.5, gap: Outline.GapHorizontal, borderRadius: BorderRadius.BR8 }]}>
                    <MaterialCommunityIcons name={Icon.Share} color={theme.counterPrimary} size={Size.IconSmaller} />
                    <Text style={{ color: theme.text, fontSize: FontSize.Small_L }}>{LocalText.save}</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={onPressShareImage} style={[styleSheet.subBtnTO, { flex: 1.5, gap: Outline.GapHorizontal, borderRadius: BorderRadius.BR8 }]}>
                    <MaterialCommunityIcons name={Icon.Share} color={theme.counterPrimary} size={Size.IconSmaller} />
                    <Text style={{ color: theme.text, fontSize: FontSize.Small_L }}>{LocalText.share}</Text>
                </TouchableOpacity>
            </View>
            {
                streakData ? <StreakPopup streak={streakData} /> : undefined
            }
        </View>
    )
}

export default TheRandomImage

const styleSheet = StyleSheet.create({
    masterView: { padding: Outline.Horizontal, flex: 1, gap: Outline.GapVertical, },
    randomTO: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', width: '100%' },
    subBtnTO: { justifyContent: 'center', flexDirection: 'row', flex: 1, alignItems: 'center', },
    headerOptionTO: { marginRight: 15 },
    image: { width: '100%', height: '100%' }
})