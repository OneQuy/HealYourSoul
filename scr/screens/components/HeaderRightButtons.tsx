// @ts-ignore
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import { TouchableOpacity, StyleSheet, View } from 'react-native'
import React, { useCallback, useContext, useMemo } from 'react'
import { Icon, Outline, ScreenName, Size } from '../../constants/AppConstants';
import { ThemeContext } from '../../constants/Colors';
import { useNavigation } from '@react-navigation/native';
import { DiversityItemType } from '../../constants/Types';
import { useSaved } from '../../hooks/useSaved';

const HeaderRightButtons = (
    {
        diversityItemData,
        diversityMode,
    }: {
        diversityItemData?: DiversityItemType,
        diversityMode?: boolean,
    }) => {
    const theme = useContext(ThemeContext);
    const navigation = useNavigation()
    const [isSaved, onPressSaved] = useSaved(diversityItemData, diversityMode)

    const onPressPremium = useCallback(() => {
        navigation.navigate(ScreenName.IAPPage as never)
    }, [navigation])

    const style = useMemo(() => {
        return StyleSheet.create({
            master: { gap: Outline.GapHorizontal, flexDirection: 'row', marginRight: 15 },
        })
    }, [])

    return (
        <View style={style.master}>
            {/* saved btn */}
            {
                diversityItemData &&
                <TouchableOpacity onPress={onPressSaved}>
                    <MaterialCommunityIcons name={isSaved ? Icon.Bookmark : Icon.BookmarkOutline} color={theme.primary} size={Size.Icon} />
                </TouchableOpacity>
            }

            {/* premium btn */}
            <TouchableOpacity onPress={onPressPremium} >
                <MaterialCommunityIcons name={Icon.Star} color={theme.primary} size={Size.Icon} />
            </TouchableOpacity>
        </View>
    )
}

export default HeaderRightButtons