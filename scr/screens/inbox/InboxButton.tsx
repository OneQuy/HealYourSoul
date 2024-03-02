// @ts-ignore
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import { TouchableOpacity } from 'react-native'
import React, { useCallback, useContext, useEffect, useState } from 'react'

import { Icon, ScreenName, Size } from '../../constants/AppConstants';
import { ThemeContext } from '../../constants/Colors';
import { track_PressDrawerItem } from '../../handle/tracking/GoodayTracking';
import { FilterOnlyLetterAndNumberFromString } from '../../handle/UtilsTS';
import { useNavigation } from '@react-navigation/native';

export type InboxStatus = 'new_msg' | 'no_msg' | 'hide'

const InboxButton = () => {
    const theme = useContext(ThemeContext)
    const [status, setStatus] = useState<InboxStatus>('no_msg')
    const navigation = useNavigation()
    
    // const 

    const onPress = useCallback(() => {
        track_PressDrawerItem(FilterOnlyLetterAndNumberFromString(ScreenName.Inbox))

        // @ts-ignore
        navigation.navigate(ScreenName.Inbox)
    }, [])

    useEffect(() => {

    }, [])

    if (status === 'hide')
        return undefined

    return (
        <TouchableOpacity onPress={onPress}>
            <MaterialCommunityIcons name={status === 'new_msg' ? Icon.BellNewMsg : Icon.BellNoMsg} color={status === 'new_msg' ? theme.primary : theme.counterBackground} size={Size.Icon} />
        </TouchableOpacity>
    )
}

export default InboxButton