import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { cartService, handleApiError } from '../../api/services';

const TAX_RATE = 0.18; // 18% GST (Indian standard)
const FREE_SHIPPING_THRESHOLD = 0; // Free shipping for all orders
const FLAT_SHIPPING_COST = 0; // Free shipping

// ==================== ASYNC THUNKS ====================

/**
 * Fetch cart by customer ID
 */
export const fetchCartByCustomerId = createAsyncThunk(
  'cart/fetchByCustomerId',
  async (customerId, { rejectWithValue }) => {
    try {
      const response = await cartService.getCartByCustomerId(customerId);
      return response.data;
    } catch (error) {
      // Handle 404 - cart might not exist yet
      if (error.response?.status === 404) {
        return { id: null, customerId, items: [], totalPrice: 0 };
      }
      return rejectWithValue(handleApiError(error));
    }
  }
);

/**
 * Create new cart for customer
 */
export const createCart = createAsyncThunk(
  'cart/create',
  async (customerId, { rejectWithValue }) => {
    try {
      const response = await cartService.createCart({ customerId });
      return response.data;
    } catch (error) {
      return rejectWithValue(handleApiError(error));
    }
  }
);

/**
 * Add item to cart
 */
export const addItemToCart = createAsyncThunk(
  'cart/addItem',
  async ({ cartId, id, productId, name, price, quantity }, { rejectWithValue, getState }) => {
    try {
      let numericCartId = cartId;
      
      // If no cartId exists, create a temporary one (will be replaced by API response)
      if (!numericCartId) {
        numericCartId = Math.floor(Math.random() * 100000); // Temporary ID
      } else {
        numericCartId = parseInt(cartId, 10);
      }
      
      if (isNaN(numericCartId)) {
        return rejectWithValue('Invalid cartId: must be an integer');
      }
      
      const response = await cartService.addItemToCart(numericCartId, {
        productId: productId || id,
        productName: name,
        productSku: '', // Add productSku if available in product data
        unitPrice: price,
        quantity: quantity || 1,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(handleApiError(error));
    }
  }
);

/**
 * Remove item from cart
 */
export const removeItemFromCart = createAsyncThunk(
  'cart/removeItem',
  async ({ cartId, cartItemId }, { rejectWithValue }) => {
    try {
      const response = await cartService.removeItemFromCart(cartId, cartItemId);
      return response.data;
    } catch (error) {
      return rejectWithValue(handleApiError(error));
    }
  }
);

/**
 * Update cart item quantity
 */
export const updateCartItem = createAsyncThunk(
  'cart/updateItem',
  async ({ cartId, cartItemId, quantity, unitPrice }, { rejectWithValue }) => {
    try {
      const response = await cartService.updateCartItem(cartId, cartItemId, {
        quantity,
        unitPrice
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(handleApiError(error));
    }
  }
);

/**
 * Clear cart
 */
export const clearCartAsync = createAsyncThunk(
  'cart/clear',
  async (cartId, { rejectWithValue }) => {
    try {
      const response = await cartService.clearCart(cartId);
      return response.data;
    } catch (error) {
      return rejectWithValue(handleApiError(error));
    }
  }
);

/**
 * Recomputes totalPrice, totalItems, shippingCost, and tax from the items array.
 * Free shipping for all orders; tax rate is 18% GST (Indian).
 * Handles both API format (unitPrice) and local format (price)
 */
function recalculateTotals(state) {
  state.totalPrice = state.items.reduce((sum, item) => {
    const price = item.totalPrice || (item.unitPrice || item.price) * item.quantity;
    return sum + price;
  }, 0);
  state.totalItems = state.items.reduce((sum, item) => sum + item.quantity, 0);
  state.shippingCost = 0; // Free shipping for all orders
  state.tax = parseFloat(((state.totalPrice + state.shippingCost) * TAX_RATE).toFixed(2));
}

const initialState = {
  id: null, // API cart ID
  items: [],
  totalPrice: 0,
  totalItems: 0,
  lastUpdated: null,
  shippingCost: 0,
  tax: 0,
  loading: false,
  error: null,
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    // Local reducers for immediate UI updates (optional, can be removed if using only API)
    addToCartLocal: (state, action) => {
      const item = action.payload;
      const cartId =
        item.cartId ||
        `${item.id}-${item.selectedSize || 'none'}-${item.selectedColor || 'none'}`;
      const existing = state.items.find((i) => i.cartId === cartId);
      if (existing) {
        existing.quantity += item.quantity || 1;
      } else {
        state.items.push({ ...item, cartId, quantity: item.quantity || 1 });
      }
      recalculateTotals(state);
      state.lastUpdated = new Date().toISOString();
    },
    removeFromCartLocal: (state, action) => {
      state.items = state.items.filter((item) => item.cartId !== action.payload);
      recalculateTotals(state);
      state.lastUpdated = new Date().toISOString();
    },
    updateQuantityLocal: (state, action) => {
      const { cartId, quantity } = action.payload;
      const item = state.items.find((i) => i.cartId === cartId);
      if (item && quantity > 0) {
        item.quantity = quantity;
        recalculateTotals(state);
        state.lastUpdated = new Date().toISOString();
      }
    },
  },
  // ==================== EXTRA REDUCERS (Handle Async Thunks) ====================
  extraReducers: (builder) => {
    // ===== FETCH CART =====
    builder.addCase(fetchCartByCustomerId.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchCartByCustomerId.fulfilled, (state, action) => {
      state.loading = false;
      state.id = action.payload.id;
      state.items = action.payload.items || [];
      // Use API totals if available, otherwise recalculate
      if (action.payload.totalPrice !== undefined && action.payload.totalItems !== undefined) {
        state.totalPrice = action.payload.totalPrice;
        state.totalItems = action.payload.totalItems;
        state.shippingCost = 0; // Free shipping
        // Tax = (Subtotal + Shipping) * TAX_RATE
        state.tax = parseFloat(((state.totalPrice + state.shippingCost) * TAX_RATE).toFixed(2));
      } else {
        recalculateTotals(state);
      }
      state.lastUpdated = new Date().toISOString();
    });
    builder.addCase(fetchCartByCustomerId.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload?.message || 'Failed to load cart';
    });

    // ===== CREATE CART =====
    builder.addCase(createCart.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(createCart.fulfilled, (state, action) => {
      state.loading = false;
      state.id = action.payload.id;
      state.items = action.payload.items || [];
      // Use API totals if available
      if (action.payload.totalPrice !== undefined) {
        state.totalPrice = action.payload.totalPrice;
        state.totalItems = action.payload.totalItems || 0;
        state.shippingCost = 0;
        // Tax = (Subtotal + Shipping) * TAX_RATE
        state.tax = parseFloat(((state.totalPrice + state.shippingCost) * TAX_RATE).toFixed(2));
      } else {
        recalculateTotals(state);
      }
    });
    builder.addCase(createCart.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload?.message || 'Failed to create cart';
    });

    // ===== ADD ITEM =====
    builder.addCase(addItemToCart.pending, (state) => {
      state.error = null;
    });
    builder.addCase(addItemToCart.fulfilled, (state, action) => {
      // Update cart ID from API response if it was null (first item added)
      if (!state.id && (action.payload.id || action.payload.cartId)) {
        state.id = action.payload.id || action.payload.cartId;
      }
      state.items = action.payload.items || [];
      // Use API totals if available
      if (action.payload.totalPrice !== undefined && action.payload.totalItems !== undefined) {
        state.totalPrice = action.payload.totalPrice;
        state.totalItems = action.payload.totalItems;
        state.shippingCost = 0;
        // Tax = (Subtotal + Shipping) * TAX_RATE
        state.tax = parseFloat(((state.totalPrice + state.shippingCost) * TAX_RATE).toFixed(2));
      } else {
        recalculateTotals(state);
      }
      state.lastUpdated = new Date().toISOString();
    });
    builder.addCase(addItemToCart.rejected, (state, action) => {
      state.error = action.payload?.message || 'Failed to add item to cart';
    });

    // ===== REMOVE ITEM =====
    builder.addCase(removeItemFromCart.pending, (state) => {
      state.error = null;
    });
    builder.addCase(removeItemFromCart.fulfilled, (state, action) => {
      state.items = action.payload.items || [];
      // Use API totals if available
      if (action.payload.totalPrice !== undefined && action.payload.totalItems !== undefined) {
        state.totalPrice = action.payload.totalPrice;
        state.totalItems = action.payload.totalItems;
        state.shippingCost = 0;
        // Tax = (Subtotal + Shipping) * TAX_RATE
        state.tax = parseFloat(((state.totalPrice + state.shippingCost) * TAX_RATE).toFixed(2));
      } else {
        recalculateTotals(state);
      }
      state.lastUpdated = new Date().toISOString();
    });
    builder.addCase(removeItemFromCart.rejected, (state, action) => {
      state.error = action.payload?.message || 'Failed to remove item';
    });

    // ===== UPDATE ITEM QUANTITY =====
    builder.addCase(updateCartItem.pending, (state) => {
      state.error = null;
    });
    builder.addCase(updateCartItem.fulfilled, (state, action) => {
      state.items = action.payload.items || [];
      // Use API totals if available
      if (action.payload.totalPrice !== undefined && action.payload.totalItems !== undefined) {
        state.totalPrice = action.payload.totalPrice;
        state.totalItems = action.payload.totalItems;
        state.shippingCost = 0;
        // Tax = (Subtotal + Shipping) * TAX_RATE
        state.tax = parseFloat(((state.totalPrice + state.shippingCost) * TAX_RATE).toFixed(2));
      } else {
        recalculateTotals(state);
      }
      state.lastUpdated = new Date().toISOString();
    });
    builder.addCase(updateCartItem.rejected, (state, action) => {
      state.error = action.payload?.message || 'Failed to update item';
    });

    // ===== CLEAR CART =====
    builder.addCase(clearCartAsync.pending, (state) => {
      state.error = null;
    });
    builder.addCase(clearCartAsync.fulfilled, (state) => {
      state.items = [];
      state.totalPrice = 0;
      state.totalItems = 0;
      state.shippingCost = 0;
      state.tax = 0;
      state.lastUpdated = new Date().toISOString();
    });
    builder.addCase(clearCartAsync.rejected, (state, action) => {
      state.error = action.payload?.message || 'Failed to clear cart';
    });
  },
});

export const { addToCartLocal, removeFromCartLocal, updateQuantityLocal } = cartSlice.actions;

// Selectors
export const selectCartItems = (state) => state.cart.items;
export const selectCartItemCount = (state) => state.cart.totalItems;
export const selectCartTotal = (state) => state.cart.totalPrice;
export const selectCartShipping = (state) => state.cart.shippingCost;
export const selectCartTax = (state) => state.cart.tax;
export const selectCartGrandTotal = (state) =>
  state.cart.totalPrice + state.cart.shippingCost + state.cart.tax;

export default cartSlice.reducer;