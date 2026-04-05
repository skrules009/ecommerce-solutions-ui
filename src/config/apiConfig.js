/**
 * API Configuration
 * Defines base URLs for all microservices
 * Uses environment variables with localhost defaults for development
 * 
 * Port Mapping (HTTPS):
 * - Auth Service: 7002
 * - Customer Service: 7001
 * - Catalog Service: 7003
 * - Cart Service: 7004
 * - Inventory Service: 7005
 * - Payment Service: 7006
 * - Search Service: 7007
 */

const API_BASE_URLS = {
  AUTH: process.env.REACT_APP_AUTH_URL || 'https://localhost:7002/api/auth',
  CUSTOMER: process.env.REACT_APP_CUSTOMER_URL || 'https://localhost:7001/api/customer',
  CATALOG: process.env.REACT_APP_CATALOG_URL || 'https://localhost:7003/api/catalog',
  CART: process.env.REACT_APP_CART_URL || 'https://localhost:7004/api/cart',
  INVENTORY: process.env.REACT_APP_INVENTORY_URL || 'https://localhost:7005/api/inventory',
  PAYMENT: process.env.REACT_APP_PAYMENT_URL || 'https://localhost:7006/api/payment',
  SEARCH: process.env.REACT_APP_SEARCH_URL || 'https://localhost:7007/api/search'
};

// Request timeout (in milliseconds)
export const API_TIMEOUT = 10000;

// Cache durations for different data types
export const CACHE_DURATION = {
  PRODUCTS: 5 * 60 * 1000,      // 5 minutes
  CART: 1 * 60 * 1000,          // 1 minute
  INVENTORY: 2 * 60 * 1000,     // 2 minutes
  PAYMENTS: 5 * 60 * 1000,      // 5 minutes
  CUSTOMERS: 10 * 60 * 1000,    // 10 minutes
  SEARCH: 1 * 60 * 1000         // 1 minute
};

export default API_BASE_URLS;
