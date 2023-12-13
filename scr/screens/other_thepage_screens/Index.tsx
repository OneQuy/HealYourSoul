import React from 'react'
import ThePage from '../template/ThePage';
import { Category } from '../../constants/AppConstants';

export const CuteScreen = () => {
  return <ThePage category={Category.Cute} />;
}

export const ArtScreen = () => {
  return <ThePage category={Category.Cute} />;
}

export const SarcasmScreen = () => {
  return <ThePage category={Category.Sarcasm} />;
}