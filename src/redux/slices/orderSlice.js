import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Initial state for orders management
const initialState = {
  items: [],
  currentOrder: null,
  loading: false,
  error: null,
  pagination: {
    currentPage: 1,
    totalPages: 1,
  },
};

// Async thunk for fetching orders
export const fetchOrders = createAsyncThunk(
  'orders/fetchOrders',
  async (page = 1, { rejectWithValue }) => {
    try {
      const response = await fetch(`/api/orders?page=${page}`);
      if (!response.ok) {
        return rejectWithValue(`Request failed with status ${response.status}`);
      }
      const data = await response.json();
      return data;
    } catch (err) {
      return rejectWithValue(err.message || 'Network error');
    }
  }
);

// Redux slice for orders management
const orderSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    createOrder: (state, action) => {
      state.items.push(action.payload);
      state.currentOrder = action.payload;
    },
    setCurrentOrder: (state, action) => {
      state.currentOrder = action.payload;
    },
    clearCurrentOrder: (state) => {
      state.currentOrder = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.orders;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      });
  },
});

// Exporting actions and reducer
export const { createOrder, setCurrentOrder, clearCurrentOrder } = orderSlice.actions;

// Selectors
export const selectOrders = (state) => state.orders.items;
export const selectCurrentOrder = (state) => state.orders.currentOrder;

export default orderSlice.reducer;