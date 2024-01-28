import { View, Text, TouchableOpacity, ActivityIndicator, StyleSheet, Animated } from 'react-native'
import React, { useCallback, useContext, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { ThemeContext } from '../../constants/Colors'
import { BorderRadius, Category, FontSize, FontWeight, Icon, LocalText, NeedReloadReason, Outline, Size, StorageKey_TriviaAnswerType, StorageKey_TriviaDifficulty } from '../../constants/AppConstants'

// @ts-ignore
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useFocusEffect, useNavigation } from '@react-navigation/native'
import { SaveCurrentScreenForLoadNextTime, ToastTheme } from '../../handle/AppUtils'
import { CommonStyles } from '../../constants/CommonConstants'
import { GetStreakAsync, SetStreakAsync } from '../../handle/Streak';
import { Streak, Trivia, TriviaAnswerType, TriviaDifficulty } from '../../constants/Types';
import StreakPopup from '../components/StreakPopup';
import { NetLord } from '../../handle/NetLord';
import { ToastOptions, toast } from '@baronha/ting';
import { PickRandomElement } from '../../handle/Utils';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { track_PressRandom, track_SimpleWithParam } from '../../handle/tracking/GoodayTracking';
import { SwipeResult, useSimpleGesture } from '../../hooks/useSimpleGesture';
import { playAnimLoadedMedia } from '../../handle/GoodayAnimation';
import HeaderSettingButton from '../components/HeaderSettingButton';

const TOAnim = Animated.createAnimatedComponent(TouchableOpacity)

interface TheTriviaProps {
    category: Category,
    getTriviaAsync: (difficulty: TriviaDifficulty, answerType: TriviaAnswerType) => Promise<Trivia | undefined>
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

    const mediaViewScaleAnimRef = useRef((Array(4).fill(0).map(i => new Animated.Value(1))))

    useEffect(() => {
        if (!trivia)
            return

        for (let i = 0; i < trivia.answer.length && i < mediaViewScaleAnimRef.current.length; i++) {
            playAnimLoadedMedia(mediaViewScaleAnimRef.current[i], i * 200)
        }
    }, [trivia])

    const onPressDifficulty = useCallback(async (diff: TriviaDifficulty) => {
        setDifficulty(diff)
        AsyncStorage.setItem(StorageKey_TriviaDifficulty, diff)
    }, [])

    const onPressAnswerType = useCallback(async (type: TriviaAnswerType) => {
        setType(type)
        AsyncStorage.setItem(StorageKey_TriviaAnswerType, type)
    }, [])

    const onPressRandom = useCallback(async (shouldTracking: boolean) => {
        reasonToReload.current = NeedReloadReason.None
        setHandling(true)
        setUserChosenAnswer(undefined)

        const diff = await AsyncStorage.getItem(StorageKey_TriviaDifficulty)
        const thediff: TriviaDifficulty = diff ? diff as TriviaDifficulty : 'all'

        const typee = await AsyncStorage.getItem(StorageKey_TriviaAnswerType)
        const thetype: TriviaAnswerType = typee ? typee as TriviaAnswerType : 'all'

        let res: Trivia | undefined = await getTriviaAsync(thediff, thetype)

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

        track_PressRandom(shouldTracking, category, res !== undefined)

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

    const onPressAnwser = useCallback((answer: string) => {
        if (userChosenAnswer) // already pick answer
            return

        setUserChosenAnswer(answer)
        const isCorrect = answer === trivia?.answer

        if (isCorrect) { // correct
            const options: ToastOptions = {
                title: PickRandomElement(CorrectToasts),
                ...ToastTheme(theme, 'done')
            };

            toast(options);
        }

        track_SimpleWithParam('trivia_correct', isCorrect.toString())
    }, [trivia, userChosenAnswer, theme])

    const onSwiped = useCallback((result: SwipeResult) => {
        if (result.primaryDirectionIsHorizontalOrVertical && !result.primaryDirectionIsPositive) {
            onPressRandom(true)
        }
    }, [])

    const [onBigViewStartTouch, onBigViewEndTouch] = useSimpleGesture(undefined, undefined, onSwiped)

    // on init once (for load first post)

    useEffect(() => {
        const handle = async () => {
            SetStreakAsync(Category[category])
            onPressRandom(false)

            const diff = await AsyncStorage.getItem(StorageKey_TriviaDifficulty)
            const thediff: TriviaDifficulty = diff ? diff as TriviaDifficulty : 'all'
            setDifficulty(thediff)

            const typee = await AsyncStorage.getItem(StorageKey_TriviaAnswerType)
            const thetype: TriviaAnswerType = typee ? typee as TriviaAnswerType : 'all'
            setType(thetype)
        }

        handle()
    }, [])

    // on change theme

    useEffect(() => {
        navigation.setOptions({
            headerRight: () => <HeaderSettingButton onPress={onPressHeaderOption} />
        });
    }, [onPressHeaderOption])

    // save last visit category screen

    useFocusEffect(useCallback(() => SaveCurrentScreenForLoadNextTime(navigation), []))

    return (
        <View pointerEvents={handling ? 'none' : 'auto'} style={[styleSheet.masterView, { backgroundColor: theme.background }]}>
            <View style={{ flexDirection: 'row', gap: Outline.GapHorizontal }}>
                <Text style={{ fontWeight: FontWeight.B500, padding: Outline.VerticalMini, color: theme.counterBackground, fontSize: FontSize.Small }}>{LocalText.difficulty}: </Text>
                {
                    Difficulties.map((diff: TriviaDifficulty) => <TouchableOpacity key={diff} onPress={() => onPressDifficulty(diff)} style={{ borderWidth: diff === difficulty ? 1 : 0, borderColor: theme.counterBackground, padding: Outline.VerticalMini, borderRadius: BorderRadius.BR8 }}>
                        <Text style={{ color: theme.counterBackground, fontSize: FontSize.Small }}>{diff}</Text>
                    </TouchableOpacity>)
                }
            </View>
            <View style={{ flexDirection: 'row', gap: Outline.GapHorizontal }}>
                <Text style={{ fontWeight: FontWeight.B500, padding: Outline.VerticalMini, color: theme.counterBackground, fontSize: FontSize.Small }}>{LocalText.answer_type}: </Text>
                {
                    AnswerTypes.map((itype: TriviaAnswerType) => <TouchableOpacity key={itype} onPress={() => onPressAnswerType(itype)} style={{ borderWidth: itype === type ? 1 : 0, borderColor: theme.counterBackground, padding: Outline.VerticalMini, borderRadius: BorderRadius.BR8 }}>
                        <Text style={{ color: theme.counterBackground, fontSize: FontSize.Small }}>{itype}</Text>
                    </TouchableOpacity>)
                }
            </View>
            <View style={CommonStyles.flex_1} >
                {
                    handling ?
                        // true ?
                        <View style={CommonStyles.flex1_justifyContentCenter_AlignItemsCenter}>
                            <ActivityIndicator color={theme.counterBackground} style={{ marginRight: Outline.Horizontal }} />
                        </View> :
                        <View style={CommonStyles.flex1_justifyContentCenter_AlignItemsCenter}>
                            {
                                reasonToReload.current !== NeedReloadReason.None ?
                                    // true ?
                                    <TouchableOpacity onPress={() => onPressRandom(true)} style={[{ gap: Outline.GapVertical }, CommonStyles.flex1_justifyContentCenter_AlignItemsCenter]} >
                                        <MaterialCommunityIcons name={reasonToReload.current === NeedReloadReason.NoInternet ? Icon.NoInternet : Icon.HeartBroken} color={theme.counterBackground} size={Size.IconMedium} />
                                        <Text style={{ fontSize: FontSize.Normal, color: theme.counterBackground }}>{reasonToReload.current === NeedReloadReason.NoInternet ? LocalText.no_internet : LocalText.cant_get_content}</Text>
                                        <Text style={{ fontSize: FontSize.Small_L, color: theme.counterBackground }}>{LocalText.tap_to_retry}</Text>
                                    </TouchableOpacity>
                                    :
                                    <View onTouchStart={onBigViewStartTouch} onTouchEnd={onBigViewEndTouch} style={{ gap: Outline.GapVertical }}>
                                        <TouchableOpacity
                                        // onPress={() => onPressRandom(true)}
                                        >
                                            <Text selectable style={{ color: theme.counterBackground, fontSize: FontSize.Big, marginBottom: Outline.Horizontal }}>{trivia?.question}</Text>
                                        </TouchableOpacity>
                                        {
                                            allAnswer?.map((answer: string, index: number) => {
                                                let bgColor: string | undefined = theme.background
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

                                                return <TOAnim onPress={() => onPressAnwser(answer)} style={[
                                                    { transform: [{ scale: userChosenAnswer ? 1 : mediaViewScaleAnimRef.current[index] }] },
                                                    styleSheet.answerTO,
                                                    { borderColor: theme.primary, backgroundColor: bgColor, gap: Outline.GapHorizontal, padding: Outline.GapVertical, borderRadius: BorderRadius.BR8 }]} key={answer}>
                                                    {
                                                        icon === '' ?
                                                            undefined :
                                                            <MaterialCommunityIcons name={icon} color={'white'} size={Size.Icon} />
                                                    }
                                                    <Text style={{ verticalAlign: 'middle', textAlign: 'center', fontSize: FontSize.Small_L, color: icon ? 'white' : theme.counterBackground }}>{answer}</Text>
                                                </TOAnim>
                                            })
                                        }
                                    </View>
                            }
                        </View>
                }
            </View>
            <View>
                <TouchableOpacity onPress={() => onPressRandom(true)} style={[{ gap: Outline.GapHorizontal, borderRadius: BorderRadius.BR8, padding: Outline.GapVertical_2, backgroundColor: theme.primary, }, styleSheet.randomTO]}>
                    <MaterialCommunityIcons name={Icon.Dice} color={theme.counterPrimary} size={Size.Icon} />
                    <Text style={{ color: theme.counterPrimary, fontSize: FontSize.Normal }}>{LocalText.random}</Text>
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
    headerOptionTO: { marginRight: 15 },
    answerTO: { flexDirection: 'row', justifyContent: 'center', borderWidth: StyleSheet.hairlineWidth * 2, }
})