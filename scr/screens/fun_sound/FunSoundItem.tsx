import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, Alert } from 'react-native'
import React, { useCallback, useContext, useMemo, useState } from 'react'
import { FunSound } from '../../constants/Types'
import { ThemeContext } from '../../constants/Colors'
import { BorderRadius, Icon, LocalPath, LocalText, Outline, Size } from '../../constants/AppConstants'
import { heightPercentageToDP } from 'react-native-responsive-screen'

// @ts-ignore
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { DownloadFileAsync, GetFLPFromRLP, IsExistedAsync } from '../../handle/FileUtils'
import { AlertNoInternet } from '../../handle/AppUtils'
import { NetLord } from '../../handle/NetLord'
import { ToCanPrint } from '../../handle/UtilsTS'

type FunSoundItemProps = {
    data: FunSound,
    playSound: (flp: string) => void,
}

const FunSoundItem = ({ data, playSound }: FunSoundItemProps) => {
    const theme = useContext(ThemeContext);
    const [isHandling, setIsHandling] = useState(false);

    const onPressed = useCallback(async () => {
        const rlp = LocalPath.MasterDirName + '/fun_sound/' + data.name + '.mp3'
        const flp = GetFLPFromRLP(rlp)

        if (!await IsExistedAsync(flp, false)) {
            setIsHandling(true)
console.log(data.mp3);

            const res = await DownloadFileAsync(data.mp3, flp, false)
            setIsHandling(false)

            if (res === null) { // success
            }
            else {
                if (!NetLord.IsAvailableLastestCheck())
                    AlertNoInternet()
                else
                    Alert.alert(
                        LocalText.popup_title_error,
                        LocalText.popup_content_error + '\n\n' + ToCanPrint(res))

                return
            }
        }

        const pathToPlay = GetFLPFromRLP(rlp, true)

        playSound(pathToPlay)
    }, [])

    const style = useMemo(() => {
        return StyleSheet.create({
            masterView: { borderRadius: BorderRadius.BR8, flex: 1, height: heightPercentageToDP(7), backgroundColor: theme.primary, margin: Outline.GapHorizontal },
            mainView: { flex: 1, paddingHorizontal: Outline.GapHorizontal, justifyContent: 'center', },
            btnBarView: { flexDirection: 'row', flex: 1, },
            btnPinTO: { flex: 1, justifyContent: 'center', alignItems: 'center' },
            btnLikeTO: { flexDirection: 'row', flex: 1, gap: Outline.GapHorizontal, justifyContent: 'center', alignItems: 'center' },
            nameTxt: { color: theme.counterPrimary, textAlign: 'center', verticalAlign: 'middle' },
            likeTxt: { color: theme.counterPrimary },
        })
    }, [theme])

    return (
        <TouchableOpacity onPress={onPressed} style={style.masterView}>
            <View style={style.mainView}>
                {
                    isHandling ?
                        <ActivityIndicator size={Size.Icon} color={theme.counterPrimary} /> :
                        <Text numberOfLines={3} adjustsFontSizeToFit style={style.nameTxt}>{data.name}</Text>
                }
            </View>
            <View style={style.btnBarView}>
                <TouchableOpacity style={style.btnPinTO}>
                    <MaterialCommunityIcons name={'pin'} color={theme.counterBackground} size={Size.IconTiny} />
                </TouchableOpacity>
                <TouchableOpacity style={style.btnLikeTO}>
                    <MaterialCommunityIcons name={!true ? "cards-heart-outline" : 'cards-heart'} color={theme.counterPrimary} size={Size.IconTiny} />
                    <Text numberOfLines={1} adjustsFontSizeToFit style={style.likeTxt}>{7}</Text>
                </TouchableOpacity>
            </View>
        </TouchableOpacity>
    )
}

export default FunSoundItem