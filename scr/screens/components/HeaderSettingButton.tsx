// @ts-ignore
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import { TouchableOpacity, StyleSheet } from 'react-native'
import React, { useCallback, useContext, useMemo } from 'react'
import { Icon, ScreenName, Size } from '../../constants/AppConstants';
import { ThemeContext } from '../../constants/Colors';
import { useNavigation } from '@react-navigation/native';

const HeaderSettingButton = ({ onPress }: { onPress?: () => {} }) => {
    const theme = useContext(ThemeContext);
    const navigation = useNavigation()

    const onPressPremium = useCallback(() => {
        navigation.navigate(ScreenName.IAPPage as never)
    }, [navigation])

    const style = useMemo(() => {
        return StyleSheet.create({
            headerOptionTO: { marginRight: 15 },
        })
    }, [])

    return (
        <TouchableOpacity onPress={onPressPremium} style={style.headerOptionTO}>
            <MaterialCommunityIcons name={Icon.Star} color={theme.primary} size={Size.Icon} />
        </TouchableOpacity>
    )
}

export default HeaderSettingButton