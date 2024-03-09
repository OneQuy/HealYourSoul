import { Category } from '../constants/AppConstants';
import { useAppSelector } from '../redux/Store';

const useFavoritedIDs = (category: Category) => {
    return useAppSelector((state) => {
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
        else if (category === Category.FunWebsites)
            return state.userData.funWebsiteFavoritesIDs;
        else if (category === Category.TopMovie)
            return state.userData.topMovieFavoritesIDs;
        else if (category === Category.BestShortFilms)
            return state.userData.shortFilmsFavoritedIDs;
        else if (category === Category.Info)
            return state.userData.infoFavoritedIDs;
        else if (category === Category.Typo)
            return state.userData.typoFavoritedIDs;
        else if (category === Category.Sunset)
            return state.userData.sunsetFavoritedIDs;
        else if (category === Category.Vocabulary)
            return state.userData.vocabularyFavoritedIDs;
        else if (category === Category.Awesome)
            return state.userData.awesomeFavoritedIDs;
        else if (category === Category.Tune)
            return state.userData.tuneFavoritedIDs;
        else if (category === Category.AwesomeNature)
            return state.userData.awesomeNatureFavoritedIDs;
        else
            throw new Error('NI cat: ' + Category[category]);
    })
}

export default useFavoritedIDs