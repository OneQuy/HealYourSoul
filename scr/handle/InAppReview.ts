// This package is only available on android version >= 21 and iOS >= 10.3
// Doc: https://github.com/MinaSamir11/react-native-in-app-review?tab=readme-ov-file#readme

import InAppReview from 'react-native-in-app-review';

/**
 * @returns true if launched native UI success
 * @returns false if not launched native UI unsuccessfully
 * @returns error if service is not available or other error
 */
export const CheckAndShowInAppReviewAsync = async (): Promise<any> => {
    try {
        if (!InAppReview.isAvailable())
            return new Error('InAppReview not available on this device.')

        const hasFlowFinishedSuccessfully = await InAppReview.RequestInAppReview()

        return hasFlowFinishedSuccessfully
    }
    catch (error) {
        return error
    }
}