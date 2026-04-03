import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import productReducer from './slices/productSlice';
import cartReducer from './slices/cartSlice';
import orderReducer from './slices/orderSlice';
import checkoutReducer from './slices/checkoutSlice';
import uiReducer from './slices/uiSlice';

/**
 * Reads the persisted auth token from localStorage to hydrate the auth slice
 * on page load. Wrapped in try/catch because localStorage is unavailable in
 * private-browsing mode in some browsers.
 */
function loadAuthState() {
  try {
    const token = localStorage.getItem('token');
    if (token) {
      return { token, isAuthenticated: true, user: null, isLoading: false, error: null };
    }
  } catch (_) {
    // localStorage unavailable — use slice default
  }
  return undefined;
}

export const store = configureStore({
  reducer: {
    auth: authReducer,
    products: productReducer,
    cart: cartReducer,
    orders: orderReducer,
    checkout: checkoutReducer,
    ui: uiReducer,
  },
  preloadedState: {
    auth: loadAuthState(),
  },
});

export default store;