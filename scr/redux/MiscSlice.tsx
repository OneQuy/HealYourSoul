import { PayloadAction, createSlice } from "@reduxjs/toolkit"
import { defaultThemeType, ThemeType } from "../constants/Colors";

// these data are not importance, not need to clear
export type MiscState = {
    themeType: ThemeType,
    mutedVideo: boolean,
    onboarded: boolean,
}

const initialState: MiscState = {
    themeType: defaultThemeType,
    mutedVideo: true,
    onboarded: false,
}

const slice = createSlice({
    name: 'misc',
    initialState,
    reducers: {
        setTheme: (state, action: PayloadAction<ThemeType>) => {
            state.themeType = action.payload;
        },

        setMutedVideo: (state) => {
            state.mutedVideo = !state.mutedVideo;
        },
        
        setOnboarded: (state) => {
            state.onboarded = !state.onboarded;
        },
    }
});

export const {
    setTheme,
    setMutedVideo,
    setOnboarded,
} = slice.actions;

export default slice.reducer;

