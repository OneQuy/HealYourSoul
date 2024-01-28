// @ts-ignore
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import { TouchableOpacity, StyleSheet } from 'react-native'
import React, { useContext, useMemo } from 'react'
import { Icon, Size } from '../../constants/AppConstants';
import { ThemeContext } from '../../constants/Colors';

const HeaderSettingButton = ({ onPress }: { onPress: () => {} }) => {
    const theme = useContext(ThemeContext);

    const style = useMemo(() => {
        return StyleSheet.create({
            headerOptionTO: { marginRight: 15 },
        })
    }, [])

    return (
        <TouchableOpacity onPress={onPress} style={style.headerOptionTO}>
            <MaterialCommunityIcons name={Icon.ThreeDots} color={theme.primary} size={Size.Icon} />
        </TouchableOpacity>
    )
}

export default HeaderSettingButton