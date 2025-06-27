import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isAuthenticated: false,
  user: null,
  loading: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginStart: (state) => {
      state.loading = true;
    },
    loginSuccess: (state, action) => {
      state.isAuthenticated = true;
      state.user = action.payload;
      state.loading = false;
      localStorage.setItem('currentUser', JSON.stringify(action.payload));
    },
    loginFailure: (state) => {
      state.loading = false;
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      localStorage.removeItem('currentUser');
    },
    initializeAuth: (state) => {
      const storedUser = localStorage.getItem('currentUser');
      if (storedUser) {
        state.user = JSON.parse(storedUser);
        state.isAuthenticated = true;
      }
    },
  },
});

export const {
  loginStart,
  loginSuccess,
  loginFailure,
  logout,
  initializeAuth,
} = authSlice.actions;

export default authSlice.reducer;
