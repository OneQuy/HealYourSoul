// https://oblador.github.io/react-native-vector-icons/

// @ts-ignore
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

// @ts-ignore
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import { View, Text, Image, TouchableOpacity, ActivityIndicator, } from 'react-native'
import React, { useCallback, useContext, useEffect, useRef, useState } from 'react'
import { Category, FontSize, Opacity, Outline, Size } from '../../constants/AppConstants';
import { ThemeContext } from '../../constants/Colors';
import { heightPercentageToDP as hp, } from "react-native-responsive-screen";
import { FileList, PostMetadata } from '../../constants/Types';
import { CheckAndGetFileListAsync } from '../../handle/AppUtils';
import { useNavigation } from '@react-navigation/native';
import { RootState, useAppSelector } from '../../redux/Store';
import { PickRandomElement } from '../../handle/Utils';

const noPic = require('../../../assets/images/no-pic.png');

type ThePageProps = {
    category: Category
}

const ThePage = ({ category }: ThePageProps) => {
    // general state
    
    const theme = useContext(ThemeContext);
    const [isFavorited, setFavorited] = useState(false);
    const [handling, setHandling] = useState(false);
    const fileList = useRef<FileList | null>(null);
    const navigation = useNavigation();
    
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

    // handles

    const loadNextPost = useCallback((isNext: boolean) => {
        let findPost = fileList.current?.posts.find(i => !seenIDs.includes(i.id));

        if (!findPost) {
            findPost = PickRandomElement(fileList.current?.posts);
            console.log('seen all posts, so picking randomly');
        }

        if (!findPost)
            throw '';

        setPost(findPost);

    }, [seenIDs]);
   
    const loadNextMedia = useCallback((isNext: boolean) => {
        
    }, [seenIDs]);

    // button handles

    const onPresssFavorite = useCallback(() => {
        setFavorited(val => !val);
    }, []);

    // init once 

    useEffect(() => {
        async function Load() {
            setHandling(true);

            if (fileList.current === null) {
                fileList.current = await CheckAndGetFileListAsync(category);
            }

            loadNextPost(true);

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

    // main render

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
                                <TouchableOpacity style={{ paddingVertical: hp('2%'), opacity: Opacity.Primary, borderTopRightRadius: Outline.BorderRadius, borderBottomRightRadius: Outline.BorderRadius, backgroundColor: theme.primary, justifyContent: 'center', alignItems: 'center' }} >
                                    <MaterialIcons name="keyboard-arrow-left" color={theme.counterPrimary} size={Size.IconSmaller} />
                                </TouchableOpacity>
                                <TouchableOpacity style={{ paddingVertical: hp('2%'), opacity: Opacity.Primary, borderTopLeftRadius: Outline.BorderRadius, borderBottomLeftRadius: Outline.BorderRadius, backgroundColor: theme.primary, justifyContent: 'center', alignItems: 'center' }} >
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
                <TouchableOpacity style={{ borderRadius: Outline.BorderRadius, paddingVertical: Outline.VerticalMini, flex: 1, backgroundColor: theme.primary, justifyContent: 'center', alignItems: 'center' }} >
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