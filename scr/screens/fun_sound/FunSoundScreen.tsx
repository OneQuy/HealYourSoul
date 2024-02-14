import { View, Text, StyleSheet, FlatList } from 'react-native'
import React, { useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'
import { Category, LocalPath, StorageKey_LocalFileVersion } from '../../constants/AppConstants'
import useCheckAndDownloadRemoteFile from '../../hooks/useCheckAndDownloadRemoteFile'
import { FunSound } from '../../constants/Types'
import { TempDirName } from '../../handle/Utils'
import { GetRemoteFileConfigVersion } from '../../handle/AppConfigHandler'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useFocusEffect, useNavigation } from '@react-navigation/native'
import { ThemeContext } from '../../constants/Colors'
import { SaveCurrentScreenForLoadNextTime } from '../../handle/AppUtils'
import FunSoundItem from './FunSoundItem'

import { DownloadFileAsync, GetFLPFromRLP, IsExistedAsync } from '../../handle/FileUtils'

const category = Category.FunSound

const fileURL = 'https://firebasestorage.googleapis.com/v0/b/warm-379a6.appspot.com/o/file_configs%2Ffun_sound.json?alt=media&token=61576a53-6c78-4428-a240-a1dd7a250825'

const numColumns = 5

const FunSoundScreen = () => {
  const navigation = useNavigation();
  const theme = useContext(ThemeContext);
  const [nowMp3Uri, setNowMp3Uri] = useState('')
  // const [videoIsPlaying, setVideoIsPlaying] = useState(false);

  const [funSounds, errorDownloadJson, _, reUpdateData] = useCheckAndDownloadRemoteFile<FunSound[]>(
    fileURL,
    TempDirName + '/fun_sound.json',
    true,
    GetRemoteFileConfigVersion('fun_sound'),
    'json',
    false,
    async () => AsyncStorage.getItem(StorageKey_LocalFileVersion(category)),
    async () => AsyncStorage.setItem(StorageKey_LocalFileVersion(category), GetRemoteFileConfigVersion('fun_sound').toString()))

  const playSound = useCallback(async (flp: string) => {
    setNowMp3Uri(flp)
    // setVideoIsPlaying(true)


  }, [])
  const onVideoCompleted = useCallback(() => {
    setNowMp3Uri('');
  }, []);

  const style = useMemo(() => {
    return StyleSheet.create({
      masterView: { flex: 1 },
      flatListContainer: { flex: 1, }
    })
  }, [theme])


  // save last visit category screen

  useFocusEffect(useCallback(() => SaveCurrentScreenForLoadNextTime(navigation), []))


  // useEffect(() => {

  //   if (nowMp3Uri && videoRef.current)
  //     videoRef.current.seek(0);

  //   console.log('aaaa', nowMp3Uri);
  // }, [nowMp3Uri])

  if (!Array.isArray(funSounds))
    return undefined

  return (
    <View style={style.masterView}>
      {/* scroll view */}
      <View style={style.flatListContainer}>
        <FlatList
          data={funSounds}
          numColumns={numColumns}
          keyExtractor={(item) => item.name}
          renderItem={({ item }) => {
            return <FunSoundItem playSound={playSound} data={item} />
          }}
        />
      </View>
    </View>
  )
}

export default FunSoundScreen