import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  currentAdmin: null,
  loading: false,
  error: false,
  users: [], 
  updateSuccess: false,
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
    fetchUserDataStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchUserDataSuccess: (state, action) => {
      state.loading = false;
      state.users = Array.isArray(action.payload) ? action.payload : []; 
      state.error = null;
    },
    fetchUserDataFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload; 
    },
    updateUserStart: (state) => {
      state.loading = true;
      state.updateSuccess = false;
    },
    updateUserSuccess: (state, action) => {
      if (Array.isArray(state.users)) {
        state.users = state.users.map(user =>
          user.id === action.payload.id ? action.payload : user
        );
      }
      state.loading = false;
      state.error = false;
      state.updateSuccess = true;
    },
    updateUserFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
      state.updateSuccess = false;
    },
    deleteUserStart: (state) => {
      state.loading = true;
    },
    deleteUserSuccess: (state, action) => {
      if (Array.isArray(state.users)) {
        state.users = state.users.filter(user => user._id !== action.payload);
      } 
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
  fetchUserDataStart,
  fetchUserDataSuccess, 
  fetchUserDataFailure,
  updateUserStart, 
  updateUserSuccess, 
  updateUserFailure,
  deleteUserStart,
  deleteUserSuccess,
  deleteUserFailure
} = adminSlice.actions;

export default adminSlice.reducer;
