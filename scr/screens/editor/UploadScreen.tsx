import { View, Text, FlatList, ListRenderItemInfo, Image, SafeAreaView, Button, TextInput, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import { MediaType } from '../../constants/Types';
import { GetFileExtensionByFilepath } from '../../handle/UtilsTS';
import { DownloadAndSaveFileList, DownloadAndSaveFileListAsync } from '../../handle/AppUtils';
import { Category } from '../../constants/AppConstants';
import { FirebaseInit } from '../../firebase/Firebase';

const urll = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSv8YKWeHIPLLphkGKO_vAqq3xz3kYPTadI3Q&usqp=CAU';

const UploadScreen = () => {
    const [mediaURIs] = useState<string[]>([]);
    const [title, setTitle] = useState('');
    const [author, setAuthor] = useState('');
    const [creditURL, setCreditURL] = useState('');


    const onPressUpload =  async () => {
       const res = await DownloadAndSaveFileListAsync(Category.Draw);
       console.log(res.version);
    };

    const mediaURLs = [urll, urll, urll, urll, urll, urll, urll, urll];
   
    useEffect(() => {
        FirebaseInit();
    }, []);

    return (
        <SafeAreaView style={{ marginHorizontal: 10, gap: 20 }}>
            <FlatList
                data={mediaURLs}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ gap: 5 }}
                renderItem={(info: ListRenderItemInfo<string>) => {
                    return <Image style={{ width: 100, height: 100 }} source={{ uri: info.item }} />
                }}
            />
            <Button title='Add' />
            <TextInput
                placeholder='title'
                value={title}
                onChangeText={setTitle}
            />
            <TextInput
                placeholder='author'
                value={author}
                onChangeText={setAuthor}
            />
            <TextInput
                placeholder='credit link'
                value={creditURL}
                onChangeText={setCreditURL}
            />
            <View style={{ flexDirection: 'row', gap: 20 }}>
                <TouchableOpacity>
                    <Text>draw</Text>
                </TouchableOpacity>
                <TouchableOpacity>
                    <Text>real</Text>
                </TouchableOpacity>
                <TouchableOpacity>
                    <Text>quote</Text>
                </TouchableOpacity>
            </View>
            <Button title='Upload' onPress={onPressUpload} />
        </SafeAreaView>
    )
}

const UriArrToMediaTypeArr = (uris: string[]) => {
    return uris.map(i => GetMediaTypeByFileExtension(GetFileExtensionByFilepath(i)));
}


function GetMediaTypeByFileExtension(extension: string) : MediaType
{
    extension = extension.toLowerCase();

    if (extension == 'jpg' || 
        extension == 'jpeg' ||
        extension == 'gif' ||
        extension == 'png')
        return MediaType.Image;
    else if (extension == 'mp4')        
        return MediaType.Video;
    else
        throw new Error(extension + ' extention is not able to regconize');
}


export default UploadScreen