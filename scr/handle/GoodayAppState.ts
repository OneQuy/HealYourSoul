import { AppStateStatus } from "react-native"
import { RegisterOnChangedState, UnregisterOnChangedState } from "./AppStateMan"
import { HandleAppConfigAsync } from "./AppConfigHandler"

const checkAndShowWaringAlertAsync = async () => {
    const success = await HandleAppConfigAsync()

}

const onAppActiveAsync = async () => {
    checkAndShowWaringAlertAsync()
}

const onStateChanged = (state: AppStateStatus) => {
    if (state === 'active') {
        onAppActiveAsync()
    }
}

export const RegisterGoodayAppState = (isRegister: boolean) => {
    if (isRegister)
        RegisterOnChangedState(onStateChanged)
    else
        UnregisterOnChangedState(onStateChanged)
}