// @ts-ignore
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { View, Text, TouchableOpacity, ActivityIndicator, Alert, StyleSheet, Image, TouchableWithoutFeedback, ScrollView } from 'react-native'
import React, { useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'
import { ThemeContext } from '../../constants/Colors'
import { BorderRadius, Category, FontSize, FontWeight, Icon, LocalText, NeedReloadReason, Outline, Size } from '../../constants/AppConstants'
import Share from 'react-native-share';
import RNFS from "react-native-fs";
import { useFocusEffect, useNavigation } from '@react-navigation/native'
import { TempDirName } from '../../handle/Utils'
import { SaveCurrentScreenForLoadNextTime, ToastTheme } from '../../handle/AppUtils'
import { CommonStyles } from '../../constants/CommonConstants'
import { GetStreakAsync, SetStreakAsync } from '../../handle/Streak';
import { PhotosOfTheYear, Streak } from '../../constants/Types';
import StreakPopup from '../components/StreakPopup';
import { ColorNameToRgb, ToCanPrint } from '../../handle/UtilsTS';
import { DownloadFileAsync, GetFLPFromRLP } from '../../handle/FileUtils';
import { SaveToGalleryAsync } from '../../handle/CameraRoll';
import { ToastOptions, toast } from '@baronha/ting';
import { NetLord } from '../../handle/NetLord';

const category = Category.AwardPicture
const dataOfYears: PhotosOfTheYear[] = require('../../../assets/json/photos_of_the_year.json')

const PicturesOfTheYearScreen = () => {
    const navigation = useNavigation();
    const reasonToReload = useRef<NeedReloadReason>(NeedReloadReason.None);
    const theme = useContext(ThemeContext);
    const [handling, setHandling] = useState(false);
    const [streakData, setStreakData] = useState<Streak | undefined>(undefined);
    const [selectingYear, setSelectingYear] = useState(dataOfYears[dataOfYears.length - 1].year)
    const [selectingPhotoIndex, setSelectingPhotoIndex] = useState(0)

    const selectingPhoto = useMemo(() => {
        const year = dataOfYears.find(y => y.year === selectingYear)
        return year?.list[selectingPhotoIndex]
    }, [selectingPhotoIndex, selectingYear])

    const renderIconReward = useCallback(() => {

        if (!selectingPhoto)
            return undefined

        if (!selectingPhoto.reward.includes('Grand') &&
            !selectingPhoto.reward.includes('Place'))
            return undefined

        let positionText = '1'
        let color = 'gold'

        if (selectingPhoto.reward.includes('First Place')) {
            positionText = '1'
            color = 'tomato'
        }
        else if (selectingPhoto.reward.includes('Second Place')) {
            positionText = '2'
            color = 'yellowgreen'
        }
        else if (selectingPhoto.reward.includes('Third Place')) {
            positionText = '3'
            color = 'sandybrown'
        }

        return <View style={[{ backgroundColor: color }, styleSheet.rewardIconView, CommonStyles.justifyContentCenter_AlignItemsCenter]}>
            {
                selectingPhoto?.reward.includes('Grand') ?
                    <MaterialCommunityIcons name={'crown'} color={theme.counterPrimary} size={Size.Icon} />
                    :
                    <Text style={[styleSheet.rewaredPositionText]}>{positionText}</Text>
            }
        </View>
    }, [selectingPhoto])

    const onPressYear = useCallback(async (year: number) => {
        setSelectingYear(year)
        setSelectingPhotoIndex(0)
    }, [])

    const onPressRandom = useCallback(async () => {
        reasonToReload.current = NeedReloadReason.None
        setHandling(true)

        const year = dataOfYears.find(y => y.year === selectingYear)

        if (!year)
            return
        let selectingIdx = selectingPhotoIndex

        if (selectingPhotoIndex < year.list.length - 1)
            selectingIdx++
        else
            selectingIdx = 0

        // if (uri) { // success
        //     SetStreakAsync(Category[category], -1)
        // }
        // else { // fail
        //     if (NetLord.IsAvailableLastestCheck())
        //         reasonToReload.current = NeedReloadReason.FailToGetContent
        //     else
        //         reasonToReload.current = NeedReloadReason.NoInternet
        // }

        setSelectingPhotoIndex(selectingIdx)
        setHandling(false)
    }, [selectingYear, selectingPhotoIndex])

    const onPressHeaderOption = useCallback(async () => {
        if (streakData)
            setStreakData(undefined)
        else {
            const streak = await GetStreakAsync(Category[category])
            setStreakData(streak)
        }
    }, [streakData])

    const onPressSaveToPhoto = useCallback(async () => {
        if (!selectingPhoto) {
            return
        }

        const flp = RNFS.DocumentDirectoryPath + '/' + TempDirName + '/image.jpg'
        const res = await DownloadFileAsync(selectingPhoto.imageUri, flp, false)

        if (res) {
            Alert.alert('Fail', ToCanPrint(res))
            return
        }

        const error = await SaveToGalleryAsync(flp)

        if (error !== null) { // error
            Alert.alert(LocalText.error, ToCanPrint(error));
        }
        else { // success
            const options: ToastOptions = {
                title: LocalText.saved,
                ...ToastTheme(theme, 'done')
            };

            toast(options);
        }
    }, [theme, selectingPhoto])

    const onPressShareImage = useCallback(async () => {
        if (!selectingPhoto)
            return

        const flp = GetFLPFromRLP(TempDirName + '/image.jpg', true)
        const res = await DownloadFileAsync(selectingPhoto.imageUri, flp, false)

        if (res) {
            Alert.alert('Fail', ToCanPrint(res))
            return
        }

        Share
            .open({
                url: flp,
            })
            .catch((err) => {
                const error = ToCanPrint(err)

                if (!error.includes('User did not share'))
                    Alert.alert('Fail', error)
            });
    }, [selectingPhoto])

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
                        // loading
                        <View style={CommonStyles.flex1_justifyContentCenter_AlignItemsCenter}>
                            <ActivityIndicator color={theme.counterPrimary} style={{ marginRight: Outline.Horizontal }} />
                        </View> :
                        <View style={CommonStyles.width100PercentHeight100Percent}>
                            {
                                reasonToReload.current !== NeedReloadReason.None ?
                                    // error
                                    <TouchableOpacity onPress={onPressRandom} style={[{ gap: Outline.GapVertical }, CommonStyles.flex1_justifyContentCenter_AlignItemsCenter]} >
                                        <MaterialCommunityIcons name={reasonToReload.current === NeedReloadReason.NoInternet ? Icon.NoInternet : Icon.HeartBroken} color={theme.primary} size={Size.IconBig} />
                                        <Text style={{ fontSize: FontSize.Normal, color: theme.counterPrimary }}>{reasonToReload.current === NeedReloadReason.NoInternet ? LocalText.no_internet : LocalText.cant_get_content}</Text>
                                        <Text style={{ fontSize: FontSize.Small_L, color: theme.counterPrimary }}>{LocalText.tap_to_retry}</Text>
                                    </TouchableOpacity>
                                    :
                                    // content
                                    <View style={[{ gap: Outline.GapHorizontal }, CommonStyles.width100PercentHeight100Percent]}>
                                        <View>
                                            <ScrollView horizontal contentContainerStyle={[styleSheet.scrollYear]}>
                                                {
                                                    dataOfYears.map((year) => {
                                                        return <TouchableOpacity onPress={() => onPressYear(year.year)} style={[styleSheet.yearView, { backgroundColor: selectingYear === year.year ? theme.primary : undefined }]} key={year.year}>
                                                            <Text style={{ color: theme.text }}>{year.year}</Text>
                                                        </TouchableOpacity>
                                                    })
                                                }
                                            </ScrollView>
                                        </View>
                                        {/* title */}
                                        <View style={[{ flexDirection: 'row', gap: Outline.GapHorizontal }, CommonStyles.justifyContentCenter_AlignItemsCenter]}>
                                            {
                                                renderIconReward()
                                            }
                                            <Text style={[{ color: theme.text, }, styleSheet.rewardText]}>{selectingPhoto?.reward + (selectingPhoto?.category ? ' - ' + selectingPhoto?.category : '')}</Text>
                                        </View>
                                        {/* image */}
                                        <TouchableWithoutFeedback onPress={onPressRandom}>
                                            <Image resizeMode='contain' source={{ uri: selectingPhoto?.imageUri }} style={styleSheet.image} />
                                        </TouchableWithoutFeedback>
                                        <Text selectable style={[{ color: theme.text }, styleSheet.titleText]}>{selectingPhoto?.title}</Text>
                                        <Text selectable style={[{ color: theme.text }, styleSheet.authorText]}>{selectingPhoto?.author + (selectingPhoto?.country ? ' (' + selectingPhoto?.country + ')' : '')}</Text>
                                    </View>
                            }
                        </View>
                }
            </View>
            <View style={{ marginHorizontal: Outline.GapVertical_2 }}>
                <TouchableOpacity onPress={onPressRandom} style={[{ gap: Outline.GapHorizontal, borderRadius: BorderRadius.BR8, padding: Outline.GapVertical_2, backgroundColor: theme.primary, }, styleSheet.randomTO]}>
                    <MaterialCommunityIcons name={Icon.Dice} color={theme.counterPrimary} size={Size.Icon} />
                    <Text style={{ color: theme.text, fontSize: FontSize.Normal }}>{LocalText.random}</Text>
                </TouchableOpacity>
            </View>
            <View style={[{ marginBottom: Outline.GapVertical, gap: Outline.GapHorizontal }, CommonStyles.row_width100Percent]}>
                <TouchableOpacity onPress={onPressSaveToPhoto} style={[styleSheet.subBtnTO, { flex: 1.5, gap: Outline.GapHorizontal, borderRadius: BorderRadius.BR8 }]}>
                    <MaterialCommunityIcons name={Icon.Download} color={theme.counterPrimary} size={Size.IconSmaller} />
                    <Text style={{ color: theme.text, fontSize: FontSize.Small_L }}>{LocalText.save}</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={onPressShareImage} style={[styleSheet.subBtnTO, { flex: 1.5, gap: Outline.GapHorizontal, borderRadius: BorderRadius.BR8 }]}>
                    <MaterialCommunityIcons name={Icon.ShareImage} color={theme.counterPrimary} size={Size.IconSmaller} />
                    <Text style={{ color: theme.text, fontSize: FontSize.Small_L }}>{LocalText.share}</Text>
                </TouchableOpacity>
            </View>
            {
                streakData ? <StreakPopup streak={streakData} /> : undefined
            }
        </View>
    )
}

export default PicturesOfTheYearScreen

const styleSheet = StyleSheet.create({
    masterView: { flex: 1, gap: Outline.GapVertical, },
    randomTO: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', width: '100%' },
    subBtnTO: { justifyContent: 'center', flexDirection: 'row', flex: 1, alignItems: 'center', },
    headerOptionTO: { marginRight: 15 },
    image: { flex: 1 },
    rewardText: { fontWeight: FontWeight.B600, textAlign: 'center', fontSize: FontSize.Normal },
    titleText: { fontWeight: FontWeight.B600, textAlign: 'center', fontSize: FontSize.Normal },
    rewaredPositionText: { fontWeight: FontWeight.B600, textAlign: 'center', fontSize: FontSize.Normal, color: 'white' },
    authorText: { textAlign: 'center', fontSize: FontSize.Small_L },
    scrollYear: { gap: Outline.Horizontal, paddingLeft: Outline.GapVertical, paddingTop: Outline.GapVertical, },
    yearView: { padding: Outline.GapHorizontal, borderRadius: BorderRadius.BR8, borderWidth: StyleSheet.hairlineWidth },
    rewardIconView: { padding: Outline.VerticalMini },
})