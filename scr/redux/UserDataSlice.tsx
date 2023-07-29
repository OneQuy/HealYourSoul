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
        addDrawSeenID(state, action: PayloadAction<number>) {
            state.drawSeenIDs.push(action.payload);
        },

        addDrawFavoritedID(state, action: PayloadAction<number>) {
            state.drawFavoritedIDs.push(action.payload);
        },

        addRealSeenID(state, action: PayloadAction<number>) {
            state.realSeenIDs.push(action.payload);
        },

        addRealFavoritedID(state, action: PayloadAction<number>) {
            state.realFavoritedIDs.push(action.payload);
        },

        addQuoteSeenID(state, action: PayloadAction<number>) {
            state.quoteSeenIDs.push(action.payload);
        },

        addQuoteFavoritedID(state, action: PayloadAction<number>) {
            state.quoteFavoritedIDs.push(action.payload);
        },
    }
});

export const { 
    addDrawSeenID,
    addDrawFavoritedID,
    
    addRealSeenID,
    addRealFavoritedID,
    
    addQuoteSeenID,
    addQuoteFavoritedID,
 } = slice.actions;

export default slice.reducer;

