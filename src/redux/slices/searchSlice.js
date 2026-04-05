import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { searchService, handleApiError } from '../../api/services';

// ==================== ASYNC THUNKS ====================

/**
 * Search products with basic query
 */
export const searchProducts = createAsyncThunk(
  'search/products',
  async ({ query, pageNumber = 1, pageSize = 10 }, { rejectWithValue }) => {
    try {
      const response = await searchService.search({
        query,
        documentType: 'product',
        pageNumber,
        pageSize,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(handleApiError(error));
    }
  }
);

/**
 * Advanced search with filters
 */
export const advancedSearchProducts = createAsyncThunk(
  'search/advancedSearch',
  async (
    { query, filters, pageNumber = 1, pageSize = 10 },
    { rejectWithValue }
  ) => {
    try {
      const response = await searchService.advancedSearch({
        query,
        documentType: 'product',
        pageNumber,
        pageSize,
        filters,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(handleApiError(error));
    }
  }
);

/**
 * Search by document type
 */
export const searchByDocumentType = createAsyncThunk(
  'search/byType',
  async (
    { documentType, query, pageNumber = 1, pageSize = 10 },
    { rejectWithValue }
  ) => {
    try {
      const response = await searchService.searchByType(
        documentType,
        query,
        pageNumber,
        pageSize
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(handleApiError(error));
    }
  }
);

/**
 * Index a document (admin)
 */
export const indexDocument = createAsyncThunk(
  'search/indexDocument',
  async (document, { rejectWithValue }) => {
    try {
      const response = await searchService.indexDocument(document);
      return response.data;
    } catch (error) {
      return rejectWithValue(handleApiError(error));
    }
  }
);

/**
 * Bulk index documents (admin)
 */
export const bulkIndexDocuments = createAsyncThunk(
  'search/bulkIndex',
  async (documents, { rejectWithValue }) => {
    try {
      const response = await searchService.bulkIndexDocuments(documents);
      return response.data;
    } catch (error) {
      return rejectWithValue(handleApiError(error));
    }
  }
);

const initialState = {
  // Search results
  results: [],
  totalResults: 0,

  // Pagination
  pageNumber: 1,
  pageSize: 10,
  totalPages: 0,

  // Search state
  searchQuery: '',
  filters: {},
  searchType: 'product', // 'product', 'category', etc.

  // Loading/error states
  loading: false,
  error: null,
  indexing: false,
  indexError: null,

  // Last search metadata
  lastSearch: null,
  lastSearchTime: null,
};

const searchSlice = createSlice({
  name: 'search',
  initialState,
  reducers: {
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload;
      state.pageNumber = 1;
    },
    setFilters: (state, action) => {
      state.filters = action.payload;
      state.pageNumber = 1;
    },
    clearFilters: (state) => {
      state.filters = {};
      state.pageNumber = 1;
    },
    setPageNumber: (state, action) => {
      state.pageNumber = action.payload;
    },
    setSearchType: (state, action) => {
      state.searchType = action.payload;
      state.pageNumber = 1;
    },
    clearSearchResults: (state) => {
      state.results = [];
      state.searchQuery = '';
      state.filters = {};
      state.pageNumber = 1;
    },
    clearSearchError: (state) => {
      state.error = null;
    },
  },
  // ==================== EXTRA REDUCERS (Handle Async Thunks) ====================
  extraReducers: (builder) => {
    // ===== SEARCH PRODUCTS =====
    builder.addCase(searchProducts.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(searchProducts.fulfilled, (state, action) => {
      state.loading = false;
      state.results = action.payload.results || [];
      state.totalResults = action.payload.totalResults || 0;
      state.pageNumber = action.payload.pageNumber || 1;
      state.pageSize = action.payload.pageSize || 10;
      state.totalPages = Math.ceil(state.totalResults / state.pageSize);
      state.lastSearch = new Date().toISOString();
    });
    builder.addCase(searchProducts.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload?.message || 'Search failed';
    });

    // ===== ADVANCED SEARCH =====
    builder.addCase(advancedSearchProducts.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(advancedSearchProducts.fulfilled, (state, action) => {
      state.loading = false;
      state.results = action.payload.results || [];
      state.totalResults = action.payload.totalResults || 0;
      state.pageNumber = action.payload.pageNumber || 1;
      state.pageSize = action.payload.pageSize || 10;
      state.totalPages = Math.ceil(state.totalResults / state.pageSize);
      state.lastSearch = new Date().toISOString();
    });
    builder.addCase(advancedSearchProducts.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload?.message || 'Advanced search failed';
    });

    // ===== SEARCH BY TYPE =====
    builder.addCase(searchByDocumentType.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(searchByDocumentType.fulfilled, (state, action) => {
      state.loading = false;
      state.results = action.payload.results || [];
      state.totalResults = action.payload.totalResults || 0;
      state.pageNumber = action.payload.pageNumber || 1;
      state.pageSize = action.payload.pageSize || 10;
      state.totalPages = Math.ceil(state.totalResults / state.pageSize);
      state.lastSearch = new Date().toISOString();
    });
    builder.addCase(searchByDocumentType.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload?.message || 'Search by type failed';
    });

    // ===== INDEX DOCUMENT =====
    builder.addCase(indexDocument.pending, (state) => {
      state.indexing = true;
      state.indexError = null;
    });
    builder.addCase(indexDocument.fulfilled, (state) => {
      state.indexing = false;
    });
    builder.addCase(indexDocument.rejected, (state, action) => {
      state.indexing = false;
      state.indexError = action.payload?.message || 'Failed to index document';
    });

    // ===== BULK INDEX =====
    builder.addCase(bulkIndexDocuments.pending, (state) => {
      state.indexing = true;
      state.indexError = null;
    });
    builder.addCase(bulkIndexDocuments.fulfilled, (state) => {
      state.indexing = false;
    });
    builder.addCase(bulkIndexDocuments.rejected, (state, action) => {
      state.indexing = false;
      state.indexError = action.payload?.message || 'Failed to bulk index documents';
    });
  },
});

export const {
  setSearchQuery,
  setFilters,
  clearFilters,
  setPageNumber,
  setSearchType,
  clearSearchResults,
  clearSearchError,
} = searchSlice.actions;

// ==================== SELECTORS ====================

export const selectSearchResults = (state) => state.search.results;
export const selectSearchTotal = (state) => state.search.totalResults;
export const selectSearchLoading = (state) => state.search.loading;
export const selectSearchError = (state) => state.search.error;
export const selectSearchPageNumber = (state) => state.search.pageNumber;
export const selectSearchTotalPages = (state) => state.search.totalPages;
export const selectSearchFilters = (state) => state.search.filters;
export const selectSearchQuery = (state) => state.search.searchQuery;

export default searchSlice.reducer;
