import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  currentAdmin: null,
  loading: false,
  error: false,
  users: []
};

const adminSlice = createSlice({
  name: "admin",
  initialState,
  reducers: {
    signInStart: (state) => {
      state.loading = true;
    },
    signInSuccess: (state, action) => {
      state.currentAdmin = action.payload;
      state.loading = false;
      state.error = null;
    },
    signInFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    signOut: (state) => {
      state.currentAdmin = null;
      state.loading = false;
      state.error = false;
    },
    resetError: (state) => {
      state.error = null;
    },
    deleteUserStart: (state) => {
      state.loading = true;
    },
    deleteUserSuccess: (state, action) => {
      state.users = state.users.filter(user => user.id !== action.payload);
      state.loading = false;
      state.error = false;
    },
    deleteUserFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    }
  },
});

export const {
  signInStart,
  signInSuccess,
  signInFailure,
  signOut,
  resetError,
  deleteUserStart,
  deleteUserSuccess,
  deleteUserFailure
} = adminSlice.actions;

export default adminSlice.reducer;