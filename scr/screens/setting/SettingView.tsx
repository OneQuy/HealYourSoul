// @ts-ignore
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

// @ts-ignore
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import { Linking, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React, { useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { ThemeContext } from '../../constants/Colors';
import { BorderRadius, FontSize, FontWeight, Icon, LocalText, Outline, Size, StorageKey_FirstTimeInstallTick } from '../../constants/AppConstants';
import { ScrollView } from 'react-native-gesture-handler';
import { CopyAndToast } from '../../handle/AppUtils';
import { track_SimpleWithParam } from '../../handle/tracking/GoodayTracking';
import { heightPercentageToDP } from 'react-native-responsive-screen';
import { GetDateAsync } from '../../handle/AsyncStorageUtils';
import { SafeDateString } from '../../handle/UtilsTS';

const limitFeedback = 300

const SettingView = () => {
  const theme = useContext(ThemeContext)
  const [isNoti_Quote, setIsNoti_Quote] = useState(true)
  const [isNoti_Fact, setIsNoti_Fact] = useState(true)
  const [isNoti_Joke, setIsNoti_Joke] = useState(false)
  const [installDate, setInstallDate] = useState('')

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
      descNotiText: { color: theme.text, fontSize: FontSize.Small },
      emailText: { color: theme.text, fontSize: FontSize.Normal },
      statText: { color: theme.text, fontSize: FontSize.Small_L },
      sendFeedbackTO: { alignSelf: 'center', paddingVertical: Outline.GapVertical, paddingHorizontal: Outline.GapVertical_2, borderRadius: BorderRadius.BR8, borderWidth: StyleSheet.hairlineWidth, },
    })
  }, [theme])

  const onPressNoti = useCallback((type: 'quote' | 'fact' | 'joke') => {
    if (type === 'fact')
      setIsNoti_Fact(!isNoti_Fact)
    else if (type === 'quote') {
      setIsNoti_Quote(!isNoti_Quote)
    }
    else if (type === 'joke') {
      setIsNoti_Joke(!isNoti_Joke)
    }
  }, [isNoti_Fact, isNoti_Quote, isNoti_Joke])

  const onPressSendFeedback = useCallback(() => {
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
    return <View style={{ marginVertical: Outline.Horizontal, backgroundColor: theme.text, width: '100%', height: StyleSheet.hairlineWidth }} />
  }, [theme])

  useEffect(() => {
    (async () => {
      // set text first day install

      const firstTimeInstallTick = await GetDateAsync(StorageKey_FirstTimeInstallTick)

      if (firstTimeInstallTick !== undefined) {
        setInstallDate(SafeDateString(firstTimeInstallTick))
      }
    })()
  }, [])

  return (
    <View style={style.masterView}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={style.scrollView}>
        {/* notification */}

        <Text style={style.titleText}>{LocalText.notification}</Text>
        <View style={style.checkbox}>
          <Text style={style.emailText}>{LocalText.notification_quote_of_the_day}</Text>
          <TouchableOpacity onPress={() => onPressNoti('quote')} style={style.emailCopyTO} >
            <MaterialCommunityIcons name={isNoti_Quote ? Icon.CheckBox_Yes : Icon.CheckBox_No} color={theme.counterPrimary} size={Size.Icon} />
          </TouchableOpacity>
        </View>
        <Text style={style.descNotiText}>{LocalText.notification_quote_of_the_day_desc}</Text>
        <View style={style.checkbox}>
          <Text style={style.emailText}>{LocalText.notification_fact_of_the_day}</Text>
          <TouchableOpacity onPress={() => onPressNoti('fact')} style={style.emailCopyTO} >
            <MaterialCommunityIcons name={isNoti_Fact ? Icon.CheckBox_Yes : Icon.CheckBox_No} color={theme.counterPrimary} size={Size.Icon} />
          </TouchableOpacity>
        </View>
        <Text style={style.descNotiText}>{LocalText.notification_fact_of_the_day_desc}</Text>
        <View style={style.checkbox}>
          <Text style={style.emailText}>{LocalText.notification_joke_of_the_day}</Text>
          <TouchableOpacity onPress={() => onPressNoti('joke')} style={style.emailCopyTO} >
            <MaterialCommunityIcons name={isNoti_Joke ? Icon.CheckBox_Yes : Icon.CheckBox_No} color={theme.counterPrimary} size={Size.Icon} />
          </TouchableOpacity>
        </View>
        <Text style={style.descNotiText}>{LocalText.notification_joke_of_the_day_desc}</Text>
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

        <Text style={style.titleText}>{LocalText.feedback}</Text>
        <View style={style.textInputConView}>
          <TextInput
            maxLength={limitFeedback}
            multiline={true}
          />
        </View>
        <TouchableOpacity onPress={onPressSendFeedback} style={style.sendFeedbackTO}>
          <Text style={style.titleText}>{LocalText.send}</Text>
        </TouchableOpacity>
        {
          hair100Width()
        }

        {/* share app */}

        <TouchableOpacity onPress={onPressSendFeedback} style={style.sendFeedbackTO}>
          <Text style={style.titleText}>{LocalText.share_app}</Text>
        </TouchableOpacity>
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