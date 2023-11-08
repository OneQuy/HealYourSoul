import React from 'react'
import ThePage from '../template/ThePage';
import { Category } from '../../constants/AppConstants';

const CatDogScreen = () => {
  return <ThePage category={Category.CatDog} />;
}

export default CatDogScreen;