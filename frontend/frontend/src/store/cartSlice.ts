import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { cartAPI } from '../services/api';

// Async thunks for cart
export const fetchCart = createAsyncThunk(
  'cart/fetchCart',
  async (_: any, { rejectWithValue }: any) => {
    try {
      const response = await cartAPI.getCart();
      return response.data;
    } catch (error: any) {
      // @ts-ignore
      return rejectWithValue(error.response?.data || 'Failed to fetch cart');
    }
  }
);

export const addToCart = createAsyncThunk(
  'cart/addToCart',
  async (args: any, { rejectWithValue }: any) => {
    try {
      const response = await cartAPI.addToCart(args.productId, args.quantity, args.variantId);
      return response.data;
    } catch (error: any) {
      // @ts-ignore
      return rejectWithValue(error.response?.data || 'Failed to add item to cart');
    }
  }
);

export const updateCartItem = createAsyncThunk(
  'cart/updateCartItem',
  async (args: any, { rejectWithValue }: any) => {
    try {
      const response = await cartAPI.updateCartItem(args.itemId, args.quantity);
      return response.data;
    } catch (error: any) {
      // @ts-ignore
      return rejectWithValue(error.response?.data || 'Failed to update cart item');
    }
  }
);

export const removeCartItem = createAsyncThunk(
  'cart/removeCartItem',
  async (itemId: any, { rejectWithValue }: any) => {
    try {
      await cartAPI.removeCartItem(itemId);
      return itemId;
    } catch (error: any) {
      // @ts-ignore
      return rejectWithValue(error.response?.data || 'Failed to remove cart item');
    }
  }
);

export const clearCart = createAsyncThunk(
  'cart/clearCart',
  async (_: any, { rejectWithValue }: any) => {
    try {
      await cartAPI.clearCart();
      return true;
    } catch (error: any) {
      // @ts-ignore
      return rejectWithValue(error.response?.data || 'Failed to clear cart');
    }
  }
);

// Initial state
const initialState = {
  items: [],
  subtotal: 0,
  total: 0,
  tax: 0,
  shipping: 0,
  discount: 0,
  itemCount: 0,
  loading: false,
  error: null,
};

// Cart slice
const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    calculateTotals: (state: any) => {
      state.itemCount = state.items.reduce((count: any, item: any) => count + item.quantity, 0);
      state.subtotal = state.items.reduce((sum: any, item: any) => sum + (item.price * item.quantity), 0);
      state.total = state.subtotal + state.shipping + state.tax - state.discount;
    },
    setShippingCost: (state: any, action: any) => {
      state.shipping = action.payload;
      state.total = state.subtotal + state.shipping + state.tax - state.discount;
    },
    applyDiscount: (state: any, action: any) => {
      state.discount = action.payload;
      state.total = state.subtotal + state.shipping + state.tax - state.discount;
    },
    resetCart: () => initialState,
  },
  extraReducers: (builder: any) => {
    builder
      // Fetch Cart
      .addCase(fetchCart.pending, (state: any) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCart.fulfilled, (state: any, action: any) => {
        state.loading = false;
        state.items = action.payload.items;
        state.subtotal = action.payload.subtotal;
        state.total = action.payload.total;
        state.tax = action.payload.tax;
        state.shipping = action.payload.shipping;
        state.discount = action.payload.discount;
        state.itemCount = action.payload.items.reduce((count: any, item: any) => count + item.quantity, 0);
      })
      .addCase(fetchCart.rejected, (state: any, action: any) => {
        state.loading = false;
        // @ts-ignore
        state.error = action.payload;
      })
      
      // Add to Cart
      .addCase(addToCart.pending, (state: any) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addToCart.fulfilled, (state: any, action: any) => {
        state.loading = false;
        state.items = action.payload.items;
        state.subtotal = action.payload.subtotal;
        state.total = action.payload.total;
        state.tax = action.payload.tax;
        state.shipping = action.payload.shipping;
        state.discount = action.payload.discount;
        state.itemCount = action.payload.items.reduce((count: any, item: any) => count + item.quantity, 0);
      })
      .addCase(addToCart.rejected, (state: any, action: any) => {
        state.loading = false;
        // @ts-ignore
        state.error = action.payload;
      })
      
      // Update Cart Item
      .addCase(updateCartItem.pending, (state: any) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateCartItem.fulfilled, (state: any, action: any) => {
        state.loading = false;
        state.items = action.payload.items;
        state.subtotal = action.payload.subtotal;
        state.total = action.payload.total;
        state.tax = action.payload.tax;
        state.shipping = action.payload.shipping;
        state.discount = action.payload.discount;
        state.itemCount = action.payload.items.reduce((count: any, item: any) => count + item.quantity, 0);
      })
      .addCase(updateCartItem.rejected, (state: any, action: any) => {
        state.loading = false;
        // @ts-ignore
        state.error = action.payload;
      })
      
      // Remove Cart Item
      .addCase(removeCartItem.pending, (state: any) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(removeCartItem.fulfilled, (state: any, action: any) => {
        state.loading = false;
        state.items = state.items.filter((item: any) => item.id !== action.payload);
        state.itemCount = state.items.reduce((count: any, item: any) => count + item.quantity, 0);
        state.subtotal = state.items.reduce((sum: any, item: any) => sum + (item.price * item.quantity), 0);
        state.total = state.subtotal + state.shipping + state.tax - state.discount;
      })
      .addCase(removeCartItem.rejected, (state: any, action: any) => {
        state.loading = false;
        // @ts-ignore
        state.error = action.payload;
      })
      
      // Clear Cart
      .addCase(clearCart.pending, (state: any) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(clearCart.fulfilled, (state: any) => {
        state.loading = false;
        state.items = [];
        state.subtotal = 0;
        state.total = 0;
        state.tax = 0;
        state.discount = 0;
        state.itemCount = 0;
      })
      .addCase(clearCart.rejected, (state: any, action: any) => {
        state.loading = false;
        // @ts-ignore
        state.error = action.payload;
      });
  },
});

export const { calculateTotals, setShippingCost, applyDiscount, resetCart } = cartSlice.actions;

export default cartSlice.reducer;

// --- Placeholders for missing exports ---
// @ts-ignore
export const removeFromCart = () => ({ type: 'removeFromCart' });
// @ts-ignore
export const updateCartItemQuantity = () => ({ type: 'updateCartItemQuantity' });
// @ts-ignore
export const selectCartItems = (state: any) => state.cart?.items || [];
// @ts-ignore
export const selectCartTotal = (state: any) => state.cart?.total || 0;
// @ts-ignore
export const selectCartItemsCount = (state: any) => (state.cart?.items?.length ?? 0);
