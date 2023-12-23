import { View, Text, TouchableOpacity } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import { useAppDispatch } from '../../redux/Store'
import { ThemeContext } from '../../constants/Colors'
import { BorderRadius, FontSize, Outline, Size } from '../../constants/AppConstants'

// @ts-ignore
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

interface TheRandomShortTextProps {
    getTextAsync: () => Promise<string | undefined>
}

const TheRandomShortText = ({
    getTextAsync,
}: TheRandomShortTextProps) => {
    const [text, setText] = useState('Japan and Saudi are set to cooperate in order to strengthen their supplies of key mineral by developing mines and acquiring interests in resource-rich countries in Africa and elsewhere.')

    const dispatch = useAppDispatch();
    const theme = useContext(ThemeContext);
    const [handling, setHandling] = useState(false);

    useEffect(() => {
        const initAsync = async () => {
            // const text = await getTextAsync()

            // if (typ tex)
            // setText(text)
        }

        initAsync()
    }, [])

    return (
        <View style={{ padding: Outline.Horizontal, backgroundColor: theme.background, flex: 1, gap: Outline.GapVertical, }}>
            <View style={{ justifyContent: 'center', padding: Outline.GapHorizontal, flex: 1 }}>
                <Text style={{ color: theme.text, fontSize: FontSize.Big }}>{text}</Text>
            </View>
            <View>
                <TouchableOpacity style={{ alignItems: 'center', borderRadius: BorderRadius.BR8, padding: Outline.GapVertical_2, backgroundColor: theme.primary, width: '100%' }}>
                    <Text style={{ color: theme.text, fontSize: FontSize.Normal }}>Random</Text>
                </TouchableOpacity>
            </View>
            <View style={{ flexDirection: 'row', width: '100%', gap: Outline.GapHorizontal }}>
                <TouchableOpacity style={{ gap: Outline.GapHorizontal, justifyContent: 'center', flexDirection: 'row', flex: 1, alignItems: 'center', borderRadius: BorderRadius.BR8 }}>
                    <MaterialIcons name={'content-copy'} color={theme.counterPrimary} size={Size.IconSmaller} />
                    <Text style={{ color: theme.text, fontSize: FontSize.Normal }}>Copy</Text>
                </TouchableOpacity>                
               
                <TouchableOpacity style={{ gap: Outline.GapHorizontal, justifyContent: 'center', flexDirection: 'row', flex: 1, alignItems: 'center', borderRadius: BorderRadius.BR8, }}>
                    <MaterialIcons name={'content-copy'} color={theme.counterPrimary} size={Size.IconSmaller} />
                    <Text style={{ color: theme.text, fontSize: FontSize.Normal }}>Share</Text>
                </TouchableOpacity>
                
                <TouchableOpacity style={{ gap: Outline.GapHorizontal, justifyContent: 'center', flexDirection: 'row', flex: 2, alignItems: 'center', borderRadius: BorderRadius.BR8, }}>
                    <MaterialIcons name={'content-copy'} color={theme.counterPrimary} size={Size.IconSmaller} />
                    <Text style={{ color: theme.text, fontSize: FontSize.Normal }}>Share as Image</Text>
                </TouchableOpacity>
                
            </View>
        </View>
    )
}

export default TheRandomShortText