// https://oblador.github.io/react-native-vector-icons/

import { View, Text, Image, TouchableOpacity, } from 'react-native'
import React, { useCallback, useContext, useEffect, useRef, useState } from 'react'
import { Category, FontSize, Opacity, Outline, Size } from '../../constants/AppConstants';
import { ThemeContext } from '../../constants/Colors';
import { heightPercentageToDP as hp, } from "react-native-responsive-screen";

// @ts-ignore
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

// @ts-ignore
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { FileList } from '../../constants/Types';
import { DownloadAndSaveFileListAsync } from '../../handle/AppUtils';

const imgTmp = 'https://i.ytimg.com/vi/4cJF1EHfVQg/hqdefault.jpg?sqp=-oaymwEcCNACELwBSFXyq4qpAw4IARUAAIhCGAFwAcABBg==&rs=AOn4CLCabcnXx7w38merVU5KlBHXHb-paA';

type ThePageProps = {
    category: Category
}

const ThePage = ({ category }: ThePageProps) => {
    const theme = useContext(ThemeContext);
    const [isFavorited, setFavorited] = useState(false);
    const fileList = useRef<FileList | null>(null);

    // button handles

    const onPresssFavorite = useCallback(() => {
        setFavorited(val => !val);
    }, []);
    
    // init once 

    useEffect(() => {
        async function Load() {
            if (fileList.current === null) {
                fileList.current = await DownloadAndSaveFileListAsync(category);
            }
        }

        Load();
    }, []);

    // main render

    return (
        // master view
        <View style={{ backgroundColor: theme.background, flex: 1, gap: Outline.GapVertical, }}>
            {/* title */}
            <View style={{ paddingHorizontal: Outline.Horizontal, paddingTop: Outline.GapVertical }}>
                <Text style={{ textAlignVertical: 'center', fontSize: FontSize.Normal, color: theme.text }}>Have a nice day! Have a nice day!</Text>
            </View>

            {/* media view */}
            <View style={{ flex: 1 }} >
                <Image resizeMode='contain' style={{ width: '100%', height: '100%', }} source={{ uri: imgTmp }} />

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

            {/* credit author */}
            <View style={{ paddingHorizontal: Outline.Horizontal, justifyContent: 'space-between', alignItems: 'center', flexDirection: 'row' }}>
                <Text style={{ fontSize: FontSize.Normal, color: theme.text }}>Author</Text>
                <TouchableOpacity style={{ justifyContent: 'center', alignItems: 'center' }} >
                    <MaterialIcons name={'content-copy'} color={theme.counterPrimary} size={Size.IconSmaller} />
                </TouchableOpacity>
            </View>

            {/* link credit */}
            <View style={{ paddingHorizontal: Outline.Horizontal, justifyContent: 'space-between', alignItems: 'center', flexDirection: 'row' }}>
                <Text style={{ fontSize: FontSize.Small, color: theme.text }}>www.google.vn</Text>
                <TouchableOpacity style={{ justifyContent: 'center', alignItems: 'center' }} >
                    <MaterialIcons name={'content-copy'} color={theme.counterPrimary} size={Size.IconSmaller} />
                </TouchableOpacity>
            </View>

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