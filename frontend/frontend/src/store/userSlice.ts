import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import { RootState } from './index';

// Types
export interface User {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  phone_number: string;
  is_store_owner: boolean;
  is_staff: boolean;
  is_superuser: boolean;
  addresses: Address[];
  payment_methods: PaymentMethod[];
  created_at: string;
  updated_at: string;
}

export interface Address {
  id: number;
  user_id: number;
  first_name: string;
  last_name: string;
  address_line1: string;
  address_line2: string | null;
  city: string;
  state: string;
  postal_code: string;
  country: string;
  phone: string;
  is_default: boolean;
  created_at: string;
  updated_at: string;
}

export interface PaymentMethod {
  id: number;
  user_id: number;
  provider: string;
  last_four: string;
  expiry_month: string;
  expiry_year: string;
  card_type: string;
  is_default: boolean;
  created_at: string;
  updated_at: string;
}

export interface UserState {
  profile: User | null;
  addresses: Address[];
  paymentMethods: PaymentMethod[];
  isLoading: boolean;
  error: string | null;
}

// Initial state
const initialState: UserState = {
  profile: null,
  addresses: [],
  paymentMethods: [],
  isLoading: false,
  error: null,
};

// Async thunks
export const fetchUserProfile = createAsyncThunk(
  'user/fetchUserProfile',
  async (_, { getState, rejectWithValue }) => {
    try {
      const state = getState() as RootState;
      const token = state.auth.token;
      
      if (!token) {
        return rejectWithValue('Authentication required');
      }
      
      const response = await axios.get('/api/users/me/', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.detail || 'Failed to fetch user profile');
    }
  }
);

export const updateUserProfile = createAsyncThunk(
  'user/updateUserProfile',
  async (userData: Partial<User>, { getState, rejectWithValue }) => {
    try {
      const state = getState() as RootState;
      const token = state.auth.token;
      
      if (!token) {
        return rejectWithValue('Authentication required');
      }
      
      const response = await axios.patch('/api/users/me/', userData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.detail || 'Failed to update user profile');
    }
  }
);

export const fetchUserAddresses = createAsyncThunk(
  'user/fetchUserAddresses',
  async (_, { getState, rejectWithValue }) => {
    try {
      const state = getState() as RootState;
      const token = state.auth.token;
      
      if (!token) {
        return rejectWithValue('Authentication required');
      }
      
      const response = await axios.get('/api/users/addresses/', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.detail || 'Failed to fetch user addresses');
    }
  }
);

export const addUserAddress = createAsyncThunk(
  'user/addUserAddress',
  async (addressData: Omit<Address, 'id' | 'user_id' | 'created_at' | 'updated_at'>, { getState, rejectWithValue }) => {
    try {
      const state = getState() as RootState;
      const token = state.auth.token;
      
      if (!token) {
        return rejectWithValue('Authentication required');
      }
      
      const response = await axios.post('/api/users/addresses/', addressData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.detail || 'Failed to add user address');
    }
  }
);

export const updateUserAddress = createAsyncThunk(
  'user/updateUserAddress',
  async ({ addressId, addressData }: { addressId: number; addressData: Partial<Address> }, { getState, rejectWithValue }) => {
    try {
      const state = getState() as RootState;
      const token = state.auth.token;
      
      if (!token) {
        return rejectWithValue('Authentication required');
      }
      
      const response = await axios.patch(`/api/users/addresses/${addressId}/`, addressData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.detail || 'Failed to update user address');
    }
  }
);

export const deleteUserAddress = createAsyncThunk(
  'user/deleteUserAddress',
  async (addressId: number, { getState, rejectWithValue }) => {
    try {
      const state = getState() as RootState;
      const token = state.auth.token;
      
      if (!token) {
        return rejectWithValue('Authentication required');
      }
      
      await axios.delete(`/api/users/addresses/${addressId}/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      return addressId;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.detail || 'Failed to delete user address');
    }
  }
);

export const fetchUserPaymentMethods = createAsyncThunk(
  'user/fetchUserPaymentMethods',
  async (_, { getState, rejectWithValue }) => {
    try {
      const state = getState() as RootState;
      const token = state.auth.token;
      
      if (!token) {
        return rejectWithValue('Authentication required');
      }
      
      const response = await axios.get('/api/users/payment-methods/', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.detail || 'Failed to fetch user payment methods');
    }
  }
);

// Slice
export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    clearUserData: (state) => {
      state.profile = null;
      state.addresses = [];
      state.paymentMethods = [];
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch user profile
      .addCase(fetchUserProfile.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.profile = action.payload;
      })
      .addCase(fetchUserProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      
      // Update user profile
      .addCase(updateUserProfile.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.profile = action.payload;
      })
      .addCase(updateUserProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      
      // Fetch user addresses
      .addCase(fetchUserAddresses.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchUserAddresses.fulfilled, (state, action) => {
        state.isLoading = false;
        state.addresses = action.payload;
      })
      .addCase(fetchUserAddresses.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      
      // Add user address
      .addCase(addUserAddress.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(addUserAddress.fulfilled, (state, action) => {
        state.isLoading = false;
        state.addresses.push(action.payload);
        
        // If this is the default address, update other addresses
        if (action.payload.is_default) {
          state.addresses.forEach(address => {
            if (address.id !== action.payload.id) {
              address.is_default = false;
            }
          });
        }
      })
      .addCase(addUserAddress.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      
      // Update user address
      .addCase(updateUserAddress.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateUserAddress.fulfilled, (state, action) => {
        state.isLoading = false;
        const index = state.addresses.findIndex(address => address.id === action.payload.id);
        if (index !== -1) {
          state.addresses[index] = action.payload;
        }
        
        // If this is the default address, update other addresses
        if (action.payload.is_default) {
          state.addresses.forEach(address => {
            if (address.id !== action.payload.id) {
              address.is_default = false;
            }
          });
        }
      })
      .addCase(updateUserAddress.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      
      // Delete user address
      .addCase(deleteUserAddress.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteUserAddress.fulfilled, (state, action) => {
        state.isLoading = false;
        state.addresses = state.addresses.filter(address => address.id !== action.payload);
      })
      .addCase(deleteUserAddress.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      
      // Fetch user payment methods
      .addCase(fetchUserPaymentMethods.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchUserPaymentMethods.fulfilled, (state, action) => {
        state.isLoading = false;
        state.paymentMethods = action.payload;
      })
      .addCase(fetchUserPaymentMethods.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearUserData } = userSlice.actions;

export const selectUserProfile = (state: RootState) => state.user.profile;
export const selectUserAddresses = (state: RootState) => state.user.addresses;
export const selectDefaultAddress = (state: RootState) => 
  state.user.addresses.find(address => address.is_default) || state.user.addresses[0];
export const selectUserPaymentMethods = (state: RootState) => state.user.paymentMethods;
export const selectDefaultPaymentMethod = (state: RootState) => 
  state.user.paymentMethods.find(method => method.is_default) || state.user.paymentMethods[0];
export const selectUserLoading = (state: RootState) => state.user.isLoading;
export const selectUserError = (state: RootState) => state.user.error;

export default userSlice.reducer;
