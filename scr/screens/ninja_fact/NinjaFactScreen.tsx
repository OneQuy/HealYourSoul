import React from 'react'
import TheRandomShortText from '../template/TheRandomShortText';
import { GetNinjaFactAsync } from '../../handle/services/NinjaFact';
import { Category } from '../../constants/AppConstants';

const NinjaFactScreen = () => {
  return <TheRandomShortText
    category={Category.NinjaFact}
    getTextAsync={GetNinjaFactAsync}
  />;
}

export default NinjaFactScreen