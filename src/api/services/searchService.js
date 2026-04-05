/**
 * Search Service
 * Handles all search-related API calls to the Search Service (Elasticsearch)
 */

import createAxiosInstance from '../axiosInstance';
import API_BASE_URLS from '../../config/apiConfig';

const axiosInstance = createAxiosInstance(API_BASE_URLS.SEARCH, 'SearchService');

export const searchService = {
  // ==================== INDEXING ====================

  /**
   * Index a single document
   * @param {Object} document - Document to index
   * @returns {Promise}
   */
  indexDocument: (document) => axiosInstance.post('/search/index', document),

  /**
   * Bulk index documents
   * @param {Array} documents - Array of documents to index
   * @returns {Promise}
   */
  bulkIndexDocuments: (documents) => axiosInstance.post('/search/bulk-index', documents),

  /**
   * Update a document
   * @param {string} documentType - Type of document (e.g., 'product')
   * @param {number} documentId - Document ID
   * @param {Object} document - Updated document
   * @returns {Promise}
   */
  updateDocument: (documentType, documentId, document) =>
    axiosInstance.put(`/search/index/${documentType}/${documentId}`, document),

  /**
   * Delete a document
   * @param {string} documentType - Type of document
   * @param {number} documentId - Document ID
   * @returns {Promise}
   */
  deleteDocument: (documentType, documentId) =>
    axiosInstance.delete(`/search/index/${documentType}/${documentId}`),

  // ==================== SEARCHING ====================

  /**
   * Simple search
   * @param {Object} searchRequest - Search request with query
   * @returns {Promise}
   */
  search: (searchRequest) => axiosInstance.post('/search/search', searchRequest),

  /**
   * Search by document type
   * @param {string} documentType - Type of document to search
   * @param {string} query - Search query
   * @param {number} pageNumber - Page number (default: 1)
   * @param {number} pageSize - Page size (default: 10)
   * @returns {Promise}
   */
  searchByType: (documentType, query, pageNumber = 1, pageSize = 10) =>
    axiosInstance.get(`/search/search/${documentType}`, {
      params: { query, pageNumber, pageSize }
    }),

  /**
   * Advanced search with filters
   * @param {Object} searchRequest - Advanced search request with filters
   * @returns {Promise}
   */
  advancedSearch: (searchRequest) =>
    axiosInstance.post('/search/search/advanced', searchRequest)
};

export default searchService;
