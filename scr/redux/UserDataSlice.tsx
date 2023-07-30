import { PayloadAction, createSlice } from "@reduxjs/toolkit"

export type UserDataState = {
    drawSeenIDs: number[],
    drawFavoritedIDs: number[],

    realSeenIDs: number[],
    realFavoritedIDs: number[],

    quoteSeenIDs: number[],
    quoteFavoritedIDs: number[],
}

const initialState: UserDataState = {
    drawSeenIDs: [],
    drawFavoritedIDs: [],

    realSeenIDs: [],
    realFavoritedIDs: [],

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

        addRealSeenID(state, action: PayloadAction<number>) {
            if (!state.realSeenIDs.includes(action.payload))
                state.realSeenIDs.push(action.payload);
        },

        addRealFavoritedID(state, action: PayloadAction<number>) {
            if (!state.realFavoritedIDs.includes(action.payload))
                state.realFavoritedIDs.push(action.payload);
        },

        addQuoteSeenID(state, action: PayloadAction<number>) {
            if (!state.quoteSeenIDs.includes(action.payload))
                state.quoteSeenIDs.push(action.payload);
        },

        addQuoteFavoritedID(state, action: PayloadAction<number>) {
            if (!state.quoteFavoritedIDs.includes(action.payload))
                state.quoteFavoritedIDs.push(action.payload);
        },
    }
});

export const {
    clearAllUserData, 
    
    addDrawSeenID,
    addDrawFavoritedID,

    addRealSeenID,
    addRealFavoritedID,

    addQuoteSeenID,
    addQuoteFavoritedID,
} = slice.actions;

export default slice.reducer;

