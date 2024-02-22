import { useCallback, useMemo } from "react";
import { DiversityItemType } from "../constants/Types";
import { useAppDispatch, useAppSelector } from "../redux/Store";
import { toggleSavedItem } from "../redux/UserDataSlice";

export const useSaved = (item?: DiversityItemType) => {
    const allSavedItems = useAppSelector((state) => state.userData.savedItems)
    const dispatch = useAppDispatch()
console.log(allSavedItems);

    const isSaved = useMemo(() => {
        if (item)
            return allSavedItems && allSavedItems.includes(item)
        else
            return false
    }, [allSavedItems, item])

    const onPressSaved = useCallback(async () => {
        if (item)
            dispatch(toggleSavedItem(item))
    }, [item])

    return [isSaved, onPressSaved] as const
}