import { ActivityIndicator, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React, { useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { ThemeContext } from '../../constants/Colors';
import { BorderRadius, FontSize, FontWeight, LocalText, Outline } from '../../constants/AppConstants';
import { ScrollView } from 'react-native-gesture-handler';
import { heightPercentageToDP } from 'react-native-responsive-screen';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const SendInboxView = () => {
  const theme = useContext(ThemeContext)
  const [titleText, setTitleText] = useState('')
  const [contentText, setContentText] = useState('')
  const [isSendingFeedback, setIsSendingFeedback] = useState(false)
  const insets = useSafeAreaInsets()
  // const dispatch = useAppDispatch()

  const style = useMemo(() => {
    return StyleSheet.create({
      masterView: { paddingBottom: insets.bottom + Outline.Horizontal, flex: 1, backgroundColor: theme.background, padding: Outline.Horizontal, paddingVertical: Outline.GapHorizontal },
      scrollView: { gap: Outline.GapHorizontal },
      flexRowWithGap: { flexDirection: 'row', gap: Outline.GapHorizontal },
      rateContainerView: { flexDirection: 'row', gap: Outline.GapHorizontal, justifyContent: 'center', alignItems: 'center' },
      checkbox: { flexDirection: 'row', gap: Outline.GapHorizontal, alignItems: 'center', justifyContent: 'space-between' },
      textInputConView: { height: heightPercentageToDP(20), padding: Outline.GapVertical, borderColor: theme.primary, borderRadius: BorderRadius.BR8, borderWidth: StyleSheet.hairlineWidth },
      textInputUserContactConView: { height: heightPercentageToDP(5), paddingHorizontal: Outline.GapVertical, borderColor: theme.primary, borderRadius: BorderRadius.BR8, borderWidth: StyleSheet.hairlineWidth },
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
      sendFeedbackInput_UserContact: { color: theme.counterBackground, textAlignVertical: 'center', textAlign: 'left', width: '100%', height: '100%' },
    })
  }, [theme, insets])

  const send = useCallback(() => {
  }, [])

  const hair100Width = useCallback(() => {
    return <View style={{ marginVertical: Outline.Horizontal, backgroundColor: theme.counterBackground, width: '100%', height: StyleSheet.hairlineWidth }} />
  }, [theme])

  useEffect(() => {
    (async () => {
    })()
  }, [])

  return (
    <View style={style.masterView}>
      <ScrollView
        showsVerticalScrollIndicator={false} contentContainerStyle={style.scrollView}>

        {/* feedback */}

        <Text style={style.titleText}>{LocalText.feedback}</Text>
        <Text style={style.contentTxt}>{LocalText.feedback_info}</Text>

        <View style={style.textInputConView}>
          <TextInput
            style={style.sendFeedbackInput}
            multiline={true}
            value={contentText}
            onChangeText={setContentText}
          />
        </View>

        <View />
        <View />

        <Text style={style.descNotiText}>{LocalText.feedback_user_contact}</Text>

        <View style={style.textInputUserContactConView}>
          <TextInput
            style={style.sendFeedbackInput}
            value={titleText}
            onChangeText={setTitleText}
            placeholder='your_email@gmail.com'
            placeholderTextColor={theme.counterBackground}
            autoCapitalize={'none'}
          />
        </View>

        <TouchableOpacity onPress={send} style={style.sendFeedbackTO}>
          {
            isSendingFeedback ?
              <ActivityIndicator /> :
              <Text style={style.btnText}>{LocalText.send}</Text>
          }
        </TouchableOpacity>
        {
          hair100Width()
        }

      </ScrollView>
    </View >
  )
}

export default SendInboxView