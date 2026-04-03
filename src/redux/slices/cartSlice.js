import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  items: [],
  totalPrice: 0,
  totalItems: 0,
  lastUpdated: null,
  shippingCost: 0,
  tax: 0,
};

const TAX_RATE = 0.08;
const FREE_SHIPPING_THRESHOLD = 50;
const FLAT_SHIPPING_COST = 5.99;

/**
 * Recomputes totalPrice, totalItems, shippingCost, and tax from the items array.
 * Free shipping on orders over $50; tax rate is 8%.
 */
function recalculateTotals(state) {
  state.totalPrice = state.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  state.totalItems = state.items.reduce((sum, item) => sum + item.quantity, 0);
  state.shippingCost =
    state.totalPrice >= FREE_SHIPPING_THRESHOLD || state.items.length === 0
      ? 0
      : FLAT_SHIPPING_COST;
  state.tax = parseFloat(((state.totalPrice + state.shippingCost) * TAX_RATE).toFixed(2));
}

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const item = action.payload;
      // Build a composite key so the same product in different size/colour
      // occupies separate cart entries, and identical variants are merged.
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
    removeFromCart: (state, action) => {
      // action.payload is the cartId string
      state.items = state.items.filter((item) => item.cartId !== action.payload);
      recalculateTotals(state);
      state.lastUpdated = new Date().toISOString();
    },
    updateQuantity: (state, action) => {
      const { cartId, quantity } = action.payload;
      const item = state.items.find((i) => i.cartId === cartId);
      if (item && quantity > 0) {
        item.quantity = quantity;
        recalculateTotals(state);
        state.lastUpdated = new Date().toISOString();
      }
    },
    clearCart: (state) => {
      state.items = [];
      state.totalPrice = 0;
      state.totalItems = 0;
      state.shippingCost = 0;
      state.tax = 0;
      state.lastUpdated = new Date().toISOString();
    },
  },
});

export const { addToCart, removeFromCart, updateQuantity, clearCart } = cartSlice.actions;

// Selectors
export const selectCartItems = (state) => state.cart.items;
export const selectCartItemCount = (state) => state.cart.totalItems;
export const selectCartTotal = (state) => state.cart.totalPrice;
export const selectCartShipping = (state) => state.cart.shippingCost;
export const selectCartTax = (state) => state.cart.tax;
export const selectCartGrandTotal = (state) =>
  state.cart.totalPrice + state.cart.shippingCost + state.cart.tax;

export default cartSlice.reducer;