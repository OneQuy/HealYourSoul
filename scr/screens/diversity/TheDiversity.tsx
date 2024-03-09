// @ts-ignore
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import { View, StyleSheet, FlatList, Text, TouchableOpacity } from 'react-native'
import React, { LegacyRef, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'
import { BorderRadius, Category, FontSize, Icon, LimitSaved, LocalText, Outline, ScreenName, Size, StorageKey_CurPageFunSoundIdx, StorageKey_IsUserPressedClosePleaseSubscribe } from '../../constants/AppConstants'
import { DiversityItemType } from '../../constants/Types'
import { NavigationProp, useFocusEffect, useNavigation } from '@react-navigation/native'
import { ThemeContext } from '../../constants/Colors'
import { IsValuableArrayOrString } from '../../handle/UtilsTS'
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { GetBooleanAsync, SetBooleanAsync, SetNumberAsync } from '../../handle/AsyncStorageUtils';
import HeaderRightButtons from '../components/HeaderRightButtons';
import DiversityItem from './DiversityItem';
import { DrawerNavigationProp } from '@react-navigation/drawer';
import { DrawerParamList } from '../../navigation/Navigator';
import PageNavigatorBar from '../fun_sound/PageNavigatorBar'
import { CatToScreenName } from '../../handle/AppUtils'
import { widthPercentageToDP } from 'react-native-responsive-screen';
import FilterDiversityPopup from './FilterDiversityPopup';
import { usePremium } from '../../hooks/usePremium';
import DiversityLimitBanner from '../components/DiversityLimitBanner';

export const numColumnsDiversity = 3

const numRowPerPage = 10

type TheDiversityProps = {
    allItems: DiversityItemType[] | undefined,
    emptyText: string,
    emptyIcon: string,
    screenBackWhenPressX: ScreenName,
    showLimitSaved?: boolean,
    showFilterButton?: boolean,
    limitPages?: number,
}

var screenBackWhenPressXGlobal = ScreenName.Saved

export const GetScreenBackWhenPressXGlobal = () => screenBackWhenPressXGlobal

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
        emptyText,
        emptyIcon,
        showLimitSaved,
        screenBackWhenPressX,
        showFilterButton,
        limitPages,
    }: TheDiversityProps) => {
    const navigation = useNavigation();
    const theme = useContext(ThemeContext);
    const [curPageIdx, setCurPageIdx] = useState(0)
    const [curFilters, setCurFilters] = useState<undefined | ScreenName[]>(undefined) // undefined means ALL
    const [isShowFilterPopup, setIsShowFilterPopup] = useState(false)
    const [isUserPressedClosePleaseSubscribe, setIsUserPressedClosePleaseSubscribe] = useState(false)
    const { isPremium } = usePremium()
    const insets = useSafeAreaInsets()
    const flatListRef = useRef<LegacyRef<FlatList<DiversityItemType>> | undefined>()

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

        setCurPageIdx(0)

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

    const titleFilter = useMemo(() => {
        if (!curFilters)
            return LocalText.show_all

        let s = ''

        for (let i = 0; i < 5 && i < curFilters.length; i++) {
            if (s.length > 0)
                s += ', '

            s += curFilters[i]
        }

        if (curFilters.length > 5)
            s += ',...'

        return s
    }, [curFilters])

    const maxPage = useMemo(() => {
        if (!Array.isArray(filterItems))
            return 0

        const totalItemsPerPage = numColumnsDiversity * numRowPerPage
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

        const totalItemsPerPage = numColumnsDiversity * numRowPerPage

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
            masterView: { flex: 1, paddingBottom: Outline.GapHorizontal, gap: Outline.GapHorizontal, },
            centerView: { flex: 1, justifyContent: 'center', alignItems: 'center' },
            filterView: { marginHorizontal: Outline.GapVertical, justifyContent: 'center', alignItems: 'center', },
            filterTO: { maxWidth: '100%', paddingHorizontal: 20, borderRadius: BorderRadius.BR8, justifyContent: 'center', alignItems: 'center', gap: Outline.GapHorizontal, padding: Outline.GapHorizontal, minWidth: widthPercentageToDP(20), flexDirection: 'row', backgroundColor: theme.primary },
            flatListContainer: { flex: 1, },
            filterCatTxt: { maxWidth: '100%', fontSize: FontSize.Small_L, color: theme.counterPrimary, },
            noItemTxt: { textAlign: 'center', marginHorizontal: Outline.GapVertical, fontSize: FontSize.Normal, color: theme.counterBackground, },
        })
    }, [theme, insets])

    const onPressedClosePlsSubscribe = useCallback(() => {
        SetBooleanAsync(StorageKey_IsUserPressedClosePleaseSubscribe, true)
        setIsUserPressedClosePleaseSubscribe(true)
    }, [])

    const renderItem = useCallback(({ item }: { item: DiversityItemType }) => {
        return <DiversityItem
            item={item} />
    }, [])

    const renderPleaseSubscribe = useCallback(() => {
        if (showLimitSaved !== true || isPremium || isUserPressedClosePleaseSubscribe)
            return undefined

        return <DiversityLimitBanner
            onPressedClose={onPressedClosePlsSubscribe}
            text={LocalText.limit_saved_desc.replace('##', LimitSaved.toString())}
        />
    }, [showLimitSaved, onPressedClosePlsSubscribe, isUserPressedClosePleaseSubscribe, isPremium])

    const showLitmitPages = useCallback(() => {
        // return true
        if (limitPages === undefined || isPremium)
            return false

        if (maxPage < 2 || curPageIdx < limitPages)
            return false

        return true
    }, [limitPages, isPremium, curPageIdx, maxPage])

    const renderLimitPages = useCallback(() => {
        if (limitPages === undefined)
            return undefined

        return <DiversityLimitBanner
            text={LocalText.limit_pages.replace('##', (limitPages + 1).toString())}
        />
    }, [showLitmitPages, limitPages, isPremium, curPageIdx])

    // init

    useEffect(() => {
        (async () => {
            setIsUserPressedClosePleaseSubscribe(await GetBooleanAsync(StorageKey_IsUserPressedClosePleaseSubscribe, false))

            navigation.setOptions({
                headerRight: () => <HeaderRightButtons />
            })
        })()
    }, [])

    useEffect(() => {
        if (flatListRef.current)
            // @ts-ignore
            flatListRef.current.scrollToOffset({ animated: false, offset: 0 });
    }, [curPageIdx])

    useFocusEffect(useCallback(() => {
        screenBackWhenPressXGlobal = screenBackWhenPressX
    }, [screenBackWhenPressX]))

    // render list is empty

    if (!IsValuableArrayOrString(itemsToRender) || !allScreensOfThisDivesity || !IsValuableArrayOrString(allScreensOfThisDivesity)) {
        return (
            <View style={style.masterView}>
                <View style={style.centerView}>
                    <MaterialCommunityIcons name={emptyIcon} color={theme.primary} size={Size.IconMedium} />
                    <Text style={style.noItemTxt}>{emptyText}</Text>

                    {
                        renderPleaseSubscribe()
                    }
                </View>
            </View>
        )
    }

    // main render

    return (
        <View style={style.masterView}>
            {/* filter button */}

            {
                showFilterButton !== false &&
                <View style={style.filterView}>
                    <TouchableOpacity onPress={() => setIsShowFilterPopup(true)} style={style.filterTO}>
                        <MaterialCommunityIcons name={Icon.Bookmark} color={theme.counterPrimary} size={Size.IconSmaller} />
                        <Text adjustsFontSizeToFit numberOfLines={1} style={style.filterCatTxt}>{titleFilter}</Text>
                    </TouchableOpacity>
                </View>
            }

            {/* limit page */}

            {
                showLitmitPages() &&
                <View style={style.centerView}>
                    {
                        renderLimitPages()
                    }
                </View>
            }

            {/* scroll view */}

            {
                !showLitmitPages() &&
                <View style={style.flatListContainer}>
                    <FlatList
                        // @ts-ignore
                        ref={flatListRef}
                        showsVerticalScrollIndicator={false}
                        data={itemsToRender}
                        numColumns={numColumnsDiversity}
                        keyExtractor={(_, index) => index.toString()}
                        renderItem={renderItem}
                    />
                </View>
            }

            {/* please subscribe */}

            {
                renderPleaseSubscribe()
            }

            {/* navigation */}

            {
                maxPage > 1 &&
                <PageNavigatorBar
                    onPressedMiddlePage={onPressedMiddlePage}
                    onPressedNextPage={onPressedNextPage}
                    onPressedTopPage={onPressedTopPage}
                    curPageIdx={curPageIdx}
                    maxPage={maxPage}
                />
            }

            {/* filter popup */}

            {
                isShowFilterPopup ? (<FilterDiversityPopup listScreen={allScreensOfThisDivesity} curFiltersParam={curFilters} setFiltersParam={setFilterAndClosePopup} />) : undefined
            }
        </View>
    )
}

export default TheDiversity