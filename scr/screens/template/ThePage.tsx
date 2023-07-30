// https://oblador.github.io/react-native-vector-icons/

// @ts-ignore
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

// @ts-ignore
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import { View, Text, Image, TouchableOpacity, ActivityIndicator, Alert, } from 'react-native'
import React, { useCallback, useContext, useEffect, useRef, useState } from 'react'
import { Category, FontSize, Opacity, Outline, Size } from '../../constants/AppConstants';
import { ThemeContext } from '../../constants/Colors';
import { heightPercentageToDP as hp, } from "react-native-responsive-screen";
import { FileList, PostMetadata } from '../../constants/Types';
import { CheckAndGetFileListAsync, CheckLocalFileAndGetURIAsync } from '../../handle/AppUtils';
import { useNavigation } from '@react-navigation/native';
import { RootState, useAppDispatch, useAppSelector } from '../../redux/Store';
import { PickRandomElement } from '../../handle/Utils';
import { addDrawSeenID } from '../../redux/UserDataSlice';

const noPic = require('../../../assets/images/no-pic.png');

type ThePageProps = {
    category: Category
}

type NeedLoadPostType = 'next' | 'previous' | 'none';

const ThePage = ({ category }: ThePageProps) => {
    // general state

    const theme = useContext(ThemeContext);
    const [isFavorited, setFavorited] = useState(false);
    const [handling, setHandling] = useState(false);
    const needLoadPost = useRef<NeedLoadPostType>('none');
    const fileList = useRef<FileList | null>(null);
    const navigation = useNavigation();
    const dispatch = useAppDispatch();

    const seenIDs = useAppSelector((state: RootState) => {
        if (category === Category.Draw)
            return state.userData.drawSeenIDs;
        else if (category === Category.Real)
            return state.userData.realSeenIDs;
        else if (category === Category.Quote)
            return state.userData.quoteSeenIDs;
        else
            throw new Error('not implement cat: ' + category);
    });

    // a post state

    const [mediaURI, setMediaURI] = useState('');
    const [post, setPost] = useState<PostMetadata | null>(null);
    const curMediaIdx = useRef<number>(0);

    // calculations

    const showNextMediaButton: boolean = post !== null && curMediaIdx.current < post.media.length - 1;
    const showPreviousMediaButton: boolean = post !== null && curMediaIdx.current > 0;

    // handles

    const loadNextMediaAsync = useCallback(async (isNext: boolean, forPost: PostMetadata, isSetNewPost?: boolean) => {
        setHandling(true);

        const nextIdx = isSetNewPost ? 0 : curMediaIdx.current + 1;
        const uriRes = await CheckLocalFileAndGetURIAsync(category, forPost, nextIdx);

        if (uriRes.uri) { // success
            curMediaIdx.current = nextIdx;
            setMediaURI(uriRes.uri);

            if (isSetNewPost) {
                setPost(forPost);
            }
        } else { // fail
            Alert.alert('Failed to load media', `Post ID: ${forPost.id}, media index: ${nextIdx}\n\nError: ${uriRes.error}`);
        }

        setHandling(false);
    }, []);

    const loadNextPostAsync = useCallback(async (isNext: boolean) => {
        let findPost = fileList.current?.posts.find(i => !seenIDs.includes(i.id));

        if (!findPost) {
            findPost = PickRandomElement(fileList.current?.posts);
            console.log('seen all posts, so picking randomly');
        }

        if (!findPost)
            throw 'cant find post';

        await loadNextMediaAsync(true, findPost, true);
    }, [seenIDs, loadNextMediaAsync]);

    // button handles

    const onPresssFavorite = useCallback(() => {
        setFavorited(val => !val);
    }, []);

    const onPressNextPost = useCallback(async (isNext: boolean) => {
        if (!post)
            return;

        dispatch(addDrawSeenID(post.id));
        needLoadPost.current = isNext ? 'next' : 'previous';
    }, [post]);

    // init once 

    useEffect(() => {
        async function Load() {
            setHandling(true);

            if (fileList.current === null) {
                fileList.current = await CheckAndGetFileListAsync(category);
            }

            needLoadPost.current = 'next';

            setHandling(false);
        }

        Load();
    }, []);

    // handling indicator

    useEffect(() => {
        navigation.setOptions({
            headerRight: !handling ? undefined : () => (
                <ActivityIndicator style={{ marginRight: Outline.Horizontal }} />
            )
        });
    }, [handling]);

    // load post

    useEffect(() => {
        if (needLoadPost.current === 'none')
            return;

        loadNextPostAsync(needLoadPost.current === 'next');
        needLoadPost.current = 'none';
    }, [needLoadPost.current]);

    // main render

    console.log('RENDER');

    return (
        // master view
        <View style={{ pointerEvents: handling ? 'none' : 'auto', backgroundColor: theme.background, flex: 1, gap: Outline.GapVertical, }}>
            {/* title */}
            <View style={{ paddingHorizontal: Outline.Horizontal, paddingTop: Outline.GapVertical }}>
                {
                    post === null || !post.title ? null :
                        <Text style={{ textAlignVertical: 'center', fontSize: FontSize.Normal, color: theme.text }}>{post.title}</Text>
                }
            </View>

            {/* media view */}
            {
                mediaURI === '' ?
                    // no media
                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }} >
                        <Image resizeMode='contain' style={{ width: '50%', height: '50%', }} source={noPic} />
                    </View> :
                    // have media
                    <View style={{ flex: 1 }} >
                        <Image resizeMode='contain' style={{ width: '100%', height: '100%', }} source={{ uri: mediaURI }} />
                        {/* menu overlay */}
                        <View style={{ width: '100%', height: '100%', position: 'absolute' }} >
                            {/* navigation buttons */}
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', flex: 1, alignItems: 'center' }} >
                                <TouchableOpacity disabled={!showPreviousMediaButton} style={{ paddingVertical: hp('2%'), opacity: showPreviousMediaButton ? Opacity.Primary : 0, borderTopRightRadius: Outline.BorderRadius, borderBottomRightRadius: Outline.BorderRadius, backgroundColor: theme.primary, justifyContent: 'center', alignItems: 'center' }} >
                                    <MaterialIcons name="keyboard-arrow-left" color={theme.counterPrimary} size={Size.IconSmaller} />
                                </TouchableOpacity>
                                <TouchableOpacity disabled={!showNextMediaButton} style={{ paddingVertical: hp('2%'), opacity: showNextMediaButton ? Opacity.Primary : 0, borderTopLeftRadius: Outline.BorderRadius, borderBottomLeftRadius: Outline.BorderRadius, backgroundColor: theme.primary, justifyContent: 'center', alignItems: 'center' }} >
                                    <MaterialIcons name="keyboard-arrow-right" color={theme.counterPrimary} size={Size.IconSmaller} />
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
            }

            {/* credit author */}
            {
                post === null || !post.author ? null :
                    <View style={{ paddingHorizontal: Outline.Horizontal, justifyContent: 'space-between', alignItems: 'center', flexDirection: 'row' }}>
                        <Text style={{ fontSize: FontSize.Normal, color: theme.text }}>{post.author}</Text>
                        <TouchableOpacity style={{ justifyContent: 'center', alignItems: 'center' }} >
                            <MaterialIcons name={'content-copy'} color={theme.counterPrimary} size={Size.IconSmaller} />
                        </TouchableOpacity>
                    </View>
            }

            {/* link credit */}
            {
                post === null || !post.url ? null :
                    <View style={{ paddingHorizontal: Outline.Horizontal, justifyContent: 'space-between', alignItems: 'center', flexDirection: 'row' }}>
                        <Text style={{ fontSize: FontSize.Small, color: theme.text }}>{post.url}</Text>
                        <TouchableOpacity style={{ justifyContent: 'center', alignItems: 'center' }} >
                            <MaterialIcons name={'content-copy'} color={theme.counterPrimary} size={Size.IconSmaller} />
                        </TouchableOpacity>
                    </View>
            }

            {/* navi part */}
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: Outline.Horizontal, gap: Outline.GapHorizontal }}>
                <TouchableOpacity onPress={onPresssFavorite} style={{ borderRadius: Outline.BorderRadius, paddingVertical: Outline.VerticalMini, flex: 1, backgroundColor: theme.primary, justifyContent: 'center', alignItems: 'center' }} >
                    <MaterialCommunityIcons name={isFavorited ? "cards-heart-outline" : 'cards-heart'} color={theme.counterPrimary} size={Size.IconSmaller} />
                </TouchableOpacity>
                <TouchableOpacity style={{ borderRadius: Outline.BorderRadius, paddingVertical: Outline.VerticalMini, flex: 1, backgroundColor: theme.primary, justifyContent: 'center', alignItems: 'center' }} >
                    <MaterialIcons name="keyboard-arrow-left" color={theme.counterPrimary} size={Size.Icon} />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => onPressNextPost(true)} style={{ borderRadius: Outline.BorderRadius, paddingVertical: Outline.VerticalMini, flex: 1, backgroundColor: theme.primary, justifyContent: 'center', alignItems: 'center' }} >
                    <MaterialIcons name="keyboard-arrow-right" color={theme.counterPrimary} size={Size.Icon} />
                </TouchableOpacity>
            </View>

            {/* menu part */}
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: Outline.Horizontal, gap: Outline.GapHorizontal, marginBottom: Outline.GapVertical, }}>
                <TouchableOpacity style={{ borderRadius: Outline.BorderRadius, paddingVertical: Outline.VerticalMini, flex: 1, backgroundColor: theme.primary, justifyContent: 'center', alignItems: 'center' }} >
                    <MaterialCommunityIcons name={'download'} color={theme.counterPrimary} size={Size.IconSmaller} />
                </TouchableOpacity>
                <TouchableOpacity style={{ borderRadius: Outline.BorderRadius, paddingVertical: Outline.VerticalMini, flex: 1, backgroundColor: theme.primary, justifyContent: 'center', alignItems: 'center' }} >
                    <MaterialIcons name="share" color={theme.counterPrimary} size={Size.IconSmaller} />
                </TouchableOpacity>
                <TouchableOpacity style={{ borderRadius: Outline.BorderRadius, paddingVertical: Outline.VerticalMini, flex: 1, backgroundColor: theme.primary, justifyContent: 'center', alignItems: 'center' }} >
                    <MaterialCommunityIcons name={'dots-horizontal'} color={theme.counterPrimary} size={Size.IconSmaller} />
                </TouchableOpacity>
            </View>
        </View>
    )
}

export default ThePage;