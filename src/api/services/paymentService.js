/**
 * Payment Service
 * Handles all payment-related API calls to the Payment Service
 */

import createAxiosInstance from '../axiosInstance';
import API_BASE_URLS from '../../config/apiConfig';

const axiosInstance = createAxiosInstance(API_BASE_URLS.PAYMENT, 'PaymentService');

export const paymentService = {
  // ==================== PAYMENTS ====================

  /**
   * Get all payments (admin only)
   * @returns {Promise}
   */
  getAllPayments: () => axiosInstance.get('/payments'),

  /**
   * Get payment by ID
   * @param {number} id - Payment ID
   * @returns {Promise}
   */
  getPaymentById: (id) => axiosInstance.get(`/payments/${id}`),

  /**
   * Get payments by status
   * @param {string} status - Payment status (Pending, Completed, Failed)
   * @returns {Promise}
   */
  getPaymentsByStatus: (status) => axiosInstance.get(`/payments/status/${status}`),

  /**
   * Get payment by transaction ID
   * @param {string} transactionId - Transaction ID
   * @returns {Promise}
   */
  getPaymentByTransactionId: (transactionId) =>
    axiosInstance.get(`/payments/transaction/${transactionId}`),

  /**
   * Get payment by order ID
   * @param {number} orderId - Order ID
   * @returns {Promise}
   */
  getPaymentByOrderId: (orderId) => axiosInstance.get(`/payments/order/${orderId}`),

  /**
   * Get payments by date range
   * @param {Date} startDate - Start date
   * @param {Date} endDate - End date
   * @returns {Promise}
   */
  getPaymentsByDateRange: (startDate, endDate) =>
    axiosInstance.get('/payments/date-range', {
      params: { startDate, endDate }
    }),

  /**
   * Process a new payment
   * @param {Object} paymentData - Payment data
   * @returns {Promise}
   */
  processPayment: (paymentData) => axiosInstance.post('/payments', paymentData),

  /**
   * Complete a payment
   * @param {number} id - Payment ID
   * @returns {Promise}
   */
  completePayment: (id) => axiosInstance.put(`/payments/${id}/complete`),

  /**
   * Fail a payment
   * @param {number} id - Payment ID
   * @param {string} failureReason - Reason for failure
   * @returns {Promise}
   */
  failPayment: (id, failureReason) =>
    axiosInstance.put(`/payments/${id}/fail`, null, {
      params: { failureReason }
    }),

  /**
   * Refund a payment
   * @param {number} id - Payment ID
   * @param {Object} refundData - Refund data (amount, reason)
   * @returns {Promise}
   */
  refundPayment: (id, refundData) => axiosInstance.post(`/payments/${id}/refund`, refundData),

  /**
   * Get refunds for a payment
   * @param {number} id - Payment ID
   * @returns {Promise}
   */
  getRefunds: (id) => axiosInstance.get(`/payments/${id}/refunds`),

  // ==================== PAYMENT METHODS ====================

  /**
   * Add a payment method
   * @param {Object} methodData - Payment method data
   * @returns {Promise}
   */
  addPaymentMethod: (methodData) => axiosInstance.post('/payment-methods', methodData),

  /**
   * Get payment methods for customer
   * @param {number} customerId - Customer ID
   * @returns {Promise}
   */
  getPaymentMethods: (customerId) =>
    axiosInstance.get(`/payment-methods/customer/${customerId}`),

  /**
   * Update payment method
   * @param {number} id - Payment Method ID
   * @param {Object} methodData - Updated payment method data
   * @returns {Promise}
   */
  updatePaymentMethod: (id, methodData) =>
    axiosInstance.put(`/payment-methods/${id}`, methodData),

  /**
   * Delete payment method
   * @param {number} id - Payment Method ID
   * @returns {Promise}
   */
  deletePaymentMethod: (id) => axiosInstance.delete(`/payment-methods/${id}`)
};

export default paymentService;
