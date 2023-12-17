import { PayloadAction, createSlice } from "@reduxjs/toolkit"
import { defaultThemeType, ThemeType } from "../constants/Colors";

// these data are not importance, not need to clear
export type MiscState = {
    themeType: ThemeType,
    mutedVideo: boolean,
}

const initialState: MiscState = {
    themeType: defaultThemeType,
    mutedVideo: true,
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
    }
});

export const {
    setTheme,
    setMutedVideo,
} = slice.actions;

export default slice.reducer;

