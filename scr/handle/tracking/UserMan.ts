import { FirebaseDatabaseTimeOutMs } from "../../constants/AppConstants"
import { CreateDefaultUser, Inbox, User } from "../../constants/Types"
import { FirebaseDatabase_GetValueAsyncWithTimeOut, FirebaseDatabase_SetValueAsync } from "../../firebase/FirebaseDatabase"
import { HandleError } from "../AppUtils"
import { UserID } from "../UserID"
import { CreateError } from "../UtilsTS"

const GetUserFirebasePath = () => {
    return `user_data/users/${UserID()}`
}

const GetUserFirebasePath_AllInboxes = (userId?: string) => {
    return `user_data/users/${userId ?? UserID()}/inboxes`
}

/**
 * 
 * @returns if success: User or null (no data)
 * @returns if fail: error (not null value)
 */
export const GetUserAsync = async (): Promise<User | Error> => {
    const userRes = await FirebaseDatabase_GetValueAsyncWithTimeOut(GetUserFirebasePath(), FirebaseDatabaseTimeOutMs)

    if (userRes.error !== null) {
        return CreateError(userRes.error)
    }

    if (!userRes.value) // empty data user
        return CreateDefaultUser()
    else
        return userRes.value as User
}

/**
 * 
 * @returns null if new inboxes is empty
 * @returns Error if error!
 */
export const GetUserInboxesAsync = async (userId?: string): Promise<Inbox[] | null | Error> => {
    const userRes = await FirebaseDatabase_GetValueAsyncWithTimeOut(GetUserFirebasePath_AllInboxes(userId), FirebaseDatabaseTimeOutMs)

    if (userRes.error !== null) { // system error
        HandleError('GetUserInboxesAsync', userRes.error, true)
        return CreateError(userRes.error)
    }

    if (!userRes.value) // empty data user
        return null
    
    return Object.values(userRes.value)
}

export const ClearUserInboxesInFirebaseAsync = async (userId?: string): Promise<void> => {
    await FirebaseDatabase_SetValueAsync(GetUserFirebasePath_AllInboxes(userId), undefined)
}