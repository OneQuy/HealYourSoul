import { View, StyleSheet, FlatList, ListRenderItem } from 'react-native'
import React, { useCallback, useContext, useMemo } from 'react'
import { Category, StorageKey_LocalFileVersion } from '../../constants/AppConstants'
import useCheckAndDownloadRemoteFile from '../../hooks/useCheckAndDownloadRemoteFile'
import { FunSound } from '../../constants/Types'
import { TempDirName } from '../../handle/Utils'
import { GetRemoteFileConfigVersion } from '../../handle/AppConfigHandler'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useFocusEffect, useNavigation } from '@react-navigation/native'
import { ThemeContext } from '../../constants/Colors'
import { SaveCurrentScreenForLoadNextTime } from '../../handle/AppUtils'
import FunSoundItem from './FunSoundItem'


const category = Category.FunSound

const fileURL = 'https://firebasestorage.googleapis.com/v0/b/warm-379a6.appspot.com/o/file_configs%2Ffun_sound.json?alt=media&token=61576a53-6c78-4428-a240-a1dd7a250825'

const numColumns = 5

const FunSoundScreen = () => {
  const navigation = useNavigation();
  const theme = useContext(ThemeContext);

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
      masterView: { flex: 1 },
      flatListContainer: { flex: 1, },
      pinContainer: { flexDirection: 'row', backgroundColor: theme.primary },
    })
  }, [theme])

  const renderItem = useCallback(({ item, index }: { item: FunSound, index: number }) => {
    return <FunSoundItem index={index} data={item} />
  }, [])

  // save last visit category screen

  useFocusEffect(useCallback(() => SaveCurrentScreenForLoadNextTime(navigation), []))

  if (!Array.isArray(funSounds))
    return undefined

  return (
    <View style={style.masterView}>
      {/* pin */}
      <View style={style.pinContainer}>
        {
          funSounds.slice(0, numColumns).map(item => {
            return <FunSoundItem key={item.name} data={item} />
          })
        }
      </View>
      
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