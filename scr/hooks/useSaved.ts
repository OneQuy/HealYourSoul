import { useCallback, useMemo } from "react";
import { DiversityItemType } from "../constants/Types";
import { useAppDispatch, useAppSelector } from "../redux/Store";
import { toggleSavedItem } from "../redux/UserDataSlice";
import { OnPressedXInDiversityMode } from "../screens/components/HeaderXButton";
import { useNavigation } from "@react-navigation/native";

export const useSaved = (itemData?: DiversityItemType, diversityMode?: boolean) => {
    const allSavedItems = useAppSelector((state) => state.userData.savedItems)
    const dispatch = useAppDispatch()
    const navi = useNavigation()

    const isSaved = useMemo(() => {
        if (itemData && allSavedItems)
            return allSavedItems.findIndex(i => JSON.stringify(i) === JSON.stringify(itemData)) >= 0
        else
            return false
    }, [allSavedItems, itemData])

    const onPressSaved = useCallback(async () => {
        if (itemData)
            dispatch(toggleSavedItem(itemData))

        if (isSaved && diversityMode)
            OnPressedXInDiversityMode(navi)
    }, [itemData, isSaved, diversityMode])

    return [isSaved, onPressSaved] as const
}