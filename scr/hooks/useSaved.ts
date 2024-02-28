import { useCallback, useMemo } from "react";
import { DiversityItemType } from "../constants/Types";
import { useAppDispatch, useAppSelector } from "../redux/Store";
import { toggleSavedItem } from "../redux/UserDataSlice";
import { GoToPremiumScreen, OnPressedXInDiversityMode } from "../screens/components/HeaderXButton";
import { useNavigation } from "@react-navigation/native";
import { LimitSaved, LocalText } from "../constants/AppConstants";
import { Alert } from "react-native";
import { usePremium } from "./usePremium";
import { GoodayToast } from "../handle/AppUtils";

export const useSaved = (itemData?: DiversityItemType, diversityMode?: boolean) => {
    const allSavedItems = useAppSelector((state) => state.userData.savedItems)
    const dispatch = useAppDispatch()
    const navigation = useNavigation()
    const { isPremium } = usePremium()

    const isSaved = useMemo(() => {
        if (itemData && allSavedItems)
            return allSavedItems.findIndex(i => JSON.stringify(i) === JSON.stringify(itemData)) >= 0
        else
            return false
    }, [allSavedItems, itemData])

    const onPressSaved = useCallback(async () => {
        if (isSaved && diversityMode)
            OnPressedXInDiversityMode(navigation)

        let shouldDispatch = true

        if (!isSaved) { // to save
            if (!isPremium && allSavedItems && allSavedItems.length >= LimitSaved) { // reached limit
                shouldDispatch = false

                Alert.alert(
                    LocalText.full_saved,
                    LocalText.full_saved_desc.replaceAll("##", LimitSaved.toString()),
                    [
                        {
                            text: LocalText.later,
                        },
                        {
                            text: LocalText.upgrade,
                            onPress: () => GoToPremiumScreen(navigation),
                        },
                    ])
            }
            else { // can save
                GoodayToast(LocalText.saved_2)
            }
        }

        if (itemData && shouldDispatch)
            dispatch(toggleSavedItem(itemData))
    }, [itemData, isSaved, isPremium, diversityMode, allSavedItems, navigation])

    return [isSaved, onPressSaved] as const
}