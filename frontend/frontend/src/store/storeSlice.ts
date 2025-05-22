import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import { RootState } from './index';

// Types
export interface Store {
  id: number;
  owner_id: number;
  name_en: string;
  name_ar: string;
  description_en: string;
  description_ar: string;
  logo: string | null;
  banner: string | null;
  currency: string;
  country: string;
  city: string;
  address: string;
  phone: string;
  email: string;
  website: string | null;
  social_media: SocialMedia;
  business_hours: BusinessHours;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  subscription: Subscription | null;
  theme: StoreTheme;
}

export interface SocialMedia {
  facebook?: string;
  instagram?: string;
  twitter?: string;
  youtube?: string;
  tiktok?: string;
}

export interface BusinessHours {
  monday: DayHours;
  tuesday: DayHours;
  wednesday: DayHours;
  thursday: DayHours;
  friday: DayHours;
  saturday: DayHours;
  sunday: DayHours;
}

export interface DayHours {
  is_open: boolean;
  open_time: string;
  close_time: string;
}

export interface Subscription {
  id: number;
  store_id: number;
  plan: SubscriptionPlan;
  status: SubscriptionStatus;
  start_date: string;
  end_date: string;
  next_billing_date: string;
  payment_method: string;
  created_at: string;
  updated_at: string;
}

export enum SubscriptionStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  CANCELLED = 'cancelled',
  EXPIRED = 'expired',
  TRIAL = 'trial'
}

export interface SubscriptionPlan {
  id: number;
  name: string;
  description: string;
  price: number;
  billing_cycle: 'monthly' | 'yearly';
  features: string[];
  product_limit: number;
  staff_limit: number;
  warehouse_limit: number;
  is_active: boolean;
}

export interface StoreTheme {
  id: number;
  store_id: number;
  theme_name: string;
  primary_color: string;
  secondary_color: string;
  accent_color: string;
  font_family: string;
  logo_position: 'left' | 'center' | 'right';
  is_dark_mode: boolean;
  custom_css: string | null;
  created_at: string;
  updated_at: string;
}

export interface StoreState {
  currentStore: Store | null;
  storeList: Store[];
  isLoading: boolean;
  error: string | null;
}

// Initial state
const initialState: StoreState = {
  currentStore: null,
  storeList: [],
  isLoading: false,
  error: null,
};

// Async thunks
export const fetchCurrentStore = createAsyncThunk(
  'store/fetchCurrentStore',
  async (_, { getState, rejectWithValue }) => {
    try {
      const state = getState() as RootState;
      const token = state.auth.token;
      
      if (!token) {
        return rejectWithValue('Authentication required');
      }
      
      const response = await axios.get('/api/stores/current/', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.detail || 'Failed to fetch current store');
    }
  }
);

export const fetchStoreById = createAsyncThunk(
  'store/fetchStoreById',
  async (storeId: number, { rejectWithValue }) => {
    try {
      const response = await axios.get(`/api/stores/${storeId}/`);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.detail || 'Failed to fetch store');
    }
  }
);

export const updateStore = createAsyncThunk(
  'store/updateStore',
  async (storeData: Partial<Store>, { getState, rejectWithValue }) => {
    try {
      const state = getState() as RootState;
      const token = state.auth.token;
      const storeId = state.store.currentStore?.id;
      
      if (!token) {
        return rejectWithValue('Authentication required');
      }
      
      if (!storeId) {
        return rejectWithValue('No store selected');
      }
      
      const response = await axios.patch(`/api/stores/${storeId}/`, storeData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.detail || 'Failed to update store');
    }
  }
);

export const updateStoreTheme = createAsyncThunk(
  'store/updateStoreTheme',
  async (themeData: Partial<StoreTheme>, { getState, rejectWithValue }) => {
    try {
      const state = getState() as RootState;
      const token = state.auth.token;
      const storeId = state.store.currentStore?.id;
      const themeId = state.store.currentStore?.theme?.id;
      
      if (!token) {
        return rejectWithValue('Authentication required');
      }
      
      if (!storeId || !themeId) {
        return rejectWithValue('No store or theme selected');
      }
      
      const response = await axios.patch(`/api/stores/${storeId}/theme/${themeId}/`, themeData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.detail || 'Failed to update store theme');
    }
  }
);

// Slice
export const storeSlice = createSlice({
  name: 'store',
  initialState,
  reducers: {
    clearStoreData: (state) => {
      state.currentStore = null;
      state.storeList = [];
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch current store
      .addCase(fetchCurrentStore.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchCurrentStore.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentStore = action.payload;
      })
      .addCase(fetchCurrentStore.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      
      // Fetch store by ID
      .addCase(fetchStoreById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchStoreById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentStore = action.payload;
      })
      .addCase(fetchStoreById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      
      // Update store
      .addCase(updateStore.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateStore.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentStore = action.payload;
      })
      .addCase(updateStore.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      
      // Update store theme
      .addCase(updateStoreTheme.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateStoreTheme.fulfilled, (state, action) => {
        state.isLoading = false;
        if (state.currentStore) {
          state.currentStore.theme = action.payload;
        }
      })
      .addCase(updateStoreTheme.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearStoreData } = storeSlice.actions;

export const selectCurrentStore = (state: RootState) => state.store.currentStore;
export const selectStoreList = (state: RootState) => state.store.storeList;
export const selectStoreLoading = (state: RootState) => state.store.isLoading;
export const selectStoreError = (state: RootState) => state.store.error;

export default storeSlice.reducer;
