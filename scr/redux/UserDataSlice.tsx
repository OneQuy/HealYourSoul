import { PayloadAction, createSlice } from "@reduxjs/toolkit"

export type UserDataState = {
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
}

const initialState: UserDataState = {
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
}

const slice = createSlice({
    name: 'userData',
    initialState,
    reducers: {
        clearAllUserData: () => initialState,

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
            [action.payload, ...state.drawFavoritedIDs] = state.drawFavoritedIDs;
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
            [action.payload, ...state.memeFavoritedIDs] = state.memeFavoritedIDs;
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
            [action.payload, ...state.quoteFavoritedIDs] = state.quoteFavoritedIDs;
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
            [action.payload, ...state.loveFavoritedIDs] = state.loveFavoritedIDs;
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
            [action.payload, ...state.nsfwFavoritedIDs] = state.nsfwFavoritedIDs;
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
            [action.payload, ...state.catdogFavoritedIDs] = state.catdogFavoritedIDs;
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
            [action.payload, ...state.satisfyingFavoritedIDs] = state.satisfyingFavoritedIDs;
        },
    }
});

export const {
    clearAllUserData,

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
} = slice.actions;

export default slice.reducer;

