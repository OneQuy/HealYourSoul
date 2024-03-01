// @ts-ignore
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import { TouchableOpacity } from 'react-native'
import React, { useContext, useState } from 'react'

import { Icon, Size } from '../../constants/AppConstants';
import { ThemeContext } from '../../constants/Colors';

export type MessageButtonStatus = 'new_msg' | 'no_msg' | 'hide'

const MessageButton = () => {
    const theme = useContext(ThemeContext)
    const [status, setStatus] = useState<MessageButtonStatus>('hide')

    if (status === 'hide')
        return undefined

    return (
        <TouchableOpacity>
            <MaterialCommunityIcons name={status === 'new_msg' ? Icon.BellNewMsg : Icon.BellNoMsg} color={status === 'new_msg' ? theme.primary : theme.counterBackground} size={Size.Icon} />
        </TouchableOpacity>
    )
}

export default MessageButton