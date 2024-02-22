import { useCallback, useMemo } from "react";
import { DiversityItemType } from "../constants/Types";
import { useAppDispatch, useAppSelector } from "../redux/Store";
import { toggleSavedItem } from "../redux/UserDataSlice";

export const useSaved = (item?: DiversityItemType) => {
    const allSavedItems = useAppSelector((state) => state.userData.savedItems)
    const dispatch = useAppDispatch()

    const isSaved = useMemo(() => {
        if (item && allSavedItems)
            return allSavedItems.findIndex(i => JSON.stringify(i) === JSON.stringify(item)) >= 0
        else
            return false
    }, [allSavedItems, item])

    const onPressSaved = useCallback(async () => {
        if (item)
            dispatch(toggleSavedItem(item))
    }, [item])

    return [isSaved, onPressSaved] as const
}