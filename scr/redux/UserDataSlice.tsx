import { PayloadAction, createSlice } from "@reduxjs/toolkit"
import { SubscribedData } from "../constants/Types";
import { ScreenName } from "../constants/AppConstants";

export type UserDataState = {
    disableScreens: ScreenName[],

    subscribedData: SubscribedData | undefined,

    shortFilmsFavoritedIDs: (number | string)[],

    awardPictureFavoritedIDs: (number | string)[],

    funWebsiteFavoritesIDs: (number | string)[],

    topMovieFavoritesIDs: (number | string)[],

    awesomeSeenIDs: (number | string)[],
    awesomeFavoritedIDs: (number | string)[],

    infoSeenIDs: (number | string)[],
    infoFavoritedIDs: (number | string)[],

    typoSeenIDs: (number | string)[],
    typoFavoritedIDs: (number | string)[],

    sunsetSeenIDs: (number | string)[],
    sunsetFavoritedIDs: (number | string)[],

    drawSeenIDs: (number | string)[],
    drawFavoritedIDs: (number | string)[],

    memeSeenIDs: (number | string)[],
    memeFavoritedIDs: (number | string)[],

    quoteSeenIDs: (number | string)[],
    quoteFavoritedIDs: (number | string)[],

    loveSeenIDs: (number | string)[],
    loveFavoritedIDs: (number | string)[],

    satisfyingSeenIDs: (number | string)[],
    satisfyingFavoritedIDs: (number | string)[],

    catdogSeenIDs: (number | string)[],
    catdogFavoritedIDs: (number | string)[],

    nsfwSeenIDs: (number | string)[],
    nsfwFavoritedIDs: (number | string)[],

    cuteSeenIDs: (number | string)[],
    cuteFavoritedIDs: (number | string)[],

    sarcasmSeenIDs: (number | string)[],
    sarcasmFavoritedIDs: (number | string)[],

    artSeenIDs: (number | string)[],
    artFavoritedIDs: (number | string)[],
}

const initialState: UserDataState = {
    disableScreens: [],

    subscribedData: undefined,

    shortFilmsFavoritedIDs: [],

    awardPictureFavoritedIDs: [],

    funWebsiteFavoritesIDs: [],

    topMovieFavoritesIDs: [],

    drawSeenIDs: [],
    drawFavoritedIDs: [],

    memeSeenIDs: [],
    memeFavoritedIDs: [],

    sunsetSeenIDs: [],
    sunsetFavoritedIDs: [],

    infoSeenIDs: [],
    infoFavoritedIDs: [],

    typoSeenIDs: [],
    typoFavoritedIDs: [],

    awesomeSeenIDs: [],
    awesomeFavoritedIDs: [],

    quoteSeenIDs: [],
    quoteFavoritedIDs: [],

    loveSeenIDs: [],
    loveFavoritedIDs: [],

    satisfyingSeenIDs: [],
    satisfyingFavoritedIDs: [],

    catdogSeenIDs: [],
    catdogFavoritedIDs: [],

    nsfwSeenIDs: [],
    nsfwFavoritedIDs: [],

    artSeenIDs: [],
    artFavoritedIDs: [],

    cuteSeenIDs: [],
    cuteFavoritedIDs: [],

    sarcasmSeenIDs: [],
    sarcasmFavoritedIDs: [],
}

const slice = createSlice({
    name: 'userData',
    initialState,
    reducers: {
        clearAllUserData: () => initialState,

        setSubscribe: (state, action: PayloadAction<string>) => {
            state.subscribedData = {
                id: action.payload,
                tick: Date.now(),
            } as SubscribedData
        },

        enableAllScreen(state) {
            state.disableScreens = []
        },

        toggleDisableScreen(state, action: PayloadAction<ScreenName>) {
            if (!state.disableScreens)
                state.disableScreens = []

            if (state.disableScreens.includes(action.payload))
                state.disableScreens = state.disableScreens.filter(screen => screen !== action.payload)
            else
                state.disableScreens.push(action.payload)
        },

        // award picture

        addAwardPictureFavoritedID(state, action: PayloadAction<number | string>) {
            if (!state.awardPictureFavoritedIDs)
                state.awardPictureFavoritedIDs = []

            if (!state.awardPictureFavoritedIDs.includes(action.payload))
                state.awardPictureFavoritedIDs.push(action.payload);
        },

        removeAwardPictureFavoritedID(state, action: PayloadAction<number | string>) {
            state.awardPictureFavoritedIDs = state.awardPictureFavoritedIDs.filter(i => i !== action.payload)
        },

        // top movies

        addTopMovieFavoritedID(state, action: PayloadAction<number | string>) {
            if (!state.topMovieFavoritesIDs)
                state.topMovieFavoritesIDs = []

            if (!state.topMovieFavoritesIDs.includes(action.payload))
                state.topMovieFavoritesIDs.push(action.payload);
        },

        removeTopMovieFavoritedID(state, action: PayloadAction<number | string>) {
            state.topMovieFavoritesIDs = state.topMovieFavoritesIDs.filter(i => i !== action.payload)
        },

        // short films

        addShortFilmsFavoritedID(state, action: PayloadAction<number | string>) {
            if (!state.shortFilmsFavoritedIDs)
                state.shortFilmsFavoritedIDs = []

            if (!state.shortFilmsFavoritedIDs.includes(action.payload))
                state.shortFilmsFavoritedIDs.push(action.payload);
        },

        removeShortFilmsFavoritedID(state, action: PayloadAction<number | string>) {
            state.shortFilmsFavoritedIDs = state.shortFilmsFavoritedIDs.filter(i => i !== action.payload)
        },

        // award picture

        addFunWebsiteFavoritedID(state, action: PayloadAction<number | string>) {
            if (!state.funWebsiteFavoritesIDs)
                state.funWebsiteFavoritesIDs = []

            if (!state.funWebsiteFavoritesIDs.includes(action.payload))
                state.funWebsiteFavoritesIDs.push(action.payload);
        },

        removeFunWebsiteFavoritedID(state, action: PayloadAction<number | string>) {
            state.funWebsiteFavoritesIDs = state.funWebsiteFavoritesIDs.filter(i => i !== action.payload)
        },

        // draw (warm)

        addDrawSeenID(state, action: PayloadAction<number | string>) {
            if (!state.drawSeenIDs.includes(action.payload))
                state.drawSeenIDs.push(action.payload);
        },

        addDrawFavoritedID(state, action: PayloadAction<number | string>) {
            if (!state.drawFavoritedIDs.includes(action.payload))
                state.drawFavoritedIDs.push(action.payload);
        },

        removeDrawFavoritedID(state, action: PayloadAction<number | string>) {
            state.drawFavoritedIDs = state.drawFavoritedIDs.filter(i => i !== action.payload)
        },

        // meme

        addMemeSeenID(state, action: PayloadAction<number | string>) {
            if (!state.memeSeenIDs.includes(action.payload))
                state.memeSeenIDs.push(action.payload);
        },

        addMemeFavoritedID(state, action: PayloadAction<number | string>) {
            if (!state.memeFavoritedIDs.includes(action.payload))
                state.memeFavoritedIDs.push(action.payload);
        },

        removeMemeFavoritedID(state, action: PayloadAction<number | string>) {
            state.memeFavoritedIDs = state.memeFavoritedIDs.filter(i => i !== action.payload)
        },

        // info

        addInfoSeenID(state, action: PayloadAction<number | string>) {
            if (!state.infoSeenIDs)
                state.infoSeenIDs = []

            if (!state.infoSeenIDs.includes(action.payload))
                state.infoSeenIDs.push(action.payload);
        },

        addInfoFavoritedID(state, action: PayloadAction<number | string>) {
            if (!state.infoFavoritedIDs)
                state.infoFavoritedIDs = []

            if (!state.infoFavoritedIDs.includes(action.payload))
                state.infoFavoritedIDs.push(action.payload);
        },

        removeInfoFavoritedID(state, action: PayloadAction<number | string>) {
            if (!state.infoFavoritedIDs)
                state.infoFavoritedIDs = []

            state.infoFavoritedIDs = state.infoFavoritedIDs.filter(i => i !== action.payload)
        },

        // typo

        addTypoSeenID(state, action: PayloadAction<number | string>) {
            if (!state.typoSeenIDs)
                state.typoSeenIDs = []

            if (!state.typoSeenIDs.includes(action.payload))
                state.typoSeenIDs.push(action.payload);
        },

        addTypoFavoritedID(state, action: PayloadAction<number | string>) {
            if (!state.typoFavoritedIDs)
                state.typoFavoritedIDs = []

            if (!state.typoFavoritedIDs.includes(action.payload))
                state.typoFavoritedIDs.push(action.payload);
        },

        removeTypoFavoritedID(state, action: PayloadAction<number | string>) {
            if (!state.typoFavoritedIDs)
                state.typoFavoritedIDs = []

            state.typoFavoritedIDs = state.typoFavoritedIDs.filter(i => i !== action.payload)
        },

        // awesome

        addAwesomeSeenID(state, action: PayloadAction<number | string>) {
            if (!state.awesomeSeenIDs)
                state.awesomeSeenIDs = []

            if (!state.awesomeSeenIDs.includes(action.payload))
                state.awesomeSeenIDs.push(action.payload);
        },

        addAwesomeFavoritedID(state, action: PayloadAction<number | string>) {
            if (!state.awesomeFavoritedIDs)
                state.awesomeFavoritedIDs = []

            if (!state.awesomeFavoritedIDs.includes(action.payload))
                state.awesomeFavoritedIDs.push(action.payload);
        },

        removeAwesomeFavoritedID(state, action: PayloadAction<number | string>) {
            if (!state.awesomeFavoritedIDs)
                state.awesomeFavoritedIDs = []

            state.awesomeFavoritedIDs = state.awesomeFavoritedIDs.filter(i => i !== action.payload)
        },

        // sunset

        addSunsetSeenID(state, action: PayloadAction<number | string>) {
            if (!state.sunsetSeenIDs)
                state.sunsetSeenIDs = []

            if (!state.sunsetSeenIDs.includes(action.payload))
                state.sunsetSeenIDs.push(action.payload);
        },

        addSunsetFavoritedID(state, action: PayloadAction<number | string>) {
            if (!state.sunsetFavoritedIDs)
                state.sunsetFavoritedIDs = []

            if (!state.sunsetFavoritedIDs.includes(action.payload))
                state.sunsetFavoritedIDs.push(action.payload);
        },

        removeSunsetFavoritedID(state, action: PayloadAction<number | string>) {
            if (!state.sunsetFavoritedIDs)
                state.sunsetFavoritedIDs = []

            state.sunsetFavoritedIDs = state.sunsetFavoritedIDs.filter(i => i !== action.payload)
        },

        // quote

        addQuoteSeenID(state, action: PayloadAction<number | string>) {
            if (!state.quoteSeenIDs.includes(action.payload))
                state.quoteSeenIDs.push(action.payload);
        },

        addQuoteFavoritedID(state, action: PayloadAction<number | string>) {
            if (!state.quoteFavoritedIDs.includes(action.payload))
                state.quoteFavoritedIDs.push(action.payload);
        },

        removeQuoteFavoritedID(state, action: PayloadAction<number | string>) {
            state.quoteFavoritedIDs = state.quoteFavoritedIDs.filter(i => i !== action.payload)
        },

        // love

        addLoveSeenID(state, action: PayloadAction<number | string>) {
            if (!state.loveSeenIDs.includes(action.payload))
                state.loveSeenIDs.push(action.payload);
        },

        addLoveFavoritedID(state, action: PayloadAction<number | string>) {
            if (!state.loveFavoritedIDs.includes(action.payload))
                state.loveFavoritedIDs.push(action.payload);
        },

        removeLoveFavoritedID(state, action: PayloadAction<number | string>) {
            state.loveFavoritedIDs = state.loveFavoritedIDs.filter(i => i !== action.payload)
        },

        // nsfw

        addNSFWSeenID(state, action: PayloadAction<number | string>) {
            if (!state.nsfwSeenIDs.includes(action.payload))
                state.nsfwSeenIDs.push(action.payload);
        },

        addNSFWFavoritedID(state, action: PayloadAction<number | string>) {
            if (!state.nsfwFavoritedIDs.includes(action.payload))
                state.nsfwFavoritedIDs.push(action.payload);
        },

        removeNSFWFavoritedID(state, action: PayloadAction<number | string>) {
            state.nsfwFavoritedIDs = state.nsfwFavoritedIDs.filter(i => i !== action.payload)
        },

        // catdog

        addCatDogSeenID(state, action: PayloadAction<number | string>) {
            if (!state.catdogSeenIDs.includes(action.payload))
                state.catdogSeenIDs.push(action.payload);
        },

        addCatDogFavoritedID(state, action: PayloadAction<number | string>) {
            if (!state.catdogFavoritedIDs.includes(action.payload))
                state.catdogFavoritedIDs.push(action.payload);
        },

        removeCatDogFavoritedID(state, action: PayloadAction<number | string>) {
            state.catdogFavoritedIDs = state.catdogFavoritedIDs.filter(i => i !== action.payload)
        },

        // art

        addArtSeenID(state, action: PayloadAction<number | string>) {
            if (!state.artSeenIDs.includes(action.payload))
                state.artSeenIDs.push(action.payload);
        },

        addArtFavoritedID(state, action: PayloadAction<number | string>) {
            if (!state.artFavoritedIDs.includes(action.payload))
                state.artFavoritedIDs.push(action.payload);
        },

        removeArtFavoritedID(state, action: PayloadAction<number | string>) {
            state.artFavoritedIDs = state.artFavoritedIDs.filter(i => i !== action.payload)
        },

        // cute

        addCuteSeenID(state, action: PayloadAction<number | string>) {
            if (!state.cuteSeenIDs.includes(action.payload))
                state.cuteSeenIDs.push(action.payload);
        },

        addCuteFavoritedID(state, action: PayloadAction<number | string>) {
            if (!state.cuteFavoritedIDs.includes(action.payload))
                state.cuteFavoritedIDs.push(action.payload);
        },

        removeCuteFavoritedID(state, action: PayloadAction<number | string>) {
            state.cuteFavoritedIDs = state.cuteFavoritedIDs.filter(i => i !== action.payload)
        },

        // sarcasm

        addSarcasmSeenID(state, action: PayloadAction<number | string>) {
            if (!state.sarcasmSeenIDs.includes(action.payload))
                state.sarcasmSeenIDs.push(action.payload);
        },

        addSarcasmFavoritedID(state, action: PayloadAction<number | string>) {
            if (!state.sarcasmFavoritedIDs.includes(action.payload))
                state.sarcasmFavoritedIDs.push(action.payload);
        },

        removeSarcasmFavoritedID(state, action: PayloadAction<number | string>) {
            state.sarcasmFavoritedIDs = state.sarcasmFavoritedIDs.filter(i => i !== action.payload)
        },

        // satisfying

        addSatisfyingSeenID(state, action: PayloadAction<number | string>) {
            if (!state.satisfyingSeenIDs.includes(action.payload))
                state.satisfyingSeenIDs.push(action.payload);
        },

        addSatisfyingFavoritedID(state, action: PayloadAction<number | string>) {
            if (!state.satisfyingFavoritedIDs.includes(action.payload))
                state.satisfyingFavoritedIDs.push(action.payload);
        },

        removeSatisfyingFavoritedID(state, action: PayloadAction<number | string>) {
            state.satisfyingFavoritedIDs = state.satisfyingFavoritedIDs.filter(i => i !== action.payload)
        },
    }
});

export const {
    clearAllUserData,

    enableAllScreen,
    toggleDisableScreen,

    setSubscribe,

    addDrawSeenID,
    addDrawFavoritedID,
    removeDrawFavoritedID,

    addMemeSeenID,
    addMemeFavoritedID,
    removeMemeFavoritedID,

    addQuoteSeenID,
    addQuoteFavoritedID,
    removeQuoteFavoritedID,

    addCatDogSeenID,
    addCatDogFavoritedID,
    removeCatDogFavoritedID,

    addLoveSeenID,
    addLoveFavoritedID,
    removeLoveFavoritedID,

    addNSFWSeenID,
    addNSFWFavoritedID,
    removeNSFWFavoritedID,

    addSatisfyingSeenID,
    addSatisfyingFavoritedID,
    removeSatisfyingFavoritedID,

    addCuteSeenID,
    addCuteFavoritedID,
    removeCuteFavoritedID,

    addInfoSeenID,
    addInfoFavoritedID,
    removeInfoFavoritedID,

    addTypoSeenID,
    addTypoFavoritedID,
    removeTypoFavoritedID,

    addSunsetSeenID,
    addSunsetFavoritedID,
    removeSunsetFavoritedID,

    addAwesomeSeenID,
    addAwesomeFavoritedID,
    removeAwesomeFavoritedID,

    addArtSeenID,
    addArtFavoritedID,
    removeArtFavoritedID,

    addSarcasmSeenID,
    addSarcasmFavoritedID,
    removeSarcasmFavoritedID,

    addAwardPictureFavoritedID,
    removeAwardPictureFavoritedID,

    addFunWebsiteFavoritedID,
    removeFunWebsiteFavoritedID,

    addTopMovieFavoritedID,
    removeTopMovieFavoritedID,

    addShortFilmsFavoritedID,
    removeShortFilmsFavoritedID
} = slice.actions;

export default slice.reducer;

