/**
 * Auth Service
 * Handles all authentication API calls to the Auth Service
 * 
 * Note: Update port/routes below based on your actual api-auth-service configuration
 */

import createAxiosInstance from '../axiosInstance';
import API_BASE_URLS from '../../config/apiConfig';

// Create axios instance for auth service
// Note: Remove auth token from headers to avoid circular dependency during login/register
const authAxiosInstance = createAxiosInstance(
  API_BASE_URLS.AUTH,
  'AuthService',
  { skipAuthHeader: true } // Auth endpoints don't need token
);

export const authService = {
  /**
   * Register a new user
   * @param {Object} registerData - { email, password, firstName, lastName, phone }
   * @returns {Promise}
   */
  register: (registerData) => 
    authAxiosInstance.post('/register', registerData),

  /**
   * Login a user
   * @param {Object} loginData - { email, password }
   * @returns {Promise<{ token, user, expiresIn }>}
   */
  login: (loginData) => 
    authAxiosInstance.post('/login', loginData),

  /**
   * Logout (usually just cleans up frontend, but may notify backend)
   * @returns {Promise}
   */
  logout: () => 
    authAxiosInstance.post('/logout'),

  /**
   * Refresh JWT token
   * @param {string} token - Current token
   * @returns {Promise<{ token, expiresIn }>}
   */
  refreshToken: (token) => 
    authAxiosInstance.post('/refresh-token', { token }),

  /**
   * Validate JWT token
   * @param {string} token - JWT token to validate
   * @returns {Promise<{ valid, expiresIn }>}
   */
  validateToken: (token) => 
    authAxiosInstance.post('/validate', { token }),

  /**
   * Request password reset
   * @param {string} email - User email
   * @returns {Promise}
   */
  requestPasswordReset: (email) => 
    authAxiosInstance.post('/password-reset/request', { email }),

  /**
   * Reset password with token
   * @param {Object} resetData - { token, newPassword, confirmPassword }
   * @returns {Promise}
   */
  resetPassword: (resetData) => 
    authAxiosInstance.post('/password-reset/reset', resetData),

  /**
   * Change password (authenticated user)
   * @param {Object} changeData - { currentPassword, newPassword }
   * @returns {Promise}
   */
  changePassword: (changeData) => 
    authAxiosInstance.post('/password-change', changeData),

  /**
   * Get current user profile (requires authentication)
   * @returns {Promise<User>}
   */
  getCurrentUser: () => 
    authAxiosInstance.get('/me'),

  /**
   * Update user profile
   * @param {Object} profileData - User profile updates
   * @returns {Promise<User>}
   */
  updateProfile: (profileData) => 
    authAxiosInstance.put('/profile', profileData),

  /**
   * Verify email with token
   * @param {string} token - Verification token
   * @returns {Promise}
   */
  verifyEmail: (token) => 
    authAxiosInstance.post('/verify-email', { token }),

  /**
   * Resend verification email
   * @param {string} email - Email to send verification to
   * @returns {Promise}
   */
  resendVerificationEmail: (email) => 
    authAxiosInstance.post('/resend-verification', { email }),

  /**
   * Two-factor authentication setup
   * @returns {Promise<{ secret, qrCode }>}
   */
  setup2FA: () => 
    authAxiosInstance.post('/2fa/setup'),

  /**
   * Verify 2FA code
   * @param {string} code - 6-digit 2FA code
   * @returns {Promise}
   */
  verify2FA: (code) => 
    authAxiosInstance.post('/2fa/verify', { code }),

  /**
   * Disable 2FA
   * @returns {Promise}
   */
  disable2FA: () => 
    authAxiosInstance.post('/2fa/disable'),

  /**
   * Get active sessions
   * @returns {Promise<Session[]>}
   */
  getSessions: () => 
    authAxiosInstance.get('/sessions'),

  /**
   * Revoke a session
   * @param {string} sessionId - Session ID to revoke
   * @returns {Promise}
   */
  revokeSession: (sessionId) => 
    authAxiosInstance.delete(`/sessions/${sessionId}`),
};

export default authService;
