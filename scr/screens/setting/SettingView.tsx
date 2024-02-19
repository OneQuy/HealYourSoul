// @ts-ignore
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

// @ts-ignore
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import { ActivityIndicator, Alert, Linking, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React, { useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'
import { ThemeContext } from '../../constants/Colors';
import { BorderRadius, FontSize, FontWeight, Icon, LocalText, Outline, Size, StorageKey_DidRateInApp, StorageKey_FirstTimeInstallTick, StorageKey_IsAnimLoadMedia, StorageKey_LastTickSendFeedback, StorageKey_NinjaFact_ToggleNoti, StorageKey_NinjaJoke_ToggleNoti, StorageKey_Quote_ToggleNoti } from '../../constants/AppConstants';
import { ScrollView } from 'react-native-gesture-handler';
import { CopyAndToast, OpenStore, RateApp, ShareApp } from '../../handle/AppUtils';
import { location, track_RateInApp, track_Simple, track_SimpleWithParam, track_ToggleNotification } from '../../handle/tracking/GoodayTracking';
import { heightPercentageToDP } from 'react-native-responsive-screen';
import { GetBooleanAsync, GetDateAsync, GetDateAsync_IsValueExistedAndIsTodayAndSameHour, SetBooleanAsync, SetDateAsync_Now } from '../../handle/AsyncStorageUtils';
import { IsValuableStringOrArray, SafeDateString, ToCanPrint } from '../../handle/UtilsTS';
import { onPressTestNoti, timeInHour24hNoti_Fact, timeInHour24hNoti_Joke, timeInHour24hNoti_Quote } from '../../handle/GoodayNotification';
import { StorageLog_GetAsync } from '../../handle/StorageLog';
import Clipboard from '@react-native-clipboard/clipboard';
import { FirebaseDatabase_SetValueAsync } from '../../firebase/FirebaseDatabase';
import { reloadSettingAnimWhenLoadMedia } from '../../handle/GoodayAnimation';
import ThemeScroll, { TrackSelectedTheme } from '../components/ThemeScroll';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { IsDev } from '../../handle/IsDev';
import { useAppDispatch } from '../../redux/Store';
import { setOnboarded } from '../../redux/MiscSlice';
import { GetIPLocationAsync } from '../../hooks/useCountryFromIP';

const limitFeedback = 300

const SettingView = () => {
  const theme = useContext(ThemeContext)
  const [isNoti_Quote, setIsNoti_Quote] = useState(true)
  const [isNoti_Fact, setIsNoti_Fact] = useState(true)
  const [isNoti_Joke, setIsNoti_Joke] = useState(false)
  const [isAnimLoadMedia, setIsAnimLoadMedia] = useState(true)
  const [installDate, setInstallDate] = useState('')
  const [feedbackText, setFeedbackText] = useState('')
  const [userContactText, setuserContactText] = useState('')
  const [isSendingFeedback, setIsSendingFeedback] = useState(false)
  const [showRateInApp, setShowRateInApp] = useState(false)
  const scrollRef = useRef()
  const insets = useSafeAreaInsets()
  const dispatch = useAppDispatch()

  const style = useMemo(() => {
    return StyleSheet.create({
      masterView: { paddingBottom: insets.bottom + Outline.Horizontal, flex: 1, backgroundColor: theme.background, padding: Outline.Horizontal, paddingVertical: Outline.GapHorizontal },
      scrollView: { gap: Outline.GapHorizontal },
      flexRowWithGap: { flexDirection: 'row', gap: Outline.GapHorizontal },
      rateContainerView: { flexDirection: 'row', gap: Outline.GapHorizontal, justifyContent: 'center', alignItems: 'center' },
      checkbox: { flexDirection: 'row', gap: Outline.GapHorizontal, alignItems: 'center', justifyContent: 'space-between' },
      textInputConView: { height: heightPercentageToDP(20), padding: Outline.GapVertical, borderColor: theme.primary, borderRadius: BorderRadius.BR8, borderWidth: StyleSheet.hairlineWidth },
      textInputUserContactConView: { height: heightPercentageToDP(5), padding: Outline.GapVertical, borderColor: theme.primary, borderRadius: BorderRadius.BR8, borderWidth: StyleSheet.hairlineWidth },
      emailCopyTO: { justifyContent: 'center', alignItems: 'center' },
      communityIconTO: { paddingHorizontal: Outline.GapVertical, flex: 1, flexDirection: 'row', gap: Outline.GapHorizontal, backgroundColor: theme.primary, paddingVertical: Outline.GapVertical, borderRadius: BorderRadius.BR8, justifyContent: 'center', alignItems: 'center' },
      communitiyTOTxt: { flex: 1, textAlign: 'center', color: theme.counterPrimary, fontSize: FontSize.Small_L },
      titleText: { color: theme.primary, fontSize: FontSize.Small_L, fontWeight: FontWeight.B600 },
      litmiFeedbackText: { color: theme.counterBackground, fontSize: FontSize.Small_L, fontWeight: '300' },
      btnText: { textAlign: 'center', color: theme.counterPrimary, fontSize: FontSize.Small_L, fontWeight: FontWeight.B500 },
      descNotiText: { color: theme.counterBackground, fontSize: FontSize.Small },
      contentTxt: { color: theme.counterBackground, fontSize: FontSize.Small_L },
      contentTxt_withBold: { color: theme.counterBackground, fontSize: FontSize.Small_L, fontWeight: FontWeight.Bold },
      sendFeedbackTO: { backgroundColor: theme.primary, minWidth: 100, alignSelf: 'center', paddingVertical: Outline.GapVertical, paddingHorizontal: Outline.GapVertical_2, borderRadius: BorderRadius.BR8 },
      shareTO: { backgroundColor: theme.primary, flexDirection: 'row', justifyContent: 'center', gap: Outline.GapHorizontal, flex: 1, alignSelf: 'center', paddingVertical: Outline.GapVertical, paddingHorizontal: Outline.GapVertical_2, borderRadius: BorderRadius.BR8, },
      sendFeedbackInput: { color: theme.counterBackground, textAlignVertical: 'top', textAlign: 'left', width: '100%', height: '100%' },
    })
  }, [theme, insets])

  const onPressCreditLogo = useCallback(() => {
    if (IsDev())
      dispatch(setOnboarded())
    else
      Linking.openURL('https://www.flaticon.com/free-icons/turtle')
  }, [])

  const onPressNoti = useCallback((type: 'quote' | 'fact' | 'joke' | 'anim_load_media') => {

    if (type === 'fact') {
      track_ToggleNotification(type, !isNoti_Fact)
      setIsNoti_Fact(!isNoti_Fact)
      SetBooleanAsync(StorageKey_NinjaFact_ToggleNoti, !isNoti_Fact)
    }
    else if (type === 'quote') {
      track_ToggleNotification(type, !isNoti_Quote)
      setIsNoti_Quote(!isNoti_Quote)
      SetBooleanAsync(StorageKey_Quote_ToggleNoti, !isNoti_Quote)
    }
    else if (type === 'joke') {
      track_ToggleNotification(type, !isNoti_Joke)
      setIsNoti_Joke(!isNoti_Joke)
      SetBooleanAsync(StorageKey_NinjaJoke_ToggleNoti, !isNoti_Joke)
    }
    else if (type === 'anim_load_media') {
      // track_ToggleNotification(type, !isAnimLoadMedia)
      setIsAnimLoadMedia(!isAnimLoadMedia)
      SetBooleanAsync(StorageKey_IsAnimLoadMedia, !isAnimLoadMedia)
      reloadSettingAnimWhenLoadMedia()
    }
  }, [isNoti_Fact, isNoti_Quote, isNoti_Joke, isAnimLoadMedia])

  const onPressGetLogStorage = useCallback(async () => {
    Clipboard.setString(await StorageLog_GetAsync())
  }, [])

  const onPressDevLocation = useCallback(async () => {
    const location = await GetIPLocationAsync()
    Alert.alert('Location', ToCanPrint(location))
  }, [])

  const onFocusInput = useCallback(async () => {
    // @ts-ignore
    scrollRef?.current?.scrollToEnd({ animated: true })
  }, [])

  const onPressSendFeedback = useCallback(async () => {
    track_Simple('press_send_feedback')

    if (isSendingFeedback)
      return

    if (!IsValuableStringOrArray(feedbackText))
      return

    if (await GetDateAsync_IsValueExistedAndIsTodayAndSameHour(StorageKey_LastTickSendFeedback)) {
      Alert.alert(LocalText.popup_title_error, LocalText.popup_content_sent_feedback_error_hour)
      return
    }

    setIsSendingFeedback(true)
    const res = await FirebaseDatabase_SetValueAsync('feedback/t' + Date.now(), feedbackText)
    setIsSendingFeedback(false)

    if (res === null) { // success
      Alert.alert(LocalText.done, LocalText.popup_content_sent_feedback)
      setFeedbackText('')
      SetDateAsync_Now(StorageKey_LastTickSendFeedback)
    }
    else { // fail
      Alert.alert(LocalText.popup_title_error, LocalText.popup_content_error + '\n\n' + ToCanPrint(res))
    }
  }, [feedbackText, isSendingFeedback])

  const onPressRateStarAsync = useCallback(async (starIdx: number) => {
    setShowRateInApp(false)
    SetBooleanAsync(StorageKey_DidRateInApp, true)

    track_RateInApp(starIdx + 1)

    if (starIdx < 3) {
      Alert.alert(LocalText.thank_you_short, LocalText.popup_content_sent_feedback)
    }
    else {
      Alert.alert(
        LocalText.thank_you_short,
        LocalText.rate_in_app_5star_content,
        [
          {
            text: LocalText.later,
          },
          {
            text: 'Okay',
            onPress: OpenStore,
          },
        ])
    }
  }, [])

  const onPress = useCallback((type: 'telegram' | 'facebook' | 'twitter' | 'email') => {
    track_SimpleWithParam('press_community', type)

    if (type === 'email') {
      CopyAndToast('onequy@gmail.com', theme)
    }
    else if (type === 'twitter') {
      Linking.openURL('https://twitter.com/warm_goodday')
    }
    else if (type === 'facebook') {
      Linking.openURL('https://www.facebook.com/GoodayMakeYourDayGood')
    }
    else if (type === 'telegram') {
      Linking.openURL('https://t.me/+JfAvH82Bnl81YmY1')
    }
  }, [])

  const hair100Width = useCallback(() => {
    return <View style={{ marginVertical: Outline.Horizontal, backgroundColor: theme.counterBackground, width: '100%', height: StyleSheet.hairlineWidth }} />
  }, [theme])

  useEffect(() => {
    (async () => {
      // set text first day install

      const firstTimeInstallTick = await GetDateAsync(StorageKey_FirstTimeInstallTick)

      if (firstTimeInstallTick !== undefined) {
        setInstallDate(SafeDateString(firstTimeInstallTick, '/'))
      }

      // update setting notifications

      setIsNoti_Quote(await GetBooleanAsync(StorageKey_Quote_ToggleNoti, true))
      setIsNoti_Fact(await GetBooleanAsync(StorageKey_NinjaFact_ToggleNoti, true))
      setIsNoti_Joke(await GetBooleanAsync(StorageKey_NinjaJoke_ToggleNoti, false))

      // setting anim

      setIsAnimLoadMedia(await GetBooleanAsync(StorageKey_IsAnimLoadMedia, true))

      // rate in app

      setShowRateInApp(!(await GetBooleanAsync(StorageKey_DidRateInApp)))
    })()
  }, [])

  const renderCommunityBtns = useMemo(() => {
    return (
      <View style={style.flexRowWithGap}>
        <TouchableOpacity onPress={() => onPress('telegram')} style={style.communityIconTO} >
          <MaterialIcons name={'telegram'} color={theme.counterPrimary} size={Size.IconSmaller} />
          <Text adjustsFontSizeToFit numberOfLines={1} style={style.communitiyTOTxt}>Telegram</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => onPress('facebook')} style={style.communityIconTO} >
          <MaterialCommunityIcons name={'facebook'} color={theme.counterPrimary} size={Size.IconSmaller} />
          <Text adjustsFontSizeToFit numberOfLines={1} style={style.communitiyTOTxt}>Facebook</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => onPress('twitter')} style={style.communityIconTO} >
          <MaterialCommunityIcons name={'twitter'} color={theme.counterPrimary} size={Size.IconSmaller} />
          <Text adjustsFontSizeToFit numberOfLines={1} style={style.communitiyTOTxt}>X (Twitter)</Text>
        </TouchableOpacity>
      </View>
    )

  }, [theme, style])

  const renderRateStars = useMemo(() => {
    return (
      new Array(5).fill(0).map((_, index) => {
        return (
          <TouchableOpacity key={index} onPress={() => onPressRateStarAsync(index)}>
            <MaterialCommunityIcons name={Icon.Star} color={theme.counterBackground} size={Size.IconMedium} />
          </TouchableOpacity>
        )
      })
    )
  }, [theme, style, onPressRateStarAsync])

  return (
    <View style={style.masterView}>
      <ScrollView
        // @ts-ignore
        ref={scrollRef}
        showsVerticalScrollIndicator={false} contentContainerStyle={style.scrollView}>

        {/* rate app */}

        {
          !showRateInApp ? undefined :
            <>
              <Text style={style.titleText}>{LocalText.rate_app}</Text>
              <Text style={style.contentTxt}>{LocalText.rate_in_app_text}:</Text>

              <View style={style.rateContainerView}>
                {
                  renderRateStars
                }
              </View>
            </>
        }

        {/* theme */}

        <Text style={style.titleText}>{LocalText.theme}</Text>

        <Text style={style.contentTxt}>{LocalText.lights_mode}</Text>
        <ThemeScroll mode='lights' />

        <Text style={style.contentTxt}>{LocalText.darks_mode}</Text>
        <ThemeScroll mode='darks' />

        <Text style={style.contentTxt}>{LocalText.specials_theme}</Text>
        <ThemeScroll mode='specials' />

        {
          hair100Width()
        }

        {/* notification */}

        <Text style={style.titleText}>{LocalText.notification}</Text>

        {/* quote */}
        <View style={style.checkbox}>
          <Text onPress={() => onPressTestNoti('quote')} style={style.contentTxt}>{LocalText.notification_quote_of_the_day}</Text>
          <TouchableOpacity onPress={() => onPressNoti('quote')} style={style.emailCopyTO} >
            <MaterialCommunityIcons name={isNoti_Quote ? Icon.CheckBox_Yes : Icon.CheckBox_No} color={theme.counterBackground} size={Size.Icon} />
          </TouchableOpacity>
        </View>
        <Text onPress={() => onPressTestNoti('quote')} style={style.descNotiText}>{LocalText.notification_quote_of_the_day_desc.replace('#', timeInHour24hNoti_Quote.toString())}</Text>

        {/* fact */}
        <View style={style.checkbox}>
          <Text onPress={() => onPressTestNoti('fact')} style={style.contentTxt}>{LocalText.notification_fact_of_the_day}</Text>
          <TouchableOpacity onPress={() => onPressNoti('fact')} style={style.emailCopyTO} >
            <MaterialCommunityIcons name={isNoti_Fact ? Icon.CheckBox_Yes : Icon.CheckBox_No} color={theme.counterBackground} size={Size.Icon} />
          </TouchableOpacity>
        </View>
        <Text onPress={() => onPressTestNoti('fact')} style={style.descNotiText}>{LocalText.notification_fact_of_the_day_desc.replace('#', timeInHour24hNoti_Fact.toString())}</Text>

        {/* joke */}
        <View style={style.checkbox}>
          <Text onPress={() => onPressTestNoti('joke')} style={style.contentTxt}>{LocalText.notification_joke_of_the_day}</Text>
          <TouchableOpacity onPress={() => onPressNoti('joke')} style={style.emailCopyTO} >
            <MaterialCommunityIcons name={isNoti_Joke ? Icon.CheckBox_Yes : Icon.CheckBox_No} color={theme.counterBackground} size={Size.Icon} />
          </TouchableOpacity>
        </View>
        <Text onPress={() => onPressTestNoti('joke')} style={style.descNotiText}>{LocalText.notification_joke_of_the_day_desc.replace('#', timeInHour24hNoti_Joke.toString())}</Text>
        {
          hair100Width()
        }

        {/* anim */}

        <Text style={style.titleText}>{LocalText.animation}</Text>

        {/* quote */}
        <View style={style.checkbox}>
          <Text onPress={() => onPressTestNoti('quote')} style={style.contentTxt}>{LocalText.anim_load_media}</Text>
          <TouchableOpacity onPress={() => onPressNoti('anim_load_media')} style={style.emailCopyTO} >
            <MaterialCommunityIcons name={isAnimLoadMedia ? Icon.CheckBox_Yes : Icon.CheckBox_No} color={theme.counterBackground} size={Size.Icon} />
          </TouchableOpacity>
        </View>
        {
          hair100Width()
        }

        {/* contact */}

        <Text style={style.titleText}>{LocalText.Contact}</Text>
        <View style={style.flexRowWithGap}>
          <Text style={style.contentTxt}>onequy@gmail.com</Text>
          <TouchableOpacity onPress={() => onPress('email')} style={style.emailCopyTO} >
            <MaterialIcons name={Icon.Copy} color={theme.counterBackground} size={Size.IconSmaller} />
          </TouchableOpacity>
        </View>
        {
          hair100Width()
        }

        {/* community */}

        <Text style={style.titleText}>{LocalText.community}</Text>
        <Text style={style.contentTxt}>{LocalText.community_content}:</Text>
        {
          renderCommunityBtns
        }

        {
          hair100Width()
        }

        {/* feedback */}

        <Text onPress={onPressGetLogStorage} style={style.titleText}>{LocalText.feedback}<Text style={style.litmiFeedbackText}>{' (' + feedbackText.length + '/' + limitFeedback + ')'}</Text></Text>
        <Text style={style.contentTxt}>{LocalText.feedback_info}</Text>

        <View style={style.textInputConView}>
          <TextInput
            style={style.sendFeedbackInput}
            maxLength={limitFeedback}
            multiline={true}
            value={feedbackText}
            onChangeText={setFeedbackText}
            onFocus={(e) => onFocusInput()}
          />
        </View>

        <Text style={style.descNotiText}>{LocalText.feedback_user_contact}</Text>

        <View style={style.textInputUserContactConView}>
          <TextInput
            style={style.sendFeedbackInput}
            maxLength={limitFeedback}
            value={userContactText}
            onChangeText={setuserContactText}
            onFocus={(e) => onFocusInput()}
            placeholder='your_email@gmail.com'
            placeholderTextColor={theme.counterBackground}
          />
        </View>
        
        <TouchableOpacity onPress={onPressSendFeedback} style={style.sendFeedbackTO}>
          {
            isSendingFeedback ?
              <ActivityIndicator /> :
              <Text style={style.btnText}>{LocalText.send}</Text>
          }
        </TouchableOpacity>
        {
          hair100Width()
        }

        {/* share app */}

        <View style={style.flexRowWithGap}>
          <TouchableOpacity onPress={ShareApp} style={style.shareTO}>
            <MaterialCommunityIcons name={Icon.ShareText} color={theme.counterPrimary} size={Size.IconSmaller} />
            <Text style={style.btnText}>{LocalText.share_app}</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={RateApp} style={style.shareTO}>
            <MaterialCommunityIcons name={Icon.Star} color={theme.counterPrimary} size={Size.IconSmaller} />
            <Text style={style.btnText}>{LocalText.rate_app}</Text>
          </TouchableOpacity>
        </View>
        {
          hair100Width()
        }

        {/* install date */}

        <Text style={style.contentTxt}>{LocalText.install_app_date + ': ' + installDate}</Text>
        {
          hair100Width()
        }

        {/* logo credit */}

        <Text style={style.contentTxt}>
          {LocalText.logo_credit} <Text onPress={onPressCreditLogo} style={style.contentTxt_withBold}>Freepik - Flaticon</Text>
        </Text>

        <View />

        <Text
          onPress={IsDev() ? onPressDevLocation : undefined}
          style={style.contentTxt_withBold}>
          Gooday <Text style={[style.contentTxt, { fontWeight: 'normal' }]}>{LocalText.myself_credit}</Text>
        </Text>

        {/* location for dev */}

        {
          !IsDev() || typeof location !== 'object' ? undefined :
            <Text style={[{ color: theme.counterBackground, fontSize: FontSize.Small_L }]}>{`(${location.city_name ?? location.region_name} - ${location.country_name})`}</Text>
        }
      </ScrollView>
    </View>
  )
}

export default SettingView

export const OnBlurSettingView = () => {
  TrackSelectedTheme()
}