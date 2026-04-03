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
    pageSize: 12,
  },
  selectedProduct: null,
  relatedProducts: [],
  reviews: [],
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
      state.pagination.totalPages = Math.ceil(action.payload.length / state.pagination.pageSize);
    },
    fetchProductsFailure(state, action) {
      state.loading = false;
      state.error = action.payload;
    },
    filterProducts(state, action) {
      state.filters = action.payload;
      state.filteredItems = state.items.filter(() => true);
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
    getRelatedProducts(state, action) {
      const productId = action.payload;
      const product = state.items.find(p => p.id === productId);
      if (product) {
        state.relatedProducts = state.items
          .filter(p => p.category === product.category && p.id !== productId)
          .slice(0, 6);
      } else {
        state.relatedProducts = [];
      }
    },
    getProductReviews(state, action) {
      const productId = action.payload;
      const product = state.items.find(p => p.id === productId);
      state.reviews = product ? (product.reviews || []) : [];
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
  getRelatedProducts,
  getProductReviews,
} = productSlice.actions;

// Selectors
export const selectProductById = (state, id) =>
  state.products.items.find(p => p.id === Number(id));

export const selectRelatedProducts = (state) =>
  state.products.relatedProducts;

export const selectProductReviews = (state) =>
  state.products.reviews;

export const selectSelectedProduct = (state) =>
  state.products.selectedProduct;

export default productSlice.reducer;
