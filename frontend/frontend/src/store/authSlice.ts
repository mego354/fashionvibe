import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { authAPI } from '../services/api';

// Async thunks for authentication
export const loginUser = createAsyncThunk(
  'auth/login',
  async (args: any, { rejectWithValue }: any) => {
    try {
      const response = await authAPI.login(args.email, args.password);
      localStorage.setItem('token', response.data.token);
      return response.data;
    } catch (error: any) {
      // @ts-ignore
      return rejectWithValue(error.response?.data || 'Login failed');
    }
  }
);

export const registerUser = createAsyncThunk(
  'auth/register',
  async (userData: any, { rejectWithValue }: any) => {
    try {
      const response = await authAPI.register(userData);
      return response.data;
    } catch (error: any) {
      // @ts-ignore
      return rejectWithValue(error.response?.data || 'Registration failed');
    }
  }
);

export const fetchUserProfile = createAsyncThunk(
  'auth/fetchProfile',
  async (_: any, { rejectWithValue }: any) => {
    try {
      const response = await authAPI.getProfile();
      return response.data;
    } catch (error: any) {
      // @ts-ignore
      return rejectWithValue(error.response?.data || 'Failed to fetch profile');
    }
  }
);

export const updateUserProfile = createAsyncThunk(
  'auth/updateProfile',
  async (userData: any, { rejectWithValue }: any) => {
    try {
      const response = await authAPI.updateProfile(userData);
      return response.data;
    } catch (error: any) {
      // @ts-ignore
      return rejectWithValue(error.response?.data || 'Failed to update profile');
    }
  }
);

// Initial state
const initialState = {
  user: null,
  isAuthenticated: false,
  loading: false,
  error: null,
  registrationSuccess: false,
};

// Auth slice
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser: (state: any, action: any) => {
      state.user = action.payload;
      state.isAuthenticated = true;
    },
    clearUser: (state: any) => {
      state.user = null;
      state.isAuthenticated = false;
      localStorage.removeItem('token');
    },
    clearError: (state: any) => {
      state.error = null;
    },
    resetRegistrationSuccess: (state: any) => {
      state.registrationSuccess = false;
    },
  },
  extraReducers: (builder: any) => {
    builder
      // Login
      .addCase(loginUser.pending, (state: any) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state: any, action: any) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
      })
      .addCase(loginUser.rejected, (state: any, action: any) => {
        state.loading = false;
        // @ts-ignore
        state.error = action.payload;
      })
      
      // Register
      .addCase(registerUser.pending, (state: any) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state: any) => {
        state.loading = false;
        state.registrationSuccess = true;
      })
      .addCase(registerUser.rejected, (state: any, action: any) => {
        state.loading = false;
        // @ts-ignore
        state.error = action.payload;
      })
      
      // Fetch Profile
      .addCase(fetchUserProfile.pending, (state: any) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserProfile.fulfilled, (state: any, action: any) => {
        state.loading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(fetchUserProfile.rejected, (state: any, action: any) => {
        state.loading = false;
        // @ts-ignore
        state.error = action.payload;
        state.isAuthenticated = false;
        state.user = null;
      })
      
      // Update Profile
      .addCase(updateUserProfile.pending, (state: any) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateUserProfile.fulfilled, (state: any, action: any) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(updateUserProfile.rejected, (state: any, action: any) => {
        state.loading = false;
        // @ts-ignore
        state.error = action.payload;
      });
  },
});

export const { setUser, clearUser, clearError, resetRegistrationSuccess } = authSlice.actions;

export default authSlice.reducer;

// --- Placeholders for missing exports ---
// @ts-ignore
export const selectIsAuthenticated = (state: any) => state.auth?.isAuthenticated || false;
// @ts-ignore
export const logout = () => ({ type: 'logout' });
