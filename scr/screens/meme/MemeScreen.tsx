import React from 'react'
import ThePage from '../template/ThePage';
import { Category } from '../../constants/AppConstants';

const MemeScreen = () => {
  return <ThePage category={Category.Meme} />;
}

export default MemeScreen;