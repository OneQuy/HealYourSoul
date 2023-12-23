import React from 'react'
import TheRandomShortText from '../template/TheRandomShortText';
import { GetNinjaFactAsync } from '../../handle/services/NinjaFact';

const NinjaFactScreen = () => {
  return <TheRandomShortText
    getTextAsync={GetNinjaFactAsync}
  />;
}

export default NinjaFactScreen