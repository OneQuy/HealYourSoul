import React from 'react'
import ThePage from '../template/ThePage';
import { Category } from '../../constants/AppConstants';

const QuoteScreen = () => {
  return <ThePage category={Category.Quote} />;
}

export default QuoteScreen;