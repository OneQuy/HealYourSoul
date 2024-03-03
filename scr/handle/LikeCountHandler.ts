import { Category } from "../constants/AppConstants";
import { FirebaseDatabase_GetValueAsync, FirebaseDatabase_IncreaseNumberAsync } from "../firebase/FirebaseDatabase";
import { FillPathPattern, HandleError } from "./AppUtils";
import { NetLord } from "./NetLord";
import { IsNumType, ToCanPrint } from "./UtilsTS";

const LikePath = 'user_data/post/@cat/@id/like';

const SharePath = 'user_data/post/@cat/@id/share';

const DownloadPath = 'user_data/post/@cat/@id/download';

const ViewPath = 'user_data/post/@cat/@id/view';

export type CountType = 'like' | 'share' | 'download' | 'view'

const GetPathCountType = (type: CountType) => {
    if (type === 'download')
        return DownloadPath
    else if (type === 'share')
        return SharePath
    else if (type === 'view')
        return ViewPath
    else
        return LikePath
}
/**
 * 
 * @returns likes or NaN if error
 */
export const GetPostLikeCountAsync = async (type: CountType, cat: Category, postID: number | string, callback: (curValue: number) => void): Promise<number> => {
    if (!NetLord.IsAvailableLatestCheck()) {
        callback(Number.NaN)
        return Number.NaN
    }

    const path = FillPathPattern(GetPathCountType(type), cat, postID)
    const res = await FirebaseDatabase_GetValueAsync(path)

    if (res.error) {
        HandleError(
            'GetPostLikeCountAsync',
            'cat ' + cat + ', id ' + postID + ', ' + ToCanPrint(res.error),
            true)

        callback(Number.NaN)
        return Number.NaN
    }

    if (IsNumType(res.value) && res.value >= 0) {
        callback(res.value)
        return res.value
    }
    else {
        callback(0)
        return 0
    }
}

export const LikePostAsync = async (type: CountType, isLikeOrDislike: boolean, cat: Category, postID: number | string, callback: (curValue: number) => void): Promise<number> => {
    if (!NetLord.IsAvailableLatestCheck()) {
        callback(Number.NaN)
        return Number.NaN
    }

    const path = FillPathPattern(GetPathCountType(type), cat, postID)
    const res = await FirebaseDatabase_IncreaseNumberAsync(path, 0, isLikeOrDislike ? 1 : -1, undefined, 0)

    if (res.error) {
        HandleError(
            'LikePostAsync',
            'cat ' + cat + ', id ' + postID + ', ' + ToCanPrint(res.error),
            true)

        callback(Number.NaN)
        return Number.NaN
    }

    if (IsNumType(res.value) && res.value >= 0) {
        callback(res.value)
        return res.value
    }
    else {
        callback(0)
        return 0
    }
}