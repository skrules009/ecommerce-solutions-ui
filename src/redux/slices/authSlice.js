import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { authService, handleApiError } from '../../api/services';

// ==================== ASYNC THUNKS ====================

/**
 * Register a new user
 */
export const registerUser = createAsyncThunk(
  'auth/register',
  async (registerData, { rejectWithValue }) => {
    try {
      const response = await authService.register({
        email: registerData.email,
        password: registerData.password,
        firstName: registerData.firstName,
        lastName: registerData.lastName,
        phone: registerData.phone
      });
      
      // Store token if provided
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
      }
      
      return response.data;
    } catch (error) {
      return rejectWithValue(handleApiError(error));
    }
  }
);

/**
 * Login user
 */
export const loginUser = createAsyncThunk(
  'auth/login',
  async (loginData, { rejectWithValue }) => {
    try {
      const response = await authService.login({
        email: loginData.email,
        password: loginData.password
      });
      
      // Store token for future requests
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
      }
      
      return response.data;
    } catch (error) {
      return rejectWithValue(handleApiError(error));
    }
  }
);

/**
 * Logout user
 */
export const logoutUser = createAsyncThunk(
  'auth/logout',
  async (_, { rejectWithValue }) => {
    try {
      await authService.logout();
      localStorage.removeItem('token');
      return null;
    } catch (error) {
      // Even if logout fails on server, clear local state
      localStorage.removeItem('token');
      return rejectWithValue(handleApiError(error));
    }
  }
);

/**
 * Refresh JWT token
 */
export const refreshToken = createAsyncThunk(
  'auth/refreshToken',
  async (_, { rejectWithValue, getState }) => {
    try {
      const state = getState();
      const currentToken = state.auth.token;
      
      if (!currentToken) {
        return rejectWithValue({ message: 'No token to refresh' });
      }
      
      const response = await authService.refreshToken(currentToken);
      
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
      }
      
      return response.data;
    } catch (error) {
      return rejectWithValue(handleApiError(error));
    }
  }
);

/**
 * Validate JWT token
 */
export const validateToken = createAsyncThunk(
  'auth/validateToken',
  async (_, { rejectWithValue, getState }) => {
    try {
      const state = getState();
      const token = state.auth.token;
      
      if (!token) {
        return rejectWithValue({ message: 'No token available' });
      }
      
      const response = await authService.validateToken(token);
      return response.data;
    } catch (error) {
      return rejectWithValue(handleApiError(error));
    }
  }
);

/**
 * Request password reset
 */
export const requestPasswordReset = createAsyncThunk(
  'auth/requestPasswordReset',
  async (email, { rejectWithValue }) => {
    try {
      const response = await authService.requestPasswordReset(email);
      return response.data;
    } catch (error) {
      return rejectWithValue(handleApiError(error));
    }
  }
);

/**
 * Reset password with token
 */
export const resetPassword = createAsyncThunk(
  'auth/resetPassword',
  async (resetData, { rejectWithValue }) => {
    try {
      const response = await authService.resetPassword({
        token: resetData.token,
        newPassword: resetData.newPassword,
        confirmPassword: resetData.confirmPassword
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(handleApiError(error));
    }
  }
);

/**
 * Change password (authenticated user)
 */
export const changePassword = createAsyncThunk(
  'auth/changePassword',
  async (changeData, { rejectWithValue }) => {
    try {
      const response = await authService.changePassword({
        currentPassword: changeData.currentPassword,
        newPassword: changeData.newPassword
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(handleApiError(error));
    }
  }
);

/**
 * Get current user profile
 */
export const getCurrentUser = createAsyncThunk(
  'auth/getCurrentUser',
  async (_, { rejectWithValue }) => {
    try {
      const response = await authService.getCurrentUser();
      return response.data;
    } catch (error) {
      return rejectWithValue(handleApiError(error));
    }
  }
);

/**
 * Update user profile
 */
export const updateUserProfile = createAsyncThunk(
  'auth/updateProfile',
  async (profileData, { rejectWithValue }) => {
    try {
      const response = await authService.updateProfile(profileData);
      return response.data;
    } catch (error) {
      return rejectWithValue(handleApiError(error));
    }
  }
);

/**
 * Verify email with token
 */
export const verifyEmail = createAsyncThunk(
  'auth/verifyEmail',
  async (token, { rejectWithValue }) => {
    try {
      const response = await authService.verifyEmail(token);
      return response.data;
    } catch (error) {
      return rejectWithValue(handleApiError(error));
    }
  }
);

/**
 * Resend verification email
 */
export const resendVerificationEmail = createAsyncThunk(
  'auth/resendVerification',
  async (email, { rejectWithValue }) => {
    try {
      const response = await authService.resendVerificationEmail(email);
      return response.data;
    } catch (error) {
      return rejectWithValue(handleApiError(error));
    }
  }
);

/**
 * Setup 2FA
 */
export const setup2FA = createAsyncThunk(
  'auth/setup2FA',
  async (_, { rejectWithValue }) => {
    try {
      const response = await authService.setup2FA();
      return response.data;
    } catch (error) {
      return rejectWithValue(handleApiError(error));
    }
  }
);

/**
 * Verify 2FA code
 */
export const verify2FA = createAsyncThunk(
  'auth/verify2FA',
  async (code, { rejectWithValue }) => {
    try {
      const response = await authService.verify2FA(code);
      return response.data;
    } catch (error) {
      return rejectWithValue(handleApiError(error));
    }
  }
);

/**
 * Disable 2FA
 */
export const disable2FA = createAsyncThunk(
  'auth/disable2FA',
  async (_, { rejectWithValue }) => {
    try {
      const response = await authService.disable2FA();
      return response.data;
    } catch (error) {
      return rejectWithValue(handleApiError(error));
    }
  }
);

/**
 * Get active sessions
 */
export const getSessions = createAsyncThunk(
  'auth/getSessions',
  async (_, { rejectWithValue }) => {
    try {
      const response = await authService.getSessions();
      return response.data;
    } catch (error) {
      return rejectWithValue(handleApiError(error));
    }
  }
);

/**
 * Revoke a session
 */
export const revokeSession = createAsyncThunk(
  'auth/revokeSession',
  async (sessionId, { rejectWithValue }) => {
    try {
      const response = await authService.revokeSession(sessionId);
      return response.data;
    } catch (error) {
      return rejectWithValue(handleApiError(error));
    }
  }
);

// ==================== AUTH SLICE ====================

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    token: localStorage.getItem('token') || null,
    isAuthenticated: !!localStorage.getItem('token'),
    isLoading: false,
    error: null,
    
    // Auth flow states
    registering: false,
    registerError: null,
    
    passwordResetting: false,
    passwordResetError: null,
    passwordResetSent: false,
    
    // 2FA states
    twoFAEnabled: false,
    twoFASetupLoading: false,
    twoFASetupError: null,
    
    // Session states
    sessions: [],
    sessionsLoading: false,
    sessionsError: null,
    
    // Verification states
    emailVerified: false,
    verificationLoading: false,
    verificationError: null,
  },
  
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearRegisterError: (state) => {
      state.registerError = null;
    },
    clearPasswordResetError: (state) => {
      state.passwordResetError = null;
      state.passwordResetSent = false;
    },
    clear2FAError: (state) => {
      state.twoFASetupError = null;
    },
    clearVerificationError: (state) => {
      state.verificationError = null;
    },
    clearSessionsError: (state) => {
      state.sessionsError = null;
    },
    updateUserLocal: (state, action) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
      }
    },
  },
  
  extraReducers: (builder) => {
    // Register
    builder
      .addCase(registerUser.pending, (state) => {
        state.registering = true;
        state.registerError = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.registering = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
        state.registerError = null;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.registering = false;
        state.registerError = action.payload?.message || 'Registration failed';
      });
    
    // Login
    builder
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.message || 'Login failed';
        state.isAuthenticated = false;
      });
    
    // Logout
    builder
      .addCase(logoutUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.isLoading = false;
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
        state.error = null;
        state.sessions = [];
      })
      .addCase(logoutUser.rejected, (state) => {
        // Still clear local state even if logout fails
        state.isLoading = false;
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
      });
    
    // Refresh Token
    builder
      .addCase(refreshToken.fulfilled, (state, action) => {
        state.token = action.payload.token;
        state.isAuthenticated = true;
      })
      .addCase(refreshToken.rejected, (state) => {
        // If refresh fails, logout user
        state.token = null;
        state.user = null;
        state.isAuthenticated = false;
      });
    
    // Validate Token
    builder
      .addCase(validateToken.fulfilled, (state, action) => {
        state.isAuthenticated = action.payload.valid;
      })
      .addCase(validateToken.rejected, (state) => {
        state.isAuthenticated = false;
        state.token = null;
      });
    
    // Request Password Reset
    builder
      .addCase(requestPasswordReset.pending, (state) => {
        state.passwordResetting = true;
        state.passwordResetError = null;
        state.passwordResetSent = false;
      })
      .addCase(requestPasswordReset.fulfilled, (state) => {
        state.passwordResetting = false;
        state.passwordResetSent = true;
        state.passwordResetError = null;
      })
      .addCase(requestPasswordReset.rejected, (state, action) => {
        state.passwordResetting = false;
        state.passwordResetError = action.payload?.message || 'Failed to send reset email';
      });
    
    // Reset Password
    builder
      .addCase(resetPassword.pending, (state) => {
        state.passwordResetting = true;
        state.passwordResetError = null;
      })
      .addCase(resetPassword.fulfilled, (state) => {
        state.passwordResetting = false;
        state.passwordResetError = null;
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.passwordResetting = false;
        state.passwordResetError = action.payload?.message || 'Failed to reset password';
      });
    
    // Change Password
    builder
      .addCase(changePassword.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(changePassword.fulfilled, (state) => {
        state.isLoading = false;
        state.error = null;
      })
      .addCase(changePassword.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.message || 'Failed to change password';
      });
    
    // Get Current User
    builder
      .addCase(getCurrentUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getCurrentUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(getCurrentUser.rejected, (state) => {
        state.isLoading = false;
        state.isAuthenticated = false;
      });
    
    // Update Profile
    builder
      .addCase(updateUserProfile.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = { ...state.user, ...action.payload };
        state.error = null;
      })
      .addCase(updateUserProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.message || 'Failed to update profile';
      });
    
    // Verify Email
    builder
      .addCase(verifyEmail.pending, (state) => {
        state.verificationLoading = true;
        state.verificationError = null;
      })
      .addCase(verifyEmail.fulfilled, (state) => {
        state.verificationLoading = false;
        state.emailVerified = true;
        state.verificationError = null;
      })
      .addCase(verifyEmail.rejected, (state, action) => {
        state.verificationLoading = false;
        state.verificationError = action.payload?.message || 'Email verification failed';
      });
    
    // Resend Verification
    builder
      .addCase(resendVerificationEmail.pending, (state) => {
        state.verificationLoading = true;
      })
      .addCase(resendVerificationEmail.fulfilled, (state) => {
        state.verificationLoading = false;
      })
      .addCase(resendVerificationEmail.rejected, (state, action) => {
        state.verificationLoading = false;
        state.verificationError = action.payload?.message || 'Failed to send verification email';
      });
    
    // Setup 2FA
    builder
      .addCase(setup2FA.pending, (state) => {
        state.twoFASetupLoading = true;
        state.twoFASetupError = null;
      })
      .addCase(setup2FA.fulfilled, (state) => {
        state.twoFASetupLoading = false;
        state.twoFASetupError = null;
      })
      .addCase(setup2FA.rejected, (state, action) => {
        state.twoFASetupLoading = false;
        state.twoFASetupError = action.payload?.message || 'Failed to setup 2FA';
      });
    
    // Verify 2FA
    builder
      .addCase(verify2FA.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(verify2FA.fulfilled, (state) => {
        state.isLoading = false;
        state.twoFAEnabled = true;
      })
      .addCase(verify2FA.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.message || 'Failed to verify 2FA code';
      });
    
    // Disable 2FA
    builder
      .addCase(disable2FA.fulfilled, (state) => {
        state.twoFAEnabled = false;
      });
    
    // Get Sessions
    builder
      .addCase(getSessions.pending, (state) => {
        state.sessionsLoading = true;
        state.sessionsError = null;
      })
      .addCase(getSessions.fulfilled, (state, action) => {
        state.sessionsLoading = false;
        state.sessions = action.payload;
        state.sessionsError = null;
      })
      .addCase(getSessions.rejected, (state, action) => {
        state.sessionsLoading = false;
        state.sessionsError = action.payload?.message || 'Failed to load sessions';
      });
    
    // Revoke Session
    builder
      .addCase(revokeSession.fulfilled, (state, action) => {
        state.sessions = state.sessions.filter(s => s.id !== action.meta.arg);
      });
  }
});

export const {
  clearError,
  clearRegisterError,
  clearPasswordResetError,
  clear2FAError,
  clearVerificationError,
  clearSessionsError,
  updateUserLocal,
} = authSlice.actions;

// ==================== SELECTORS ====================

export const selectUser = (state) => state.auth.user;
export const selectToken = (state) => state.auth.token;
export const selectIsAuthenticated = (state) => state.auth.isAuthenticated;
export const selectAuthLoading = (state) => state.auth.isLoading;
export const selectAuthError = (state) => state.auth.error;
export const selectRegistering = (state) => state.auth.registering;
export const selectRegisterError = (state) => state.auth.registerError;
export const selectPasswordResetting = (state) => state.auth.passwordResetting;
export const selectPasswordResetError = (state) => state.auth.passwordResetError;
export const selectPasswordResetSent = (state) => state.auth.passwordResetSent;
export const selectTwoFAEnabled = (state) => state.auth.twoFAEnabled;
export const selectSessions = (state) => state.auth.sessions;
export const selectSessionsLoading = (state) => state.auth.sessionsLoading;
export const selectEmailVerified = (state) => state.auth.emailVerified;

export default authSlice.reducer;