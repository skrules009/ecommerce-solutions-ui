/**
 * Customer Service
 * Handles all customer-related API calls to the Customer Service
 */

import createAxiosInstance from '../axiosInstance';
import API_BASE_URLS from '../../config/apiConfig';

const axiosInstance = createAxiosInstance(API_BASE_URLS.CUSTOMER, 'CustomerService');

export const customerService = {
  /**
   * Get all customers (admin only)
   * @returns {Promise}
   */
  getAllCustomers: () => axiosInstance.get('/customers'),

  /**
   * Get active customers only
   * @returns {Promise}
   */
  getActiveCustomers: () => axiosInstance.get('/customers/active'),

  /**
   * Get customer by ID
   * @param {number} id - Customer ID
   * @returns {Promise}
   */
  getCustomerById: (id) => axiosInstance.get(`/customers/${id}`),

  /**
   * Get customer by email
   * @param {string} email - Customer email
   * @returns {Promise}
   */
  getCustomerByEmail: (email) => axiosInstance.get(`/customers/by-email/${email}`),

  /**
   * Create a new customer
   * @param {Object} customerData - Customer data
   * @returns {Promise}
   */
  createCustomer: (customerData) => axiosInstance.post('/customers', customerData),

  /**
   * Update an existing customer
   * @param {number} id - Customer ID
   * @param {Object} customerData - Updated customer data
   * @returns {Promise}
   */
  updateCustomer: (id, customerData) =>
    axiosInstance.put(`/customers/${id}`, customerData),

  /**
   * Delete a customer
   * @param {number} id - Customer ID
   * @returns {Promise}
   */
  deleteCustomer: (id) => axiosInstance.delete(`/customers/${id}`)
};

export default customerService;
