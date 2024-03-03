// @ts-ignore
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import { View, Text, StyleSheet } from 'react-native'
import React, { useContext, useMemo } from 'react'
import { Category, FontSize, Icon, Outline, Size } from '../../constants/AppConstants';
import { ThemeContext } from '../../constants/Colors';
import useCount from '../../hooks/useCount';
import { IsNumType } from '../../handle/UtilsTS';

const ViewCount = ({
    cat,
    id
}: {
    cat: Category,
    id: string | number | undefined
}) => {
    const theme = useContext(ThemeContext);
    const { count, onPress } = useCount('view', '', cat, id)

    const style = useMemo(() => {
        return StyleSheet.create({
            master: { gap: Outline.GapHorizontal, alignItems: 'center', justifyContent: 'center', flexDirection: 'row' },
            text: { fontSize: FontSize.Small, color: theme.counterBackground, }
        })
    }, [theme])

    const countVal = IsNumType(count) ? count : 0

    return (
        <View style={style.master} >
            <MaterialCommunityIcons name={Icon.Eye} color={theme.counterBackground} size={Size.IconTiny} />
            <Text style={style.text}>{88999}</Text>
        </View>
    )
}

export default ViewCount