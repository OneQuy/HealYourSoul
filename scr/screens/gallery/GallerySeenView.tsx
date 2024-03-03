import React, { useMemo } from 'react'
import TheDiversity from '../diversity/TheDiversity'
import { Category, Icon, LocalText, ScreenName } from '../../constants/AppConstants'
import { DiversityItemType } from '../../constants/Types'
import useSeenIDs from '../../hooks/useSeenIDs'

const GallerySeenView = ({ cat }: { cat: Category }) => {
    const ids = useSeenIDs(cat)

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
            emptyIcon={Icon.Eye}
            emptyText={LocalText.you_have_no_item}
            showLimitSaved={false}
            screenBackWhenPressX={ScreenName.Gallery}
            showFilterButton={false}
        />
    )
}

export default GallerySeenView