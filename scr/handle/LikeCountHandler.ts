import { Category } from "../constants/AppConstants";
import { FirebaseDatabase_GetValueAsync, FirebaseDatabase_IncreaseNumberAsync } from "../firebase/FirebaseDatabase";
import { FillPathPattern, OnLogError } from "./AppUtils";
import { NetLord } from "./NetLord";
import { IsNumType, ToCanPrint } from "./UtilsTS";

const LikePath = 'user_data/post/@cat/@id/like';

/**
 * 
 * @returns likes or NaN if error
 */
export const GetPostLikeCountAsync = async (cat: Category, postID: number, callback: (curValue: number) => void): Promise<number> => {
    if (!NetLord.IsAvailableLastestCheck())
    {
        callback(Number.NaN)
        return Number.NaN
    }

    const path = FillPathPattern(LikePath, cat, postID)
    const res = await FirebaseDatabase_GetValueAsync(path)

    if (res.error) {
        OnLogError('get like error, cat ' + cat + ', id ' + postID + ', ' + ToCanPrint(res.error))
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

export const LikePostAsync = async (isLikeOrDislike: boolean, cat: Category, postID: number, callback: (curValue: number) => void): Promise<number> => {
    if (!NetLord.IsAvailableLastestCheck()) {
        callback(Number.NaN)
        return Number.NaN
    }

    const path = FillPathPattern(LikePath, cat, postID)
    const res = await FirebaseDatabase_IncreaseNumberAsync(path, 0, isLikeOrDislike ? 1 : -1)

    if (res.error) {
        OnLogError('set like error, cat ' + cat + ', id ' + postID + ', ' + ToCanPrint(res.error))
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