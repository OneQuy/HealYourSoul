// @ts-ignore
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import { TouchableOpacity } from 'react-native'
import React, { useCallback, useContext, useEffect, useRef, useState } from 'react'

import { Icon, ScreenName, Size } from '../../constants/AppConstants';
import { ThemeContext } from '../../constants/Colors';
import { track_PressDrawerItem } from '../../handle/tracking/GoodayTracking';
import { FilterOnlyLetterAndNumberFromString } from '../../handle/UtilsTS';
import { useNavigation } from '@react-navigation/native';
import { useAppDispatch, useAppSelector } from '../../redux/Store';
import { Inbox } from '../../constants/Types';
import { GetUserInboxesAsync } from '../../handle/tracking/UserMan';
import { addInboxes } from '../../redux/UserDataSlice';
import { useDrawerStatus } from '@react-navigation/drawer';

export type InboxStatus = 'new_msg' | 'no_msg' | 'hide'

const InboxButton = () => {
    const theme = useContext(ThemeContext)
    const [status, setStatus] = useState<InboxStatus>('no_msg')
    const navigation = useNavigation()
    const allInboxes = useAppSelector(state => state.userData.inboxes)
    const fetchNewInboxesStatus = useRef<'fetching' | 'fetched' | 'not_fetched_yet'>('not_fetched_yet')
    const dispatch = useAppDispatch()
    const drawerStatus = useDrawerStatus()

    // const 

    const checkAndFetchNewInboxes = useCallback(async () => {
        // already called

        if (fetchNewInboxesStatus.current === 'fetching' ||
            fetchNewInboxesStatus.current === 'fetched') {
            return
        }
        // fetch!

        fetchNewInboxesStatus.current = 'fetching'

        const inboxes = await GetUserInboxesAsync()

        if (inboxes instanceof Error) {
            fetchNewInboxesStatus.current = 'not_fetched_yet'
            return
        }

        fetchNewInboxesStatus.current = 'fetched'

        if (inboxes)
            dispatch(addInboxes(inboxes))
    }, [])

    const onPress = useCallback(() => {
        track_PressDrawerItem(FilterOnlyLetterAndNumberFromString(ScreenName.Inbox))

        // @ts-ignore
        navigation.navigate(ScreenName.Inbox)
    }, [])

    useEffect(() => {
        checkAndFetchNewInboxes()
    }, [drawerStatus])

    if (status === 'hide')
        return undefined

    return (
        <TouchableOpacity onPress={onPress}>
            <MaterialCommunityIcons name={status === 'new_msg' ? Icon.BellNewMsg : Icon.BellNoMsg} color={status === 'new_msg' ? theme.primary : theme.counterBackground} size={Size.Icon} />
        </TouchableOpacity>
    )
}

export default InboxButton