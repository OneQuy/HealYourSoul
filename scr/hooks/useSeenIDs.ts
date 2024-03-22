import { useEffect } from 'react';
import { Category } from '../constants/AppConstants';
import { useAppDispatch, useAppSelector } from '../redux/Store';
import { addDrawSeenID, addQuoteSeenID, addMemeSeenID, addLoveSeenID, addSatisfyingSeenID, addCatDogSeenID, addNSFWSeenID, addCuteSeenID, addArtSeenID, addSarcasmSeenID, addTypoSeenID, addSunsetSeenID, addInfoSeenID, addAwesomeSeenID, addTuneSeenID, addVocabularySeenID, addAwesomeNatureSeenID, addNiceClipSeenID } from '../redux/UserDataSlice'

const useSeenIDs = (category: Category, postID: number | string | undefined) => {
    const dispatch = useAppDispatch()

    const seenIDs = useAppSelector((state) => {
        if (category === Category.Draw)
            return state.userData.drawSeenIDs;
        else if (category === Category.Meme)
            return state.userData.memeSeenIDs;
        else if (category === Category.Quote)
            return state.userData.quoteSeenIDs;
        else if (category === Category.Satisfying)
            return state.userData.satisfyingSeenIDs;
        else if (category === Category.Love)
            return state.userData.loveSeenIDs;
        else if (category === Category.CatDog)
            return state.userData.catdogSeenIDs;
        else if (category === Category.NSFW)
            return state.userData.nsfwSeenIDs;
        else if (category === Category.Cute)
            return state.userData.cuteSeenIDs;
        else if (category === Category.Art)
            return state.userData.artSeenIDs;
        else if (category === Category.Sarcasm)
            return state.userData.sarcasmSeenIDs;
        else if (category === Category.Info)
            return state.userData.infoSeenIDs;
        else if (category === Category.Typo)
            return state.userData.typoSeenIDs;
        else if (category === Category.Sunset)
            return state.userData.sunsetSeenIDs;
        else if (category === Category.Vocabulary)
            return state.userData.vocabularySeenIDs;
        else if (category === Category.Awesome)
            return state.userData.awesomeSeenIDs;
        else if (category === Category.Tune)
            return state.userData.tuneSeenIDs;
        else if (category === Category.AwesomeNature)
            return state.userData.awesomeNatureSeenIDs;
        else if (category === Category.NiceClip)
            return state.userData.niceClipSeenIDs;
        else
            throw new Error('not implement cat: ' + category);
    })

    useEffect(() => {
        if (postID === undefined)
            return

        if (category === Category.Meme)
            dispatch(addMemeSeenID(postID));
        else if (category === Category.Draw)
            dispatch(addDrawSeenID(postID));
        else if (category === Category.Quote)
            dispatch(addQuoteSeenID(postID));
        else if (category === Category.Love)
            dispatch(addLoveSeenID(postID));
        else if (category === Category.Satisfying)
            dispatch(addSatisfyingSeenID(postID));
        else if (category === Category.CatDog)
            dispatch(addCatDogSeenID(postID));
        else if (category === Category.NSFW)
            dispatch(addNSFWSeenID(postID));
        else if (category === Category.Cute)
            dispatch(addCuteSeenID(postID));
        else if (category === Category.Art)
            dispatch(addArtSeenID(postID));
        else if (category === Category.Sarcasm)
            dispatch(addSarcasmSeenID(postID));
        else if (category === Category.Typo)
            dispatch(addTypoSeenID(postID));
        else if (category === Category.Sunset)
            dispatch(addSunsetSeenID(postID));
        else if (category === Category.Vocabulary)
            dispatch(addVocabularySeenID(postID));
        else if (category === Category.Info)
            dispatch(addInfoSeenID(postID));
        else if (category === Category.Awesome)
            dispatch(addAwesomeSeenID(postID));
        else if (category === Category.Tune)
            dispatch(addTuneSeenID(postID));
        else if (category === Category.AwesomeNature)
            dispatch(addAwesomeNatureSeenID(postID));
        else if (category === Category.NiceClip)
            dispatch(addNiceClipSeenID(postID));
        else
            throw new Error('NI cat: ' + category);
    }, [postID])

    return seenIDs
}

export default useSeenIDs