import { PayloadAction, createSlice } from "@reduxjs/toolkit"
import { defaultThemeType, ThemeType } from "../constants/Colors";

export type MiscState = {
    themeType: ThemeType,
} 

const initialState: MiscState = {
    themeType: defaultThemeType,
}

const slice = createSlice({
    name: 'misc',
    initialState,
    reducers: {
        setTheme: (state, action: PayloadAction<ThemeType>) => {
            state.themeType = action.payload;
        }
    }
});

export const { setTheme } = slice.actions;

export default slice.reducer;

