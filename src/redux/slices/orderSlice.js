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
export const fetchOrders = createAsyncThunk('orders/fetchOrders', async (page = 1) => {
  const response = await fetch(`/api/orders?page=${page}`);
  const data = await response.json();
  return data;
});

// Redux slice for orders management
const orderSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    createOrder: (state, action) => {
      state.items.push(action.payload);
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
        state.error = action.error.message;
      });
  },
});

// Exporting actions and reducer
export const { createOrder, setCurrentOrder, clearCurrentOrder } = orderSlice.actions;
export default orderSlice.reducer;