// @ts-ignore
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

// @ts-ignore
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import { ActivityIndicator, Share as RNShare, Alert, Linking, StyleSheet, Text, TextInput, TouchableOpacity, View, ShareContent, ShareOptions } from 'react-native'
import React, { useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'
import { ThemeContext } from '../../constants/Colors';
import { BorderRadius, FontSize, FontWeight, Icon, LocalText, Outline, Size, StorageKey_FirstTimeInstallTick, StorageKey_LastTickSendFeedback, StorageKey_NinjaFact_ToggleNoti, StorageKey_NinjaJoke_ToggleNoti, StorageKey_Quote_ToggleNoti } from '../../constants/AppConstants';
import { ScrollView } from 'react-native-gesture-handler';
import { CopyAndToast, RateApp } from '../../handle/AppUtils';
import { track_Simple, track_SimpleWithParam, track_ToggleNotification } from '../../handle/tracking/GoodayTracking';
import { heightPercentageToDP } from 'react-native-responsive-screen';
import { GetBooleanAsync, GetDateAsync, GetDateAsync_IsValueExistedAndIsTodayAndSameHour, SetBooleanAsync, SetDateAsync_Now } from '../../handle/AsyncStorageUtils';
import { IsValuableStringOrArray, SafeDateString, ToCanPrint } from '../../handle/UtilsTS';
import { onPressTestNoti, timeInHour24hNoti_Fact, timeInHour24hNoti_Joke, timeInHour24hNoti_Quote } from '../../handle/GoodayNotification';
import { StorageLog_GetAsync } from '../../handle/StorageLog';
import Clipboard from '@react-native-clipboard/clipboard';
import { FirebaseDatabase_SetValueAsync } from '../../firebase/FirebaseDatabase';

const limitFeedback = 300

const shareAppText = `Gooday - Make your day good. A meme, information & positive stuffs app.

Download now!

AppStore: https://apps.apple.com/us/app/gooday-make-your-day/id6471367879

Google Play: https://play.google.com/store/apps/details?id=com.healyoursoul

#gooday #make_your_day_good`

const SettingView = () => {
  const theme = useContext(ThemeContext)
  const [isNoti_Quote, setIsNoti_Quote] = useState(true)
  const [isNoti_Fact, setIsNoti_Fact] = useState(true)
  const [isNoti_Joke, setIsNoti_Joke] = useState(false)
  const [installDate, setInstallDate] = useState('')
  const [feedbackText, setFeedbackText] = useState('')
  const [isSendingFeedback, setIsSendingFeedback] = useState(false)
  const scrollRef = useRef()

  const style = useMemo(() => {
    return StyleSheet.create({
      masterView: { flex: 1, backgroundColor: theme.background, padding: Outline.Horizontal, paddingVertical: Outline.GapHorizontal },
      scrollView: { gap: Outline.GapHorizontal },
      flexRowWithGap: { flexDirection: 'row', gap: Outline.GapHorizontal },
      checkbox: { flexDirection: 'row', gap: Outline.GapHorizontal, alignItems: 'center', justifyContent: 'space-between' },
      textInputConView: { height: heightPercentageToDP(20), padding: Outline.GapVertical, borderRadius: BorderRadius.BR8, borderWidth: StyleSheet.hairlineWidth },
      emailCopyTO: { justifyContent: 'center', alignItems: 'center' },
      communityIconTO: { justifyContent: 'center', alignItems: 'center' },
      titleText: { color: theme.text, fontSize: FontSize.Small_L, fontWeight: FontWeight.B600 },
      litmiFeedbackText: { color: theme.text, fontSize: FontSize.Small_L, fontWeight: '300' },
      btnText: { textAlign: 'center', color: theme.text, fontSize: FontSize.Small_L, fontWeight: FontWeight.B600 },
      descNotiText: { color: theme.text, fontSize: FontSize.Small },
      emailText: { color: theme.text, fontSize: FontSize.Normal },
      statText: { color: theme.text, fontSize: FontSize.Small_L },
      sendFeedbackTO: { minWidth: '50%', alignSelf: 'center', paddingVertical: Outline.GapVertical, paddingHorizontal: Outline.GapVertical_2, borderRadius: BorderRadius.BR8, borderWidth: StyleSheet.hairlineWidth, },
      shareTO: { flexDirection: 'row', justifyContent: 'center', gap: Outline.GapHorizontal, flex: 1, alignSelf: 'center', paddingVertical: Outline.GapVertical, paddingHorizontal: Outline.GapVertical_2, borderRadius: BorderRadius.BR8, borderWidth: StyleSheet.hairlineWidth, },
      sendFeedbackInput: { textAlignVertical: 'top', textAlign: 'left', width: '100%', height: '100%' },
    })
  }, [theme])

  const onPressNoti = useCallback((type: 'quote' | 'fact' | 'joke') => {

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
  }, [isNoti_Fact, isNoti_Quote, isNoti_Joke])

  const onPressShareApp = useCallback(() => {
    RNShare.share({
      title: 'Gooday',
      message: shareAppText,
    } as ShareContent,
      {
        tintColor: theme.primary,
      } as ShareOptions)
  }, [theme])

  const onPressGetLogStorage = useCallback(async () => {
    Clipboard.setString(await StorageLog_GetAsync())
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
    return <View style={{ marginVertical: Outline.Horizontal, backgroundColor: theme.text, width: '100%', height: StyleSheet.hairlineWidth }} />
  }, [theme])

  useEffect(() => {
    (async () => {
      // set text first day install

      const firstTimeInstallTick = await GetDateAsync(StorageKey_FirstTimeInstallTick)

      if (firstTimeInstallTick !== undefined) {
        setInstallDate(SafeDateString(firstTimeInstallTick, '/'))
      }

      setIsNoti_Quote(await GetBooleanAsync(StorageKey_Quote_ToggleNoti, true))
      setIsNoti_Fact(await GetBooleanAsync(StorageKey_NinjaFact_ToggleNoti, true))
      setIsNoti_Joke(await GetBooleanAsync(StorageKey_NinjaJoke_ToggleNoti, false))
    })()
  }, [])

  return (
    <View style={style.masterView}>
      <ScrollView
        // @ts-ignore
        ref={scrollRef}
        showsVerticalScrollIndicator={false} contentContainerStyle={style.scrollView}>
        {/* notification */}

        <Text style={style.titleText}>{LocalText.notification}</Text>

        {/* quote */}
        <View style={style.checkbox}>
          <Text onPress={() => onPressTestNoti('quote')} style={style.emailText}>{LocalText.notification_quote_of_the_day}</Text>
          <TouchableOpacity onPress={() => onPressNoti('quote')} style={style.emailCopyTO} >
            <MaterialCommunityIcons name={isNoti_Quote ? Icon.CheckBox_Yes : Icon.CheckBox_No} color={theme.counterPrimary} size={Size.Icon} />
          </TouchableOpacity>
        </View>
        <Text onPress={() => onPressTestNoti('quote')} style={style.descNotiText}>{LocalText.notification_quote_of_the_day_desc.replace('#', timeInHour24hNoti_Quote.toString())}</Text>

        {/* fact */}
        <View style={style.checkbox}>
          <Text onPress={() => onPressTestNoti('fact')} style={style.emailText}>{LocalText.notification_fact_of_the_day}</Text>
          <TouchableOpacity onPress={() => onPressNoti('fact')} style={style.emailCopyTO} >
            <MaterialCommunityIcons name={isNoti_Fact ? Icon.CheckBox_Yes : Icon.CheckBox_No} color={theme.counterPrimary} size={Size.Icon} />
          </TouchableOpacity>
        </View>
        <Text onPress={() => onPressTestNoti('fact')} style={style.descNotiText}>{LocalText.notification_fact_of_the_day_desc.replace('#', timeInHour24hNoti_Fact.toString())}</Text>

        {/* joke */}
        <View style={style.checkbox}>
          <Text onPress={() => onPressTestNoti('joke')} style={style.emailText}>{LocalText.notification_joke_of_the_day}</Text>
          <TouchableOpacity onPress={() => onPressNoti('joke')} style={style.emailCopyTO} >
            <MaterialCommunityIcons name={isNoti_Joke ? Icon.CheckBox_Yes : Icon.CheckBox_No} color={theme.counterPrimary} size={Size.Icon} />
          </TouchableOpacity>
        </View>
        <Text onPress={() => onPressTestNoti('joke')} style={style.descNotiText}>{LocalText.notification_joke_of_the_day_desc.replace('#', timeInHour24hNoti_Joke.toString())}</Text>
        {
          hair100Width()
        }

        {/* contact */}

        <Text style={style.titleText}>{LocalText.Contact}</Text>
        <View style={style.flexRowWithGap}>
          <Text style={style.emailText}>onequy@gmail.com</Text>
          <TouchableOpacity onPress={() => onPress('email')} style={style.emailCopyTO} >
            <MaterialIcons name={Icon.Copy} color={theme.counterPrimary} size={Size.IconSmaller} />
          </TouchableOpacity>
        </View>
        {
          hair100Width()
        }

        {/* community */}

        <Text style={style.titleText}>{LocalText.community}</Text>
        <View style={style.flexRowWithGap}>
          <TouchableOpacity onPress={() => onPress('telegram')} style={style.communityIconTO} >
            <MaterialIcons name={'telegram'} color={theme.counterPrimary} size={Size.IconMedium} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => onPress('facebook')} style={style.communityIconTO} >
            <MaterialCommunityIcons name={'facebook'} color={theme.counterPrimary} size={Size.IconMedium} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => onPress('twitter')} style={style.communityIconTO} >
            <MaterialCommunityIcons name={'twitter'} color={theme.counterPrimary} size={Size.IconMedium} />
          </TouchableOpacity>
        </View>
        {
          hair100Width()
        }

        {/* feedback */}

        <Text onPress={onPressGetLogStorage} style={style.titleText}>{LocalText.feedback}<Text style={style.litmiFeedbackText}>{' (' + feedbackText.length + '/' + limitFeedback + ')'}</Text></Text>
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
          <TouchableOpacity onPress={onPressShareApp} style={style.shareTO}>
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

        <Text style={style.statText}>{LocalText.install_app_date + ': ' + installDate}</Text>
      </ScrollView>
    </View>
  )
}

export default SettingView