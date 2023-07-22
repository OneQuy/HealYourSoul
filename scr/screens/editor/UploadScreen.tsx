import { View, Text, FlatList, ListRenderItemInfo, Image, SafeAreaView, Button, TextInput, TouchableOpacity, Alert } from 'react-native'
import React, { useEffect, useState } from 'react'
import { MediaType, PostMetadata } from '../../constants/Types';
import { GetFileExtensionByFilepath } from '../../handle/UtilsTS';
import { DownloadAndSaveFileListAsync, GetDBPath, GetListFileRLP } from '../../handle/AppUtils';
import { Category, FirebaseDBPath } from '../../constants/AppConstants';
import { FirebaseInit } from '../../firebase/Firebase';
import { FirebaseStorage_UploadTextAsFileAsync } from '../../firebase/FirebaseStorage';
import { IsErrorObject_Empty } from '../../handle/Utils';
import { FirebaseDatabase_IncreaseNumberAsync, FirebaseDatabase_SetValueAsync } from '../../firebase/FirebaseDatabase';

const urll = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSv8YKWeHIPLLphkGKO_vAqq3xz3kYPTadI3Q&usqp=CAU';

const UploadScreen = () => {
    const [mediaURIs] = useState<string[]>([]);
    const [title, setTitle] = useState('');
    const [author, setAuthor] = useState('');
    const [creditURL, setCreditURL] = useState('');
    const [category, setCategory] = useState(Category.Draw);

    const onPressUpload = async () => {
        const fileList = await DownloadAndSaveFileListAsync(category);
        const latestID = fileList.posts[0].id;

        const newPost: PostMetadata = {
            id: latestID + 1,
            author,
            url: creditURL,
            title,
            media: UriArrToMediaTypeArr(mediaURIs)
        }

        fileList.posts.unshift(newPost);
        fileList.version++;

        var res = await FirebaseStorage_UploadTextAsFileAsync(GetListFileRLP(category, false), JSON.stringify(fileList, null, 1));

        const versionRes = await FirebaseDatabase_SetValueAsync(GetDBPath(category), fileList.version);

        if (IsErrorObject_Empty(res) && !versionRes)
            Alert.alert('Success', 'FileList & DB version: ' + fileList.version + '\nPost ID: ' + (latestID + 1)); 
        else
            Alert.alert('Fail', JSON.stringify(res) + '\n\n' + versionRes);
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
                <TouchableOpacity onPress={() => setCategory(Category.Draw)}>
                    <Text style={[category === Category.Draw ? {backgroundColor: 'pink'} : undefined]}>draw</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setCategory(Category.Real)}>
                    <Text style={[category === Category.Real ? {backgroundColor: 'pink'} : undefined]}>real</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setCategory(Category.Quote)}>
                    <Text style={[category === Category.Quote ? {backgroundColor: 'pink'} : undefined]}>quote</Text>
                </TouchableOpacity>
            </View>
            <Button title='Upload' onPress={onPressUpload} />
        </SafeAreaView>
    )
}

const UriArrToMediaTypeArr = (uris: string[]) => {
    return uris.map(i => GetMediaTypeByFileExtension(GetFileExtensionByFilepath(i)));
}

function GetMediaTypeByFileExtension(extension: string): MediaType {
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