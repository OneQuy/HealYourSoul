import { useCallback, useEffect, useMemo, useState } from "react";
import { Category } from "../constants/AppConstants";
import { RootState, useAppDispatch, useAppSelector } from "../redux/Store";
import { addDrawFavoritedID, addQuoteFavoritedID, addMemeFavoritedID, removeDrawFavoritedID, removeQuoteFavoritedID, removeMemeFavoritedID, removeLoveFavoritedID, addLoveFavoritedID, removeSatisfyingFavoritedID, addSatisfyingFavoritedID, removeCatDogFavoritedID, addCatDogFavoritedID, removeNSFWFavoritedID, addNSFWFavoritedID, removeCuteFavoritedID, addCuteFavoritedID, removeArtFavoritedID, addArtFavoritedID, removeSarcasmFavoritedID, addSarcasmFavoritedID, removeAwardPictureFavoritedID, addAwardPictureFavoritedID } from '../redux/UserDataSlice'
import { GetPostLikeCountAsync, LikePostAsync } from "../handle/LikeCountHandler";

export default function useIsFavorited(category: Category, id: number | undefined)
    : readonly [isFavorited: boolean, likeCount: number, onPressFavorite: () => void] {
    const dispatch = useAppDispatch()    
    const [likeCount, setLikeCount] = useState<number>(Number.NaN);

    const favoritedIDs = useAppSelector((state: RootState) => {
        if (category === Category.Draw)
            return state.userData.drawFavoritedIDs;
        else if (category === Category.Meme)
            return state.userData.memeFavoritedIDs;
        else if (category === Category.Quote)
            return state.userData.quoteFavoritedIDs;
        else if (category === Category.Love)
            return state.userData.loveFavoritedIDs;
        else if (category === Category.CatDog)
            return state.userData.catdogFavoritedIDs;
        else if (category === Category.Satisfying)
            return state.userData.satisfyingFavoritedIDs;
        else if (category === Category.NSFW)
            return state.userData.nsfwFavoritedIDs;
        else if (category === Category.Cute)
            return state.userData.cuteFavoritedIDs;
        else if (category === Category.Sarcasm)
            return state.userData.sarcasmFavoritedIDs;
        else if (category === Category.Art)
            return state.userData.artFavoritedIDs;
        else if (category === Category.AwardPicture)
            return state.userData.awardPictureFavoritedIDs;
        else
            throw new Error('NI cat: ' + Category[category]);
    })
    
    const isFavorited: boolean = useMemo(() => {
        if (id === undefined)
            return false

        return favoritedIDs && favoritedIDs.includes(id);
    }, [favoritedIDs, id])

    const onPressFavorite = useCallback(async () => {
        if (id === undefined)
            return

        if (category === Category.Quote) {
            if (isFavorited)
                dispatch(removeQuoteFavoritedID(id));
            else
                dispatch(addQuoteFavoritedID(id));
        } else if (category === Category.Draw) {
            if (isFavorited)
                dispatch(removeDrawFavoritedID(id));
            else
                dispatch(addDrawFavoritedID(id));
        }
        else if (category === Category.Meme) {
            if (isFavorited)
                dispatch(removeMemeFavoritedID(id));
            else
                dispatch(addMemeFavoritedID(id));
        }
        else if (category === Category.Love) {
            if (isFavorited)
                dispatch(removeLoveFavoritedID(id));
            else
                dispatch(addLoveFavoritedID(id));
        }
        else if (category === Category.Satisfying) {
            if (isFavorited)
                dispatch(removeSatisfyingFavoritedID(id));
            else
                dispatch(addSatisfyingFavoritedID(id));
        }
        else if (category === Category.CatDog) {
            if (isFavorited)
                dispatch(removeCatDogFavoritedID(id));
            else
                dispatch(addCatDogFavoritedID(id));
        }
        else if (category === Category.NSFW) {
            if (isFavorited)
                dispatch(removeNSFWFavoritedID(id));
            else
                dispatch(addNSFWFavoritedID(id));
        }
        else if (category === Category.Cute) {
            if (isFavorited)
                dispatch(removeCuteFavoritedID(id));
            else
                dispatch(addCuteFavoritedID(id));
        }
        else if (category === Category.Art) {
            if (isFavorited)
                dispatch(removeArtFavoritedID(id));
            else
                dispatch(addArtFavoritedID(id));
        }
        else if (category === Category.Sarcasm) {
            if (isFavorited)
                dispatch(removeSarcasmFavoritedID(id));
            else
                dispatch(addSarcasmFavoritedID(id));
        }
        else if (category === Category.AwardPicture) {
            if (isFavorited)
                dispatch(removeAwardPictureFavoritedID(id));
            else
                dispatch(addAwardPictureFavoritedID(id));
        }
        else
            throw new Error('NI cat: ' + category);

        LikePostAsync(!isFavorited, category, id, (likes) => setLikeCount(likes))
    }, [isFavorited, id]);

    useEffect(() => {
        if (id === undefined)
            setLikeCount(Number.NaN)
        else{
            setLikeCount(Number.NaN)
            GetPostLikeCountAsync(category, id, (likes) => setLikeCount(likes))
        }
    }, [id])

    return [isFavorited, likeCount, onPressFavorite] as const
}