import { View, Text, TouchableOpacity, ActivityIndicator, StyleSheet } from 'react-native'
import React, { LegacyRef, useCallback, useContext, useEffect, useRef, useState } from 'react'
import { ThemeContext } from '../../constants/Colors'
import { BorderRadius, Category, FontSize, FontWeight, Icon, LocalText, NeedReloadReason, Outline, Size } from '../../constants/AppConstants'

// @ts-ignore
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

// @ts-ignore
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useFocusEffect, useNavigation } from '@react-navigation/native'
import { SaveCurrentScreenForLoadNextTime, ToastTheme } from '../../handle/AppUtils'
import ViewShot from 'react-native-view-shot'
import { CommonStyles } from '../../constants/CommonConstants'
import { GetStreakAsync, SetStreakAsync } from '../../handle/Streak';
import { Streak, Trivia, TriviaAnswerType, TriviaDifficulty } from '../../constants/Types';
import StreakPopup from '../components/StreakPopup';
import { NetLord } from '../../handle/NetLord';
import { ToastOptions, toast } from '@baronha/ting';
import { PickRandomElement } from '../../handle/Utils';

interface TheTriviaProps {
    category: Category,
    getTriviaAsync: () => Promise<Trivia | undefined>
}

const CorrectToasts = [
    LocalText.you_are_awesome,
    LocalText.great,
    LocalText.you_rock,
    LocalText.cool,
]

const Difficulties: TriviaDifficulty[] = ['all', 'easy', 'medium', 'hard']

const AnswerTypes: TriviaAnswerType[] = ['all', 'multi', 'truefalse']

const TheTrivia = ({
    category,
    getTriviaAsync,
}: TheTriviaProps) => {
    const navigation = useNavigation();
    const [trivia, setTrivia] = useState<Trivia | undefined>(undefined)
    const [allAnswer, setAllAnswer] = useState<string[] | undefined>(undefined)
    const reasonToReload = useRef<NeedReloadReason>(NeedReloadReason.None);
    const theme = useContext(ThemeContext);
    const [handling, setHandling] = useState(false);
    const [streakData, setStreakData] = useState<Streak | undefined>(undefined);
    const [userChosenAnswer, setUserChosenAnswer] = useState<string | undefined>(undefined);
    const [difficulty, setDifficulty] = useState<TriviaDifficulty>('all');
    const [type, setType] = useState<TriviaAnswerType>('all');
    const viewShotRef = useRef<LegacyRef<ViewShot> | undefined>();

    const onPressDifficulty = useCallback(async (diff: TriviaDifficulty) => {
        setDifficulty(diff)
    }, [])
    
    const onPressAnswerType = useCallback(async (type: TriviaAnswerType) => {
        setType(type)
    }, [])

    const onPressRandom = useCallback(async () => {
        reasonToReload.current = NeedReloadReason.None
        setHandling(true)
        setUserChosenAnswer(undefined)

        let res: Trivia | undefined = await getTriviaAsync()

        setTrivia(res)

        if (res) { // success
            const arr = res.incorrectAnswer.concat(res.answer)
            arr.sort()
            setAllAnswer(arr)

            SetStreakAsync(Category[category], -1)
        }
        else { // fail
            setAllAnswer(undefined)

            if (NetLord.IsAvailableLastestCheck())
                reasonToReload.current = NeedReloadReason.FailToGetContent
            else
                reasonToReload.current = NeedReloadReason.NoInternet
        }

        setHandling(false)
    }, [])

    const onPressCopy = useCallback(() => {
        // if (!text)
        //     return

        // CopyAndToast(text, theme)
    }, [trivia, theme])

    const onPressHeaderOption = useCallback(async () => {
        if (streakData)
            setStreakData(undefined)
        else {
            const streak = await GetStreakAsync(Category[category])
            setStreakData(streak)
        }
    }, [streakData])

    const onPressShareText = useCallback(() => {
        // if (!text)
        //     return

        // RNShare.share({
        //     title: LocalText.fact_of_the_day,
        //     message: text,
        // } as ShareContent,
        //     {
        //         tintColor: theme.primary,
        //     } as ShareOptions)
    }, [trivia, theme])

    const onPressAnwser = useCallback((answer: string) => {
        if (userChosenAnswer) // already pick answer
            return

        setUserChosenAnswer(answer)

        if (answer === trivia?.answer) { // correct
            const options: ToastOptions = {
                title: PickRandomElement(CorrectToasts),
                ...ToastTheme(theme, 'done')
            };

            toast(options);
        }
    }, [trivia, userChosenAnswer, theme])

    const onPressShareImage = useCallback(() => {
        // if (!text)
        //     return

        // // @ts-ignore
        // viewShotRef.current.capture().then(async (uri: string) => {
        //     Share
        //         .open({
        //             url: uri,
        //         })
        //         .catch((err) => {
        //             const error = ToCanPrint(err)

        //             if (!error.includes('User did not share'))
        //                 Alert.alert('Fail', error)
        //         });
        // })
    }, [trivia, theme])

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
            <View style={{ flexDirection: 'row', gap: Outline.GapHorizontal }}>
                <Text style={{ fontWeight: FontWeight.B500, padding: Outline.VerticalMini, color: theme.text, fontSize: FontSize.Small }}>{LocalText.difficulty}: </Text>
                {
                    Difficulties.map((diff: TriviaDifficulty) => <TouchableOpacity key={diff} onPress={() => setDifficulty(diff)} style={{ borderWidth: diff === difficulty ? 1 : 0, borderColor: theme.text, padding: Outline.VerticalMini, borderRadius: BorderRadius.BR8 }}>
                        <Text style={{ color: theme.text, fontSize: FontSize.Small }}>{diff}</Text>
                    </TouchableOpacity>)
                }
            </View>
            <View style={{ flexDirection: 'row', gap: Outline.GapHorizontal }}>
                <Text style={{ fontWeight: FontWeight.B500, padding: Outline.VerticalMini, color: theme.text, fontSize: FontSize.Small }}>{LocalText.answer_type}: </Text>
                {
                    AnswerTypes.map((diff: TriviaAnswerType) => <TouchableOpacity key={diff} onPress={() => setType(diff)} style={{ borderWidth: diff === type ? 1 : 0, borderColor: theme.text, padding: Outline.VerticalMini, borderRadius: BorderRadius.BR8 }}>
                        <Text style={{ color: theme.text, fontSize: FontSize.Small }}>{diff}</Text>
                    </TouchableOpacity>)
                }
            </View>
            {/* @ts-ignore */}
            <ViewShot style={CommonStyles.flex_1} ref={viewShotRef} options={{ fileName: "Your-File-Name", format: "jpg", quality: 1 }}>
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
                                        <View style={{ gap: Outline.GapVertical }}>
                                            <Text style={{ color: theme.text, fontSize: FontSize.Big, marginBottom: Outline.Horizontal }}>{trivia?.question}</Text>
                                            {
                                                allAnswer?.map((answer: string) => {
                                                    let bgColor: string | undefined = undefined
                                                    let icon = ''

                                                    if (userChosenAnswer !== undefined) { // user did pick answer
                                                        if (answer === trivia?.answer) {
                                                            bgColor = 'green'
                                                            icon = Icon.Check
                                                        }
                                                        else if (answer === userChosenAnswer) {
                                                            bgColor = 'red'
                                                            icon = Icon.X
                                                        }
                                                    }

                                                    return <TouchableOpacity onPress={() => onPressAnwser(answer)} style={[styleSheet.answerTO, { backgroundColor: bgColor }, { gap: Outline.GapHorizontal, padding: Outline.GapVertical, borderRadius: BorderRadius.BR8 }]} key={answer}>
                                                        {
                                                            icon === '' ?
                                                                undefined :
                                                                <MaterialCommunityIcons name={icon} color={'white'} size={Size.Icon} />
                                                        }
                                                        <Text style={{ verticalAlign: 'middle', textAlign: 'center', fontSize: FontSize.Small_L, color: bgColor ? 'white' : theme.text }}>{answer}</Text>
                                                    </TouchableOpacity>
                                                })
                                            }
                                        </View>
                                }
                            </View>
                    }
                </View>
            </ViewShot>
            <View>
                <TouchableOpacity onPress={onPressRandom} style={[{ gap: Outline.GapHorizontal, borderRadius: BorderRadius.BR8, padding: Outline.GapVertical_2, backgroundColor: theme.primary, }, styleSheet.randomTO]}>
                    <MaterialCommunityIcons name={Icon.Dice} color={theme.counterPrimary} size={Size.Icon} />
                    <Text style={{ color: theme.text, fontSize: FontSize.Normal }}>{LocalText.random}</Text>
                </TouchableOpacity>
            </View>
            <View style={[{ gap: Outline.GapHorizontal }, CommonStyles.row_width100Percent]}>
                <TouchableOpacity onPress={onPressCopy} style={[{ gap: Outline.GapHorizontal, borderRadius: BorderRadius.BR8 }, styleSheet.subBtnTO]}>
                    <MaterialIcons name={Icon.Copy} color={theme.counterPrimary} size={Size.IconSmaller} />
                    <Text style={{ color: theme.text, fontSize: FontSize.Small_L }}>{LocalText.copy}</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={onPressShareText} style={[{ gap: Outline.GapHorizontal, borderRadius: BorderRadius.BR8 }, styleSheet.subBtnTO]}>
                    <MaterialCommunityIcons name={Icon.ShareText} color={theme.counterPrimary} size={Size.IconSmaller} />
                    <Text style={{ color: theme.text, fontSize: FontSize.Small_L }}>{LocalText.share}</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={onPressShareImage} style={[styleSheet.subBtnTO, { flex: 1.5, gap: Outline.GapHorizontal, borderRadius: BorderRadius.BR8 }]}>
                    <MaterialCommunityIcons name={Icon.ShareImage} color={theme.counterPrimary} size={Size.IconSmaller} />
                    <Text style={{ color: theme.text, fontSize: FontSize.Small_L }}>{LocalText.share_image}</Text>
                </TouchableOpacity>

            </View>
            {
                streakData ? <StreakPopup streak={streakData} /> : undefined
            }
        </View>
    )
}

export default TheTrivia

const styleSheet = StyleSheet.create({
    masterView: { padding: Outline.Horizontal, flex: 1, gap: Outline.GapVertical, },
    randomTO: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', width: '100%' },
    subBtnTO: { justifyContent: 'center', flexDirection: 'row', flex: 1, alignItems: 'center', },
    headerOptionTO: { marginRight: 15 },
    answerTO: { flexDirection: 'row', justifyContent: 'center', borderWidth: StyleSheet.hairlineWidth * 2, }
})