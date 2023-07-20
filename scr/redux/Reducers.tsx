import { combineReducers } from "@reduxjs/toolkit";
import miscSlice from './MiscSlice';

export const reducers = combineReducers({
    misc: miscSlice,
});