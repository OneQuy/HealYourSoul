import { ActivityIndicator, Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React, { useContext, useMemo, useState } from 'react'
import { ThemeContext } from '../../constants/Colors';
import { BorderRadius, Category, FontSize, FontWeight, LocalText, Outline, ScreenName } from '../../constants/AppConstants';
import { ScrollView } from 'react-native-gesture-handler';
import { heightPercentageToDP, widthPercentageToDP } from 'react-native-responsive-screen';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { DiversityItemType, Inbox } from '../../constants/Types';
import { IsValuableArrayOrString, RemoveEmptyAndFalsyFromObject, ToCanPrint } from '../../handle/UtilsTS';
import { InboxUserAsync } from '../../handle/tracking/UserMan';
import { AlertWithError, GoodayToast } from '../../handle/AppUtils';
import Clipboard from '@react-native-clipboard/clipboard';

const SendInboxView = () => {
  const theme = useContext(ThemeContext)

  const [userIdText, setUserId] = useState('')
  const [title, setTitleText] = useState('')
  const [msg, setContentText] = useState('')
  const [imgUri, setimageurlText] = useState('')
  const [btnText, setbtnText] = useState('')
  const [btnUrl, setbtnUrl] = useState('')
  const [btnScreen, setbtnScreen] = useState('')
  const [uploadDiversityItemId, setDiversityItemId] = useState(0)
  const [diversityItemCat, setDiversityItemCat] = useState(Category.Meme)

  const [isSendingFeedback, setIsSendingFeedback] = useState(false)
  const insets = useSafeAreaInsets()

  const style = useMemo(() => {
    return StyleSheet.create({
      masterView: { paddingBottom: insets.bottom + Outline.GapHorizontal, flex: 1, backgroundColor: theme.background, padding: Outline.Horizontal, paddingVertical: Outline.GapHorizontal },
      scrollView: { gap: Outline.GapHorizontal },
      btnText: { textAlign: 'center', color: theme.counterPrimary, fontSize: FontSize.Small_L, fontWeight: FontWeight.B500 },
      textInputConView: { height: heightPercentageToDP(13), padding: Outline.GapVertical, borderColor: theme.primary, borderRadius: BorderRadius.BR8, borderWidth: StyleSheet.hairlineWidth },
      textInputUserContactConView: { flexDirection: 'row', height: heightPercentageToDP(5), paddingHorizontal: Outline.GapVertical, borderColor: theme.primary, borderRadius: BorderRadius.BR8, borderWidth: StyleSheet.hairlineWidth },
      sendFeedbackInput: { flex: 1, color: theme.counterBackground, textAlignVertical: 'top', textAlign: 'left', height: '100%' },
      titleText: { color: theme.primary, fontSize: FontSize.Small_L, fontWeight: FontWeight.B600 },
      contentTxt: { color: theme.counterBackground, fontSize: FontSize.Small_L },
      sendTO: { backgroundColor: theme.primary, margin: Outline.GapVertical, minWidth: widthPercentageToDP(40), alignSelf: 'center', paddingVertical: Outline.GapVertical, paddingHorizontal: Outline.GapVertical_2, borderRadius: BorderRadius.BR8 },
    })
  }, [theme, insets])

  const paste = async (set: (s: string) => void) => {
    set(await Clipboard.getString())
  }

  const screens = useMemo(() => {
    const keys = Object.keys(ScreenName).filter(i => i !== 'Upload')
    return ['Upload'].concat(keys)
  }, [])

  const send = async () => {
    if (!IsValuableArrayOrString(msg) && !IsValuableArrayOrString(title)) {
      Alert.alert('title empty or content')
      return
    }
    
    const inbox: Inbox = {
      tickAsId: Date.now(),
      msg,
      title,
      imgUri,
      primaryBtnTxt: uploadDiversityItemId <= 0 ? btnText : (btnText ?? "View it"),
      primaryBtnGoToScreen: btnScreen,
      primaryBtnUrl: btnUrl,

      approvedUploadedDiversity: uploadDiversityItemId <= 0 ? undefined : {
        cat: diversityItemCat,
        id: uploadDiversityItemId,
      } as DiversityItemType
    }

    const obj = RemoveEmptyAndFalsyFromObject(inbox) as Inbox
    console.log(ToCanPrint(obj));

    setIsSendingFeedback(true)

    const res = await InboxUserAsync(obj, userIdText)

    setIsSendingFeedback(false)

    if (res === null) {
      GoodayToast('success')
    }
    else {
      AlertWithError(res)
    }
  }

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
          <TouchableOpacity onPress={() => paste(setUserId)}>
            <Text style={style.contentTxt}>paste</Text>
          </TouchableOpacity>
        </View>

        {/* content */}

        <Text style={style.titleText}>content</Text>

        <View style={style.textInputConView}>
          <TextInput
            style={style.sendFeedbackInput}
            multiline={true}
            value={msg}
            onChangeText={setContentText}
          />
          <TouchableOpacity onPress={() => paste(setContentText)}>
            <Text style={style.contentTxt}>paste</Text>
          </TouchableOpacity>
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
          <TouchableOpacity onPress={() => paste(setTitleText)}>
            <Text style={style.contentTxt}>paste</Text>
          </TouchableOpacity>
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
          <TouchableOpacity onPress={() => paste(setimageurlText)}>
            <Text style={style.contentTxt}>paste</Text>
          </TouchableOpacity>
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
          <TouchableOpacity onPress={() => paste(setbtnText)}>
            <Text style={style.contentTxt}>paste</Text>
          </TouchableOpacity>
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
          <TouchableOpacity onPress={() => paste(setbtnUrl)}>
            <Text style={style.contentTxt}>paste</Text>
          </TouchableOpacity>
        </View>

        {/* primaryBtnGoToScreen */}

        <Text style={style.titleText}>primaryBtnGoToScreen</Text>

        {/* <View style={style.textInputUserContactConView}>
          <TextInput
            style={style.sendFeedbackInput}
            value={btnScreen}
            onChangeText={setbtnScreen}
            placeholderTextColor={theme.counterBackground}
            autoCapitalize={'none'}
          />
          <TouchableOpacity onPress={() => paste(setbtnScreen)}>
            <Text style={style.contentTxt}>paste</Text>
          </TouchableOpacity>
        </View> */}

        <ScrollView
          horizontal
          contentContainerStyle={{ gap: Outline.GapHorizontal }}
          showsHorizontalScrollIndicator={false}
        >
          {
            screens.map(i => {
              return (
                // @ts-ignore
                <TouchableOpacity key={i} onPress={() => setbtnScreen(ScreenName[i])} style={{ backgroundColor: i === btnScreen ? theme.primary : undefined }}>
                  <Text style={{ color: theme.counterBackground, fontSize: FontSize.Normal }}>{i}</Text>
                </TouchableOpacity>
              )
            })
          }
        </ScrollView>

        {/* diversity id */}

        <Text style={style.titleText}>upload diversity id</Text>

        <View style={style.textInputUserContactConView}>
          <TextInput
            style={style.sendFeedbackInput}
            value={uploadDiversityItemId.toString()}
            onChangeText={s => setDiversityItemId(Number.isNaN(Number.parseInt(s)) ? 0 : Number.parseInt(s))}
            placeholderTextColor={theme.counterBackground}
            autoCapitalize={'none'}
            inputMode='numeric'
          />
          <TouchableOpacity onPress={() => paste(s => setDiversityItemId(Number.parseInt(s)))}>
            <Text style={style.contentTxt}>paste</Text>
          </TouchableOpacity>
        </View>

        <Text style={style.titleText}>upload diversity cat</Text>

        <ScrollView
          horizontal
          contentContainerStyle={{ gap: Outline.GapHorizontal }}
          showsHorizontalScrollIndicator={false}
        >
          {
            Object.keys(Category).map(i => {
              const cat = Category[i as any]

              return (
                // @ts-ignore
                <TouchableOpacity key={i} onPress={() => setDiversityItemCat(Category[cat])} style={{ backgroundColor: cat === Category[diversityItemCat] ? theme.primary : undefined }}>
                  <Text style={{ color: theme.counterBackground, fontSize: FontSize.Normal }}>{cat}</Text>
                </TouchableOpacity>
              )
            })
          }
        </ScrollView>
      </ScrollView>


      {/* send */}

      <TouchableOpacity onPress={send} style={style.sendTO}>
        {
          isSendingFeedback ?
            <ActivityIndicator /> :
            <Text style={style.btnText}>{LocalText.send}</Text>
        }
      </TouchableOpacity>
    </View >
  )
}

export default SendInboxView