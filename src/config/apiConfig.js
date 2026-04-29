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
 * - Order Service: 7000
 * - Payment Service: 7006
 * - Search Service: 7007
 */

const API_BASE_URLS = {
  AUTH: 'https://localhost:7002/api/Auth/',
  CUSTOMER: 'https://localhost:7001/api/',
  CATALOG: 'https://localhost:7003/api/',
  CART: 'https://localhost:7004/api/',
  INVENTORY: 'https://localhost:7005/api/',
  ORDER: 'https://localhost:7000/api/',
  PAYMENT: 'https://localhost:7006/api/',
  SEARCH: 'https://localhost:7007/api/'
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
