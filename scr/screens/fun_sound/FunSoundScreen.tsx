import { View, Text, StyleSheet, FlatList } from 'react-native'
import React, { useCallback, useContext, useMemo, useRef, useState } from 'react'
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

// @ts-ignore
import Video, { VideoRef } from 'react-native-video';

const category = Category.FunSound

const fileURL = 'https://firebasestorage.googleapis.com/v0/b/warm-379a6.appspot.com/o/file_configs%2Ffun_sound.json?alt=media&token=61576a53-6c78-4428-a240-a1dd7a250825'

const numColumns = 5

const FunSoundScreen = () => {
  const navigation = useNavigation();
  const theme = useContext(ThemeContext);
  const videoRef = useRef<VideoRef>(null);
  const [nowMp3Uri, setNowMp3Uri] = useState('')
  // const [videoIsPlaying, setVideoIsPlaying] = useState<boolean>(false);

  const [funSounds, errorDownloadJson, _, reUpdateData] = useCheckAndDownloadRemoteFile<FunSound[]>(
    fileURL,
    TempDirName + '/fun_sound.json',
    true,
    GetRemoteFileConfigVersion('fun_sound'),
    'json',
    false,
    async () => AsyncStorage.getItem(StorageKey_LocalFileVersion(category)),
    async () => AsyncStorage.setItem(StorageKey_LocalFileVersion(category), GetRemoteFileConfigVersion('fun_sound').toString()))

  const onPressed_Sound = useCallback((item: FunSound) => {
    setNowMp3Uri(item.mp3)
    videoRef.current.seek(0);
  }, [])

  const style = useMemo(() => {
    return StyleSheet.create({
      masterView: { flex: 1 },
      flatListContainer: { flex: 1, }
    })
  }, [theme])

  // save last visit category screen

  useFocusEffect(useCallback(() => SaveCurrentScreenForLoadNextTime(navigation), []))

  if (!Array.isArray(funSounds))
    return undefined

  return (
    <View style={style.masterView}>
      <Video
        source={{ uri: nowMp3Uri }}
        ref={videoRef}
        audioOnly={true}
      />

      {/* scroll view */}
      <View style={style.flatListContainer}>
        <FlatList
          data={funSounds}
          numColumns={numColumns}
          keyExtractor={(item) => item.name}
          renderItem={({ item }) => {
            return <FunSoundItem onPressed={onPressed_Sound} data={item} />
          }}
        />
      </View>
    </View>
  )
}

export default FunSoundScreen