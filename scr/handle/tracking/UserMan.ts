import { FirebaseDatabaseTimeOutMs } from "../../constants/AppConstants"
import { CreateDefaultUser, User } from "../../constants/Types"
import { FirebaseDatabase_GetValueAsyncWithTimeOut } from "../../firebase/FirebaseDatabase"
import { UserID } from "../UserID"
import { CreateError } from "../UtilsTS"

const GetUserFirebasePath = () => {
    return `user_data/users/${UserID()}`
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