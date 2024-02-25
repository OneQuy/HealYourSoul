import { View, StyleSheet, FlatList, Text } from 'react-native'
import React, { useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { FontSize, LocalText, Outline, StorageKey_CurPageFunSoundIdx } from '../../constants/AppConstants'
import { DiversityItemType } from '../../constants/Types'
import { useNavigation } from '@react-navigation/native'
import { ThemeContext } from '../../constants/Colors'
import { IsValuableArrayOrString } from '../../handle/UtilsTS'
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { SetNumberAsync } from '../../handle/AsyncStorageUtils';
import HeaderRightButtons from '../components/HeaderRightButtons';
import DiversityItem from '../components/DiversityItem';
import { DrawerNavigationProp } from '@react-navigation/drawer';
import { DrawerParamList } from '../../navigation/Navigator';
import PageNavigatorBar from '../fun_sound/PageNavigatorBar'

const numColumns = 4
const numRowPerPage = 10

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
            flatListContainer: { flex: 1, },
            // pinContainer: { flexDirection: 'row' },
            // naviContainer: { backgroundColor: theme.primary, borderRadius: BorderRadius.BR, marginBottom: insets.bottom + Outline.GapHorizontal, marginHorizontal: Outline.GapVertical, justifyContent: 'space-between', flexDirection: 'row', alignItems: 'center' },
            // naviTO: { padding: Outline.GapVertical_2, flex: 1, alignItems: 'center', justifyContent: 'center', },
            noItemTxt: { fontSize: FontSize.Normal, color: theme.counterBackground, },
        })
    }, [theme, insets])

    const renderItem = useCallback(({ item }: { item: DiversityItemType }) => {
        return <DiversityItem
            item={item} />
    }, [])

    // init

    useEffect(() => {
        (async () => {
            navigation.setOptions({
                headerRight: () => <HeaderRightButtons />
            });
        })()
    }, [])

    // render list is empty

    if (!IsValuableArrayOrString(itemsToRender)) {
        return (
            <View style={style.masterView}>
                <View style={style.centerView}>
                    <Text style={style.noItemTxt}>{LocalText.diversity_no_items}</Text>
                </View>
            </View>
        )
    }

    // main render

    return (
        <View style={style.masterView}>
            {/* scroll view */}
            <View style={style.flatListContainer}>
                <FlatList
                    showsVerticalScrollIndicator={false}
                    data={itemsToRender}
                    numColumns={numColumns}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={renderItem}
                />
            </View>

            {/* navigation */}

            <PageNavigatorBar
                onPressedMiddlePage={onPressedMiddlePage}
                onPressedNextPage={onPressedNextPage}
                onPressedTopPage={onPressedTopPage}
                curPageIdx={curPageIdx}
                maxPage={maxPage}
            />
        </View>
    )
}

export default TheDiversity

export const ClearDisversityModeCurrentScreen = (navigation: DrawerNavigationProp<DrawerParamList>) => {
    navigation.setParams({ item: undefined })
}