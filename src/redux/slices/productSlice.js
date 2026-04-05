import { createSlice, createSelector, createAsyncThunk } from '@reduxjs/toolkit';
import { productService, handleApiError } from '../../api/services';

// ==================== ASYNC THUNKS ====================

/**
 * Fetch all products from API
 */
export const fetchProducts = createAsyncThunk(
  'products/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const response = await productService.getAllProducts();
      return response.data;
    } catch (error) {
      return rejectWithValue(handleApiError(error));
    }
  }
);

/**
 * Fetch single product by ID from API
 */
export const fetchProductById = createAsyncThunk(
  'products/fetchById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await productService.getProductById(id);
      return response.data;
    } catch (error) {
      return rejectWithValue(handleApiError(error));
    }
  }
);

/**
 * Create new product (admin)
 */
export const createProduct = createAsyncThunk(
  'products/create',
  async (productData, { rejectWithValue }) => {
    try {
      const response = await productService.createProduct(productData);
      return response.data;
    } catch (error) {
      return rejectWithValue(handleApiError(error));
    }
  }
);

/**
 * Update product (admin)
 */
export const updateProduct = createAsyncThunk(
  'products/update',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await productService.updateProduct(id, data);
      return response.data;
    } catch (error) {
      return rejectWithValue(handleApiError(error));
    }
  }
);

/**
 * Delete product (admin)
 */
export const deleteProduct = createAsyncThunk(
  'products/delete',
  async (id, { rejectWithValue }) => {
    try {
      await productService.deleteProduct(id);
      return id;
    } catch (error) {
      return rejectWithValue(handleApiError(error));
    }
  }
);

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
  lastFetch: null, // Track when data was last fetched
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
  if (minRating != null) result = result.filter((item) => (item.rating ?? 0) >= minRating);
  if (inStock) result = result.filter((item) => (item.variants?.stock ?? item.stock ?? 0) > 0);

  return result;
}

const productSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
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
  // ==================== EXTRA REDUCERS (Handle Async Thunks) ====================
  extraReducers: (builder) => {
    // ===== FETCH ALL PRODUCTS =====
    builder.addCase(fetchProducts.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchProducts.fulfilled, (state, action) => {
      state.loading = false;
      state.items = action.payload;
      state.searchTerm = '';
      state.filters = {};
      state.filteredItems = action.payload;
      state.pagination.currentPage = 1;
      state.pagination.totalPages = Math.ceil(action.payload.length / state.pagination.pageSize);
      state.lastFetch = new Date().toISOString();
    });
    builder.addCase(fetchProducts.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload?.message || 'Failed to load products';
    });

    // ===== FETCH SINGLE PRODUCT =====
    builder.addCase(fetchProductById.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchProductById.fulfilled, (state, action) => {
      state.loading = false;
      state.selectedProduct = action.payload;
      // Merge into items array if not already there
      const existingIndex = state.items.findIndex((p) => p.id === action.payload.id);
      if (existingIndex >= 0) {
        state.items[existingIndex] = action.payload;
      } else {
        state.items.push(action.payload);
      }
    });
    builder.addCase(fetchProductById.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload?.message || 'Failed to load product';
    });

    // ===== CREATE PRODUCT =====
    builder.addCase(createProduct.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(createProduct.fulfilled, (state, action) => {
      state.loading = false;
      state.items.unshift(action.payload);
      state.filteredItems = applyAllFilters(state.items, state.filters, state.searchTerm);
    });
    builder.addCase(createProduct.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload?.message || 'Failed to create product';
    });

    // ===== UPDATE PRODUCT =====
    builder.addCase(updateProduct.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(updateProduct.fulfilled, (state, action) => {
      state.loading = false;
      const index = state.items.findIndex((p) => p.id === action.payload.id);
      if (index >= 0) {
        state.items[index] = action.payload;
      }
      state.filteredItems = applyAllFilters(state.items, state.filters, state.searchTerm);
    });
    builder.addCase(updateProduct.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload?.message || 'Failed to update product';
    });

    // ===== DELETE PRODUCT =====
    builder.addCase(deleteProduct.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(deleteProduct.fulfilled, (state, action) => {
      state.loading = false;
      state.items = state.items.filter((p) => p.id !== action.payload);
      state.filteredItems = applyAllFilters(state.items, state.filters, state.searchTerm);
    });
    builder.addCase(deleteProduct.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload?.message || 'Failed to delete product';
    });
  },
});

export const {
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

export const selectAllCategories = createSelector(
  (state) => state.products.items,
  (items) => [...new Set(items.map((p) => p.category))].sort()
);

export const selectPaginatedProducts = createSelector(
  (state) => state.products.filteredItems,
  (state) => state.products.pagination,
  (filteredItems, pagination) => {
    const { currentPage, pageSize } = pagination;
    const start = (currentPage - 1) * pageSize;
    return filteredItems.slice(start, start + pageSize);
  }
);

export default productSlice.reducer;
