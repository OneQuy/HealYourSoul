import { useEffect, useMemo } from 'react'
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { DrawerParamList } from '../navigation/Navigator';
import { UpdateHeaderXButton } from '../screens/components/HeaderXButton';
import { PostMetadata, RandomImage } from '../constants/Types';
import { GetThumbUriFromWikipediaObject } from '../screens/wiki/WikipediaScreen';

const useDiversityItem = (
    reload: () => void,
    post?: PostMetadata | null,
    randomImage?: RandomImage,
    text?: string,
    wikipediaObject?: object,
) => {
    const route = useRoute<RouteProp<DrawerParamList>>()
    const navigation = useNavigation()

    const diversityItem = useMemo(() => {
        return route.params?.item
    }, [route.params?.item])

    useEffect(() => {
        // update x button

        UpdateHeaderXButton(navigation, diversityItem !== undefined)

        if (!diversityItem)
            return

        // already open this screen before => load this new selected diversity post

        let needReload = false

        if (post && diversityItem.id !== post.id) {
            needReload = true
        }
        else if (randomImage && diversityItem.randomImage && diversityItem.randomImage.uri !== randomImage.uri) {
            needReload = true
        }
        else if (text && diversityItem.text && diversityItem.text !== text) {
            needReload = true
        }
        else if (
            wikipediaObject && 
            diversityItem.wikipediaObject && 
            GetThumbUriFromWikipediaObject(diversityItem.wikipediaObject) !== GetThumbUriFromWikipediaObject(wikipediaObject)) {
            needReload = true
        }

        if (needReload)
            reload()
    }, [diversityItem])

    return diversityItem
}

export default useDiversityItem