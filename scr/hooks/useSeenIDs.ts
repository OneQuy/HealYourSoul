import { View, Text } from 'react-native'
import React from 'react'
import { Category } from '../constants/AppConstants';
import { useAppSelector } from '../redux/Store';

const useSeenIDs = (category: Category) => {
    return useAppSelector((state) => {
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
        else
            throw new Error('not implement cat: ' + category);
    })
}

export default useSeenIDs