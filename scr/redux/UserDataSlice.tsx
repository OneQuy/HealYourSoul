import { PayloadAction, createSlice } from "@reduxjs/toolkit"
import { SubscribedData } from "../constants/Types";

export type UserDataState = {
    subscribedData: SubscribedData | undefined,

    awardPictureFavoritedIDs: number[],

    drawSeenIDs: number[],
    drawFavoritedIDs: number[],

    memeSeenIDs: number[],
    memeFavoritedIDs: number[],

    quoteSeenIDs: number[],
    quoteFavoritedIDs: number[],

    loveSeenIDs: number[],
    loveFavoritedIDs: number[],

    satisfyingSeenIDs: number[],
    satisfyingFavoritedIDs: number[],

    catdogSeenIDs: number[],
    catdogFavoritedIDs: number[],

    nsfwSeenIDs: number[],
    nsfwFavoritedIDs: number[],

    cuteSeenIDs: number[],
    cuteFavoritedIDs: number[],

    sarcasmSeenIDs: number[],
    sarcasmFavoritedIDs: number[],

    artSeenIDs: number[],
    artFavoritedIDs: number[],
}

const initialState: UserDataState = {
    subscribedData: undefined,

    awardPictureFavoritedIDs: [],

    drawSeenIDs: [],
    drawFavoritedIDs: [],

    memeSeenIDs: [],
    memeFavoritedIDs: [],

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

        // award picture

        addAwardPictureFavoritedID(state, action: PayloadAction<number>) {
            if (!state.awardPictureFavoritedIDs)
                state.awardPictureFavoritedIDs = []

            if (!state.awardPictureFavoritedIDs.includes(action.payload))
                state.awardPictureFavoritedIDs.push(action.payload);
        },

        removeAwardPictureFavoritedID(state, action: PayloadAction<number>) {
            state.awardPictureFavoritedIDs = state.awardPictureFavoritedIDs.filter(i => i !== action.payload)
        },

        // draw

        addDrawSeenID(state, action: PayloadAction<number>) {
            if (!state.drawSeenIDs.includes(action.payload))
                state.drawSeenIDs.push(action.payload);
        },

        addDrawFavoritedID(state, action: PayloadAction<number>) {
            if (!state.drawFavoritedIDs.includes(action.payload))
                state.drawFavoritedIDs.push(action.payload);
        },

        removeDrawFavoritedID(state, action: PayloadAction<number>) {
            state.drawFavoritedIDs = state.drawFavoritedIDs.filter(i => i !== action.payload)
        },

        // meme

        addMemeSeenID(state, action: PayloadAction<number>) {
            if (!state.memeSeenIDs.includes(action.payload))
                state.memeSeenIDs.push(action.payload);
        },

        addMemeFavoritedID(state, action: PayloadAction<number>) {
            if (!state.memeFavoritedIDs.includes(action.payload))
                state.memeFavoritedIDs.push(action.payload);
        },

        removeMemeFavoritedID(state, action: PayloadAction<number>) {
            state.memeFavoritedIDs = state.memeFavoritedIDs.filter(i => i !== action.payload)
        },

        // quote

        addQuoteSeenID(state, action: PayloadAction<number>) {
            if (!state.quoteSeenIDs.includes(action.payload))
                state.quoteSeenIDs.push(action.payload);
        },

        addQuoteFavoritedID(state, action: PayloadAction<number>) {
            if (!state.quoteFavoritedIDs.includes(action.payload))
                state.quoteFavoritedIDs.push(action.payload);
        },

        removeQuoteFavoritedID(state, action: PayloadAction<number>) {
            state.quoteFavoritedIDs = state.quoteFavoritedIDs.filter(i => i !== action.payload)
        },

        // love

        addLoveSeenID(state, action: PayloadAction<number>) {
            if (!state.loveSeenIDs.includes(action.payload))
                state.loveSeenIDs.push(action.payload);
        },

        addLoveFavoritedID(state, action: PayloadAction<number>) {
            if (!state.loveFavoritedIDs.includes(action.payload))
                state.loveFavoritedIDs.push(action.payload);
        },

        removeLoveFavoritedID(state, action: PayloadAction<number>) {
            state.loveFavoritedIDs = state.loveFavoritedIDs.filter(i => i !== action.payload)
        },

        // nsfw

        addNSFWSeenID(state, action: PayloadAction<number>) {
            if (!state.nsfwSeenIDs.includes(action.payload))
                state.nsfwSeenIDs.push(action.payload);
        },

        addNSFWFavoritedID(state, action: PayloadAction<number>) {
            if (!state.nsfwFavoritedIDs.includes(action.payload))
                state.nsfwFavoritedIDs.push(action.payload);
        },

        removeNSFWFavoritedID(state, action: PayloadAction<number>) {
            state.nsfwFavoritedIDs = state.nsfwFavoritedIDs.filter(i => i !== action.payload)
        },

        // catdog

        addCatDogSeenID(state, action: PayloadAction<number>) {
            if (!state.catdogSeenIDs.includes(action.payload))
                state.catdogSeenIDs.push(action.payload);
        },

        addCatDogFavoritedID(state, action: PayloadAction<number>) {
            if (!state.catdogFavoritedIDs.includes(action.payload))
                state.catdogFavoritedIDs.push(action.payload);
        },

        removeCatDogFavoritedID(state, action: PayloadAction<number>) {
            state.catdogFavoritedIDs = state.catdogFavoritedIDs.filter(i => i !== action.payload)
        },

        // art

        addArtSeenID(state, action: PayloadAction<number>) {
            if (!state.artSeenIDs.includes(action.payload))
                state.artSeenIDs.push(action.payload);
        },

        addArtFavoritedID(state, action: PayloadAction<number>) {
            if (!state.artFavoritedIDs.includes(action.payload))
                state.artFavoritedIDs.push(action.payload);
        },

        removeArtFavoritedID(state, action: PayloadAction<number>) {
            state.artFavoritedIDs = state.artFavoritedIDs.filter(i => i !== action.payload)
        },

        // cute

        addCuteSeenID(state, action: PayloadAction<number>) {
            if (!state.cuteSeenIDs.includes(action.payload))
                state.cuteSeenIDs.push(action.payload);
        },

        addCuteFavoritedID(state, action: PayloadAction<number>) {
            if (!state.cuteFavoritedIDs.includes(action.payload))
                state.cuteFavoritedIDs.push(action.payload);
        },

        removeCuteFavoritedID(state, action: PayloadAction<number>) {
            state.cuteFavoritedIDs = state.cuteFavoritedIDs.filter(i => i !== action.payload)
        },

        // sarcasm

        addSarcasmSeenID(state, action: PayloadAction<number>) {
            if (!state.sarcasmSeenIDs.includes(action.payload))
                state.sarcasmSeenIDs.push(action.payload);
        },

        addSarcasmFavoritedID(state, action: PayloadAction<number>) {
            if (!state.sarcasmFavoritedIDs.includes(action.payload))
                state.sarcasmFavoritedIDs.push(action.payload);
        },

        removeSarcasmFavoritedID(state, action: PayloadAction<number>) {
            state.sarcasmFavoritedIDs = state.sarcasmFavoritedIDs.filter(i => i !== action.payload)
        },

        // satisfying

        addSatisfyingSeenID(state, action: PayloadAction<number>) {
            if (!state.satisfyingSeenIDs.includes(action.payload))
                state.satisfyingSeenIDs.push(action.payload);
        },

        addSatisfyingFavoritedID(state, action: PayloadAction<number>) {
            if (!state.satisfyingFavoritedIDs.includes(action.payload))
                state.satisfyingFavoritedIDs.push(action.payload);
        },

        removeSatisfyingFavoritedID(state, action: PayloadAction<number>) {
            state.satisfyingFavoritedIDs = state.satisfyingFavoritedIDs.filter(i => i !== action.payload)
        },
    }
});

export const {
    clearAllUserData,

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

    addArtSeenID,
    addArtFavoritedID,
    removeArtFavoritedID,

    addSarcasmSeenID,
    addSarcasmFavoritedID,
    removeSarcasmFavoritedID,

    addAwardPictureFavoritedID,
    removeAwardPictureFavoritedID,
} = slice.actions;

export default slice.reducer;

