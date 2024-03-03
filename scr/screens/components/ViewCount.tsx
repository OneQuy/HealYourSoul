// @ts-ignore
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import { View, Text, StyleSheet } from 'react-native'
import React, { useContext, useEffect, useMemo } from 'react'
import { Category, FontSize, Icon, Outline, Size } from '../../constants/AppConstants';
import { ThemeContext } from '../../constants/Colors';
import useCount from '../../hooks/useCount';
import { IsNumType, NumberWithCommas } from '../../handle/UtilsTS';
import { IsDev } from '../../handle/IsDev';

const ViewCount = ({
    cat,
    id,
    fontSize,
}: {
    cat: Category,
    id: string | number | undefined,
    fontSize?: number
}) => {
    const theme = useContext(ThemeContext);
    const { count, onPress } = useCount('view', '', cat, id)

    const style = useMemo(() => {
        return StyleSheet.create({
            master: { gap: Outline.GapHorizontal, alignItems: 'center', justifyContent: 'center', flexDirection: 'row' },
            text: { fontSize: fontSize ?? FontSize.Small, color: theme.counterBackground, }
        })
    }, [theme, fontSize])

    const countVal = NumberWithCommas(IsNumType(count) ? count : 0)

    useEffect(() => {
        if (IsDev())
            return

        onPress()
    }, [id, cat])

    return (
        <View style={style.master} >
            <MaterialCommunityIcons name={Icon.Eye} color={theme.counterBackground} size={Size.IconTiny} />
            <Text style={style.text}>{countVal}</Text>
        </View>
    )
}

export default ViewCount