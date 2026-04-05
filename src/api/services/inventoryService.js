/**
 * Inventory Service
 * Handles all inventory-related API calls to the Inventory Service
 */

import createAxiosInstance from '../axiosInstance';
import API_BASE_URLS from '../../config/apiConfig';

const axiosInstance = createAxiosInstance(API_BASE_URLS.INVENTORY, 'InventoryService');

export const inventoryService = {
  /**
   * Get all inventories
   * @returns {Promise}
   */
  getAllInventories: () => axiosInstance.get('/inventories'),

  /**
   * Get inventory by ID
   * @param {number} id - Inventory ID
   * @returns {Promise}
   */
  getInventoryById: (id) => axiosInstance.get(`/inventories/${id}`),

  /**
   * Get inventory by product ID
   * @param {number} productId - Product ID
   * @returns {Promise}
   */
  getInventoryByProductId: (productId) =>
    axiosInstance.get(`/inventories/product/${productId}`),

  /**
   * Get inventory by SKU
   * @param {string} sku - Product SKU
   * @returns {Promise}
   */
  getInventoryBySku: (sku) => axiosInstance.get(`/inventories/sku/${sku}`),

  /**
   * Get inventories by warehouse
   * @param {string} warehouse - Warehouse name
   * @returns {Promise}
   */
  getInventoriesByWarehouse: (warehouse) =>
    axiosInstance.get(`/inventories/warehouse/${warehouse}`),

  /**
   * Get low stock inventories
   * @returns {Promise}
   */
  getLowStockInventories: () => axiosInstance.get('/inventories/low-stock'),

  /**
   * Get inventory quantity
   * @param {number} id - Inventory ID
   * @returns {Promise}
   */
  getQuantity: (id) => axiosInstance.get(`/inventories/${id}/quantity`),

  /**
   * Create new inventory
   * @param {Object} inventoryData - Inventory data
   * @returns {Promise}
   */
  createInventory: (inventoryData) => axiosInstance.post('/inventories', inventoryData),

  /**
   * Update inventory
   * @param {number} id - Inventory ID
   * @param {Object} inventoryData - Updated inventory data
   * @returns {Promise}
   */
  updateInventory: (id, inventoryData) =>
    axiosInstance.put(`/inventories/${id}`, inventoryData),

  /**
   * Adjust inventory quantity
   * @param {number} id - Inventory ID
   * @param {Object} adjustData - Adjustment data (quantity, transactionType)
   * @returns {Promise}
   */
  adjustQuantity: (id, adjustData) =>
    axiosInstance.put(`/inventories/${id}/adjust`, adjustData),

  /**
   * Delete inventory
   * @param {number} id - Inventory ID
   * @returns {Promise}
   */
  deleteInventory: (id) => axiosInstance.delete(`/inventories/${id}`),

  /**
   * Add inventory transaction
   * @param {number} id - Inventory ID
   * @param {Object} transactionData - Transaction data
   * @returns {Promise}
   */
  addTransaction: (id, transactionData) =>
    axiosInstance.post(`/inventories/${id}/transactions`, transactionData),

  /**
   * Get inventory transactions
   * @param {number} id - Inventory ID
   * @returns {Promise}
   */
  getTransactions: (id) => axiosInstance.get(`/inventories/${id}/transactions`)
};

export default inventoryService;
