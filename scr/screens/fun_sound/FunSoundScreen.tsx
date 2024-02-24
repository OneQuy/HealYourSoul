// @ts-ignore
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import { View, StyleSheet, FlatList, TouchableOpacity, Text } from 'react-native'
import React, { useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { BorderRadius, Category, FontSize, Icon, NeedReloadReason, Outline, Size, StorageKey_CurPageFunSoundIdx, StorageKey_LocalFileVersion } from '../../constants/AppConstants'
import useCheckAndDownloadRemoteFile from '../../hooks/useCheckAndDownloadRemoteFile'
import { FunSound } from '../../constants/Types'
import { TempDirName } from '../../handle/Utils'
import { GetRemoteFileConfigVersion } from '../../handle/AppConfigHandler'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useFocusEffect, useNavigation } from '@react-navigation/native'
import { ThemeContext } from '../../constants/Colors'
import { FillPathPattern, SaveCurrentScreenForLoadNextTime } from '../../handle/AppUtils'
import FunSoundItem from './FunSoundItem'
import { useAppDispatch, useAppSelector } from '../../redux/Store'
import { FilterOnlyLetterAndNumberFromString, IsValuableArrayOrString, RandomColor } from '../../handle/UtilsTS'
import LoadingOrError from '../components/LoadingOrError'
import { NetLord } from '../../handle/NetLord'
import { FirebaseDatabase_GetValueAsync, FirebaseDatabase_SetValueAsync } from '../../firebase/FirebaseDatabase'
import { addFunSoundFavoritedID, removeFunSoundFavoritedID } from '../../redux/UserDataSlice'
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { GetNumberIntAsync, SetNumberAsync } from '../../handle/AsyncStorageUtils';
import HeaderRightButtons from '../components/HeaderRightButtons';
import { track_PressFavorite, track_PressNextPost } from '../../handle/tracking/GoodayTracking';
import PageNavigatorBar from './PageNavigatorBar';

const LikePathByID = 'user_data/post/@cat/@id/like';
const LikePathAll = 'user_data/post/@cat';

const category = Category.FunSound

const fileURL = 'https://firebasestorage.googleapis.com/v0/b/warm-379a6.appspot.com/o/file_configs%2Ffun_sound.json?alt=media&token=61576a53-6c78-4428-a240-a1dd7a250825'

const numColumns = 4
const numRowPerPage = 9

const FunSoundScreen = () => {
  const navigation = useNavigation();
  const theme = useContext(ThemeContext);
  const pinnedSounds = useAppSelector((state) => state.userData.pinnedFunSoundNames)
  const [likesObj, setLikesObj] = useState<{} | undefined>(undefined)
  const [curPageIdx, setCurPageIdx] = useState(0)
  const dispatch = useAppDispatch()
  const favoritedIDs = useAppSelector((state) => state.userData.funSoundFavoriteIDs)
  const insets = useSafeAreaInsets()

  const [funSounds, errorDownloadJson, _, reUpdateData] = useCheckAndDownloadRemoteFile<FunSound[]>(
    fileURL,
    TempDirName + '/fun_sound.json',
    true,
    GetRemoteFileConfigVersion('fun_sound'),
    'json',
    false,
    async () => AsyncStorage.getItem(StorageKey_LocalFileVersion(category)),
    async () => AsyncStorage.setItem(StorageKey_LocalFileVersion(category), GetRemoteFileConfigVersion('fun_sound').toString()))

  const idOfSound = useCallback((item: FunSound) => {
    return FilterOnlyLetterAndNumberFromString(item.name)
  }, [])

  const likeCount = useCallback((item: FunSound) => {
    if (!likesObj)
      return Number.NaN

    // @ts-ignore
    if (likesObj[idOfSound(item)] && typeof likesObj[idOfSound(item)].like === 'number')
      // @ts-ignore
      return likesObj[idOfSound(item)].like
    else
      return 0
  }, [likesObj, idOfSound])

  const maxPage = useMemo(() => {
    if (!Array.isArray(funSounds))
      return 0

    const totalItemsPerPage = numColumns * numRowPerPage
    const maxPage = Math.ceil(funSounds.length / totalItemsPerPage)

    return maxPage
  }, [funSounds])

  const onPressedTopPage = useCallback((isNext: boolean) => {
    if (!Array.isArray(funSounds))
      return

    const idx = isNext ? maxPage - 1 : 0

    setCurPageIdx(idx)
    SetNumberAsync(StorageKey_CurPageFunSoundIdx, idx)
  }, [funSounds, maxPage])

  const onPressedMiddlePage = useCallback(() => {
    if (!Array.isArray(funSounds))
      return

    const idx = Math.floor(maxPage / 2)

    setCurPageIdx(idx)
    SetNumberAsync(StorageKey_CurPageFunSoundIdx, idx)
  }, [funSounds, maxPage])

  const onPressedNextPage = useCallback((isNext: boolean) => {
    if (!Array.isArray(funSounds))
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

    track_PressNextPost(true, category, isNext)
  }, [curPageIdx, funSounds, maxPage])

  const isFavorited = useCallback((item: FunSound) => {
    const id = idOfSound(item)
    return favoritedIDs && favoritedIDs.includes(id);
  }, [favoritedIDs, idOfSound])

  const itemsToRender = useMemo(() => {
    if (!Array.isArray(funSounds))
      return []

    const totalItemsPerPage = numColumns * numRowPerPage

    return funSounds.slice(curPageIdx * totalItemsPerPage, curPageIdx * totalItemsPerPage + totalItemsPerPage)
  }, [curPageIdx, funSounds])

  const style = useMemo(() => {
    return StyleSheet.create({
      masterView: { flex: 1, gap: Outline.GapHorizontal, },
      flatListContainer: { flex: 1, },
      pinContainer: { flexDirection: 'row' },
    })
  }, [theme, insets])

  const onPressedFavorite = useCallback(async (item: FunSound) => {
    let obj = likesObj

    if (!obj) {
      obj = await fetchLikesAsync()
    }

    const nowIsLiked = isFavorited(item)
    const id = idOfSound(item)

    track_PressFavorite(category, !nowIsLiked)

    if (nowIsLiked) { // to dislike
      // update local

      dispatch(removeFunSoundFavoritedID(idOfSound(item)))

      // update firebase

      if (!obj)
        return

      // @ts-ignore
      if (typeof obj[id]?.like === 'number' && obj[id].like > 0) {
        // @ts-ignore
        obj[id].like--
      }
      else
        return
    }
    else { // to like
      // update local

      dispatch(addFunSoundFavoritedID(idOfSound(item)))

      // update firebase

      if (!obj)
        return

      // @ts-ignore
      if (obj[id] && obj[id].like) {
        // @ts-ignore
        obj[id].like++
      }
      else {
        // @ts-ignore
        obj[id] = {}

        // @ts-ignore
        obj[id].like = 1
      }
    }

    // @ts-ignore
    const like = obj[id].like

    const path = FillPathPattern(LikePathByID, category, id)
    // console.log(path, ToCanPrint(obj));

    FirebaseDatabase_SetValueAsync(path, like)

    setLikesObj(obj)
  }, [likesObj, isFavorited, idOfSound])

  const renderPinnedSounds = useMemo(() => {
    if (!IsValuableArrayOrString(pinnedSounds) || !Array.isArray(funSounds))
      return undefined

    return (
      <View style={style.pinContainer}>
        {
          pinnedSounds.map(item => {
            const data = funSounds.find(i => i.name === item)

            if (data)
              return <FunSoundItem
                onPressedLike={onPressedFavorite}
                pinnedSounds={pinnedSounds}
                idOfSound={idOfSound}
                key={item}
                canHideLikes={true}
                likeCount={likeCount}
                isFavorited={isFavorited}
                data={data} />
            else
              return undefined
          })
        }
      </View>
    )
  }, [style, pinnedSounds, funSounds, onPressedFavorite])

  const renderItem = useCallback(({ item, index }: { item: FunSound, index: number }) => {
    return <FunSoundItem
      pinnedSounds={pinnedSounds}
      idOfSound={idOfSound}
      likeCount={likeCount}
      isFavorited={isFavorited}
      onPressedLike={onPressedFavorite}
      data={item} />
  }, [pinnedSounds, likeCount, isFavorited, onPressedFavorite])

  // save last visit category screen

  useFocusEffect(useCallback(() => SaveCurrentScreenForLoadNextTime(navigation), []))

  // init

  useEffect(() => {
    (async () => {
      // load likes

      const res = await fetchLikesAsync()
      setLikesObj(res)

      // load cur page idx

      setCurPageIdx(await GetNumberIntAsync(StorageKey_CurPageFunSoundIdx, 0))
    })()
  }, [])

  // on change theme

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => <HeaderRightButtons />
    });
  }, [])

  // render loading or error

  if (!Array.isArray(funSounds)) {
    let reasonToReload = NeedReloadReason.None // loading

    if (errorDownloadJson != undefined) {
      if (NetLord.IsAvailableLatestCheck())
        reasonToReload = NeedReloadReason.FailToGetContent
      else
        reasonToReload = NeedReloadReason.NoInternet
    }

    return (
      <LoadingOrError reasonToReload={reasonToReload} onPressedReload={reUpdateData} />
    )
  }

  // main render

  return (
    <View style={style.masterView}>
      {/* pin */}
      {
        renderPinnedSounds
      }

      {/* scroll view */}
      <View style={style.flatListContainer}>
        <FlatList
          showsVerticalScrollIndicator={false}
          data={itemsToRender}
          numColumns={numColumns}
          keyExtractor={(item) => item.name}
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

export default FunSoundScreen

/**
 * @returns {} (empty) or value if success
 * @returns undefined if fail
 */
const fetchLikesAsync = async () => {
  if (!NetLord.IsAvailableLatestCheck())
    return undefined

  const path = FillPathPattern(LikePathAll, category, 0)
  const res = await FirebaseDatabase_GetValueAsync(path)

  if (res.error === null) {  // fetch success
    if (res.value === null) { // have no data
      return {}
    }
    else
      return res.value
  }
  else // fetch error
    return undefined
}