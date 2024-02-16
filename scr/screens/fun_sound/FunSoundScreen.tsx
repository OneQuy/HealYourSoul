import { View, StyleSheet, FlatList } from 'react-native'
import React, { useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { Category, NeedReloadReason, Outline, StorageKey_LocalFileVersion } from '../../constants/AppConstants'
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
import { FilterOnlyLetterAndNumberFromString, IsValuableArrayOrString, ToCanPrint } from '../../handle/UtilsTS'
import LoadingOrError from '../components/LoadingOrError'
import { NetLord } from '../../handle/NetLord'
import { FirebaseDatabase_GetValueAsync, FirebaseDatabase_SetValueAsync } from '../../firebase/FirebaseDatabase'
import { addFunSoundFavoritedID, removeFunSoundFavoritedID } from '../../redux/UserDataSlice'

const LikePathByID = 'user_data/post/@cat/@id/like';
const LikePathAll = 'user_data/post/@cat';

const category = Category.FunSound

const fileURL = 'https://firebasestorage.googleapis.com/v0/b/warm-379a6.appspot.com/o/file_configs%2Ffun_sound.json?alt=media&token=61576a53-6c78-4428-a240-a1dd7a250825'

const numColumns = 5

const FunSoundScreen = () => {
  const navigation = useNavigation();
  const theme = useContext(ThemeContext);
  const pinnedSounds = useAppSelector((state) => state.userData.pinnedFunSoundNames)
  const [likesObj, setLikesObj] = useState<{} | undefined>(undefined)
  const dispatch = useAppDispatch()
  const favoritedIDs = useAppSelector((state) => state.userData.funSoundFavoriteIDs)

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

  const isFavorited = useCallback((item: FunSound) => {
    const id = idOfSound(item)
    return favoritedIDs && favoritedIDs.includes(id);
  }, [favoritedIDs, idOfSound])

  const style = useMemo(() => {
    return StyleSheet.create({
      masterView: { flex: 1, gap: Outline.GapHorizontal, },
      flatListContainer: { flex: 1, },
      pinContainer: { flexDirection: 'row' },
    })
  }, [theme])

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
                key={item}
                likeCount={likeCount}
                isFavorited={isFavorited}
                data={data} />
            else
              return undefined
          })
        }
      </View>
    )
  }, [style, pinnedSounds, funSounds])

  const onPressedFavorite = useCallback(async (item: FunSound) => {
    let obj = likesObj

    if (!obj) {
      obj = await fetchLikesAsync()
    }

    const nowIsLiked = isFavorited(item)
    const id = idOfSound(item)

    if (nowIsLiked) { // to dislike
      // update local

      dispatch(removeFunSoundFavoritedID(idOfSound(item)))

      // update firebase

      if (!obj)
        return

      // @ts-ignore
      if (typeof obj[id]?.like === 'number') {
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
    console.log(path, ToCanPrint(obj));

    FirebaseDatabase_SetValueAsync(path, like)

    setLikesObj(obj)
  }, [likesObj, isFavorited, idOfSound])

  const renderItem = useCallback(({ item, index }: { item: FunSound, index: number }) => {
    return <FunSoundItem
      pinnedSounds={pinnedSounds}
      index={index}
      likeCount={likeCount}
      isFavorited={isFavorited}
      onPressedLike={onPressedFavorite}
      data={item} />
  }, [pinnedSounds, likeCount, isFavorited, onPressedFavorite])

  // save last visit category screen

  useFocusEffect(useCallback(() => SaveCurrentScreenForLoadNextTime(navigation), []))

  // load likes

  useEffect(() => {
    (async () => {
      const res = await fetchLikesAsync()
      setLikesObj(res)
    })()
  }, [])

  // render loading or error

  if (!Array.isArray(funSounds)) {
    let reasonToReload = NeedReloadReason.None // loading

    if (errorDownloadJson != undefined) {
      if (NetLord.IsAvailableLastestCheck())
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
          data={funSounds.slice(0, 10)}
          numColumns={numColumns}
          keyExtractor={(item) => item.name}
          renderItem={renderItem}
        />
      </View>
    </View>
  )
}

export default FunSoundScreen

/**
 * @returns {} (empty) or value if success
 * @returns undefined if fail
 */
const fetchLikesAsync = async () => {
  if (!NetLord.IsAvailableLastestCheck())
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