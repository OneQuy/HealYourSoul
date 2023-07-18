import { combineReducers } from "@reduxjs/toolkit";
import loginSlice from "./LoginSlice";
import miscSlice from './MiscSlice';

export const reducers = combineReducers({
    login: loginSlice,
    misc: miscSlice,
});