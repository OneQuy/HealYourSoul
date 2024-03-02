import React from 'react'
import TheDiversity from '../diversity/TheDiversity'
import { useAppSelector } from '../../redux/Store'
import { Icon, LocalText } from '../../constants/AppConstants'

const SavedScreen = () => {
  const allSavedItems = useAppSelector((state) => state.userData.savedItems)

  return (
    <TheDiversity
      allItems={allSavedItems}
      emptyIcon={Icon.BookmarkOutline}
      emptyText={LocalText.diversity_empty_saved}
      showLimitSaved={true}
    />
  )
}

export default SavedScreen