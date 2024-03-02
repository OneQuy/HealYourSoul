// @ts-ignore
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import { TouchableOpacity } from 'react-native'
import React, { useCallback, useContext, useEffect, useRef, useState } from 'react'
import { Icon, ScreenName, Size, StorageKey_HaveNewApprovedUploads } from '../../constants/AppConstants';
import { ThemeContext } from '../../constants/Colors';
import { track_PressDrawerItem } from '../../handle/tracking/GoodayTracking';
import { DateDiff_InHour_WithNow, FilterOnlyLetterAndNumberFromString } from '../../handle/UtilsTS';
import { useNavigation } from '@react-navigation/native';
import { useAppDispatch, useAppSelector } from '../../redux/Store';
import { ClearAllUserInboxesInFirebaseAsync, GetUserInboxesAsync } from '../../handle/tracking/UserMan';
import { addInboxes, addUploadedItem } from '../../redux/UserDataSlice';
import { useDrawerStatus } from '@react-navigation/drawer';
import { SetBooleanAsync } from '../../handle/AsyncStorageUtils';

export type InboxStatus = 'new_msg' | 'no_msg' | 'hide'

const InboxButton = () => {
    const theme = useContext(ThemeContext)
    const [status, setStatus] = useState<InboxStatus>('hide')
    const navigation = useNavigation()
    const allInboxes = useAppSelector(state => state.userData.inboxes)
    const fetchNewInboxesStatus = useRef<'fetching' | 'fetched' | 'not_fetched_yet'>('not_fetched_yet')
    const lastFetchedTick = useRef(0)
    const dispatch = useAppDispatch()
    const drawerStatus = useDrawerStatus()

    // const 

    const checkAndFetchNewInboxes = useCallback(async () => {
        // fetching

        if (fetchNewInboxesStatus.current === 'fetching') {
            return
        }

        // fetched => check last fetch, if over 1 hour re-fetch

        if (fetchNewInboxesStatus.current === 'fetched') {
            if (DateDiff_InHour_WithNow(lastFetchedTick.current) < 1) {
                return
            }
        }

        // fetch!

        fetchNewInboxesStatus.current = 'fetching'

        const inboxes = await GetUserInboxesAsync()

        // error 

        if (inboxes instanceof Error) {
            fetchNewInboxesStatus.current = 'not_fetched_yet'
            return
        }

        // success

        fetchNewInboxesStatus.current = 'fetched'
        lastFetchedTick.current = Date.now()

        // have new inboxes

        if (inboxes) {
            // save to local

            dispatch(addInboxes(inboxes))

            // clear on firebase

            ClearAllUserInboxesInFirebaseAsync()

            // add approvedUploadedDiversity

            let setNewApproved = false

            for (let i = 0; i < inboxes.length; i++) {
                const inb = inboxes[i]

                if (!inb.approvedUploadedDiversity)
                    continue

                dispatch(addUploadedItem(inb.approvedUploadedDiversity))

                if (!setNewApproved) {
                    setNewApproved = true

                    SetBooleanAsync(StorageKey_HaveNewApprovedUploads, true)
                }
            }
        }
    }, [])

    const onPress = useCallback(() => {
        track_PressDrawerItem(FilterOnlyLetterAndNumberFromString(ScreenName.Inbox))

        // @ts-ignore
        navigation.navigate(ScreenName.Inbox)
    }, [])

    useEffect(() => {
        checkAndFetchNewInboxes()
    }, [drawerStatus])

    useEffect(() => {
        if (!allInboxes || allInboxes.length === 0)
            setStatus('hide')
        else {
            const unread = allInboxes.findIndex(inb => !inb.didRead) >= 0

            setStatus(unread ? 'new_msg' : 'no_msg')
        }
    }, [allInboxes])

    if (status === 'hide')
        return undefined

    return (
        <TouchableOpacity onPress={onPress}>
            <MaterialCommunityIcons name={status === 'new_msg' ? Icon.BellNewMsg : Icon.BellNoMsg} color={status === 'new_msg' ? theme.primary : theme.counterBackground} size={Size.IconSmaller} />
        </TouchableOpacity>
    )
}

export default InboxButton