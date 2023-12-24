import { View, Text, TouchableOpacity, ActivityIndicator } from 'react-native'
import React, { useCallback, useContext, useEffect, useRef, useState } from 'react'
import { useAppDispatch } from '../../redux/Store'
import { ThemeContext } from '../../constants/Colors'
import { BorderRadius, FontSize, LocalText, NeedReloadReason, Outline, Size } from '../../constants/AppConstants'

// @ts-ignore
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

// @ts-ignore
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { NetLord } from '../../handle/NetLord'
import { useFocusEffect, useNavigation } from '@react-navigation/native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { Cheat } from '../../handle/Cheat'
import { PickRandomElement } from '../../handle/Utils'
import { CopyAndToast } from '../../handle/AppUtils'

interface TheRandomShortTextProps {
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
    getTextAsync,
}: TheRandomShortTextProps) => {
    const navigation = useNavigation();
    const [text, setText] = useState<string | undefined>('undefined')
    const reasonToReload = useRef<NeedReloadReason>(NeedReloadReason.None);
    const theme = useContext(ThemeContext);
    const [handling, setHandling] = useState(false);

    const onPressRandom = useCallback(async () => {
        reasonToReload.current = NeedReloadReason.None
        setHandling(true)

        let text: string | undefined

        if (__DEV__ && !Cheat('ForceRealApiTextContent'))
            text = PickRandomElement(FakeTextContents)
        else
            text = await getTextAsync()

        setText(text)

        if (!text) { // fail
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

    // on init once (for load first post)

    useEffect(() => {
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
        <View style={{ padding: Outline.Horizontal, backgroundColor: theme.background, flex: 1, gap: Outline.GapVertical, }}>
            <View style={{ flex: 1 }}>
                {
                    handling ?
                        // true ?
                        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', }}>
                            <ActivityIndicator color={theme.counterPrimary} style={{ marginRight: Outline.Horizontal }} />
                        </View> :
                        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', }}>
                            {
                                reasonToReload.current !== NeedReloadReason.None ?
                                    // true ?
                                    <TouchableOpacity onPress={onPressRandom} style={{ flex: 1, justifyContent: 'center', alignItems: 'center', gap: Outline.GapVertical }} >
                                        <MaterialCommunityIcons name={reasonToReload.current === NeedReloadReason.NoInternet ? 'access-point-network-off' : 'heart-broken'} color={theme.primary} size={Size.IconBig} />
                                        <Text style={{ fontSize: FontSize.Normal, color: theme.counterPrimary }}>{reasonToReload.current === NeedReloadReason.NoInternet ? LocalText.no_internet : LocalText.cant_get_content}</Text>
                                        <Text style={{ fontSize: FontSize.Small_L, color: theme.counterPrimary }}>{LocalText.tap_to_retry}</Text>
                                    </TouchableOpacity>
                                    :
                                    <Text style={{ color: theme.text, fontSize: FontSize.Big }}>{text}</Text>
                            }
                        </View>
                }
            </View>
            <View>
                <TouchableOpacity onPress={onPressRandom} style={{ flexDirection: 'row', justifyContent: 'center', gap: Outline.GapHorizontal, alignItems: 'center', borderRadius: BorderRadius.BR8, padding: Outline.GapVertical_2, backgroundColor: theme.primary, width: '100%' }}>
                    <MaterialCommunityIcons name={'dice-5-outline'} color={theme.counterPrimary} size={Size.Icon} />
                    <Text style={{ color: theme.text, fontSize: FontSize.Normal }}>Random</Text>
                </TouchableOpacity>
            </View>
            <View style={{ flexDirection: 'row', width: '100%', gap: Outline.GapHorizontal }}>
                <TouchableOpacity onPress={onPressCopy} style={{ gap: Outline.GapHorizontal, justifyContent: 'center', flexDirection: 'row', flex: 1, alignItems: 'center', borderRadius: BorderRadius.BR8 }}>
                    <MaterialIcons name={'content-copy'} color={theme.counterPrimary} size={Size.IconSmaller} />
                    <Text style={{ color: theme.text, fontSize: FontSize.Small_L }}>Copy</Text>
                </TouchableOpacity>

                <TouchableOpacity style={{ gap: Outline.GapHorizontal, justifyContent: 'center', flexDirection: 'row', flex: 1, alignItems: 'center', borderRadius: BorderRadius.BR8, }}>
                    <MaterialIcons name={'share'} color={theme.counterPrimary} size={Size.IconSmaller} />
                    <Text style={{ color: theme.text, fontSize: FontSize.Small_L }}>Share</Text>
                </TouchableOpacity>

                <TouchableOpacity style={{ gap: Outline.GapHorizontal, justifyContent: 'center', flexDirection: 'row', flex: 1.5, alignItems: 'center', borderRadius: BorderRadius.BR8, }}>
                    <MaterialCommunityIcons name={'share'} color={theme.counterPrimary} size={Size.IconSmaller} />
                    <Text style={{ color: theme.text, fontSize: FontSize.Small_L }}>Share Image</Text>
                </TouchableOpacity>

            </View>
        </View>
    )
}

export default TheRandomShortText