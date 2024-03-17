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

export const AwesomeNatureScreen = () => {
  return <ThePage category={Category.AwesomeNature} />;
}

export const AwesomeScreen = () => {
  return <ThePage category={Category.Awesome} />;
}

export const SunsetScreen = () => {
  return <ThePage category={Category.Sunset} />;
}

export const InfoScreen = () => {
  return <ThePage category={Category.Info} />;
}

export const TuneScreen = () => {
  return <ThePage category={Category.Tune} />;
}

export const TypoScreen = () => {
  return <ThePage category={Category.Typo} />;
}

export const VocabularyScreen = () => {
  return <ThePage category={Category.Vocabulary} />;
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