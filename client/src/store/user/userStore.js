import { createSlice } from "@reduxjs/toolkit";

export const userStore = createSlice({
  name: "user",
  initialState: {
    isLoggedIn: false,
    current: null,
    token: null,
  },
  reducers: {
    register: (state, action) => {
      state.isLoggedIn = action.payload.isLoggedIn;
      state.current = action.payload.userData;
      state.token = action.payload.token;
    },
  },
});

export const { register } = userStore.actions;
export default userStore.reducer;
