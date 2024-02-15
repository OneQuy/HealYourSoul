import { View, StyleSheet, FlatList } from 'react-native'
import React, { useCallback, useContext, useMemo } from 'react'
import { Category, NeedReloadReason, Outline, StorageKey_LocalFileVersion } from '../../constants/AppConstants'
import useCheckAndDownloadRemoteFile from '../../hooks/useCheckAndDownloadRemoteFile'
import { FunSound } from '../../constants/Types'
import { TempDirName } from '../../handle/Utils'
import { GetRemoteFileConfigVersion } from '../../handle/AppConfigHandler'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useFocusEffect, useNavigation } from '@react-navigation/native'
import { ThemeContext } from '../../constants/Colors'
import { OpenStore, SaveCurrentScreenForLoadNextTime } from '../../handle/AppUtils'
import FunSoundItem from './FunSoundItem'
import { useAppSelector } from '../../redux/Store'
import { IsValuableArrayOrString } from '../../handle/UtilsTS'
import LoadingOrError from '../components/LoadingOrError'
import { NetLord } from '../../handle/NetLord'


const category = Category.FunSound

const fileURL = 'https://firebasestorage.googleapis.com/v0/b/warm-379a6.appspot.com/o/file_configs%2Ffun_sound.json?alt=media&token=61576a53-6c78-4428-a240-a1dd7a250825'

const numColumns = 5

const FunSoundScreen = () => {
  const navigation = useNavigation();
  const theme = useContext(ThemeContext);
  const pinnedSounds = useAppSelector((state) => state.userData.pinnedFunSoundNames)

  const [funSounds, errorDownloadJson, _, reUpdateData] = useCheckAndDownloadRemoteFile<FunSound[]>(
    fileURL,
    TempDirName + '/fun_sound.json',
    true,
    GetRemoteFileConfigVersion('fun_sound'),
    'json',
    false,
    async () => AsyncStorage.getItem(StorageKey_LocalFileVersion(category)),
    async () => AsyncStorage.setItem(StorageKey_LocalFileVersion(category), GetRemoteFileConfigVersion('fun_sound').toString()))

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
              return <FunSoundItem pinnedSounds={pinnedSounds} key={item} data={data} />
            else
              return undefined
          })
        }
      </View>
    )
  }, [style, pinnedSounds, funSounds])

  const renderItem = useCallback(({ item, index }: { item: FunSound, index: number }) => {
    return <FunSoundItem
      pinnedSounds={pinnedSounds}
      index={index}
      data={item} />
  }, [pinnedSounds])

  // save last visit category screen

  useFocusEffect(useCallback(() => SaveCurrentScreenForLoadNextTime(navigation), []))

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
          data={funSounds}
          numColumns={numColumns}
          keyExtractor={(item) => item.name}
          renderItem={renderItem}
        />
      </View>
    </View>
  )
}

export default FunSoundScreen