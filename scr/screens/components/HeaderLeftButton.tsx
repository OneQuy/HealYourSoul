// @ts-ignore
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import { TouchableOpacity, StyleSheet, View } from 'react-native'
import React, { useCallback, useContext, useMemo } from 'react'
import { Icon, Outline, Size } from '../../constants/AppConstants';
import { ThemeContext } from '../../constants/Colors';
import { useNavigation } from '@react-navigation/native';
import { DrawerNavigationProp } from '@react-navigation/drawer';
import { DrawerParamList } from '../../navigation/Navigator';

const HeaderLeftButton = () => {
    const theme = useContext(ThemeContext);
    const navigation = useNavigation()

    const style = useMemo(() => {
        return StyleSheet.create({
            master: { gap: Outline.GapHorizontal, flexDirection: 'row', marginLeft: 15 },
        })
    }, [])

    const onPressX = useCallback(() => {

    }, [])

    return (
        <View style={style.master}>
            {/* x button */}
            <TouchableOpacity onPress={onPressX} >
                <MaterialCommunityIcons name={Icon.Close} color={theme.primary} size={Size.Icon} />
            </TouchableOpacity>
        </View>
    )
}

export const UpdateHeaderLeftButton = (navigation: DrawerNavigationProp<DrawerParamList>, savedMode: boolean) => {
    navigation.setOptions({
        headerLeft: savedMode ? () => <HeaderLeftButton /> : undefined,
    })
}