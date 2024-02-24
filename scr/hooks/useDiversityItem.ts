import { useEffect, useMemo } from 'react'
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { DrawerParamList } from '../navigation/Navigator';
import { UpdateHeaderXButton } from '../screens/components/HeaderXButton';
import { PostMetadata, RandomImage } from '../constants/Types';

const useDiversityItem = (
    reload: () => void,
    post?: PostMetadata,
    randomImage?: RandomImage,
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

        if (diversityItem.randomImage) {
            if (randomImage && diversityItem.randomImage.uri !== randomImage.uri) {
                reload()
            }
        }
    }, [diversityItem])

    return diversityItem
}

export default useDiversityItem