import React from 'react'
import TheDiversity from '../diversity/TheDiversity'
import { useAppSelector } from '../../redux/Store'
import { Icon, LocalText } from '../../constants/AppConstants'

const ApprovedUploadsView = () => {
  const allItems = useAppSelector((state) => state.userData.uploadedItems)

  return (
    <TheDiversity
      allItems={allItems}
      emptyIcon={Icon.Upload}
      emptyText={LocalText.you_have_no_item}
    />
  )
}

export default ApprovedUploadsView