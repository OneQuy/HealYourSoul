import { FirebaseDatabaseTimeOutMs } from "../../constants/AppConstants"
import { User } from "../../constants/Types"
import { FirebaseDatabase_GetValueAsync, FirebaseDatabase_GetValueAsyncWithTimeOut } from "../../firebase/FirebaseDatabase"
import { UserID } from "../UserID"

const GetUserFirebasePath = () => {
    return `user_data/users/${UserID()}`
}

/**
 * 
 * @returns if success: User or null (no data)
 * @returns if fail: error (not null value)
 */
export const GetUserAsync = async (): Promise<User | null | any> => {
    const userRes = await FirebaseDatabase_GetValueAsyncWithTimeOut(GetUserFirebasePath(), FirebaseDatabaseTimeOutMs)

    if (userRes.error !== null) {
        return userRes.error
    }

    return userRes.value
}