// @ts-ignore
import Video from 'react-native-video';

// @ts-ignore
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

// @ts-ignore
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import { View, Text, Image, TouchableOpacity, ActivityIndicator, Alert, PanResponder, LayoutChangeEvent, GestureResponderEvent, Animated, } from 'react-native'
import React, { useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'
import { Category, FontSize, LocalText, NeedReloadReason, Opacity, Outline, ScreenName, Size } from '../../constants/AppConstants';
import { ThemeContext } from '../../constants/Colors';
import { heightPercentageToDP as hp, } from "react-native-responsive-screen";
import { FileList, MediaType, PostMetadata } from '../../constants/Types';
import { CheckAndGetFileListAsync, CheckLocalFileAndGetURIAsync, GetAllSavedLocalPostIDsListAsync, ToastTheme } from '../../handle/AppUtils';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { RootState, useAppDispatch, useAppSelector } from '../../redux/Store';
import { PickRandomElement, RoundNumber, SecondsToHourMinuteSecondString } from '../../handle/Utils';
import { addDrawFavoritedID, addDrawSeenID, addQuoteFavoritedID, addQuoteSeenID, addRealFavoritedID, addRealSeenID, removeDrawFavoritedID, removeQuoteFavoritedID, removeRealFavoritedID } from '../../redux/UserDataSlice';
import { setMutedVideo } from '../../redux/MiscSlice';
import { ColorNameToRgb, HexToRgb } from '../../handle/UtilsTS';
import Clipboard from '@react-native-clipboard/clipboard';
import { ToastOptions, toast } from '@baronha/ting';
import { useDrawerStatus } from '@react-navigation/drawer';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { DownloadProgressCallbackResult } from 'react-native-fs';
import { NetLord } from '../../handle/NetLord';
import { SaveToGalleryAsync } from '../../handle/CameraRoll';

const videoNumbSize = 10;
const videoTouchEffectRadius = 100;
const touchDistanceThreshold = 5;

type ThePageProps = {
    category: Category
}

type NeedLoadPostType = 'next' | 'previous' | 'none';

var globalCurrentCategory: Category;

const ThePage = ({ category }: ThePageProps) => {
    // general state

    const dispatch = useAppDispatch();
    const navigation = useNavigation();
    const drawerStatus = useDrawerStatus();
    const theme = useContext(ThemeContext);
    const [handling, setHandling] = useState(false);
    const [needLoadPost, setNeedLoadPost] = useState<NeedLoadPostType>('none');
    const [downloadPercent, setDownloadPercent] = useState(0);
    const [isInternetAvailable, setIsInternetAvailable] = useState(true);
    const reasonToReload = useRef<NeedReloadReason>(NeedReloadReason.None);
    const fileList = useRef<FileList | null>(null);
    const previousPostIDs = useRef<number[]>([]);
    const bigViewStartTouchNERef = useRef<GestureResponderEvent['nativeEvent'] | null>(null);
    const allSavedLocalPostIdsRef = useRef<number[] | undefined>(undefined);

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

    const favoritedIDs = useAppSelector((state: RootState) => {
        if (category === Category.Draw)
            return state.userData.drawFavoritedIDs;
        else if (category === Category.Real)
            return state.userData.realFavoritedIDs;
        else if (category === Category.Quote)
            return state.userData.quoteFavoritedIDs;
        else
            throw new Error('NI cat: ' + category);
    });

    // video states

    const videoBarWholeWidth = useRef<number>(0);
    const videoWholeDuration = useRef<number>(0);
    const videoBarPreventTouchEvent = useRef(false);
    const videoNumbLastPosX = useRef(0);
    const videoBarTouchMoving = useRef<boolean>(false);
    const videoRef = useRef<Video>();
    const videoIsCompleted = useRef<boolean>(false);
    const videoTimeRemainLastUpdate = useRef(0);
    const [videoIsPlaying, setVideoIsPlaying] = useState<boolean>(false);
    const [videoTimeRemain, setVideoTimeRemain] = useState<number>(0);
    const videoNumbPosX = useRef(new Animated.Value(0)).current;
    const videoBarPercent = useRef(new Animated.Value(0)).current;
    const videoTouchEffectTranslate = useRef(new Animated.ValueXY()).current;
    const videoTouchEffectZoomAV = useRef(new Animated.Value(0)).current;

    const videoBarPanResponder = useRef(
        PanResponder.create({
            onMoveShouldSetPanResponder: () => {
                videoBarTouchMoving.current = true
                setVideoIsPlaying(false)
                return true
            },

            onPanResponderMove: (_, state) => {
                if (videoBarWholeWidth.current <= 0)
                    return;

                if (Math.abs(state.dx) < touchDistanceThreshold) {
                    return;
                }

                const newPost = Math.max(0 - videoNumbSize / 2, Math.min(videoNumbLastPosX.current + state.dx, videoBarWholeWidth.current - videoNumbSize / 2));
                videoNumbPosX.setValue(newPost);

                const percent = (newPost + videoNumbSize / 2) / videoBarWholeWidth.current;
                videoBarPercent.setValue(percent);

                // set time remain

                if (Date.now() - videoTimeRemainLastUpdate.current > 200) {
                    videoTimeRemainLastUpdate.current = Date.now();

                    const seekToSeconds = percent * videoWholeDuration.current;
                    setVideoTimeRemain(videoWholeDuration.current - seekToSeconds)
                }
            },

            onPanResponderRelease: (_, state) => {
                if (Math.abs(state.dx) >= touchDistanceThreshold) {
                    videoBarPreventTouchEvent.current = true;
                }

                videoBarTouchMoving.current = false;

                const newPost = Math.max(0 - videoNumbSize / 2, Math.min(videoNumbLastPosX.current + state.dx, videoBarWholeWidth.current - videoNumbSize / 2));
                const percent = (newPost + videoNumbSize / 2) / videoBarWholeWidth.current;
                const seekToSeconds = percent * videoWholeDuration.current;

                videoRef.current.seek(seekToSeconds);

                setVideoTimeRemain(videoWholeDuration.current - seekToSeconds)

                setVideoIsPlaying(true)
            },
        }),
    ).current;

    const isMutedVideo = useAppSelector((state: RootState) => state.misc.mutedVideo);

    // a post state

    const mediaURI = useRef('');
    const post = useRef<PostMetadata | null>(null);
    const curMediaIdx = useRef<number>(0);

    // calculations

    const showNextMediaButton: boolean = post.current !== null && curMediaIdx.current < post.current.media.length - 1;
    const showPreviousMediaButton: boolean = post.current !== null && curMediaIdx.current > 0;
    const currentMediaIsImage: boolean = post.current !== null && post.current.media[curMediaIdx.current] === MediaType.Image;
    const activePreviousPostButton: boolean = previousPostIDs.current.length > 0 && post.current !== null && previousPostIDs.current.indexOf(post.current.id) !== 0;
    const hasCredit: boolean = post.current !== null && post.current.author != null && post.current.author.length > 0;

    const isFavorited: boolean = useMemo(() => {
        return post.current !== null && favoritedIDs.includes(post.current.id);
    }, [favoritedIDs, post.current?.id])

    // handles

    const loadNextMediaAsync = useCallback(async (isNext: boolean, forPost: PostMetadata, isNextPost: NeedLoadPostType) => {
        setHandling(true);
        setDownloadPercent(0);

        reasonToReload.current = NeedReloadReason.None;

        if (isNextPost === 'none') { // just change media
            if (mediaURI.current !== '')
                curMediaIdx.current = curMediaIdx.current + (isNext ? 1 : -1);
        }
        else // change post too
            curMediaIdx.current = 0;

        mediaURI.current = ''

        const uriOrReasonToReload = await CheckLocalFileAndGetURIAsync(category, forPost, curMediaIdx.current, (process: DownloadProgressCallbackResult) => {
            const percent = RoundNumber(process.bytesWritten / process.contentLength * 100, 0);
            setDownloadPercent(percent);
        });

        if (typeof uriOrReasonToReload === 'string') { // success
            // update media

            mediaURI.current = uriOrReasonToReload;

            // add to previous list

            if (isNextPost === 'next') {
                const idx = previousPostIDs.current.indexOf(forPost.id);

                if (idx >= 0) {
                    previousPostIDs.current.splice(idx, 1);
                }

                previousPostIDs.current.push(forPost.id);
            }

            // update offline ids

            addPostIDToOfflineList(forPost.id);            
        } else { // fail
            reasonToReload.current = uriOrReasonToReload;
        }

        setHandling(false);
    }, []);

    const loadNextPostAsync = useCallback(async (isNext: boolean) => {
        reasonToReload.current = NeedReloadReason.None;
        let foundPost: PostMetadata | undefined;

        if (isNext) {
            if (!NetLord.IsAvailableLastestCheck()) { // offline mode
                const offlineID = getPostIDForOffline();

                if (typeof offlineID === 'number')
                    foundPost = fileList.current?.posts.find(post => post.id === offlineID);
            }

            if (!foundPost) // default
                foundPost = fileList.current?.posts.find(i => !seenIDs.includes(i.id));

            if (!foundPost) {
                foundPost = PickRandomElement(fileList.current?.posts, post.current);
            }
        }
        else { // previous
            const curPostIdx = post.current ? previousPostIDs.current.indexOf(post.current.id) : -1;

            if (curPostIdx > 0) {
                foundPost = fileList.current?.posts.find(p => p.id === previousPostIDs.current[curPostIdx - 1]);
            }
            else
                foundPost = fileList.current?.posts.find(p => p.id === previousPostIDs.current[previousPostIDs.current.length - 1]);
        }

        if (!foundPost)
            throw new Error('cant find post');

        post.current = foundPost;
        await loadNextMediaAsync(true, foundPost, isNext ? 'next' : 'previous');
    }, [seenIDs, loadNextMediaAsync]);

    const onVideoLoaded = useCallback((e: any) => {
        videoWholeDuration.current = e.duration;
        setVideoTimeRemain(RoundNumber(e.duration));

        videoNumbPosX.setValue(-videoNumbSize / 2);
        videoBarPercent.setValue(0);
    }, []);

    const onTouchEndVideoBar = useCallback((e: GestureResponderEvent) => {
        if (videoBarWholeWidth.current === 0)
            return;

        if (videoBarPreventTouchEvent.current) {
            videoBarPreventTouchEvent.current = false;
            return;
        }

        videoNumbPosX.setValue(e.nativeEvent.locationX - videoNumbSize / 2);

        const percent = (e.nativeEvent.locationX) / videoBarWholeWidth.current;
        videoBarPercent.setValue(percent);

        videoRef.current.seek(percent * videoWholeDuration.current);

        const seekToSeconds = percent * videoWholeDuration.current;
        setVideoTimeRemain(videoWholeDuration.current - seekToSeconds)

        if (!videoIsPlaying)
            setVideoIsPlaying(true);
    }, [videoIsPlaying]);

    const onLayoutVideoBar = useCallback((e: LayoutChangeEvent) => {
        videoBarWholeWidth.current = e.nativeEvent.layout.width;
    }, []);

    const onVideoCompleted = useCallback(() => {
        setVideoIsPlaying(false);
        videoIsCompleted.current = true;
        setVideoTimeRemain(0);
    }, []);

    const onVideoProcess = useCallback((e: any) => {
        videoIsCompleted.current = false;

        if (!e.currentTime || !e.seekableDuration)
            return;

        if (Date.now() - videoTimeRemainLastUpdate.current > 1000) {
            videoTimeRemainLastUpdate.current = Date.now();
            setVideoTimeRemain(RoundNumber(e.seekableDuration - e.currentTime));
        }

        if (videoBarTouchMoving.current)
            return;

        const percent = e.currentTime / e.seekableDuration;
        videoBarPercent.setValue(percent);

        const newPost = videoBarWholeWidth.current * percent - videoNumbSize / 2;
        videoNumbPosX.setValue(newPost);
        videoNumbLastPosX.current = newPost;
    }, []);

    const checkAndPauseVideo = useCallback(() => {
        if (!videoRef.current)
            return;

        if (videoIsPlaying)
            setVideoIsPlaying(false);
    }, [videoIsPlaying]);

    const checkAndLoadFileListAndStartShowPostAsync = useCallback(async () => {
        if (fileList.current !== null)
            return false;

        setHandling(true);

        const res = await CheckAndGetFileListAsync(category);

        if (typeof res === 'object') {
            fileList.current = res;
            setNeedLoadPost('next');
        }
        else {
            reasonToReload.current = res;
        }

        setHandling(false);
        return true;
    }, []);

    const addPostIDToOfflineList = useCallback((id: number) => {
        if (!allSavedLocalPostIdsRef.current) {
            allSavedLocalPostIdsRef.current = [id];
            return;
        }

        if (allSavedLocalPostIdsRef.current.indexOf(id) >= 0)
            return;

        allSavedLocalPostIdsRef.current.push(id);
    }, []);

    const getPostIDForOffline = useCallback(() => {
        const savedLocalIDs = allSavedLocalPostIdsRef.current;

        if (!savedLocalIDs)
            return undefined

        const fidx = savedLocalIDs.findIndex(id => previousPostIDs.current.indexOf(id) === -1)

        if (fidx < 0)
            return PickRandomElement(savedLocalIDs, post.current?.id)
        else
            return savedLocalIDs[fidx];
    }, []);

    const onInternetChanged = useCallback(() => {
        const isNet = NetLord.IsAvailableLastestCheck();
        setIsInternetAvailable(isNet);

        if (isNet && reasonToReload.current !== NeedReloadReason.None && globalCurrentCategory === category)
            onPressReloadAsync();
    }, []);

    // button handles

    const onPressDownloadMedia = useCallback(async () => {
        if (!mediaURI.current)
            return;

        const res = await SaveToGalleryAsync(mediaURI.current)

        const options: ToastOptions = {
            title: LocalText.saved,
            backgroundColor: theme.primary
        };

        toast(options);
    }, []);

    const onPressFavorite = useCallback(() => {
        if (!post.current)
            return;

        if (category === Category.Quote) {
            if (isFavorited)
                dispatch(removeQuoteFavoritedID(post.current.id));
            else
                dispatch(addQuoteFavoritedID(post.current.id));
        } else if (category === Category.Draw) {
            if (isFavorited)
                dispatch(removeDrawFavoritedID(post.current.id));
            else
                dispatch(addDrawFavoritedID(post.current.id));
        }
        else if (category === Category.Real) {
            if (isFavorited)
                dispatch(removeRealFavoritedID(post.current.id));
            else
                dispatch(addRealFavoritedID(post.current.id));
        }
        else
            throw new Error('NI cat: ' + category);
    }, [isFavorited]);

    const onPressNextMedia = useCallback(async (isNext: boolean) => {
        if (!post.current)
            return;

        loadNextMediaAsync(isNext, post.current, 'none');
    }, [loadNextMediaAsync]);

    const onPressCopy = useCallback((s: string | undefined) => {
        if (!s)
            return;

        Clipboard.setString(s);

        const options: ToastOptions = {
            title: LocalText.copied,
            backgroundColor: theme.primary
        };

        toast(options);
    }, [theme]);

    const onPressToggleMutedVideo = useCallback(() => {
        dispatch(setMutedVideo());
    }, []);

    const onPressPlayVideo = useCallback(() => {
        setVideoIsPlaying(val => !val);

        if (videoIsCompleted.current)
            videoRef.current.seek(0);
    }, []);

    const onTouchStartBigView = useCallback((e: GestureResponderEvent) => {
        bigViewStartTouchNERef.current = e.nativeEvent;
    }, []);

    const onTouchEndBigView = useCallback((e: GestureResponderEvent) => {
        if (!bigViewStartTouchNERef.current)
            return;

        // general handle for image / video

        const distanceFromStart = Math.sqrt(
            Math.pow(e.nativeEvent.locationX - bigViewStartTouchNERef.current.locationX, 2) +
            Math.pow(e.nativeEvent.locationY - bigViewStartTouchNERef.current.locationY, 2));

        const isTouch = distanceFromStart < touchDistanceThreshold;

        const howLongFromStart = e.nativeEvent.timestamp - bigViewStartTouchNERef.current.timestamp;
        const isLongPressed = howLongFromStart > 500 && isTouch;

        if (isLongPressed) {
            const options: ToastOptions = {
                title: 'Long Pressed',
                ...ToastTheme(theme, 'done')
            };

            toast(options);
        }

        // handle touch effect for video

        if (!videoRef.current || !isTouch || isLongPressed)
            return;

        videoTouchEffectTranslate.setValue({ x: e.nativeEvent.locationX - videoTouchEffectRadius / 2, y: e.nativeEvent.locationY - videoTouchEffectRadius / 2 })

        videoTouchEffectZoomAV.setValue(0);

        Animated.timing(
            videoTouchEffectZoomAV,
            {
                toValue: 1,
                duration: 300,
                useNativeDriver: false,
            }).start(() => videoTouchEffectZoomAV.setValue(0));

        onPressPlayVideo();
    }, [onPressPlayVideo]);

    const onPressReloadAsync = useCallback(async () => {
        reasonToReload.current = NeedReloadReason.None;

        // check file list

        let needHandle = await checkAndLoadFileListAndStartShowPostAsync();

        if (needHandle)
            return;

        // check post

        needHandle = post.current === null;

        if (needHandle) {
            await loadNextPostAsync(true);
            return;
        }

        // check media

        needHandle = mediaURI.current === '';

        if (needHandle && post.current !== null) {
            await loadNextMediaAsync(true, post.current, 'none');
            return;
        }
    }, [checkAndLoadFileListAndStartShowPostAsync]);

    const onPressNextPost = useCallback(async (isNext: boolean) => {
        if (!fileList.current) {
            onPressReloadAsync();
            return;
        }

        if (post.current) {
            if (category === Category.Real)
                dispatch(addRealSeenID(post.current.id));
            else if (category === Category.Draw)
                dispatch(addDrawSeenID(post.current.id));
            else if (category === Category.Quote)
                dispatch(addQuoteSeenID(post.current.id));
            else
                throw new Error('NI cat: ' + category);
        }

        setNeedLoadPost(isNext ? 'next' : 'previous');
    }, [onPressReloadAsync]);

    const onPlayVideoError = useCallback((error: any) => {
        Alert.alert('Video load failed', 'Can not play this video (Post ID: ' + post.current?.id + '). Let\'s go to the next post!\n\nError: ' + JSON.stringify(error),
            [
                {
                    text: 'OK',
                    onPress: () => onPressNextPost(true)
                }
            ]);
    }, [onPressNextPost]);

    // init once 

    useEffect(() => {
        const Init = async () => {
            // set net state

            if (isInternetAvailable !== NetLord.IsAvailableLastestCheck())
                setIsInternetAvailable(NetLord.IsAvailableLastestCheck());

            // subscribe net

            NetLord.Subscribe(onInternetChanged);

            // get list offline post

            allSavedLocalPostIdsRef.current = await GetAllSavedLocalPostIDsListAsync(category);
            
            // start load

            onPressReloadAsync();
        }

        Init();

        return () => {
            NetLord.Unsubscribe(onInternetChanged)
        }
    }, []);

    // on focus

    useFocusEffect(
        useCallback(() => {
            // save last visit category screen

            const state = navigation.getState();
            const screenName = state.routeNames[state.index];
            AsyncStorage.setItem('categoryScreenToOpenFirst', screenName);

            // update global cat

            globalCurrentCategory = category;

            // refresh if last time is offline

            if (NetLord.IsAvailableLastestCheck() &&
                reasonToReload.current !== NeedReloadReason.None &&
                globalCurrentCategory === category)
                onPressReloadAsync();
        }, [])
    );

    // pause video when open drawer

    useEffect(() => {
        if (drawerStatus === 'open') {
            checkAndPauseVideo();
        }
    }, [drawerStatus]);

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
        if (needLoadPost === 'none')
            return;

        const isNext = needLoadPost === 'next';
        setNeedLoadPost('none');
        loadNextPostAsync(isNext);
    }, [needLoadPost]);

    // main render

    // console.log(Category[category], 'post', post.current?.id, 'RENDER: ' + Date.now());

    return (
        // master view
        <View style={{ pointerEvents: handling ? 'none' : 'auto', backgroundColor: theme.background, flex: 1, gap: Outline.GapVertical, }}>
            {/* net state */}
            {
                isInternetAvailable ? null :
                    <View style={{ paddingHorizontal: Outline.Horizontal, paddingVertical: 2, backgroundColor: ColorNameToRgb('silver', 0.5), alignItems: 'center' }}>
                        <Text style={{ textAlignVertical: 'center', fontSize: FontSize.Small, color: theme.text }}>{LocalText.you_are_offline}</Text>
                    </View>
            }

            {/* title */}
            <View style={{ paddingHorizontal: Outline.Horizontal, paddingTop: 0 }}>
                {
                    post.current === null || !post.current.title ? null :
                        <Text style={{ textAlignVertical: 'center', fontSize: FontSize.Normal, color: theme.text }}>{post.current.title}</Text>
                }
            </View>

            {/* media view */}
            {
                mediaURI.current === '' ?
                    // no media
                    <View style={{ flex: 1 }} >
                        {
                            reasonToReload.current !== NeedReloadReason.None ?
                                // need to reload
                                <TouchableOpacity onPress={onPressReloadAsync} style={{ flex: 1, justifyContent: 'center', alignItems: 'center', gap: Outline.GapVertical }} >
                                    <MaterialCommunityIcons name={'file-image-outline'} color={theme.primary} size={100} />
                                    <Text style={{ fontSize: FontSize.Big, color: theme.counterPrimary }}>{reasonToReload.current === NeedReloadReason.NoInternet ? LocalText.no_internet : LocalText.cant_get_content}</Text>
                                    <Text style={{ fontSize: FontSize.Normal, color: theme.counterPrimary }}>{LocalText.tap_to_retry}</Text>
                                </TouchableOpacity> :
                                // loading
                                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', gap: Outline.GapVertical }} >
                                    <MaterialCommunityIcons name={'file-image-outline'} color={theme.primary} size={100} />
                                    <Text style={{ fontSize: FontSize.Big }}>{downloadPercent}%</Text>
                                </View>
                        }
                    </View> :
                    // have media
                    <View style={{ flex: 1 }} >
                        {
                            currentMediaIsImage ?
                                <Image resizeMode='contain' style={{ width: '100%', height: '100%', }} source={{ uri: mediaURI.current }} />
                                :
                                <View style={{ width: '100%', height: '100%' }} >
                                    <Video
                                        ref={videoRef}
                                        onError={(e: any) => onPlayVideoError(e)}
                                        onLoad={onVideoLoaded}
                                        source={{ uri: mediaURI.current }} resizeMode={'contain'}
                                        muted={isMutedVideo}
                                        paused={!videoIsPlaying}
                                        onProgress={onVideoProcess}
                                        onEnd={onVideoCompleted}
                                        style={{ flex: 1 }} />
                                </View>
                        }
                        {/* menu overlay */}
                        <View style={{ width: '100%', height: '100%', position: 'absolute' }} >
                            {/* media navigation buttons */}
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', flex: 1, alignItems: 'center' }} >
                                {/* previous media btn */}
                                <TouchableOpacity onPress={() => onPressNextMedia(false)} disabled={!showPreviousMediaButton} style={{ paddingVertical: hp('2%'), opacity: showPreviousMediaButton ? Opacity.Primary : 0, borderTopRightRadius: Outline.BorderRadius, borderBottomRightRadius: Outline.BorderRadius, backgroundColor: theme.primary, justifyContent: 'center', alignItems: 'center' }} >
                                    <MaterialIcons name="keyboard-arrow-left" color={theme.counterPrimary} size={Size.IconSmaller} />
                                </TouchableOpacity>
                                {/* center view & big play video btn */}
                                <View
                                    onTouchStart={onTouchStartBigView}
                                    onTouchEnd={onTouchEndBigView}
                                    style={{ flex: 1, height: '100%' }} >
                                    {/* effect touch */}
                                    <Animated.View pointerEvents={'none'} style={[videoTouchEffectTranslate.getLayout(), { transform: [{ scale: videoTouchEffectZoomAV },], width: videoTouchEffectRadius, height: videoTouchEffectRadius, borderRadius: videoTouchEffectRadius / 2, backgroundColor: ColorNameToRgb('white', 0.3) }]} />
                                </View>
                                {/* next media btn */}
                                <TouchableOpacity onPress={() => onPressNextMedia(true)} disabled={!showNextMediaButton} style={{ paddingVertical: hp('2%'), opacity: showNextMediaButton ? Opacity.Primary : 0, borderTopLeftRadius: Outline.BorderRadius, borderBottomLeftRadius: Outline.BorderRadius, backgroundColor: theme.primary, justifyContent: 'center', alignItems: 'center' }} >
                                    <MaterialIcons name="keyboard-arrow-right" color={theme.counterPrimary} size={Size.IconSmaller} />
                                </TouchableOpacity>
                            </View>
                            {/* video controller */}
                            {
                                currentMediaIsImage ? undefined :
                                    <View style={{ backgroundColor: HexToRgb(theme.primary, 0.5), marginHorizontal: Outline.Horizontal, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }} >
                                        {/* play btn */}
                                        <TouchableOpacity style={{}} onPress={onPressPlayVideo} >
                                            <MaterialIcons name={videoIsPlaying ? 'pause' : 'play-arrow'} color={theme.counterPrimary} size={Size.Icon} />
                                        </TouchableOpacity>
                                        {/* video bar */}
                                        <View
                                            onLayout={onLayoutVideoBar}
                                            onTouchEnd={onTouchEndVideoBar}
                                            {...videoBarPanResponder.panHandlers}
                                            style={{ flex: 1, flexDirection: 'row', height: '100%', marginHorizontal: Outline.Horizontal, }}>
                                            {/* bar bg */}
                                            <View style={{ width: '100%', height: 3, borderRadius: 5, alignSelf: 'center', backgroundColor: 'white', flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }}>
                                                {/* bar */}
                                                <Animated.View style={[{
                                                    width: videoBarPercent.interpolate({
                                                        inputRange: [0, 1],
                                                        outputRange: ['0%', '100%'],
                                                    }),
                                                    height: '100%',
                                                    borderRadius: 5,
                                                    backgroundColor: 'black'
                                                }]} />
                                                {/* numb */}
                                                <Animated.View pointerEvents={'none'} style={[{ transform: [{ translateX: videoNumbPosX }] }, { position: 'absolute', width: videoNumbSize, height: videoNumbSize, borderRadius: videoNumbSize / 2, backgroundColor: 'black' }]} />
                                            </View>
                                        </View>
                                        {/* time remain text */}
                                        <Text style={{ marginRight: Outline.Horizontal, color: theme.counterPrimary }}>{SecondsToHourMinuteSecondString(videoTimeRemain, true)}</Text>
                                        {/* muted btn */}
                                        <TouchableOpacity style={{}} onPress={onPressToggleMutedVideo} >
                                            <MaterialIcons name={isMutedVideo ? 'volume-off' : 'volume-up'} color={theme.counterPrimary} size={Size.Icon} />
                                        </TouchableOpacity>
                                    </View>
                            }
                        </View>
                    </View>
            }

            {/* credit author */}
            <View style={{ paddingHorizontal: Outline.Horizontal, justifyContent: 'space-between', alignItems: 'center', flexDirection: 'row' }}>
                <Text numberOfLines={1} style={{ flex: 1, fontSize: FontSize.Normal, color: theme.text }}>{hasCredit ? post.current?.author : LocalText.credit_to_author}</Text>
                {
                    !hasCredit ? undefined :
                        <TouchableOpacity onPress={() => onPressCopy(post.current?.author)} style={{ marginLeft: Outline.Horizontal, justifyContent: 'center', alignItems: 'center' }} >
                            <MaterialIcons name={'content-copy'} color={theme.counterPrimary} size={Size.IconSmaller} />
                        </TouchableOpacity>
                }
            </View>

            {/* link credit */}
            {
                post.current === null || !post.current.url ? null :
                    <View style={{ paddingHorizontal: Outline.Horizontal, justifyContent: 'space-between', alignItems: 'center', flexDirection: 'row' }}>
                        <Text numberOfLines={1} style={{ flex: 1, fontSize: FontSize.Small, color: theme.text }}>{post.current.url}</Text>
                        <TouchableOpacity onPress={() => onPressCopy(post.current?.url)} style={{ marginLeft: Outline.Horizontal, justifyContent: 'center', alignItems: 'center' }} >
                            <MaterialIcons name={'content-copy'} color={theme.counterPrimary} size={Size.IconSmaller} />
                        </TouchableOpacity>
                    </View>
            }

            {/* navi part */}
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: Outline.Horizontal, gap: Outline.GapHorizontal }}>
                <TouchableOpacity onPress={onPressFavorite} style={{ borderRadius: Outline.BorderRadius, paddingVertical: Outline.VerticalMini, flex: 1, backgroundColor: theme.primary, justifyContent: 'center', alignItems: 'center' }} >
                    <MaterialCommunityIcons name={!isFavorited ? "cards-heart-outline" : 'cards-heart'} color={theme.counterPrimary} size={Size.IconSmaller} />
                </TouchableOpacity>
                {
                    !activePreviousPostButton ? undefined :
                        <TouchableOpacity onPress={() => onPressNextPost(false)} style={{ borderRadius: Outline.BorderRadius, paddingVertical: Outline.VerticalMini, flex: 1, backgroundColor: theme.primary, justifyContent: 'center', alignItems: 'center' }} >
                            <MaterialIcons name="keyboard-arrow-left" color={theme.counterPrimary} size={Size.Icon} />
                        </TouchableOpacity>
                }
                <TouchableOpacity onPress={() => onPressNextPost(true)} style={{ borderRadius: Outline.BorderRadius, paddingVertical: Outline.VerticalMini, flex: 1, backgroundColor: theme.primary, justifyContent: 'center', alignItems: 'center' }} >
                    <MaterialIcons name="keyboard-arrow-right" color={theme.counterPrimary} size={Size.Icon} />
                </TouchableOpacity>
            </View>

            {/* menu part */}
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: Outline.Horizontal, gap: Outline.GapHorizontal, marginBottom: Outline.GapVertical, }}>
                {/* download media */}
                <TouchableOpacity onPress={onPressDownloadMedia} style={{ borderRadius: Outline.BorderRadius, paddingVertical: Outline.VerticalMini, flex: 1, backgroundColor: theme.primary, justifyContent: 'center', alignItems: 'center' }} >
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