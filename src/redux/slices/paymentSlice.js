import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { paymentService, handleApiError } from '../../api/services';

// ==================== ASYNC THUNKS ====================

/**
 * Process a new payment
 */
export const processPayment = createAsyncThunk(
  'payment/process',
  async (paymentData, { rejectWithValue }) => {
    try {
      const response = await paymentService.processPayment({
        orderId: paymentData.orderId,
        customerId: paymentData.customerId,
        amount: paymentData.amount,
        currency: 'INR',
        paymentMethod: paymentData.paymentMethod,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(handleApiError(error));
    }
  }
);

/**
 * Complete a payment
 */
export const completePayment = createAsyncThunk(
  'payment/complete',
  async (paymentId, { rejectWithValue }) => {
    try {
      const response = await paymentService.completePayment(paymentId);
      return response.data;
    } catch (error) {
      return rejectWithValue(handleApiError(error));
    }
  }
);

/**
 * Fail a payment
 */
export const failPayment = createAsyncThunk(
  'payment/fail',
  async ({ paymentId, failureReason }, { rejectWithValue }) => {
    try {
      const response = await paymentService.failPayment(paymentId, failureReason);
      return response.data;
    } catch (error) {
      return rejectWithValue(handleApiError(error));
    }
  }
);

/**
 * Get payment by ID
 */
export const fetchPaymentById = createAsyncThunk(
  'payment/fetchById',
  async (paymentId, { rejectWithValue }) => {
    try {
      const response = await paymentService.getPaymentById(paymentId);
      return response.data;
    } catch (error) {
      return rejectWithValue(handleApiError(error));
    }
  }
);

/**
 * Get payment by order ID
 */
export const fetchPaymentByOrderId = createAsyncThunk(
  'payment/fetchByOrderId',
  async (orderId, { rejectWithValue }) => {
    try {
      const response = await paymentService.getPaymentByOrderId(orderId);
      return response.data;
    } catch (error) {
      return rejectWithValue(handleApiError(error));
    }
  }
);

/**
 * Get all payments (for order history)
 */
export const fetchAllPayments = createAsyncThunk(
  'payment/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const response = await paymentService.getAllPayments();
      return response.data;
    } catch (error) {
      return rejectWithValue(handleApiError(error));
    }
  }
);

/**
 * Add payment method
 */
export const addPaymentMethod = createAsyncThunk(
  'payment/addMethod',
  async (methodData, { rejectWithValue }) => {
    try {
      const response = await paymentService.addPaymentMethod(methodData);
      return response.data;
    } catch (error) {
      return rejectWithValue(handleApiError(error));
    }
  }
);

/**
 * Get payment methods for customer
 */
export const fetchPaymentMethods = createAsyncThunk(
  'payment/fetchMethods',
  async (customerId, { rejectWithValue }) => {
    try {
      const response = await paymentService.getPaymentMethods(customerId);
      return response.data;
    } catch (error) {
      return rejectWithValue(handleApiError(error));
    }
  }
);

/**
 * Refund payment
 */
export const refundPayment = createAsyncThunk(
  'payment/refund',
  async ({ paymentId, amount, reason }, { rejectWithValue }) => {
    try {
      const response = await paymentService.refundPayment(paymentId, {
        amount,
        reason,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(handleApiError(error));
    }
  }
);

const initialState = {
  // Current payment processing
  currentPayment: null,
  processing: false,
  paymentError: null,

  // Payment methods
  paymentMethods: [],
  methodsLoading: false,
  methodsError: null,

  // All payments (order history)
  payments: [],
  paymentHistory: [],
  historyLoading: false,
  historyError: null,

  // UI state
  lastProcessedPaymentId: null,
  paymentStatus: null, // 'pending', 'completed', 'failed', 'refunded'
};

const paymentSlice = createSlice({
  name: 'payment',
  initialState,
  reducers: {
    clearPaymentError: (state) => {
      state.paymentError = null;
    },
    clearMethodsError: (state) => {
      state.methodsError = null;
    },
    setPaymentStatus: (state, action) => {
      state.paymentStatus = action.payload;
    },
  },
  // ==================== EXTRA REDUCERS (Handle Async Thunks) ====================
  extraReducers: (builder) => {
    // ===== PROCESS PAYMENT =====
    builder.addCase(processPayment.pending, (state) => {
      state.processing = true;
      state.paymentError = null;
    });
    builder.addCase(processPayment.fulfilled, (state, action) => {
      state.processing = false;
      state.currentPayment = action.payload;
      state.lastProcessedPaymentId = action.payload.id;
      state.paymentStatus = action.payload.status;
    });
    builder.addCase(processPayment.rejected, (state, action) => {
      state.processing = false;
      state.paymentError = action.payload?.message || 'Payment processing failed';
      state.paymentStatus = 'failed';
    });

    // ===== COMPLETE PAYMENT =====
    builder.addCase(completePayment.pending, (state) => {
      state.processing = true;
      state.paymentError = null;
    });
    builder.addCase(completePayment.fulfilled, (state, action) => {
      state.processing = false;
      state.currentPayment = action.payload;
      state.paymentStatus = 'completed';
    });
    builder.addCase(completePayment.rejected, (state, action) => {
      state.processing = false;
      state.paymentError = action.payload?.message || 'Failed to complete payment';
    });

    // ===== FAIL PAYMENT =====
    builder.addCase(failPayment.pending, (state) => {
      state.processing = true;
    });
    builder.addCase(failPayment.fulfilled, (state, action) => {
      state.processing = false;
      state.currentPayment = action.payload;
      state.paymentStatus = 'failed';
    });
    builder.addCase(failPayment.rejected, (state, action) => {
      state.processing = false;
      state.paymentError = action.payload?.message || 'Failed to fail payment';
    });

    // ===== FETCH PAYMENT BY ID =====
    builder.addCase(fetchPaymentById.pending, (state) => {
      state.processing = true;
      state.paymentError = null;
    });
    builder.addCase(fetchPaymentById.fulfilled, (state, action) => {
      state.processing = false;
      state.currentPayment = action.payload;
    });
    builder.addCase(fetchPaymentById.rejected, (state, action) => {
      state.processing = false;
      state.paymentError = action.payload?.message || 'Failed to fetch payment';
    });

    // ===== FETCH PAYMENT BY ORDER ID =====
    builder.addCase(fetchPaymentByOrderId.pending, (state) => {
      state.processing = true;
      state.paymentError = null;
    });
    builder.addCase(fetchPaymentByOrderId.fulfilled, (state, action) => {
      state.processing = false;
      state.currentPayment = action.payload;
    });
    builder.addCase(fetchPaymentByOrderId.rejected, (state, action) => {
      state.processing = false;
      state.paymentError = action.payload?.message || 'Failed to fetch payment';
    });

    // ===== FETCH ALL PAYMENTS =====
    builder.addCase(fetchAllPayments.pending, (state) => {
      state.historyLoading = true;
      state.historyError = null;
    });
    builder.addCase(fetchAllPayments.fulfilled, (state, action) => {
      state.historyLoading = false;
      state.payments = action.payload;
      state.paymentHistory = action.payload;
    });
    builder.addCase(fetchAllPayments.rejected, (state, action) => {
      state.historyLoading = false;
      state.historyError = action.payload?.message || 'Failed to fetch payment history';
    });

    // ===== ADD PAYMENT METHOD =====
    builder.addCase(addPaymentMethod.pending, (state) => {
      state.methodsError = null;
    });
    builder.addCase(addPaymentMethod.fulfilled, (state, action) => {
      state.paymentMethods.push(action.payload);
    });
    builder.addCase(addPaymentMethod.rejected, (state, action) => {
      state.methodsError = action.payload?.message || 'Failed to add payment method';
    });

    // ===== FETCH PAYMENT METHODS =====
    builder.addCase(fetchPaymentMethods.pending, (state) => {
      state.methodsLoading = true;
      state.methodsError = null;
    });
    builder.addCase(fetchPaymentMethods.fulfilled, (state, action) => {
      state.methodsLoading = false;
      state.paymentMethods = action.payload;
    });
    builder.addCase(fetchPaymentMethods.rejected, (state, action) => {
      state.methodsLoading = false;
      state.methodsError = action.payload?.message || 'Failed to fetch payment methods';
    });

    // ===== REFUND PAYMENT =====
    builder.addCase(refundPayment.pending, (state) => {
      state.processing = true;
      state.paymentError = null;
    });
    builder.addCase(refundPayment.fulfilled, (state, action) => {
      state.processing = false;
      state.paymentStatus = 'refunded';
      // Update refunds in current payment
      if (state.currentPayment) {
        state.currentPayment.refunds = state.currentPayment.refunds || [];
        state.currentPayment.refunds.push(action.payload);
      }
    });
    builder.addCase(refundPayment.rejected, (state, action) => {
      state.processing = false;
      state.paymentError = action.payload?.message || 'Failed to refund payment';
    });
  },
});

export const { clearPaymentError, clearMethodsError, setPaymentStatus } = paymentSlice.actions;

// ==================== SELECTORS ====================

export const selectCurrentPayment = (state) => state.payment.currentPayment;
export const selectPaymentStatus = (state) => state.payment.paymentStatus;
export const selectPaymentMethods = (state) => state.payment.paymentMethods;
export const selectPaymentHistory = (state) => state.payment.paymentHistory;
export const selectAllPayments = (state) => state.payment.payments;
export const selectPaymentProcessing = (state) => state.payment.processing;
export const selectPaymentError = (state) => state.payment.paymentError;

export default paymentSlice.reducer;
