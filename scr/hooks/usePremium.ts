import { useMemo } from "react";
import { GetExpiredDateAndDaysLeft } from "../handle/AppUtils";
import { RootState, useAppSelector } from "../redux/Store";
import { SplitNumberInText } from "../handle/UtilsTS";

export const usePremium = () => {
    const subscribedData = useAppSelector((state: RootState) => state.userData.subscribedData);

    const [expiredDate, dayLeft] = useMemo(() => {
        if (subscribedData) {
            const monthNum = SplitNumberInText(subscribedData.id)
            return GetExpiredDateAndDaysLeft(subscribedData.tick, monthNum)
        }
        else
            return [new Date(), 0]
    }, [subscribedData])

    return {
        expiredDate,
        dayLeft,
        subscribedData,
        isPremium: dayLeft > 0
    } as const
}