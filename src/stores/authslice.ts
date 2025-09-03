import { createSlice } from '@reduxjs/toolkit';

interface User {
  id: number;
  email: string;
  username: string;
  role: string;
  profile_image: string;
  is_verified?: boolean; 
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
}

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  loading: false
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginSuccess(state, action) {
      state.user = action.payload;
      state.isAuthenticated = true;
      state.loading = false;
    },
    logout(state) {
      state.user = null;
      state.isAuthenticated = false;
      state.loading = false;
    },
    setLoading(state, action) {
      state.loading = action.payload;
    },
    updateVerificationStatus(state, action) {
      if (state.user) {
        state.user.is_verified = action.payload; 
      }
    }
  }
});

export const { loginSuccess, logout, setLoading, updateVerificationStatus } = authSlice.actions;
export default authSlice.reducer;
