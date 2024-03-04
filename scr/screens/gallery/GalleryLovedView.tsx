import React, { useMemo } from 'react'
import TheDiversity from '../diversity/TheDiversity'
import { Category, Icon, LimitPagesGalleryLovedPosts, LocalText, ScreenName } from '../../constants/AppConstants'
import { DiversityItemType } from '../../constants/Types'
import useFavoritedIDs from '../../hooks/useFavoritedIDs'

const GalleryLovedView = ({ cat }: { cat: Category }) => {
    const ids = useFavoritedIDs(cat)

    const allItems = useMemo(() => {
        if (!ids)
            return undefined

        const arr: DiversityItemType[] = []

        for (let i = 0; i < ids.length; i++) {
            arr.unshift({
                cat,
                id: ids[i]
            })
        }

        return arr
    }, [ids, cat])

    return (
        <TheDiversity
            allItems={allItems}
            emptyIcon={Icon.HeartFull}
            emptyText={LocalText.diversity_empty_gallery_loved}
            showLimitSaved={false}
            screenBackWhenPressX={ScreenName.Gallery}
            showFilterButton={false}
            limitPages={LimitPagesGalleryLovedPosts}
        />
    )
}

export default GalleryLovedView