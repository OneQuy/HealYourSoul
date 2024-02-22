// @ts-ignore
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import { TouchableOpacity, StyleSheet, View } from 'react-native'
import React, { useCallback, useContext, useMemo } from 'react'
import { Category, Icon, Outline, ScreenName, Size } from '../../constants/AppConstants';
import { ThemeContext } from '../../constants/Colors';
import { useNavigation } from '@react-navigation/native';
import { PostMetadata } from '../../constants/Types';

const HeaderSettingButton = (
    {
        cat,
        thePagePost,
    }: {
        cat?: Category,
        thePagePost?: PostMetadata | null,
    }) => {
    const theme = useContext(ThemeContext);
    const navigation = useNavigation()

    const onPressPremium = useCallback(() => {
        navigation.navigate(ScreenName.IAPPage as never)
    }, [navigation])


    const onPressSaved = useCallback(async () => {
    }, [])

    const style = useMemo(() => {
        return StyleSheet.create({
            master: { gap: Outline.GapHorizontal, flexDirection: 'row', marginRight: 15 },
            iconTO: {},
        })
    }, [])

    return (
        <View style={style.master}>
            {/* saved btn */}
            {
                !onPressSaved ? undefined :
                    <TouchableOpacity onPress={onPressSaved} style={style.iconTO}>
                        <MaterialCommunityIcons name={0 ? Icon.Bookmark : Icon.BookmarkOutline} color={theme.primary} size={Size.Icon} />
                    </TouchableOpacity>
            }

            {/* premium btn */}
            <TouchableOpacity onPress={onPressPremium} style={style.iconTO}>
                <MaterialCommunityIcons name={Icon.Star} color={theme.primary} size={Size.Icon} />
            </TouchableOpacity>
        </View>
    )
}

export default HeaderSettingButton