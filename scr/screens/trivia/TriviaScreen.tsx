import React from 'react'
import { Category } from '../../constants/AppConstants';
import TheTrivia from '../template/TheTrivia';
import { GetTriviaAsync } from '../../handle/services/TriviaApi';

const TheTriviaScreen = () => {
  return <TheTrivia
    category={Category.Trivia}
    getTriviaAsync={GetTriviaAsync}
  />;
}

export default TheTriviaScreen