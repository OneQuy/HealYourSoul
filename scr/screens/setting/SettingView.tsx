// @ts-ignore
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

// @ts-ignore
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import { Linking, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useCallback, useContext, useMemo } from 'react'
import { ThemeContext } from '../../constants/Colors';
import { FontSize, FontWeight, Icon, LocalText, Outline, Size } from '../../constants/AppConstants';
import { ScrollView } from 'react-native-gesture-handler';
import { CopyAndToast } from '../../handle/AppUtils';
import { track_SimpleWithParam } from '../../handle/tracking/GoodayTracking';

const SettingView = () => {
  const theme = useContext(ThemeContext)

  const style = useMemo(() => {
    return StyleSheet.create({
      masterView: { flex: 1, backgroundColor: theme.background, padding: Outline.Horizontal },
      scrollView: { gap: Outline.GapHorizontal },
      flexRowWithGap: { flexDirection: 'row', gap: Outline.GapHorizontal },
      emailCopyTO: { justifyContent: 'center', alignItems: 'center' },
      communityIconTO: { justifyContent: 'center', alignItems: 'center' },
      titleText: { color: theme.text, fontSize: FontSize.Small_L, fontWeight: FontWeight.B600 },
      emailText: { color: theme.text, fontSize: FontSize.Normal },
    })
  }, [theme])

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

  return (
    <View style={style.masterView}>
      <ScrollView contentContainerStyle={style.scrollView}>
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



        {/* <TouchableOpacity onPress={onPressEnableAll} style={[style.enableAllTO,]}>
        <Text style={style.titleText}>{LocalText.enable_all}</Text>
      </TouchableOpacity> */}
      </ScrollView>
    </View>
  )
}

export default SettingView