import { View, Text, TouchableOpacity, ActivityIndicator, Share as RNShare, ShareContent, ShareOptions, Alert, StyleSheet } from 'react-native'
import React, { LegacyRef, useCallback, useContext, useEffect, useRef, useState } from 'react'
import { ThemeContext } from '../../constants/Colors'
import { BorderRadius, Category, FontSize, LocalText, NeedReloadReason, Outline, Size } from '../../constants/AppConstants'
import Share from 'react-native-share';

// @ts-ignore
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

// @ts-ignore
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { NetLord } from '../../handle/NetLord'
import { useFocusEffect, useNavigation } from '@react-navigation/native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { Cheat } from '../../handle/Cheat'
import { DelayAsync, PickRandomElement } from '../../handle/Utils'
import { CopyAndToast } from '../../handle/AppUtils'
import ViewShot from 'react-native-view-shot'
import { CommonStyles } from '../../constants/CommonConstants'
import { GetStreakAsync, SetStreakAsync } from '../../handle/Streak';

interface TheRandomShortTextProps {
    category: Category,
    getTextAsync: () => Promise<string | undefined>
}

const FakeTextContents = [
    'Winter hazards such as wind, cold, snow, or whiteout conditions can turn an outing into a tragedy. Have a plan and a back-up plan in case parking is limited or conditions are unsafe. Weather can change quickly!',
    'This is the closest I can get for web support with available APIs. Since Safari does not support captureStream, I wont be able to read the FPS yet',
    'Strategy games are an irresistibly fun way to improve our decision-making skills, but what makes these type of games so alluring?',
    'This group will pump again soon.',
    'Profitable trades are being shared here',
]

const TheRandomShortText = ({
    category,
    getTextAsync,
}: TheRandomShortTextProps) => {
    const navigation = useNavigation();
    const [text, setText] = useState<string | undefined>('undefined')
    const reasonToReload = useRef<NeedReloadReason>(NeedReloadReason.None);
    const theme = useContext(ThemeContext);
    const [handling, setHandling] = useState(false);
    const ref = useRef<LegacyRef<ViewShot> | undefined>();

    const onPressRandom = useCallback(async () => {
        reasonToReload.current = NeedReloadReason.None
        setHandling(true)

        let text: string | undefined

        if (__DEV__ && !Cheat('ForceRealApiTextContent'))
        {
            await DelayAsync(500)
            text = PickRandomElement(FakeTextContents)
        }
        else
            text = await getTextAsync()

        setText(text)

        if (text) { // success
            SetStreakAsync(Category[category], true)
        }
        else { // fail
            if (NetLord.IsAvailableLastestCheck())
                reasonToReload.current = NeedReloadReason.FailToGetContent
            else
                reasonToReload.current = NeedReloadReason.NoInternet
        }

        setHandling(false)
    }, [])

    const onPressCopy = useCallback(() => {
        if (!text)
            return

        CopyAndToast(text, theme)
    }, [text, theme])

    const onPressShareText = useCallback(() => {
        if (!text)
            return

        RNShare.share({
            title: LocalText.fact_of_the_day,
            message: text,
        } as ShareContent,
            {
                tintColor: theme.primary,
            } as ShareOptions)
    }, [text, theme])

    const onPressShareImage = useCallback(() => {
        if (!text)
            return

        // @ts-ignore
        ref.current.capture().then(async (uri: string) => {
            Share
                .open({
                    url: uri,
                })
                .then((res) => {

                })
                .catch((err) => {
                    Alert.alert('Fail', '' + err)
                });
        })
    }, [text, theme])

    // on init once (for load first post)

    useEffect(() => {
        SetStreakAsync(Category[category])
        onPressRandom()
    }, [])

    // save last visit category screen

    useFocusEffect(
        useCallback(() => {
            const state = navigation.getState();
            const screenName = state.routeNames[state.index];
            AsyncStorage.setItem('categoryScreenToOpenFirst', screenName);
        }, [])
    );

    return (
        <View pointerEvents={handling ? 'none' : 'auto'} style={[styleSheet.masterView, { backgroundColor: theme.background }]}>
            {/* @ts-ignore */}
            <ViewShot style={CommonStyles.flex_1} ref={ref} options={{ fileName: "Your-File-Name", format: "jpg", quality: 1 }}>
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
                                        <MaterialCommunityIcons name={reasonToReload.current === NeedReloadReason.NoInternet ? 'access-point-network-off' : 'heart-broken'} color={theme.primary} size={Size.IconBig} />
                                        <Text style={{ fontSize: FontSize.Normal, color: theme.counterPrimary }}>{reasonToReload.current === NeedReloadReason.NoInternet ? LocalText.no_internet : LocalText.cant_get_content}</Text>
                                        <Text style={{ fontSize: FontSize.Small_L, color: theme.counterPrimary }}>{LocalText.tap_to_retry}</Text>
                                    </TouchableOpacity>
                                    :
                                    <Text style={{ color: theme.text, fontSize: FontSize.Big }}>{text}</Text>
                            }
                        </View>
                }
            </ViewShot>
            <View>
                <TouchableOpacity onPress={onPressRandom} style={[{ gap: Outline.GapHorizontal, borderRadius: BorderRadius.BR8, padding: Outline.GapVertical_2, backgroundColor: theme.primary, }, styleSheet.randomTO]}>
                    <MaterialCommunityIcons name={'dice-5-outline'} color={theme.counterPrimary} size={Size.Icon} />
                    <Text style={{ color: theme.text, fontSize: FontSize.Normal }}>{LocalText.random}</Text>
                </TouchableOpacity>
            </View>
            <View style={[{ gap: Outline.GapHorizontal }, CommonStyles.row_width100Percent]}>
                <TouchableOpacity onPress={onPressCopy} style={[{ gap: Outline.GapHorizontal, borderRadius: BorderRadius.BR8 }, styleSheet.subBtnTO]}>
                    <MaterialIcons name={'content-copy'} color={theme.counterPrimary} size={Size.IconSmaller} />
                    <Text style={{ color: theme.text, fontSize: FontSize.Small_L }}>{LocalText.copy}</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={onPressShareText} style={[{ gap: Outline.GapHorizontal, borderRadius: BorderRadius.BR8 }, styleSheet.subBtnTO]}>
                    <MaterialIcons name={'share'} color={theme.counterPrimary} size={Size.IconSmaller} />
                    <Text style={{ color: theme.text, fontSize: FontSize.Small_L }}>{LocalText.share}</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={onPressShareImage} style={[styleSheet.subBtnTO, { flex: 1.5, gap: Outline.GapHorizontal, borderRadius: BorderRadius.BR8 }]}>
                    <MaterialCommunityIcons name={'share'} color={theme.counterPrimary} size={Size.IconSmaller} />
                    <Text style={{ color: theme.text, fontSize: FontSize.Small_L }}>{LocalText.share_image}</Text>
                </TouchableOpacity>

            </View>
        </View>
    )
}

export default TheRandomShortText

const styleSheet = StyleSheet.create({
    masterView: { padding: Outline.Horizontal, flex: 1, gap: Outline.GapVertical, },
    randomTO: { flexDirection: 'row', justifyContent: 'center',  alignItems: 'center', width: '100%' },
    subBtnTO: { justifyContent: 'center', flexDirection: 'row', flex: 1, alignItems: 'center',  }
})