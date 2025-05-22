import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { productsAPI } from '../services/api';

// Async thunks for products
export const fetchProducts = createAsyncThunk(
  'products/fetchProducts',
  async (params: any, { rejectWithValue }: any) => {
    try {
      const response = await productsAPI.getProducts(params);
      return response.data;
    } catch (error: any) {
      // @ts-ignore
      return rejectWithValue(error.response?.data || 'Failed to fetch products');
    }
  }
);

export const fetchProductDetails = createAsyncThunk(
  'products/fetchProductDetails',
  async (productId: any, { rejectWithValue }: any) => {
    try {
      const response = await productsAPI.getProduct(productId);
      return response.data;
    } catch (error: any) {
      // @ts-ignore
      return rejectWithValue(error.response?.data || 'Failed to fetch product details');
    }
  }
);

export const fetchCategories = createAsyncThunk(
  'products/fetchCategories',
  async (_: any, { rejectWithValue }: any) => {
    try {
      const response = await productsAPI.getCategories();
      return response.data;
    } catch (error: any) {
      // @ts-ignore
      return rejectWithValue(error.response?.data || 'Failed to fetch categories');
    }
  }
);

export const searchProducts = createAsyncThunk(
  'products/searchProducts',
  async (query: any, { rejectWithValue }: any) => {
    try {
      const response = await productsAPI.searchProducts(query);
      return response.data;
    } catch (error: any) {
      // @ts-ignore
      return rejectWithValue(error.response?.data || 'Failed to search products');
    }
  }
);

export const fetchFeaturedProducts = createAsyncThunk(
  'products/fetchFeaturedProducts',
  async (_: any, { rejectWithValue }: any) => {
    try {
      const response = await productsAPI.getFeaturedProducts();
      return response.data;
    } catch (error: any) {
      // @ts-ignore
      return rejectWithValue(error.response?.data || 'Failed to fetch featured products');
    }
  }
);

export const fetchRelatedProducts = createAsyncThunk(
  'products/fetchRelatedProducts',
  async (productId: any, { rejectWithValue }: any) => {
    try {
      const response = await productsAPI.getRelatedProducts(productId);
      return response.data;
    } catch (error: any) {
      // @ts-ignore
      return rejectWithValue(error.response?.data || 'Failed to fetch related products');
    }
  }
);

// Initial state
const initialState = {
  products: [],
  product: null,
  categories: [],
  featuredProducts: [],
  relatedProducts: [],
  searchResults: [],
  loading: false,
  error: null,
  filters: {
    category: null,
    priceRange: [0, 10000],
    sortBy: 'newest',
  },
  pagination: {
    page: 1,
    pageSize: 12,
    totalItems: 0,
    totalPages: 0,
  },
};

// Products slice
const productSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    setFilters: (state: any, action: any) => {
      state.filters = { ...state.filters, ...action.payload };
      state.pagination.page = 1; // Reset to first page when filters change
    },
    setPage: (state: any, action: any) => {
      state.pagination.page = action.payload;
    },
    clearProductDetails: (state: any) => {
      state.product = null;
    },
    clearSearchResults: (state: any) => {
      state.searchResults = [];
    },
  },
  extraReducers: (builder: any) => {
    builder
      // Fetch Products
      .addCase(fetchProducts.pending, (state: any) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state: any, action: any) => {
        state.loading = false;
        state.products = action.payload.results;
        state.pagination = {
          ...state.pagination,
          totalItems: action.payload.count,
          totalPages: Math.ceil(action.payload.count / state.pagination.pageSize),
        };
      })
      .addCase(fetchProducts.rejected, (state: any, action: any) => {
        state.loading = false;
        // @ts-ignore
        state.error = action.payload;
      })
      
      // Fetch Product Details
      .addCase(fetchProductDetails.pending, (state: any) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProductDetails.fulfilled, (state: any, action: any) => {
        state.loading = false;
        state.product = action.payload;
      })
      .addCase(fetchProductDetails.rejected, (state: any, action: any) => {
        state.loading = false;
        // @ts-ignore
        state.error = action.payload;
      })
      
      // Fetch Categories
      .addCase(fetchCategories.pending, (state: any) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCategories.fulfilled, (state: any, action: any) => {
        state.loading = false;
        state.categories = action.payload;
      })
      .addCase(fetchCategories.rejected, (state: any, action: any) => {
        state.loading = false;
        // @ts-ignore
        state.error = action.payload;
      })
      
      // Search Products
      .addCase(searchProducts.pending, (state: any) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(searchProducts.fulfilled, (state: any, action: any) => {
        state.loading = false;
        state.searchResults = action.payload.results;
      })
      .addCase(searchProducts.rejected, (state: any, action: any) => {
        state.loading = false;
        // @ts-ignore
        state.error = action.payload;
      })
      
      // Fetch Featured Products
      .addCase(fetchFeaturedProducts.pending, (state: any) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFeaturedProducts.fulfilled, (state: any, action: any) => {
        state.loading = false;
        state.featuredProducts = action.payload;
      })
      .addCase(fetchFeaturedProducts.rejected, (state: any, action: any) => {
        state.loading = false;
        // @ts-ignore
        state.error = action.payload;
      })
      
      // Fetch Related Products
      .addCase(fetchRelatedProducts.pending, (state: any) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRelatedProducts.fulfilled, (state: any, action: any) => {
        state.loading = false;
        state.relatedProducts = action.payload;
      })
      .addCase(fetchRelatedProducts.rejected, (state: any, action: any) => {
        state.loading = false;
        // @ts-ignore
        state.error = action.payload;
      });
  },
});

export const { setFilters, setPage, clearProductDetails, clearSearchResults } = productSlice.actions;

export default productSlice.reducer;

// --- Placeholders for missing exports ---
// @ts-ignore
export const setSearchQuery = () => ({ type: 'setSearchQuery' });
// @ts-ignore
export const setCategoryFilter = () => ({ type: 'setCategoryFilter' });
// @ts-ignore
export const setPriceFilter = () => ({ type: 'setPriceFilter' });
// @ts-ignore
export const setSortBy = () => ({ type: 'setSortBy' });
// @ts-ignore
export const clearFilters = () => ({ type: 'clearFilters' });
// @ts-ignore
export const selectProducts = (state: any) => state.product?.products || [];
// @ts-ignore
export const selectProductsLoading = (state: any) => state.product?.loading || false;
// @ts-ignore
export const selectProductFilters = (state: any) => state.product?.filters || {};
// @ts-ignore
export const selectProductPagination = (state: any) => state.product?.pagination || {};
// @ts-ignore
export const selectCategories = (state: any) => state.product?.categories || [];
// @ts-ignore
export const addToWishlist = () => ({ type: 'addToWishlist' });
// @ts-ignore
export const removeFromWishlist = () => ({ type: 'removeFromWishlist' });
// @ts-ignore
export const selectProductDetails = (state: any) => state.product?.product || null;
// @ts-ignore
export const selectProductLoading = (state: any) => state.product?.loading || false;
// @ts-ignore
export const selectIsInWishlist = () => false;
