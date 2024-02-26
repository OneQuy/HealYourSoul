import React from 'react'
import TheDiversity from '../diversity/TheDiversity'
import { useAppSelector } from '../../redux/Store'

const SavedScreen = () => {
  const allSavedItems = useAppSelector((state) => state.userData.savedItems)
  // console.log(allSavedItems);

  return (
    <TheDiversity allItems={allSavedItems} />
  )
}

export default SavedScreen