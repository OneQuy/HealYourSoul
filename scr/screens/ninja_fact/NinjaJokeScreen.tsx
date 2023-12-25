import React from 'react'
import TheRandomShortText from '../template/TheRandomShortText';
import { Category } from '../../constants/AppConstants';
import { GetNinjaJokeAsync } from '../../handle/services/NinjaJoke';

const NinjaJokeScreen = () => {
  return <TheRandomShortText
    category={Category.NinjaJoke}
    getTextAsync={GetNinjaJokeAsync}
  />;
}

export default NinjaJokeScreen