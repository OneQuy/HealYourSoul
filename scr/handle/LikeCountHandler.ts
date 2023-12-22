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
const GetPostLikeCountAsync = async (cat: Category, postID: number): Promise<number> => {
    if (!NetLord.IsAvailableLastestCheck())
        return Number.NaN

    const path = FillPathPattern(LikePath, cat, postID)
    const res = await FirebaseDatabase_GetValueAsync(path)

    if (res.error) {
        OnLogError('get like error, cat ' + cat + ', id ' + postID + ', ' + ToCanPrint(res.error))
        return Number.NaN
    }

    if (IsNumType(res.value) && res.value >= 0) {
        return res.value
    }
    else {
        return 0
    }
}

const LikePostAsync = async (isLikeOrDislike: boolean, cat: Category, postID: number): Promise<number> => {
    if (!NetLord.IsAvailableLastestCheck()) {
        return Number.NaN
    }

    const path = FillPathPattern(LikePath, cat, postID)
    const res = await FirebaseDatabase_IncreaseNumberAsync(path, 0, isLikeOrDislike ? 1 : -1)

    if (res.error) {
        OnLogError('set like error, cat ' + cat + ', id ' + postID + ', ' + ToCanPrint(res.error))
        return Number.NaN
    }

    if (IsNumType(res.value) && res.value >= 0) {
        return res.value
    }
    else {
        return 0
    }
}