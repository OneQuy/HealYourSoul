import React from 'react'
import ThePage from '../template/ThePage';
import { Category } from '../../constants/AppConstants';

const ComicScreen = () => {
  return <ThePage category={Category.Draw} />;
}

export default ComicScreen;