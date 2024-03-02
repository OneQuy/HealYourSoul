import { ActivityIndicator, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React, { useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { ThemeContext } from '../../constants/Colors';
import { BorderRadius, FontSize, FontWeight, LocalText, Outline } from '../../constants/AppConstants';
import { ScrollView } from 'react-native-gesture-handler';
import { heightPercentageToDP } from 'react-native-responsive-screen';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Inbox } from '../../constants/Types';
import { IsValuableArrayOrString, RemoveEmptyAndFalsyFromObject } from '../../handle/UtilsTS';
import { InboxUserAsync } from '../../handle/tracking/UserMan';
import { UserID } from '../../handle/UserID';
import { AlertWithError, GoodayToast } from '../../handle/AppUtils';

const SendInboxView = () => {
  const theme = useContext(ThemeContext)

  const [userIdText, setUserId] = useState('')
  const [title, setTitleText] = useState('')
  const [msg, setContentText] = useState('')
  const [imgUri, setimageurlText] = useState('')
  const [btnText, setbtnText] = useState('')
  const [btnUrl, setbtnUrl] = useState('')
  const [btnScreen, setbtnScreen] = useState('')
  const [param, setparam] = useState('')

  const [isSendingFeedback, setIsSendingFeedback] = useState(false)
  const insets = useSafeAreaInsets()

  const style = useMemo(() => {
    return StyleSheet.create({
      masterView: { paddingBottom: insets.bottom + Outline.Horizontal, flex: 1, backgroundColor: theme.background, padding: Outline.Horizontal, paddingVertical: Outline.GapHorizontal },
      scrollView: { gap: Outline.GapHorizontal },
      btnText: { textAlign: 'center', color: theme.counterPrimary, fontSize: FontSize.Small_L, fontWeight: FontWeight.B500 },
      textInputConView: { height: heightPercentageToDP(20), padding: Outline.GapVertical, borderColor: theme.primary, borderRadius: BorderRadius.BR8, borderWidth: StyleSheet.hairlineWidth },
      textInputUserContactConView: { height: heightPercentageToDP(5), paddingHorizontal: Outline.GapVertical, borderColor: theme.primary, borderRadius: BorderRadius.BR8, borderWidth: StyleSheet.hairlineWidth },
      titleText: { color: theme.primary, fontSize: FontSize.Small_L, fontWeight: FontWeight.B600 },
      descNotiText: { color: theme.counterBackground, fontSize: FontSize.Small },
      contentTxt: { color: theme.counterBackground, fontSize: FontSize.Small_L },
      sendFeedbackTO: { backgroundColor: theme.primary, minWidth: 100, alignSelf: 'center', paddingVertical: Outline.GapVertical, paddingHorizontal: Outline.GapVertical_2, borderRadius: BorderRadius.BR8 },
      sendFeedbackInput: { color: theme.counterBackground, textAlignVertical: 'top', textAlign: 'left', width: '100%', height: '100%' },
    })
  }, [theme, insets])

  const send = async () => {
    if (!IsValuableArrayOrString(msg))
      return

    const inbox: Inbox = {
      tickAsId: Date.now(),
      msg,

      title,
      imgUri,
      primaryBtnTxt: btnText,
      primaryBtnGoToScreen: btnScreen,
      primaryBtnUrl: btnUrl,
      goToScreenParamObj: null
    }

    const obj = RemoveEmptyAndFalsyFromObject(inbox) as Inbox
    const res = await InboxUserAsync(obj, userIdText)

    if (res === null) {
      GoodayToast('success')
    }
    else {
      AlertWithError(res)
    }
  }

  useEffect(() => {
    (async () => {
    })()
  }, [])

  return (
    <View style={style.masterView}>
      <ScrollView
        showsVerticalScrollIndicator={false} contentContainerStyle={style.scrollView}>

        {/* user id */}

        <Text style={style.titleText}>user id</Text>

        <View style={style.textInputUserContactConView}>
          <TextInput
            style={style.sendFeedbackInput}
            value={userIdText}
            onChangeText={setUserId}
            placeholderTextColor={theme.counterBackground}
            autoCapitalize={'none'}
          />
        </View>

        {/* content */}

        <Text style={style.titleText}>content***</Text>

        <View style={style.textInputConView}>
          <TextInput
            style={style.sendFeedbackInput}
            multiline={true}
            value={msg}
            onChangeText={setContentText}
          />
        </View>

        {/* title */}

        <Text style={style.titleText}>title</Text>

        <View style={style.textInputUserContactConView}>
          <TextInput
            style={style.sendFeedbackInput}
            value={title}
            onChangeText={setTitleText}
            placeholderTextColor={theme.counterBackground}
            autoCapitalize={'none'}
          />
        </View>

        {/* image uri */}

        <Text style={style.titleText}>image url</Text>

        <View style={style.textInputUserContactConView}>
          <TextInput
            style={style.sendFeedbackInput}
            value={imgUri}
            onChangeText={setimageurlText}
            placeholderTextColor={theme.counterBackground}
            autoCapitalize={'none'}
          />
        </View>

        {/* primaryBtnTxt */}

        <Text style={style.titleText}>primaryBtnTxt</Text>

        <View style={style.textInputUserContactConView}>
          <TextInput
            style={style.sendFeedbackInput}
            value={btnText}
            onChangeText={setbtnText}
            placeholderTextColor={theme.counterBackground}
            autoCapitalize={'none'}
          />
        </View>

        {/* primaryBtnUrl */}

        <Text style={style.titleText}>primaryBtnUrl</Text>

        <View style={style.textInputUserContactConView}>
          <TextInput
            style={style.sendFeedbackInput}
            value={btnUrl}
            onChangeText={setbtnUrl}
            placeholderTextColor={theme.counterBackground}
            autoCapitalize={'none'}
          />
        </View>

        {/* primaryBtnGoToScreen */}

        <Text style={style.titleText}>primaryBtnGoToScreen</Text>

        <View style={style.textInputUserContactConView}>
          <TextInput
            style={style.sendFeedbackInput}
            value={btnScreen}
            onChangeText={setbtnScreen}
            placeholderTextColor={theme.counterBackground}
            autoCapitalize={'none'}
          />
        </View>

        {/* goToScreenParamObj */}

        <Text style={style.titleText}>goToScreenParamObj</Text>

        <View style={style.textInputUserContactConView}>
          <TextInput
            style={style.sendFeedbackInput}
            value={param}
            onChangeText={setparam}
            placeholderTextColor={theme.counterBackground}
            autoCapitalize={'none'}
          />
        </View>

        {/* send */}

        <TouchableOpacity onPress={send} style={style.sendFeedbackTO}>
          {
            isSendingFeedback ?
              <ActivityIndicator /> :
              <Text style={style.btnText}>{LocalText.send}</Text>
          }
        </TouchableOpacity>
      </ScrollView>
    </View >
  )
}

export default SendInboxView