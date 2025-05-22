import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import { RootState } from './index';

// Types
export interface AnalyticsData {
  sales: SalesData;
  customers: CustomerData;
  products: ProductData;
  orders: OrderData;
}

export interface SalesData {
  total: number;
  today: number;
  week: number;
  month: number;
  year: number;
  chart: ChartData;
}

export interface CustomerData {
  total: number;
  new: number;
  returning: number;
  chart: ChartData;
}

export interface ProductData {
  total: number;
  top: TopProduct[];
  categories: CategoryData[];
}

export interface OrderData {
  total: number;
  pending: number;
  processing: number;
  shipped: number;
  delivered: number;
  cancelled: number;
  returned: number;
  chart: ChartData;
}

export interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor?: string;
    borderColor?: string;
  }[];
}

export interface TopProduct {
  id: number;
  name: string;
  sku: string;
  quantity: number;
  revenue: number;
}

export interface CategoryData {
  id: number;
  name: string;
  count: number;
  percentage: number;
}

export interface AnalyticsState {
  data: AnalyticsData | null;
  isLoading: boolean;
  error: string | null;
  dateRange: {
    start: string;
    end: string;
  };
}

// Initial state
const initialState: AnalyticsState = {
  data: null,
  isLoading: false,
  error: null,
  dateRange: {
    start: new Date(new Date().setDate(new Date().getDate() - 30)).toISOString().split('T')[0], // 30 days ago
    end: new Date().toISOString().split('T')[0], // today
  },
};

// Async thunks
export const fetchAnalytics = createAsyncThunk(
  'analytics/fetchAnalytics',
  async (_, { getState, rejectWithValue }) => {
    try {
      const state = getState() as RootState;
      const token = state.auth.token;
      const { start, end } = state.analytics.dateRange;
      
      if (!token) {
        return rejectWithValue('Authentication required');
      }
      
      const response = await axios.get('/api/analytics/', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          start_date: start,
          end_date: end,
        },
      });
      
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.detail || 'Failed to fetch analytics data');
    }
  }
);

export const fetchSalesAnalytics = createAsyncThunk(
  'analytics/fetchSalesAnalytics',
  async (_, { getState, rejectWithValue }) => {
    try {
      const state = getState() as RootState;
      const token = state.auth.token;
      const { start, end } = state.analytics.dateRange;
      
      if (!token) {
        return rejectWithValue('Authentication required');
      }
      
      const response = await axios.get('/api/analytics/sales/', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          start_date: start,
          end_date: end,
        },
      });
      
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.detail || 'Failed to fetch sales analytics');
    }
  }
);

export const fetchCustomerAnalytics = createAsyncThunk(
  'analytics/fetchCustomerAnalytics',
  async (_, { getState, rejectWithValue }) => {
    try {
      const state = getState() as RootState;
      const token = state.auth.token;
      const { start, end } = state.analytics.dateRange;
      
      if (!token) {
        return rejectWithValue('Authentication required');
      }
      
      const response = await axios.get('/api/analytics/customers/', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          start_date: start,
          end_date: end,
        },
      });
      
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.detail || 'Failed to fetch customer analytics');
    }
  }
);

export const fetchProductAnalytics = createAsyncThunk(
  'analytics/fetchProductAnalytics',
  async (_, { getState, rejectWithValue }) => {
    try {
      const state = getState() as RootState;
      const token = state.auth.token;
      const { start, end } = state.analytics.dateRange;
      
      if (!token) {
        return rejectWithValue('Authentication required');
      }
      
      const response = await axios.get('/api/analytics/products/', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          start_date: start,
          end_date: end,
        },
      });
      
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.detail || 'Failed to fetch product analytics');
    }
  }
);

export const fetchOrderAnalytics = createAsyncThunk(
  'analytics/fetchOrderAnalytics',
  async (_, { getState, rejectWithValue }) => {
    try {
      const state = getState() as RootState;
      const token = state.auth.token;
      const { start, end } = state.analytics.dateRange;
      
      if (!token) {
        return rejectWithValue('Authentication required');
      }
      
      const response = await axios.get('/api/analytics/orders/', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          start_date: start,
          end_date: end,
        },
      });
      
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.detail || 'Failed to fetch order analytics');
    }
  }
);

// Slice
export const analyticsSlice = createSlice({
  name: 'analytics',
  initialState,
  reducers: {
    setDateRange: (state, action: PayloadAction<{ start: string; end: string }>) => {
      state.dateRange = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch all analytics
      .addCase(fetchAnalytics.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchAnalytics.fulfilled, (state, action) => {
        state.isLoading = false;
        state.data = action.payload;
      })
      .addCase(fetchAnalytics.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      
      // Fetch sales analytics
      .addCase(fetchSalesAnalytics.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchSalesAnalytics.fulfilled, (state, action) => {
        state.isLoading = false;
        if (state.data) {
          state.data.sales = action.payload;
        } else {
          state.data = {
            sales: action.payload,
            customers: {} as CustomerData,
            products: {} as ProductData,
            orders: {} as OrderData,
          };
        }
      })
      .addCase(fetchSalesAnalytics.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      
      // Fetch customer analytics
      .addCase(fetchCustomerAnalytics.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchCustomerAnalytics.fulfilled, (state, action) => {
        state.isLoading = false;
        if (state.data) {
          state.data.customers = action.payload;
        } else {
          state.data = {
            sales: {} as SalesData,
            customers: action.payload,
            products: {} as ProductData,
            orders: {} as OrderData,
          };
        }
      })
      .addCase(fetchCustomerAnalytics.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      
      // Fetch product analytics
      .addCase(fetchProductAnalytics.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchProductAnalytics.fulfilled, (state, action) => {
        state.isLoading = false;
        if (state.data) {
          state.data.products = action.payload;
        } else {
          state.data = {
            sales: {} as SalesData,
            customers: {} as CustomerData,
            products: action.payload,
            orders: {} as OrderData,
          };
        }
      })
      .addCase(fetchProductAnalytics.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      
      // Fetch order analytics
      .addCase(fetchOrderAnalytics.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchOrderAnalytics.fulfilled, (state, action) => {
        state.isLoading = false;
        if (state.data) {
          state.data.orders = action.payload;
        } else {
          state.data = {
            sales: {} as SalesData,
            customers: {} as CustomerData,
            products: {} as ProductData,
            orders: action.payload,
          };
        }
      })
      .addCase(fetchOrderAnalytics.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { setDateRange } = analyticsSlice.actions;

export const selectAnalyticsData = (state: RootState) => state.analytics.data;
export const selectSalesData = (state: RootState) => state.analytics.data?.sales;
export const selectCustomerData = (state: RootState) => state.analytics.data?.customers;
export const selectProductData = (state: RootState) => state.analytics.data?.products;
export const selectOrderData = (state: RootState) => state.analytics.data?.orders;
export const selectAnalyticsLoading = (state: RootState) => state.analytics.isLoading;
export const selectAnalyticsError = (state: RootState) => state.analytics.error;
export const selectAnalyticsDateRange = (state: RootState) => state.analytics.dateRange;

export default analyticsSlice.reducer;
