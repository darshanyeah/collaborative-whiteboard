import { User } from "@/utils/interfaces";
import { createSlice } from "@reduxjs/toolkit";

const initialState: User = {
  _id: "",
  username: "",
  token: undefined,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    LOGIN: (state, action) => {
      state._id = action.payload._id;
      state.username = action.payload.username;
      state.token = action.payload.token;
    },

    LOGOUT: (state) => {
      state._id = "";
      state.username = "";
      state.token = undefined;
    },
  },
});

export const { LOGIN, LOGOUT } = userSlice.actions;
export default userSlice.reducer;
