import { PayloadAction, createSlice } from "@reduxjs/toolkit"
import { defaultThemeType, ThemeType } from "../constants/Colors";
import { SubscribedData } from "../constants/Types";

export type MiscState = {
    themeType: ThemeType,
    mutedVideo: boolean,
    subscribedData: SubscribedData | undefined,
}

const initialState: MiscState = {
    themeType: defaultThemeType,
    mutedVideo: true,
    subscribedData: undefined,
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

        setSubscribe: (state, action: PayloadAction<string>) => {
            state.subscribedData = {
                id: action.payload,
                tick: Date.now(),
            } as SubscribedData
        },
    }
});

export const {
    setTheme,
    setMutedVideo,
    setSubscribe,
} = slice.actions;

export default slice.reducer;

