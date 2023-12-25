import React from 'react'
import ThePage from '../template/ThePage';
import { Category } from '../../constants/AppConstants';
import TheRandomImage from '../template/TheRandomImage';
import { GetRandomUnsplashPictureAsync } from '../../handle/services/Unsplash';

const PictureScreen = () => {
    return <TheRandomImage
        category={Category.Picture}
        getImageAsync={GetRandomUnsplashPictureAsync}
    />;
}

export default PictureScreen