import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { inventoryService, handleApiError } from '../../api/services';

// ==================== ASYNC THUNKS ====================

/**
 * Check inventory for a product
 */
export const checkInventory = createAsyncThunk(
  'inventory/check',
  async (productId, { rejectWithValue }) => {
    try {
      const response = await inventoryService.getInventoryByProductId(productId);
      return response.data;
    } catch (error) {
      return rejectWithValue(handleApiError(error));
    }
  }
);

/**
 * Get inventory by SKU
 */
export const checkInventoryBySku = createAsyncThunk(
  'inventory/checkBySku',
  async (sku, { rejectWithValue }) => {
    try {
      const response = await inventoryService.getInventoryBySku(sku);
      return response.data;
    } catch (error) {
      return rejectWithValue(handleApiError(error));
    }
  }
);

/**
 * Get all low stock items
 */
export const fetchLowStockItems = createAsyncThunk(
  'inventory/fetchLowStock',
  async (_, { rejectWithValue }) => {
    try {
      const response = await inventoryService.getLowStockInventories();
      return response.data;
    } catch (error) {
      return rejectWithValue(handleApiError(error));
    }
  }
);

/**
 * Get inventory by warehouse
 */
export const fetchInventoriesByWarehouse = createAsyncThunk(
  'inventory/fetchByWarehouse',
  async (warehouse, { rejectWithValue }) => {
    try {
      const response = await inventoryService.getInventoriesByWarehouse(warehouse);
      return response.data;
    } catch (error) {
      return rejectWithValue(handleApiError(error));
    }
  }
);

/**
 * Adjust inventory quantity (admin)
 */
export const adjustInventoryQuantity = createAsyncThunk(
  'inventory/adjust',
  async ({ inventoryId, quantity, transactionType }, { rejectWithValue }) => {
    try {
      const response = await inventoryService.adjustQuantity(inventoryId, {
        quantity,
        transactionType,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(handleApiError(error));
    }
  }
);

/**
 * Add inventory transaction (admin)
 */
export const addInventoryTransaction = createAsyncThunk(
  'inventory/addTransaction',
  async ({ inventoryId, quantity, transactionType, notes }, { rejectWithValue }) => {
    try {
      const response = await inventoryService.addTransaction(inventoryId, {
        quantity,
        transactionType,
        notes,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(handleApiError(error));
    }
  }
);

/**
 * Get inventory transactions
 */
export const fetchInventoryTransactions = createAsyncThunk(
  'inventory/fetchTransactions',
  async (inventoryId, { rejectWithValue }) => {
    try {
      const response = await inventoryService.getTransactions(inventoryId);
      return response.data;
    } catch (error) {
      return rejectWithValue(handleApiError(error));
    }
  }
);

const initialState = {
  // Inventory cache by product ID
  inventories: {}, // { productId: inventoryData }

  // Low stock items
  lowStockItems: [],
  lowStockLoading: false,
  lowStockError: null,

  // Warehouse inventory
  warehouseInventory: [],
  warehouseLoading: false,
  warehouseError: null,

  // Current inventory transactions
  currentTransactions: [],
  transactionsLoading: false,
  transactionsError: null,

  // General loading/error
  loading: false,
  error: null,

  // Cache metadata
  lastFetch: {},
};

const inventorySlice = createSlice({
  name: 'inventory',
  initialState,
  reducers: {
    clearInventoryError: (state) => {
      state.error = null;
    },
    clearInventoryCache: (state) => {
      state.inventories = {};
      state.lastFetch = {};
    },
  },
  // ==================== EXTRA REDUCERS (Handle Async Thunks) ====================
  extraReducers: (builder) => {
    // ===== CHECK INVENTORY =====
    builder.addCase(checkInventory.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(checkInventory.fulfilled, (state, action) => {
      state.loading = false;
      const productId = action.meta.arg;
      state.inventories[productId] = action.payload;
      state.lastFetch[productId] = new Date().toISOString();
    });
    builder.addCase(checkInventory.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload?.message || 'Failed to check inventory';
    });

    // ===== CHECK INVENTORY BY SKU =====
    builder.addCase(checkInventoryBySku.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(checkInventoryBySku.fulfilled, (state, action) => {
      state.loading = false;
      // Store by SKU as well
      if (action.payload.productSku) {
        state.inventories[action.payload.productSku] = action.payload;
      }
    });
    builder.addCase(checkInventoryBySku.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload?.message || 'Failed to check inventory by SKU';
    });

    // ===== FETCH LOW STOCK =====
    builder.addCase(fetchLowStockItems.pending, (state) => {
      state.lowStockLoading = true;
      state.lowStockError = null;
    });
    builder.addCase(fetchLowStockItems.fulfilled, (state, action) => {
      state.lowStockLoading = false;
      state.lowStockItems = action.payload;
    });
    builder.addCase(fetchLowStockItems.rejected, (state, action) => {
      state.lowStockLoading = false;
      state.lowStockError = action.payload?.message || 'Failed to fetch low stock items';
    });

    // ===== FETCH BY WAREHOUSE =====
    builder.addCase(fetchInventoriesByWarehouse.pending, (state) => {
      state.warehouseLoading = true;
      state.warehouseError = null;
    });
    builder.addCase(fetchInventoriesByWarehouse.fulfilled, (state, action) => {
      state.warehouseLoading = false;
      state.warehouseInventory = action.payload;
    });
    builder.addCase(fetchInventoriesByWarehouse.rejected, (state, action) => {
      state.warehouseLoading = false;
      state.warehouseError = action.payload?.message || 'Failed to fetch warehouse inventory';
    });

    // ===== ADJUST INVENTORY =====
    builder.addCase(adjustInventoryQuantity.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(adjustInventoryQuantity.fulfilled, (state, action) => {
      state.loading = false;
      // Update cached inventory
      if (action.payload.productId) {
        state.inventories[action.payload.productId] = action.payload;
      }
    });
    builder.addCase(adjustInventoryQuantity.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload?.message || 'Failed to adjust inventory';
    });

    // ===== ADD TRANSACTION =====
    builder.addCase(addInventoryTransaction.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(addInventoryTransaction.fulfilled, (state, action) => {
      state.loading = false;
      // Add to current transactions
      state.currentTransactions.unshift(action.payload);
    });
    builder.addCase(addInventoryTransaction.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload?.message || 'Failed to add transaction';
    });

    // ===== FETCH TRANSACTIONS =====
    builder.addCase(fetchInventoryTransactions.pending, (state) => {
      state.transactionsLoading = true;
      state.transactionsError = null;
    });
    builder.addCase(fetchInventoryTransactions.fulfilled, (state, action) => {
      state.transactionsLoading = false;
      state.currentTransactions = action.payload;
    });
    builder.addCase(fetchInventoryTransactions.rejected, (state, action) => {
      state.transactionsLoading = false;
      state.transactionsError = action.payload?.message || 'Failed to fetch transactions';
    });
  },
});

export const { clearInventoryError, clearInventoryCache } = inventorySlice.actions;

// ==================== SELECTORS ====================

export const selectInventoryByProductId = (state, productId) =>
  state.inventory.inventories[productId];

export const selectLowStockItems = (state) => state.inventory.lowStockItems;
export const selectLowStockLoading = (state) => state.inventory.lowStockLoading;

export const selectWarehouseInventory = (state) => state.inventory.warehouseInventory;

export const selectInventoryTransactions = (state) => state.inventory.currentTransactions;

export const selectInventoryLoading = (state) => state.inventory.loading;
export const selectInventoryError = (state) => state.inventory.error;

export default inventorySlice.reducer;
