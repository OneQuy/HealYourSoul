// @ts-ignore
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import { View, StyleSheet, FlatList, TouchableOpacity, Text } from 'react-native'
import React, { useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { BorderRadius, Category, FontSize, Icon, LocalText, NeedReloadReason, Outline, Size, StorageKey_CurPageFunSoundIdx, StorageKey_LocalFileVersion } from '../../constants/AppConstants'
import useCheckAndDownloadRemoteFile from '../../hooks/useCheckAndDownloadRemoteFile'
import { DiversityItemType, FunSound } from '../../constants/Types'
import { TempDirName } from '../../handle/Utils'
import { GetRemoteFileConfigVersion } from '../../handle/AppConfigHandler'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useFocusEffect, useNavigation } from '@react-navigation/native'
import { ThemeContext } from '../../constants/Colors'
import { FillPathPattern, SaveCurrentScreenForLoadNextTime } from '../../handle/AppUtils'
import { useAppDispatch, useAppSelector } from '../../redux/Store'
import { FilterOnlyLetterAndNumberFromString, IsValuableArrayOrString, RandomColor } from '../../handle/UtilsTS'
import LoadingOrError from '../components/LoadingOrError'
import { NetLord } from '../../handle/NetLord'
import { FirebaseDatabase_GetValueAsync, FirebaseDatabase_SetValueAsync } from '../../firebase/FirebaseDatabase'
import { addFunSoundFavoritedID, removeFunSoundFavoritedID } from '../../redux/UserDataSlice'
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { GetNumberIntAsync, SetNumberAsync } from '../../handle/AsyncStorageUtils';
import HeaderSettingButton from '../components/HeaderSettingButton';
import { track_PressNextPost } from '../../handle/tracking/GoodayTracking';
import DiversityItem from '../components/DiversityItem';

const numColumns = 4
const numRowPerPage = 9

type TheDiversityProps = {
    allItems: DiversityItemType[] | undefined,
}

const TheDiversity = (
    {
        allItems,
    }: TheDiversityProps) => {
    const navigation = useNavigation();
    const theme = useContext(ThemeContext);
    const [curPageIdx, setCurPageIdx] = useState(0)
    const dispatch = useAppDispatch()
    const insets = useSafeAreaInsets()

    const maxPage = useMemo(() => {
        if (!Array.isArray(allItems))
            return 0

        const totalItemsPerPage = numColumns * numRowPerPage
        const maxPage = Math.ceil(allItems.length / totalItemsPerPage)

        return maxPage
    }, [allItems])

    const onPressedTopPage = useCallback((isNext: boolean) => {
        if (!Array.isArray(allItems))
            return

        const idx = isNext ? maxPage - 1 : 0

        setCurPageIdx(idx)
        SetNumberAsync(StorageKey_CurPageFunSoundIdx, idx)
    }, [allItems, maxPage])

    const onPressedMiddlePage = useCallback(() => {
        if (!Array.isArray(allItems))
            return

        const idx = Math.floor(maxPage / 2)

        setCurPageIdx(idx)
        SetNumberAsync(StorageKey_CurPageFunSoundIdx, idx)
    }, [allItems, maxPage])

    const onPressedNextPage = useCallback((isNext: boolean) => {
        if (!Array.isArray(allItems))
            return

        let idx = curPageIdx

        if (isNext) {
            if (curPageIdx < maxPage - 1)
                idx = curPageIdx + 1
        }
        else {
            if (curPageIdx > 0)
                idx = curPageIdx - 1
        }

        setCurPageIdx(idx)
        SetNumberAsync(StorageKey_CurPageFunSoundIdx, idx)

        // track_PressNextPost(true, category, isNext)
    }, [curPageIdx, allItems, maxPage])

    const itemsToRender = useMemo(() => {
        if (!Array.isArray(allItems))
            return []

        const totalItemsPerPage = numColumns * numRowPerPage

        return allItems.slice(curPageIdx * totalItemsPerPage, curPageIdx * totalItemsPerPage + totalItemsPerPage)
    }, [curPageIdx, allItems])

    const style = useMemo(() => {
        return StyleSheet.create({
            masterView: { flex: 1, paddingBottom: insets.bottom, gap: Outline.GapHorizontal, },
            centerView: { flex: 1, justifyContent: 'center', alignItems: 'center' },
            // flatListContainer: { flex: 1, },
            // pinContainer: { flexDirection: 'row' },
            // naviContainer: { backgroundColor: theme.primary, borderRadius: BorderRadius.BR, marginBottom: insets.bottom + Outline.GapHorizontal, marginHorizontal: Outline.GapVertical, justifyContent: 'space-between', flexDirection: 'row', alignItems: 'center' },
            // naviTO: { padding: Outline.GapVertical_2, flex: 1, alignItems: 'center', justifyContent: 'center', },
            noItemTxt: { fontSize: FontSize.Normal, color: theme.counterBackground, },
        })
    }, [theme, insets])

    const renderItem = useCallback(({ item, index }: { item: DiversityItemType, index: number }) => {
        return <DiversityItem
            onPressed={() => { }}
            data={item} />
    }, [])

    // init

    useEffect(() => {
        (async () => {
            navigation.setOptions({
                headerRight: () => <HeaderSettingButton />
            });
        })()
    }, [])

    // render list is empty

    if (!IsValuableArrayOrString(itemsToRender)) {
        return (
            <View style={style.masterView}>
                <View style={style.centerView}>
                    <Text style={style.noItemTxt}>{LocalText.saved_no_items}</Text>
                </View>
            </View>
        )
    }

    // main render

    // return (
    //     <View style={style.masterView}>
    //         {/* pin */}
    //         {
    //             renderPinnedSounds
    //         }

    //         {/* scroll view */}
    //         <View style={style.flatListContainer}>
    //             <FlatList
    //                 showsVerticalScrollIndicator={false}
    //                 data={itemsToRender}
    //                 numColumns={numColumns}
    //                 keyExtractor={(item) => item.name}
    //                 renderItem={renderItem}
    //             />
    //         </View>

    //         {/* navigation */}
    //         <View style={style.naviContainer}>
    //             <TouchableOpacity onPress={() => onPressedTopPage(false)} style={style.naviTO}>
    //                 <MaterialCommunityIcons name={Icon.MaxLeft} color={theme.counterPrimary} size={Size.Icon} />
    //             </TouchableOpacity>
    //             <TouchableOpacity onPress={() => onPressedNextPage(false)} style={style.naviTO}>
    //                 <MaterialCommunityIcons name={Icon.Left} color={theme.counterPrimary} size={Size.Icon} />
    //             </TouchableOpacity>
    //             <Text onPress={onPressedMiddlePage} style={style.pageTxt}>{curPageIdx + 1}/{maxPage}</Text>
    //             <TouchableOpacity onPress={() => onPressedNextPage(true)} style={style.naviTO}>
    //                 <MaterialCommunityIcons name={Icon.Right} color={theme.counterPrimary} size={Size.Icon} />
    //             </TouchableOpacity>
    //             <TouchableOpacity onPress={() => onPressedTopPage(true)} style={style.naviTO}>
    //                 <MaterialCommunityIcons name={Icon.MaxRight} color={theme.counterPrimary} size={Size.Icon} />
    //             </TouchableOpacity>
    //         </View>
    //     </View>
    // )
}

export default TheDiversity