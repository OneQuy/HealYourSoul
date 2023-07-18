import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

export interface LoginState {
  userID: string | null,
}

const initialState: LoginState = {
  userID: null,
}

const loginSlice = createSlice({
  name: 'login',
  initialState,
  reducers: {
    logout: (state) => {
      // Redux Toolkit allows us to write "mutating" logic in reducers. It
      // doesn't actually mutate the state because it uses the Immer library,
      // which detects changes to a "draft state" and produces a brand new
      // immutable state based off those changes
      state.userID = null
    },

    login: (state, action: PayloadAction<string>) => {
      state.userID = action.payload
    },
  },
})

export const { logout, login } = loginSlice.actions

export default loginSlice.reducer