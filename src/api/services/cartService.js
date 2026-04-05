/**
 * Cart Service
 * Handles all cart-related API calls to the Cart Service
 */

import createAxiosInstance from '../axiosInstance';
import API_BASE_URLS from '../../config/apiConfig';

const axiosInstance = createAxiosInstance(API_BASE_URLS.CART, 'CartService');

export const cartService = {
  /**
   * Get all carts (admin only)
   * @returns {Promise}
   */
  getAllCarts: () => axiosInstance.get('/carts'),

  /**
   * Get active carts
   * @returns {Promise}
   */
  getActiveCarts: () => axiosInstance.get('/carts/active'),

  /**
   * Get abandoned carts
   * @returns {Promise}
   */
  getAbandonedCarts: () => axiosInstance.get('/carts/abandoned'),

  /**
   * Get cart by ID
   * @param {number} id - Cart ID
   * @returns {Promise}
   */
  getCartById: (id) => axiosInstance.get(`/carts/${id}`),

  /**
   * Get cart by customer ID
   * @param {number} customerId - Customer ID
   * @returns {Promise}
   */
  getCartByCustomerId: (customerId) => axiosInstance.get(`/carts/customer/${customerId}`),

  /**
   * Create a new cart
   * @param {Object} cartData - Cart data with customerId
   * @returns {Promise}
   */
  createCart: (cartData) => axiosInstance.post('/carts', cartData),

  /**
   * Add item to cart
   * @param {number} cartId - Cart ID
   * @param {Object} itemData - Cart item data (productId, quantity)
   * @returns {Promise}
   */
  addItemToCart: (cartId, itemData) => axiosInstance.post(`/carts/${cartId}/items`, itemData),

  /**
   * Update cart item quantity
   * @param {number} cartId - Cart ID
   * @param {number} cartItemId - Cart Item ID
   * @param {Object} itemData - Updated item data (quantity)
   * @returns {Promise}
   */
  updateCartItem: (cartId, cartItemId, itemData) =>
    axiosInstance.put(`/carts/${cartId}/items/${cartItemId}`, itemData),

  /**
   * Remove item from cart
   * @param {number} cartId - Cart ID
   * @param {number} cartItemId - Cart Item ID
   * @returns {Promise}
   */
  removeItemFromCart: (cartId, cartItemId) =>
    axiosInstance.delete(`/carts/${cartId}/items/${cartItemId}`),

  /**
   * Clear all items from cart
   * @param {number} cartId - Cart ID
   * @returns {Promise}
   */
  clearCart: (cartId) => axiosInstance.delete(`/carts/${cartId}/clear`),

  /**
   * Delete cart
   * @param {number} id - Cart ID
   * @returns {Promise}
   */
  deleteCart: (id) => axiosInstance.delete(`/carts/${id}`)
};

export default cartService;
