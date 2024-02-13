import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import React, { useContext, useMemo } from 'react'
import { FunSound } from '../../constants/Types'
import { ThemeContext } from '../../constants/Colors'
import { BorderRadius, Outline, Size } from '../../constants/AppConstants'
import { heightPercentageToDP } from 'react-native-responsive-screen'

// @ts-ignore
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

type FunSoundItemProps = {
    data: FunSound,
    onPressed: (item: FunSound) => void,
}

const FunSoundItem = ({ data, onPressed }: FunSoundItemProps) => {
    const theme = useContext(ThemeContext);

    const style = useMemo(() => {
        return StyleSheet.create({
            masterView: { borderRadius: BorderRadius.BR8, flex: 1, height: heightPercentageToDP(7), backgroundColor: theme.primary, margin: Outline.GapHorizontal },
            mainView: { flex: 1, paddingHorizontal: Outline.GapHorizontal },
            btnBarView: { flexDirection: 'row', flex: 1, },
            btnPinTO: { flex: 1, justifyContent: 'center', alignItems: 'center' },
            btnLikeTO: { flexDirection: 'row', flex: 1, gap: Outline.GapHorizontal, justifyContent: 'center', alignItems: 'center' },
            nameTxt: { color: theme.counterPrimary, textAlign: 'center', verticalAlign: 'middle' },
            likeTxt: { color: theme.counterPrimary },
        })
    }, [theme])

    return (
        <TouchableOpacity onPress={() => onPressed(data)} style={style.masterView}>
            <View style={style.mainView}>
                <Text numberOfLines={3} adjustsFontSizeToFit style={style.nameTxt}>{data.name}</Text>
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