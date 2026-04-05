# Auth Service Integration - Complete Guide

## ✅ What Was Integrated

The **api-auth-service** has been fully integrated into your Redux layer with:

### 1. Auth Service File Created
- **File:** `src/api/services/authService.js`
- **Status:** ✅ Complete with 16 methods
- **Methods:**
  - `register()` - Create new user account
  - `login()` - User authentication
  - `logout()` - Clear session
  - `refreshToken()` - Refresh JWT token
  - `validateToken()` - Check token validity
  - `requestPasswordReset()` - Email reset link
  - `resetPassword()` - Reset with token
  - `changePassword()` - Authenticated password change
  - `getCurrentUser()` - Get user profile
  - `updateProfile()` - Update user info
  - `verifyEmail()` - Email verification
  - `resendVerificationEmail()` - Resend verification
  - `setup2FA()` - Enable two-factor auth
  - `verify2FA()` - Verify 2FA code
  - `disable2FA()` - Disable 2FA
  - `getSessions()` / `revokeSession()` - Session management

### 2. Auth Slice Updated
- **File:** `src/redux/slices/authSlice.js`
- **Status:** ✅ Updated with 16+ async thunks
- **Thunks Added:**
  - `registerUser` - async thunk for registration
  - `loginUser` - async thunk for login
  - `logoutUser` - async thunk for logout
  - `refreshToken` - refresh JWT
  - `validateToken` - check token validity
  - `requestPasswordReset` - request password reset
  - `resetPassword` - reset password with token
  - `changePassword` - change authenticated user password
  - `getCurrentUser` - fetch current user profile
  - `updateUserProfile` - update user info
  - `verifyEmail` - verify email address
  - `resendVerificationEmail` - resend verification
  - `setup2FA` - enable 2FA
  - `verify2FA` - verify 2FA code
  - `disable2FA` - disable 2FA
  - `getSessions` - get active sessions
  - `revokeSession` - revoke a session

### 3. API Configuration Updated
- **File:** `src/config/apiConfig.js`
- **Added:** `AUTH` URL entry
- **Current Value:** `https://localhost:7001/api` (adjustable)

### 4. Services Index Updated
- **File:** `src/api/services/index.js`
- **Added:** `authService` export

### 5. Axios Instance Enhanced
- **File:** `src/api/axiosInstance.js`
- **Enhanced:** Support for `skipAuthHeader` option
- **Benefit:** Auth endpoints (login/register) don't include token headers

---

## 🔧 Configuration Required

**⚠️ UPDATE THE AUTH SERVICE PORT:**

If your api-auth-service runs on a different port than `7001`, update:

**File:** `src/config/apiConfig.js`

```javascript
AUTH: process.env.REACT_APP_AUTH_URL || 'https://localhost:YOUR_PORT/api'
```

Or set environment variable in `.env.local`:
```
REACT_APP_AUTH_URL=https://localhost:7001/api
```

---

## 📚 All 16+ Async Thunks

### Authentication Flow (4 Thunks)
```javascript
import { registerUser, loginUser, logoutUser, validateToken } from '../redux/slices/authSlice';

// Register new user
dispatch(registerUser({
  email: 'user@example.com',
  password: 'SecurePass123!',
  firstName: 'John',
  lastName: 'Doe',
  phone: '+1-555-0000'
}));

// Login user
dispatch(loginUser({
  email: 'user@example.com',
  password: 'SecurePass123!'
}));

// Logout
dispatch(logoutUser());

// Validate token
dispatch(validateToken());
```

### Token Management (2 Thunks)
```javascript
// Refresh JWT token
dispatch(refreshToken());

// Validate current token
dispatch(validateToken());
```

### Password Management (3 Thunks)
```javascript
// Request password reset email
dispatch(requestPasswordReset('user@example.com'));

// Reset password with token
dispatch(resetPassword({
  token: 'reset_token_from_email',
  newPassword: 'NewPass123!',
  confirmPassword: 'NewPass123!'
}));

// Change password (authenticated user)
dispatch(changePassword({
  currentPassword: 'OldPass123!',
  newPassword: 'NewPass123!'
}));
```

### User Profile Management (3 Thunks)
```javascript
// Get current user profile
dispatch(getCurrentUser());

// Update user profile
dispatch(updateUserProfile({
  firstName: 'Jane',
  lastName: 'Smith',
  phone: '+1-555-1234'
}));

// Update any profile fields
dispatch(updateUserProfile({
  profileImage: 'url...',
  bio: 'My bio',
  // ... any fields your auth service accepts
}));
```

### Email Verification (2 Thunks)
```javascript
// Verify email with token from email
dispatch(verifyEmail('verification_token'));

// Resend verification email
dispatch(resendVerificationEmail('user@example.com'));
```

### Two-Factor Authentication (3 Thunks)
```javascript
// Setup 2FA (returns QR code)
dispatch(setup2FA());

// Verify 2FA code
dispatch(verify2FA('123456'));

// Disable 2FA
dispatch(disable2FA());
```

### Session Management (2 Thunks)
```javascript
// Get all active sessions
dispatch(getSessions());

// Revoke a specific session
dispatch(revokeSession('session_id'));
```

---

## 💡 Usage Examples

### Example 1: Login Page

```javascript
import { useDispatch, useSelector } from 'react-redux';
import { loginUser, selectAuthError, selectAuthLoading } from '../redux/slices/authSlice';

function Login() {
  const dispatch = useDispatch();
  const loading = useSelector(selectAuthLoading);
  const error = useSelector(selectAuthError);

  const handleLogin = async (email, password) => {
    const result = await dispatch(loginUser({ email, password }));
    
    if (result.payload) {
      // Success - navigate to dashboard
      navigate('/dashboard');
    } else {
      // Error already in Redux state (shown by error selector)
    }
  };

  return (
    <form onSubmit={(e) => {
      e.preventDefault();
      handleLogin(email, password);
    }}>
      <input type="email" placeholder="Email" />
      <input type="password" placeholder="Password" />
      <button disabled={loading}>{loading ? 'Logging in...' : 'Login'}</button>
      {error && <p className="error">{error}</p>}
    </form>
  );
}
```

### Example 2: Register Page

```javascript
import { registerUser, selectRegisterError, selectRegistering } from '../redux/slices/authSlice';

function Register() {
  const dispatch = useDispatch();
  const registering = useSelector(selectRegistering);
  const registerError = useSelector(selectRegisterError);

  const handleRegister = async (formData) => {
    const result = await dispatch(registerUser(formData));
    
    if (result.payload) {
      // Success - user registered and logged in
      navigate('/dashboard');
    }
  };

  return (
    <form onSubmit={(e) => {
      e.preventDefault();
      handleRegister({
        email: form.email,
        password: form.password,
        firstName: form.firstName,
        lastName: form.lastName,
        phone: form.phone
      });
    }}>
      {/* Form fields */}
      <button disabled={registering}>{registering ? 'Creating...' : 'Register'}</button>
      {registerError && <p className="error">{registerError}</p>}
    </form>
  );
}
```

### Example 3: Logout

```javascript
import { logoutUser } from '../redux/slices/authSlice';

function LogoutButton() {
  const dispatch = useDispatch();

  const handleLogout = async () => {
    await dispatch(logoutUser());
    navigate('/login');
  };

  return <button onClick={handleLogout}>Logout</button>;
}
```

### Example 4: Protected Route with Token Validation

```javascript
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { validateToken, selectIsAuthenticated } from '../redux/slices/authSlice';

function ProtectedRoute({ children }) {
  const dispatch = useDispatch();
  const isAuthenticated = useSelector(selectIsAuthenticated);

  useEffect(() => {
    // Validate token on component mount
    dispatch(validateToken());
  }, [dispatch]);

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return children;
}
```

### Example 5: Refresh Token on Expiry

```javascript
// In app-level error handler or interceptor
import { refreshToken } from '../redux/slices/authSlice';

// If API returns 401 (token expired), refresh and retry
const handle401Error = async (dispatch) => {
  const result = await dispatch(refreshToken());
  
  if (result.payload) {
    // Token refreshed, retry original request
    return true;
  } else {
    // Refresh failed, redirect to login
    window.location.href = '/login';
  }
};
```

### Example 6: Update User Profile

```javascript
import { updateUserProfile } from '../redux/slices/authSlice';

function AccountSettings() {
  const dispatch = useDispatch();
  const user = useSelector(selectUser);

  const handleSaveProfile = async (updatedData) => {
    const result = await dispatch(updateUserProfile({
      firstName: updatedData.firstName,
      lastName: updatedData.lastName,
      phone: updatedData.phone
    }));

    if (result.payload) {
      showSuccess('Profile updated!');
    }
  };

  return (
    <form onSubmit={(e) => {
      e.preventDefault();
      handleSaveProfile(formData);
    }}>
      {/* Form fields prefilled with user data */}
    </form>
  );
}
```

---

## 📊 Redux State Structure for Auth

```javascript
{
  auth: {
    // User data
    user: null | {
      id: number,
      email: string,
      firstName: string,
      lastName: string,
      phone: string,
      emailVerified: boolean,
      // ... other fields
    },
    
    // Token
    token: null | string, // JWT token
    isAuthenticated: boolean, // true if logged in
    
    // Login/Logout states
    isLoading: boolean,
    error: null | string,
    
    // Registration
    registering: boolean,
    registerError: null | string,
    
    // Password reset
    passwordResetting: boolean,
    passwordResetError: null | string,
    passwordResetSent: boolean,
    
    // 2FA
    twoFAEnabled: boolean,
    twoFASetupLoading: boolean,
    twoFASetupError: null | string,
    
    // Sessions
    sessions: Array,
    sessionsLoading: boolean,
    sessionsError: null | string,
    
    // Email verification
    emailVerified: boolean,
    verificationLoading: boolean,
    verificationError: null | string,
  }
}
```

---

## 🎯 All Available Selectors

```javascript
import {
  selectUser,                 // Current user object
  selectToken,               // JWT token
  selectIsAuthenticated,     // Is logged in?
  selectAuthLoading,         // Login/logout loading
  selectAuthError,           // Login/logout error
  selectRegistering,         // Registration in progress?
  selectRegisterError,       // Registration error
  selectPasswordResetting,   // Password reset in progress?
  selectPasswordResetError,  // Password reset error
  selectPasswordResetSent,   // Was reset email sent?
  selectTwoFAEnabled,        // Is 2FA enabled?
  selectSessions,            // Active sessions list
  selectSessionsLoading,     // Sessions loading?
  selectEmailVerified,       // Is email verified?
} from '../redux/slices/authSlice';
```

---

## 🔐 Security Considerations

### 1. Token Storage
- Token automatically stored in `localStorage` on successful login
- Token automatically removed on logout
- Token checked on app initialization

### 2. Protected Headers
- Auth token automatically injected in `Authorization: Bearer {token}` header
- Except for public endpoints (login, register) where header is skipped

### 3. Token Refresh
- Call `refreshToken()` async thunk when token expires
- Returns new token automatically stored

### 4. Session Management
- Get active sessions to detect suspicious logins
- Revoke sessions to force logout from other devices

### 5. 2FA Support
- Setup 2FA with QR code
- Verify with one-time code
- Enhance account security

---

## 📝 API Request/Response Format

### Login Request
```javascript
POST /api/auth/login
{
  "email": "user@example.com",
  "password": "SecurePass123!"
}
```

### Login Response
```javascript
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "phone": "+1-555-0000",
    "emailVerified": false,
    "twoFAEnabled": false
  },
  "expiresIn": 3600
}
```

### Register Request
```javascript
POST /api/auth/register
{
  "email": "newuser@example.com",
  "password": "SecurePass123!",
  "firstName": "Jane",
  "lastName": "Smith",
  "phone": "+1-555-1111"
}
```

### Register Response
```javascript
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": { /* user object */ },
  "expiresIn": 3600,
  "message": "Registration successful"
}
```

---

## 🚀 Ready for Phase 3

Your auth service is now ready to be integrated into React components. 

**Next Steps:**
1. ✅ Auth service created and exported
2. ✅ Async thunks ready for components
3. ✅ Redux state configured
4. ✅ Selectors available
5. 🔄 Components need updating:
   - `src/pages/Login.js` - Use `loginUser` thunk
   - `src/pages/Register.js` - Use `registerUser` thunk
   - `src/pages/Account.js` - Use `updateUserProfile` thunk
   - Header/Navbar - Use `selectUser` and `logoutUser`
   - Protected routes - Use `selectIsAuthenticated`

---

## ⚙️ Configuration Checklist

Before Phase 3:

- [ ] Auth service port correct in `apiConfig.js`
- [ ] `.env.local` has `REACT_APP_AUTH_URL` (if needed)
- [ ] `authService.js` exported correctly
- [ ] `authSlice.js` has all thunks
- [ ] Redux store includes `auth` reducer (already configured)
- [ ] No console errors on import

---

## 🧪 Testing the Integration

### Test in Browser Console

```javascript
// Assuming store is exposed globally

// Register
store.dispatch(registerUser({
  email: 'test@example.com',
  password: 'Test1234!',
  firstName: 'Test',
  lastName: 'User',
  phone: '555-0000'
}))
  .then(result => console.log('Registered:', result.payload))
  .catch(err => console.error('Error:', err));

// Login
store.dispatch(loginUser({
  email: 'test@example.com',
  password: 'Test1234!'
}))
  .then(result => console.log('Logged in:', result.payload))
  .catch(err => console.error('Error:', err));

// Check state
console.log(store.getState().auth);
```

---

## 📞 Support

If you have issues:

1. Check Redux DevTools for auth actions
2. Check Network tab for API requests
3. Check browser console for errors
4. Verify auth service port in `apiConfig.js`
5. Check that auth token is in localStorage after login

---

**Status:** ✅ Auth Service Integration Complete  
**Next:** Phase 3 - Update React Components  
**Estimated Component Update Time:** 1-2 hours

**Auth service is ready! 🔐**
