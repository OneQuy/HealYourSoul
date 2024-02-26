// @ts-ignore
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import { View, StyleSheet, FlatList, Text, TouchableOpacity } from 'react-native'
import React, { useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { BorderRadius, Category, FontSize, Icon, LocalText, Outline, ScreenName, Size, StorageKey_CurPageFunSoundIdx } from '../../constants/AppConstants'
import { DiversityItemType } from '../../constants/Types'
import { NavigationProp, useNavigation } from '@react-navigation/native'
import { ThemeContext } from '../../constants/Colors'
import { IsValuableArrayOrString } from '../../handle/UtilsTS'
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { SetNumberAsync } from '../../handle/AsyncStorageUtils';
import HeaderRightButtons from '../components/HeaderRightButtons';
import DiversityItem from './DiversityItem';
import { DrawerNavigationProp } from '@react-navigation/drawer';
import { DrawerParamList } from '../../navigation/Navigator';
import PageNavigatorBar from '../fun_sound/PageNavigatorBar'
import { CatToScreenName } from '../../handle/AppUtils'
import { widthPercentageToDP } from 'react-native-responsive-screen';
import FilterDiversityPopup from './FilterDiversityPopup';
import { ArrayGroupElements } from '../../handle/Utils';

const numColumns = 4
const numRowPerPage = 4

type TheDiversityProps = {
    allItems: DiversityItemType[] | undefined,
}

var onPressedNextItemDiversityGlobalFunc: undefined | ((isNext: boolean, curItem: DiversityItemType) => void) = undefined

export const OnPressedNextItemDiversity = (isNext: boolean, curItem: DiversityItemType) => {
    if (!onPressedNextItemDiversityGlobalFunc)
        return

    onPressedNextItemDiversityGlobalFunc(isNext, curItem)
}

export const OnPressedDeversityItem = (
    navigation: DrawerNavigationProp<DrawerParamList> | NavigationProp<ReactNavigation.RootParamList>,
    item: DiversityItemType) => {
    const screen = CatToScreenName(item.cat)

    // switch screen

    if (!screen)
        return

    // @ts-ignore
    navigation.navigate(screen, { item })
}

const TheDiversity = (
    {
        allItems,
    }: TheDiversityProps) => {
    const navigation = useNavigation();
    const theme = useContext(ThemeContext);
    const [curPageIdx, setCurPageIdx] = useState(0)
    const [curFilters, setCurFilters] = useState<undefined | ScreenName[]>(undefined) // undefined means ALL
    const insets = useSafeAreaInsets()
    const [isShowFilterPopup, setIsShowFilterPopup] = useState(false)

    const filterItems: DiversityItemType[] | undefined = useMemo(() => {
        if (!allItems || !IsValuableArrayOrString(allItems))
            return undefined

        const arr = allItems.filter(item => {
            if (!curFilters)// show all
                return true
            else {
                const screenOfCat = CatToScreenName(item.cat)

                if (!screenOfCat)
                    return true
                else
                    return curFilters.includes(screenOfCat)
            }
        })

        if (!arr || arr.length === 0)
            setCurFilters(undefined)

        return arr
    }, [allItems, curFilters])

    const allScreensOfThisDivesity: ScreenName[] | undefined = useMemo(() => {
        if (!allItems)
            return undefined

        const arr: Category[] = []

        for (let i = 0; i < allItems.length; i++) {
            if (!arr.includes(allItems[i].cat))
                arr.push(allItems[i].cat)
        }

        const screenNames: ScreenName[] = []

        for (let i = 0; i < arr.length; i++) {
            const screen = CatToScreenName(arr[i])

            if (screen)
                screenNames.push(screen)
        }

        return screenNames
    }, [allItems])
    console.log(allScreensOfThisDivesity);

    const maxPage = useMemo(() => {
        if (!Array.isArray(filterItems))
            return 0

        const totalItemsPerPage = numColumns * numRowPerPage
        const maxPage = Math.ceil(filterItems.length / totalItemsPerPage)

        return maxPage
    }, [filterItems])

    const setFilterAndClosePopup = useCallback((filters: undefined | ScreenName[]) => {
        setCurFilters(filters)
        setIsShowFilterPopup(false)
    }, [])

    const onPressedTopPage = useCallback((isNext: boolean) => {
        if (!Array.isArray(filterItems))
            return

        const idx = isNext ? maxPage - 1 : 0

        setCurPageIdx(idx)
        SetNumberAsync(StorageKey_CurPageFunSoundIdx, idx)
    }, [filterItems, maxPage])

    const onPressedMiddlePage = useCallback(() => {
        if (!Array.isArray(filterItems))
            return

        const idx = Math.floor(maxPage / 2)

        setCurPageIdx(idx)
        SetNumberAsync(StorageKey_CurPageFunSoundIdx, idx)
    }, [filterItems, maxPage])

    const onPressedNextPage = useCallback((isNext: boolean) => {
        if (!Array.isArray(filterItems))
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
    }, [curPageIdx, filterItems, maxPage])

    const itemsToRender = useMemo(() => {
        if (!Array.isArray(filterItems))
            return []

        const totalItemsPerPage = numColumns * numRowPerPage

        return filterItems.slice(curPageIdx * totalItemsPerPage, curPageIdx * totalItemsPerPage + totalItemsPerPage)
    }, [curPageIdx, filterItems])

    onPressedNextItemDiversityGlobalFunc = useCallback((isNext: boolean, curItem: DiversityItemType) => {
        if (!filterItems)
            return

        const curIdx = filterItems.findIndex(i => JSON.stringify(i) === JSON.stringify(curItem))

        if (curIdx < 0)
            return

        let goToIdx = curIdx

        if (isNext) {
            if (curIdx < filterItems.length - 1)
                goToIdx = curIdx + 1
        }
        else {
            if (curIdx > 0) {
                goToIdx = curIdx - 1
            }
        }

        if (curIdx === goToIdx)
            return

        OnPressedDeversityItem(navigation, filterItems[goToIdx])
    }, [filterItems])

    const style = useMemo(() => {
        return StyleSheet.create({
            masterView: { flex: 1, paddingBottom: insets.bottom, gap: Outline.GapHorizontal, },
            centerView: { flex: 1, justifyContent: 'center', alignItems: 'center' },
            filterView: { justifyContent: 'center', alignItems: 'center', },
            filterTO: { borderRadius: BorderRadius.BR8, justifyContent: 'center', alignItems: 'center', gap: Outline.GapHorizontal, padding: Outline.GapHorizontal, minWidth: widthPercentageToDP(20), flexDirection: 'row', backgroundColor: theme.primary },
            flatListContainer: { flex: 1, },
            filterCatTxt: { fontSize: FontSize.Normal, color: theme.counterPrimary, },
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

    if (!IsValuableArrayOrString(itemsToRender) || !allScreensOfThisDivesity) {
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
            {/* filter button */}

            <View style={style.filterView}>
                <TouchableOpacity onPress={() => setIsShowFilterPopup(true)} style={style.filterTO}>
                    <MaterialCommunityIcons name={Icon.Bookmark} color={theme.counterPrimary} size={Size.Icon} />
                    <Text style={style.filterCatTxt}>All</Text>
                </TouchableOpacity>
            </View>

            {/* scroll view */}

            <View style={style.flatListContainer}>
                <FlatList
                    showsVerticalScrollIndicator={false}
                    data={itemsToRender}
                    numColumns={numColumns}
                    keyExtractor={(_, index) => index.toString()}
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

            {/* filter popup */}

            {
                isShowFilterPopup ? (<FilterDiversityPopup listScreen={allScreensOfThisDivesity} curFiltersParam={curFilters} setFiltersParam={setFilterAndClosePopup} />) : undefined
            }
        </View>
    )
}

export default TheDiversity

export const ClearDisversityModeCurrentScreen = (navigation: DrawerNavigationProp<DrawerParamList>) => {
    navigation.setParams({ item: undefined })
}