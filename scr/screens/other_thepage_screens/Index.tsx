import React from 'react'
import ThePage from '../template/ThePage';
import { Category } from '../../constants/AppConstants';
import TheRandomShortText from '../template/TheRandomShortText';
import { GetQuoteTextAsync } from '../../handle/services/QuoteTextApi';

export const CuteScreen = () => {
  return <ThePage category={Category.Cute} />;
}

export const ArtScreen = () => {
  return <ThePage category={Category.Art} />;
}

export const SarcasmScreen = () => {
  return <ThePage category={Category.Sarcasm} />;
}

export const QuoteTextScreen = () => {
  return <TheRandomShortText
    category={Category.Quotetext}
    getTextAsync={GetQuoteTextAsync}
  />;
}