import { combineReducers } from "@reduxjs/toolkit";
import loginSlice from "./LoginSlice";

export const reducers = combineReducers({
    login: loginSlice,
});