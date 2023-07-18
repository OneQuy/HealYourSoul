import { createSlice } from "@reduxjs/toolkit"

export type MiscState = {
    isLightTheme: boolean,
} 

const initialState: MiscState = {
    isLightTheme: true,
}

const slice = createSlice({
    name: 'misc',
    initialState,
    reducers: {
        toggleTheme: (state) => {
            state.isLightTheme = !state.isLightTheme
        }
    }
});

export const { toggleTheme } = slice.actions;

export default slice.reducer;

