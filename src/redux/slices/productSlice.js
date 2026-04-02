import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  items: [],
  filteredItems: [],
  loading: false,
  error: null,
  filters: {},
  pagination: {
    currentPage: 1,
    totalPages: 0,
  },
};

const productSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    fetchProductsStart(state) {
      state.loading = true;
      state.error = null;
    },
    fetchProductsSuccess(state, action) {
      state.loading = false;
      state.items = action.payload;
      state.filteredItems = action.payload;
      // Update pagination based on fetched items
      state.pagination.totalPages = Math.ceil(action.payload.length / state.pagination.pageSize);
    },
    fetchProductsFailure(state, action) {
      state.loading = false;
      state.error = action.payload;
    },
    filterProducts(state, action) {
      state.filters = action.payload;
      // Implement filtering logic based on filters
      state.filteredItems = state.items.filter(item => {
        // Apply your filter logic here
        return true;
      });
    },
    searchProducts(state, action) {
      const searchTerm = action.payload.toLowerCase();
      state.filteredItems = state.items.filter(item =>
        item.name.toLowerCase().includes(searchTerm)
      );
    },
    setSelectedProduct(state, action) {
      state.selectedProduct = action.payload;
    },
  },
});

export const {
  fetchProductsStart,
  fetchProductsSuccess,
  fetchProductsFailure,
  filterProducts,
  searchProducts,
  setSelectedProduct,
} = productSlice.actions;

export default productSlice.reducer;
