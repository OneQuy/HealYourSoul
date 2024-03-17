// @ts-ignore
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import React, { useContext, useMemo } from 'react'
import { ThemeContext } from '../../constants/Colors';
import { BorderRadius, Category, FontSize, Outline, Size } from '../../constants/AppConstants';
import FavoriteButton from './FavoriteButton';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { CountType } from '../../handle/LikeCountHandler';
import CountButton from './CountButton';

export type BottomBarItem = {
    icon?: string,
    onPress?: () => void,
    text?: string,
    scaleIcon?: number,

    favoriteCallbackRef?: React.MutableRefObject<(() => void) | undefined>,

    countType?: CountType,
}

const BottomBar = ({
    items,
    category,
    id,
}: {
    items: BottomBarItem[],
    category: Category,

    /**
     * id for count view & favorite
     */
    id?: string | number,
}) => {
    const theme = useContext(ThemeContext);
    const safeArea = useSafeAreaInsets()

    const styleSheet = useMemo(() => {
        return StyleSheet.create({
            masterView: {
                marginBottom: safeArea.bottom > 0 ? safeArea.bottom : Outline.GapVertical,
                marginHorizontal: Outline.GapVertical,
                borderRadius: BorderRadius.BR,
                backgroundColor: theme.primary,
                flexDirection: 'row',
                justifyContent: 'space-between',
            },
            mainBtnTO: { paddingVertical: Outline.GapVertical_2, justifyContent: 'center', flex: 1, alignItems: 'center', gap: Outline.GapVertical },
            mainBtnTxt: { color: theme.counterPrimary, fontSize: FontSize.Small },
        })
    }, [theme, safeArea])

    const renderedItems = useMemo(() => {
        return items.map((item) => {
            if (item.favoriteCallbackRef)
                return <FavoriteButton
                    key={'favorite'}
                    callbackRef={item.favoriteCallbackRef}
                    category={category}
                    id={id}
                />
            else if (item.countType !== undefined && item.icon && item.text)
                return <CountButton
                    key={item.text}
                    title={item.text}
                    type={item.countType}
                    onPressFunc={item.onPress}
                    category={category}
                    id={id}
                    icon={item.icon}
                />
            else {
                return (
                    <TouchableOpacity key={item.text} onPress={item.onPress} style={styleSheet.mainBtnTO}>
                        <View style={{ transform: [{ scale: typeof item.scaleIcon === 'number' ? item.scaleIcon : 1 }] }}>
                            <MaterialCommunityIcons name={item.icon} color={theme.counterPrimary} size={Size.Icon} />
                        </View>
                        <Text style={styleSheet.mainBtnTxt}>{item.text}</Text>
                    </TouchableOpacity>
                )
            }
        })
    }, [items, theme, styleSheet, id, category])

    return (
        <View style={styleSheet.masterView}>
            {
                renderedItems
            }
        </View>
    )
}

export default BottomBar