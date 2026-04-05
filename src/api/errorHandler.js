/**
 * API Error Handler
 * Parses and formats API errors in a consistent way
 */

/**
 * Standardize API error responses
 * @param {Error} error - Axios error object
 * @returns {Object} Standard error format
 */
export const handleApiError = (error) => {
  // If we got a response from the server
  if (error.response) {
    const { status, data } = error.response;
    return {
      status,
      message: data?.message || data?.error?.message || 'An error occurred',
      errors: data?.errors || data?.error?.errors || null,
      originalError: error
    };
  }
  // If request was made but no response received
  else if (error.request) {
    return {
      status: null,
      message: 'No response from server. Please check your connection.',
      errors: null,
      originalError: error
    };
  }
  // If error occurred in request setup
  else {
    return {
      status: null,
      message: error.message || 'An unknown error occurred',
      errors: null,
      originalError: error
    };
  }
};

/**
 * Extract user-friendly error message
 * @param {Error} error - Axios error object
 * @returns {string} Error message
 */
export const getErrorMessage = (error) => {
  const parsedError = handleApiError(error);
  return parsedError.message;
};

/**
 * Check if error is network-related
 * @param {Error} error - Axios error object
 * @returns {boolean} True if network error
 */
export const isNetworkError = (error) => {
  return !error.response && error.request;
};

/**
 * Check if error is validation error (400)
 * @param {Error} error - Axios error object
 * @returns {boolean} True if validation error
 */
export const isValidationError = (error) => {
  return error.response?.status === 400;
};

/**
 * Check if error is unauthorized (401)
 * @param {Error} error - Axios error object
 * @returns {boolean} True if unauthorized
 */
export const isUnauthorizedError = (error) => {
  return error.response?.status === 401;
};

/**
 * Check if error is server error (5xx)
 * @param {Error} error - Axios error object
 * @returns {boolean} True if server error
 */
export const isServerError = (error) => {
  return error.response?.status >= 500;
};

/**
 * Get validation errors from response
 * @param {Error} error - Axios error object
 * @returns {Object} Map of field -> error messages
 */
export const getValidationErrors = (error) => {
  const errors = error.response?.data?.errors;
  if (typeof errors === 'object' && errors !== null) {
    return errors;
  }
  return {};
};

export default handleApiError;
