import React from 'react'
import ThePage from '../template/ThePage';
import { Category } from '../../constants/AppConstants';

const NSFWScreen = () => {
  return <ThePage category={Category.NSFW} />;
}

export default NSFWScreen;