import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AuthState {
  coordinatorEmail: string;
  isAdmin: boolean;
  isAuthenticated: boolean;
}

const initialState: AuthState = {
  coordinatorEmail: '',
  isAdmin: false,
  isAuthenticated: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAuth: (state, action: PayloadAction<{ email: string; isAdmin: boolean }>) => {
      state.coordinatorEmail = action.payload.email;
      state.isAdmin = action.payload.isAdmin;
      state.isAuthenticated = true;
    },
    logout: (state) => {
      state.coordinatorEmail = '';
      state.isAdmin = false;
      state.isAuthenticated = false;
    },
  },
});

export const { setAuth, logout } = authSlice.actions;
export default authSlice.reducer;