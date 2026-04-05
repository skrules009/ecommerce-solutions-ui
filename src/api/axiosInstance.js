/**
 * Axios Instance Factory
 * Creates preconfigured axios instances with interceptors for API calls
 * Handles auth tokens, error responses, and request/response logging
 */

import axios from 'axios';
import { API_TIMEOUT } from '../config/apiConfig';

/**
 * Create a new axios instance with interceptors
 * @param {string} baseURL - The base URL for the service
 * @param {string} serviceName - Name of the service (for logging)
 * @param {Object} options - Configuration options
 * @param {boolean} options.skipAuthHeader - Don't include auth token in headers (for public endpoints)
 * @returns {Object} Configured axios instance
 */
const createAxiosInstance = (baseURL, serviceName = 'API', options = {}) => {
  const { skipAuthHeader = false } = options;
  // Note: For development with self-signed certificates, browsers automatically
  // handle CORS/SSL issues. This axios config is client-side only.
  const instance = axios.create({
    baseURL,
    timeout: API_TIMEOUT,
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json'
    }
  });

  /**
   * Request Interceptor
   * - Adds authentication token if available (unless skipAuthHeader is true)
   * - Logs outgoing requests in development
   */
  instance.interceptors.request.use(
    (config) => {
      // Add auth token unless explicitly skipped (for public endpoints like login/register)
      if (!skipAuthHeader) {
        const token = localStorage.getItem('authToken') || localStorage.getItem('token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      }

      // Log request in development
      if (process.env.NODE_ENV === 'development') {
        console.log(`[${serviceName}] REQUEST:`, {
          method: config.method.toUpperCase(),
          url: config.url,
          data: config.data
        });
      }

      return config;
    },
    (error) => {
      console.error(`[${serviceName}] REQUEST ERROR:`, error);
      return Promise.reject(error);
    }
  );

  /**
   * Response Interceptor
   * - Handles successful responses
   * - Handles error responses
   * - Redirects to login on 401 (Unauthorized)
   * - Logs responses in development
   */
  instance.interceptors.response.use(
    (response) => {
      if (process.env.NODE_ENV === 'development') {
        console.log(`[${serviceName}] RESPONSE:`, {
          status: response.status,
          url: response.config.url,
          data: response.data
        });
      }
      return response;
    },
    (error) => {
      const status = error.response?.status;
      const data = error.response?.data;

      // Log errors
      console.error(`[${serviceName}] ERROR:`, {
        status,
        message: data?.message || error.message,
        url: error.config?.url
      });

      // Handle specific error statuses
      if (status === 401) {
        // Unauthorized - clear auth and redirect to login
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
        window.location.href = '/login';
      } else if (status === 403) {
        // Forbidden - user doesn't have permission
        console.warn('Access denied: You do not have permission to access this resource');
      } else if (status === 404) {
        // Not found
        console.warn('Resource not found:', error.config?.url);
      } else if (status >= 500) {
        // Server error
        console.error('Server error. Please try again later.');
      }

      return Promise.reject(error);
    }
  );

  return instance;
};

/**
 * Create a simple axios instance without interceptors
 * Use this for services that don't need auth or special handling
 */
export const createSimpleAxiosInstance = (baseURL) => {
  return axios.create({
    baseURL,
    timeout: API_TIMEOUT,
    headers: {
      'Content-Type': 'application/json'
    }
  });
};

export default createAxiosInstance;
