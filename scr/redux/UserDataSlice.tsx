import { PayloadAction, createSlice } from "@reduxjs/toolkit"

export type UserDataState = {
    drawSeenIDs: number[],
    drawFavoritedIDs: number[],

    memeSeenIDs: number[],
    memeFavoritedIDs: number[],

    quoteSeenIDs: number[],
    quoteFavoritedIDs: number[],
}

const initialState: UserDataState = {
    drawSeenIDs: [],
    drawFavoritedIDs: [],

    memeSeenIDs: [],
    memeFavoritedIDs: [],

    quoteSeenIDs: [],
    quoteFavoritedIDs: [],
}

const slice = createSlice({
    name: 'userData',
    initialState,
    reducers: {
        clearAllUserData: () => initialState,

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
} = slice.actions;

export default slice.reducer;

