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
  const [imageurlText, setimageurlText] = useState('')
  const [btnText, setbtnText] = useState('')
  const [btnUrl, setbtnUrl] = useState('')
  const [btnScreen, setbtnScreen] = useState('')
  const [param, setparam] = useState('')
  
  const [isSendingFeedback, setIsSendingFeedback] = useState(false)
  const insets = useSafeAreaInsets()
  // const dispatch = useAppDispatch()

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

  const send = useCallback(() => {
  }, [])

  useEffect(() => {
    (async () => {
    })()
  }, [])

  return (
    <View style={style.masterView}>
      <ScrollView
        showsVerticalScrollIndicator={false} contentContainerStyle={style.scrollView}>

        {/* title */}

        <Text style={style.titleText}>title</Text>

        <View style={style.textInputUserContactConView}>
          <TextInput
            style={style.sendFeedbackInput}
            value={titleText}
            onChangeText={setTitleText}
            placeholderTextColor={theme.counterBackground}
            autoCapitalize={'none'}
          />
        </View>

        {/* content */}

        <Text style={style.titleText}>content</Text>

        <View style={style.textInputConView}>
          <TextInput
            style={style.sendFeedbackInput}
            multiline={true}
            value={contentText}
            onChangeText={setContentText}
          />
        </View>

        {/* image uri */}

        <Text style={style.titleText}>image url</Text>

        <View style={style.textInputUserContactConView}>
          <TextInput
            style={style.sendFeedbackInput}
            value={imageurlText}
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