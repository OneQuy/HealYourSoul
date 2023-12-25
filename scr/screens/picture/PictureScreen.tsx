import React from 'react'
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