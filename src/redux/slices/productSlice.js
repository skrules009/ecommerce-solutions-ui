import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  items: [],
  filteredItems: [],
  loading: false,
  error: null,
  filters: {},
  searchTerm: '',
  pagination: {
    currentPage: 1,
    totalPages: 0,
    pageSize: 12,
  },
  selectedProduct: null,
  relatedProducts: [],
  reviews: [],
};

/**
 * Apply both search term and filter criteria to the items array.
 */
function applyAllFilters(items, filters, searchTerm) {
  let result = items;

  if (searchTerm) {
    const term = searchTerm.toLowerCase();
    result = result.filter(
      (item) =>
        item.name.toLowerCase().includes(term) ||
        (item.description && item.description.toLowerCase().includes(term)) ||
        (item.category && item.category.toLowerCase().includes(term))
    );
  }

  const { category, minPrice, maxPrice, minRating, inStock } = filters;
  if (category) result = result.filter((item) => item.category === category);
  if (minPrice != null) result = result.filter((item) => item.price >= minPrice);
  if (maxPrice != null) result = result.filter((item) => item.price <= maxPrice);
  if (minRating != null) result = result.filter((item) => item.rating >= minRating);
  if (inStock) result = result.filter((item) => (item.variants?.stock ?? item.stock ?? 0) > 0);

  return result;
}

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
      state.searchTerm = '';
      state.filters = {};
      state.filteredItems = action.payload;
      state.pagination.currentPage = 1;
      state.pagination.totalPages = Math.ceil(action.payload.length / state.pagination.pageSize);
    },
    fetchProductsFailure(state, action) {
      state.loading = false;
      state.error = action.payload;
    },
    filterProducts(state, action) {
      state.filters = action.payload;
      state.filteredItems = applyAllFilters(state.items, action.payload, state.searchTerm);
      state.pagination.currentPage = 1;
      state.pagination.totalPages = Math.ceil(state.filteredItems.length / state.pagination.pageSize);
    },
    searchProducts(state, action) {
      state.searchTerm = action.payload;
      state.filteredItems = applyAllFilters(state.items, state.filters, action.payload);
      state.pagination.currentPage = 1;
      state.pagination.totalPages = Math.ceil(state.filteredItems.length / state.pagination.pageSize);
    },
    clearFilters(state) {
      state.filters = {};
      state.searchTerm = '';
      state.filteredItems = state.items;
      state.pagination.currentPage = 1;
      state.pagination.totalPages = Math.ceil(state.items.length / state.pagination.pageSize);
    },
    setPage(state, action) {
      state.pagination.currentPage = action.payload;
    },
    setSelectedProduct(state, action) {
      state.selectedProduct = action.payload;
    },
    getRelatedProducts(state, action) {
      const productId = action.payload;
      const product = state.items.find((p) => p.id === productId);
      if (product) {
        state.relatedProducts = state.items
          .filter((p) => p.category === product.category && p.id !== productId)
          .slice(0, 6);
      } else {
        state.relatedProducts = [];
      }
    },
    getProductReviews(state, action) {
      const productId = action.payload;
      const product = state.items.find((p) => p.id === productId);
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
  clearFilters,
  setPage,
  setSelectedProduct,
  getRelatedProducts,
  getProductReviews,
} = productSlice.actions;

// Selectors
export const selectProductById = (state, id) =>
  state.products.items.find((p) => p.id === Number(id));

export const selectRelatedProducts = (state) => state.products.relatedProducts;

export const selectProductReviews = (state) => state.products.reviews;

export const selectSelectedProduct = (state) => state.products.selectedProduct;

export const selectAllCategories = (state) =>
  [...new Set(state.products.items.map((p) => p.category))].sort();

export const selectPaginatedProducts = (state) => {
  const { filteredItems, pagination } = state.products;
  const { currentPage, pageSize } = pagination;
  const start = (currentPage - 1) * pageSize;
  return filteredItems.slice(start, start + pageSize);
};

export default productSlice.reducer;
