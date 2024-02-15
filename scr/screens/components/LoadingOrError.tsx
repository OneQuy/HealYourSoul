// @ts-ignore
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import { View, Text, TouchableOpacity, ActivityIndicator } from 'react-native'
import React, { useContext } from 'react'
import { FontSize, LocalText, NeedReloadReason, Outline, Size } from '../../constants/AppConstants'
import { ThemeContext } from '../../constants/Colors'

type LoadingOrErrorProps = {
    reasonToReload: NeedReloadReason,
    onPressedReload: () => void,
}
const LoadingOrError = ({
    reasonToReload,
    onPressedReload }: LoadingOrErrorProps) => {
    const theme = useContext(ThemeContext);

    return (
        <>
            {
                // true ?
                reasonToReload !== NeedReloadReason.None ?
                    // need to reload
                    <TouchableOpacity onPress={onPressedReload} style={{ flex: 1, justifyContent: 'center', alignItems: 'center', gap: Outline.GapVertical }} >
                        <MaterialCommunityIcons name={reasonToReload === NeedReloadReason.NoInternet ? 'access-point-network-off' : 'heart-broken'} color={theme.counterBackground} size={Size.IconMedium} />
                        <Text style={{ fontSize: FontSize.Normal, color: theme.counterBackground }}>{reasonToReload === NeedReloadReason.NoInternet ? LocalText.no_internet : LocalText.cant_get_content}</Text>
                        <Text style={{ fontSize: FontSize.Small_L, color: theme.counterBackground }}>{LocalText.tap_to_retry}</Text>
                    </TouchableOpacity> :

                    // loading
                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', gap: Outline.GapVertical }} >
                        <ActivityIndicator color={theme.counterBackground} style={{ marginRight: Outline.Horizontal }} />
                    </View>
            }
        </>
    )
}

export default LoadingOrError