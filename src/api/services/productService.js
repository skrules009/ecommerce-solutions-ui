/**
 * Product Service
 * Handles all product-related API calls to the Catalog Service
 */

import createAxiosInstance from '../axiosInstance';
import API_BASE_URLS from '../../config/apiConfig';

const axiosInstance = createAxiosInstance(API_BASE_URLS.CATALOG, 'ProductService');

export const productService = {
  /**
   * Get all products
   * @returns {Promise}
   */
  getAllProducts: () => axiosInstance.get('/Product'),

  /**
   * Get product by ID
   * @param {number} id - Product ID
   * @returns {Promise}
   */
  getProductById: (id) => axiosInstance.get(`/Product/${id}`),

  /**
   * Create a new product
   * @param {Object} productData - Product data
   * @returns {Promise}
   */
  createProduct: (productData) => axiosInstance.post('/Product', productData),

  /**
   * Update an existing product
   * @param {number} id - Product ID
   * @param {Object} productData - Updated product data
   * @returns {Promise}
   */
  updateProduct: (id, productData) => axiosInstance.put(`/Product/${id}`, productData),

  /**
   * Delete a product
   * @param {number} id - Product ID
   * @returns {Promise}
   */
  deleteProduct: (id) => axiosInstance.delete(`/Product/${id}`)
};

export default productService;
