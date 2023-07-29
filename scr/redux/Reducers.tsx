import { combineReducers } from "@reduxjs/toolkit";
import miscSlice from './MiscSlice';
import userDataSlice from './UserDataSlice';

export const reducers = combineReducers({
    misc: miscSlice,
    userData: userDataSlice,
});