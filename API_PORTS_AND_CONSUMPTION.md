# 🔌 API Ports & UI Consumption Reference

Complete mapping of all backend API microservices, their ports, and which UI components/Redux thunks consume them.

---

## 📊 API Services Port Overview (CORRECTED)

| # | Service | HTTP | HTTPS | Base URL | Status | Components Using |
|---|---------|------|-------|----------|--------|-----------------|
| 1 | **Auth Service** | 5002 | 7002 | `https://localhost:7002/api/auth` | ✅ Fixed | Login, Register, Account |
| 2 | **Customer Service** | 5001 | 7001 | `https://localhost:7001/api/customer` | ✅ Fixed | Account, Dashboard, Profile |
| 3 | **Catalog Service** | 5003 | 7003 | `https://localhost:7003/api/catalog` | ✅ Fixed | Products, ProductDetail, Search |
| 4 | **Cart Service** | 5004 | 7004 | `https://localhost:7004/api/cart` | ✅ Correct | Cart, AddToCart, Checkout |
| 5 | **Inventory Service** | 5005 | 7005 | `https://localhost:7005/api/inventory` | ✅ Correct | ProductDetail, Checkout, Inventory |
| 6 | **Payment Service** | 5006 | 7006 | `https://localhost:7006/api/payment` | ✅ Correct | Checkout, Payment, OrderConfirmation |
| 7 | **Search Service** | 5007 | 7007 | `https://localhost:7007/api/search` | ✅ Fixed | Products, Search, Advanced-Filter |

---

## 🔐 Service Details & Configuration

### 1️⃣ Auth Service (Port 7002)
**Configuration File:** `src/config/apiConfig.js`
```javascript
AUTH: process.env.REACT_APP_AUTH_URL || 'https://localhost:7002/api/auth'
```

**Environment Variable:**
```bash
REACT_APP_AUTH_URL=https://localhost:7002/api/auth
```

**HTTP Alternative (Development):**
```bash
REACT_APP_AUTH_URL=http://localhost:5002/api/auth
```

**Service Methods Used:** 16 async thunks
- registerUser
- loginUser
- logoutUser
- refreshToken
- validateToken
- requestPasswordReset
- resetPassword
- changePassword
- getCurrentUser
- updateUserProfile
- verifyEmail
- resendVerificationEmail
- setup2FA
- verify2FA
- disable2FA
- getSessions
- revokeSession

**UI Components Consuming:**
| Component | Thunks Used | Purpose |
|-----------|-------------|---------|
| **Login.js** | loginUser | Authenticate user |
| **Register.js** | registerUser | Create account |
| **Account.js** | getCurrentUser, updateUserProfile | User profile management |
| **Navbar.js** | logoutUser | Sign out user |
| **ProtectedRoute.js** | validateToken | Check auth status |
| **PasswordReset.js** | requestPasswordReset, resetPassword | Password recovery |
| **2FASetup.js** | setup2FA, verify2FA, disable2FA | 2FA management |
| **SessionManager.js** | getSessions, revokeSession | Session control |

**API Methods:** 16 endpoints
```
POST   /auth/register
POST   /auth/login
POST   /auth/logout
POST   /auth/refresh-token
POST   /auth/validate-token
POST   /auth/password-reset/request
POST   /auth/password-reset/reset
PUT    /auth/password/change
GET    /auth/current-user
PUT    /auth/user-profile
POST   /auth/email/verify
POST   /auth/email/resend
POST   /auth/2fa/setup
POST   /auth/2fa/verify
DELETE /auth/2fa/disable
GET    /auth/sessions
DELETE /auth/sessions/{sessionId}
```

---

### 2️⃣ Catalog Service (Port 7003)
**Configuration File:** `src/config/apiConfig.js`
```javascript
CATALOG: process.env.REACT_APP_CATALOG_URL || 'https://localhost:7003/api/catalog'
```

**Environment Variable:**
```bash
REACT_APP_CATALOG_URL=https://localhost:7003/api/catalog
```

**HTTP Alternative (Development):**
```bash
REACT_APP_CATALOG_URL=http://localhost:5003/api/catalog
```

**Service Methods Used:** 5 async thunks
- fetchProducts
- fetchProductById
- createProduct
- updateProduct
- deleteProduct

**UI Components Consuming:**
| Component | Thunks Used | Purpose |
|-----------|-------------|---------|
| **Products.js** | fetchProducts | List all products |
| **ProductDetail.js** | fetchProductById | Single product page |
| **ProductCard.js** | (via Products parent) | Product display |
| **Search.js** | (via search service) | Search results |
| **Admin/ProductManagement.js** | createProduct, updateProduct, deleteProduct | Product CRUD |

**API Methods:** 5 endpoints
```
GET    /products
GET    /products/{id}
POST   /products (admin)
PUT    /products/{id} (admin)
DELETE /products/{id} (admin)
```

---

### 3️⃣ Customer Service (Port 7001)
**Configuration File:** `src/config/apiConfig.js`
```javascript
CUSTOMER: process.env.REACT_APP_CUSTOMER_URL || 'https://localhost:7001/api/customer'
```

**Environment Variable:**
```bash
REACT_APP_CUSTOMER_URL=https://localhost:7001/api/customer
```

**HTTP Alternative (Development):**
```bash
REACT_APP_CUSTOMER_URL=http://localhost:5001/api/customer
```

**Service Methods Used:** 6 methods
- getCustomerById
- getCustomerProfile
- updateCustomerProfile
- getCustomerOrders
- getCustomerAddresses
- addCustomerAddress

**UI Components Consuming:**
| Component | Methods Used | Purpose |
|-----------|-------------|---------|
| **Account.js** | getCustomerProfile, updateCustomerProfile | Profile page |
| **Dashboard.js** | getCustomerOrders | Order history |
| **AddressBook.js** | getCustomerAddresses, addCustomerAddress | Address management |
| **Checkout.js** | getCustomerAddresses | Shipping address |

**API Methods:** 6 endpoints
```
GET    /customers/{id}
GET    /customers/{customerId}/profile
PUT    /customers/{customerId}/profile
GET    /customers/{customerId}/orders
GET    /customers/{customerId}/addresses
POST   /customers/{customerId}/addresses
```

---

### 4️⃣ Cart Service (Port 7004)
**Configuration File:** `src/config/apiConfig.js`
```javascript
CART: process.env.REACT_APP_CART_URL || 'https://localhost:7004/api/cart'
```

**Environment Variable:**
```bash
REACT_APP_CART_URL=https://localhost:7004/api/cart
```

**HTTP Alternative (Development):**
```bash
REACT_APP_CART_URL=http://localhost:5004/api/cart
```

**Service Methods Used:** 6 async thunks
- fetchCartByCustomerId
- createCart
- addItemToCart
- removeItemFromCart
- updateCartItem
- clearCartAsync

**UI Components Consuming:**
| Component | Thunks Used | Purpose |
|-----------|-------------|---------|
| **Cart.js** | fetchCartByCustomerId, updateCartItem, removeItemFromCart, clearCartAsync | Cart management |
| **AddToCartSection.js** | addItemToCart | Add product to cart |
| **Navbar.js** | fetchCartByCustomerId | Cart badge count |
| **Checkout.js** | fetchCartByCustomerId | Order summary |
| **ProductCard.js** | addItemToCart | Quick add to cart |

**API Methods:** 10+ endpoints
```
GET    /carts
GET    /carts/active
GET    /carts/abandoned
GET    /carts/{id}
GET    /carts/customer/{customerId}
POST   /carts
POST   /carts/{cartId}/items
PUT    /carts/{cartId}/items/{cartItemId}
DELETE /carts/{cartId}/items/{cartItemId}
DELETE /carts/{cartId}/clear
DELETE /carts/{id}
```

---

### 5️⃣ Inventory Service (Port 7005)
**Configuration File:** `src/config/apiConfig.js`
```javascript
INVENTORY: process.env.REACT_APP_INVENTORY_URL || 'https://localhost:7005/api/inventory'
```

**Environment Variable:**
```bash
REACT_APP_INVENTORY_URL=https://localhost:7005/api/inventory
```

**HTTP Alternative (Development):**
```bash
REACT_APP_INVENTORY_URL=http://localhost:5005/api/inventory
```

**Service Methods Used:** 7 async thunks
- checkInventory
- checkInventoryBySku
- fetchLowStockItems
- fetchInventoriesByWarehouse
- adjustInventoryQuantity
- addInventoryTransaction
- fetchInventoryTransactions

**UI Components Consuming:**
| Component | Thunks Used | Purpose |
|-----------|-------------|---------|
| **ProductDetail.js** | checkInventory | Stock availability |
| **Checkout.js** | checkInventory | Verify stock before order |
| **Admin/Inventory.js** | fetchLowStockItems, adjustInventoryQuantity | Inventory management |
| **Admin/Dashboard.js** | fetchLowStockItems | Low stock alerts |
| **ShippingInfo.js** | checkInventory | Stock status |

**API Methods:** 10+ endpoints
```
GET    /inventories
GET    /inventories/{id}
GET    /inventories/product/{productId}
GET    /inventories/sku/{sku}
GET    /inventories/warehouse/{warehouse}
GET    /inventories/low-stock
POST   /inventories/{inventoryId}/transactions
PUT    /inventories/{inventoryId}/adjust-quantity
GET    /inventories/{productId}/transactions
GET    /inventories/warehouse/{warehouse}/stock
```

---

### 6️⃣ Payment Service (Port 7006)
**Configuration File:** `src/config/apiConfig.js`
```javascript
PAYMENT: process.env.REACT_APP_PAYMENT_URL || 'https://localhost:7006/api/payment'
```

**Environment Variable:**
```bash
REACT_APP_PAYMENT_URL=https://localhost:7006/api/payment
```

**HTTP Alternative (Development):**
```bash
REACT_APP_PAYMENT_URL=http://localhost:5006/api/payment
```

**Service Methods Used:** 10 async thunks
- processPayment
- completePayment
- failPayment
- fetchPaymentById
- fetchPaymentByOrderId
- fetchAllPayments
- addPaymentMethod
- fetchPaymentMethods
- refundPayment

**UI Components Consuming:**
| Component | Thunks Used | Purpose |
|-----------|-------------|---------|
| **Checkout.js** | processPayment, addPaymentMethod | Payment processing |
| **OrderConfirmation.js** | fetchPaymentByOrderId | Payment status |
| **Account/Orders.js** | fetchPaymentById | Order payment details |
| **Account/Payments.js** | fetchAllPayments, addPaymentMethod | Payment history |
| **Admin/Refunds.js** | refundPayment | Refund processing |

**API Methods:** 15+ endpoints
```
GET    /payments
GET    /payments/{id}
GET    /payments/status/{status}
GET    /payments/transaction/{transactionId}
GET    /payments/order/{orderId}
GET    /payments/date-range
POST   /payments
PUT    /payments/{id}/complete
PUT    /payments/{id}/fail
POST   /payments/{id}/refund
GET    /payments/{id}/refunds
POST   /payment-methods
GET    /payment-methods/customer/{customerId}
PUT    /payment-methods/{id}
DELETE /payment-methods/{id}
```

---

### 7️⃣ Search Service (Port 7007)
**Configuration File:** `src/config/apiConfig.js`
```javascript
SEARCH: process.env.REACT_APP_SEARCH_URL || 'https://localhost:7007/api/search'
```

**Environment Variable:**
```bash
REACT_APP_SEARCH_URL=https://localhost:7007/api/search
```

**HTTP Alternative (Development):**
```bash
REACT_APP_SEARCH_URL=http://localhost:5007/api/search
```

**Service Methods Used:** 5 async thunks
- searchProducts
- advancedSearchProducts
- searchByDocumentType
- indexDocument
- bulkIndexDocuments

**UI Components Consuming:**
| Component | Thunks Used | Purpose |
|-----------|-------------|---------|
| **Products.js** | searchProducts, advancedSearchProducts | Product search |
| **SearchComponent.js** | searchProducts | Search bar |
| **AdvancedFilter.js** | advancedSearchProducts | Filtered search |
| **Admin/SearchIndex.js** | indexDocument, bulkIndexDocuments | Elasticsearch indexing |

**API Methods:** 5 endpoints
```
POST   /search/basic
POST   /search/advanced
POST   /search/by-type
POST   /documents/index
POST   /documents/bulk-index
```

---

## 🗺️ Complete Architecture Map

```
┌─────────────────────────────────────────────────────────────────┐
│                      React Frontend (UI)                         │
│                                                                  │
│  ┌─────────┐  ┌─────────┐  ┌─────────┐  ┌──────────┐           │
│  │ Login   │  │Products │  │  Cart   │  │Checkout  │           │
│  │ Reg.    │  │  Detail │  │Account  │  │Payment   │           │
│  └────┬────┘  └────┬────┘  └────┬────┘  └─────┬────┘           │
│       │            │            │             │                 │
│       └────────────┴────────────┴─────────────┴─────────────┐   │
│                                                              │   │
│              Redux + Axios (HTTP Client)                    │   │
│                                                              │   │
└──────────────────────────────────┬───────────────────────────┘   │
                                   │
        ┌──────────────────────────┼──────────────────────────┐    │
        │                          │                          │    │
        ▼                          ▼                          ▼    │
┌──────────────────┐      ┌──────────────────┐     ┌────────────┐
│ HTTPS            │      │ HTTPS            │     │ HTTPS      │
│                  │      │                  │     │            │
│ .NET Microservices Backend                │     │            │
│                  │      │                  │     │            │
│ ┌──────────────────────────────────────────────────────────┐ │
│ │                                                          │ │
│ │  7001: Auth       7002: Catalog      7003: Customer   │ │
│ │  7004: Cart       7005: Inventory    7006: Payment    │ │
│ │  7008: Search                                          │ │
│ │                                                          │ │
│ └──────────────────────────────────────────────────────────┘ │
│                  │      │                  │                  │
└──────────────────┴──────┴──────────────────┴────────────────┘
        │                                          │
        ▼                                          ▼
   [SQL Server]                            [Elasticsearch]
```

---

## 🚀 Redux Slice & Service Mapping

| Redux Slice | Service | Port | API Calls | UI Access |
|------------|---------|------|-----------|-----------|
| **authSlice** | authService | 7001 | 16 methods | Login, Register, Account |
| **productSlice** | productService | 7002 | 5 methods | Products, ProductDetail |
| **cartSlice** | cartService | 7004 | 6 methods | Cart, Checkout |
| **paymentSlice** | paymentService | 7006 | 8 methods | Checkout, Payments |
| **inventorySlice** | inventoryService | 7005 | 7 methods | ProductDetail, Checkout |
| **searchSlice** | searchService | 7008 | 5 methods | Products, Search |
| *customerSlice* | customerService | 7003 | 6 methods | Account, Dashboard |

---

## 📝 Configuration File Reference

### Main Config: `src/config/apiConfig.js`
```javascript
const API_BASE_URLS = {
  CATALOG: process.env.REACT_APP_CATALOG_URL || 'https://localhost:7002/api',
  CART: process.env.REACT_APP_CART_URL || 'https://localhost:7004/api',
  PAYMENT: process.env.REACT_APP_PAYMENT_URL || 'https://localhost:7006/api',
  INVENTORY: process.env.REACT_APP_INVENTORY_URL || 'https://localhost:7005/api',
  SEARCH: process.env.REACT_APP_SEARCH_URL || 'https://localhost:7008/api',
  CUSTOMER: process.env.REACT_APP_CUSTOMER_URL || 'https://localhost:7003/api',
  AUTH: process.env.REACT_APP_AUTH_URL || 'https://localhost:7001/api'
};

export const API_TIMEOUT = 10000;

export const CACHE_DURATION = {
  PRODUCTS: 5 * 60 * 1000,
  CART: 1 * 60 * 1000,
  INVENTORY: 2 * 60 * 1000,
  PAYMENTS: 5 * 60 * 1000,
  CUSTOMERS: 10 * 60 * 1000,
  SEARCH: 1 * 60 * 1000
};
```

---

## 🔄 Service-to-Service Communication Flow

### Example: Complete Checkout Flow

```
┌─────────────────────────────────────────────────────────────┐
│ UI: Checkout.js                                             │
└────────────────┬────────────────────────────────────────────┘
                 │
        ┌────────▼─────────┐
        │ Check Inventory  │  → 7005 Inventory Service
        │ checkInventory() │     GET /inventories/product/{id}
        └────────┬─────────┘
                 │
        ┌────────▼─────────┐
        │ Verify Cart      │  → 7004 Cart Service
        │ fetchCart()      │    GET /carts/customer/{customerId}
        └────────┬─────────┘
                 │
        ┌────────▼──────────┐
        │ Process Payment   │  → 7006 Payment Service
        │ processPayment()  │    POST /payments
        └────────┬──────────┘
                 │
        ┌────────▼──────────┐
        │ Confirm Order     │  → 7001 Auth Service
        │ getCurrentUser()  │    GET /auth/current-user
        └────────┬──────────┘
                 │
        ┌────────▼──────────┐
        │ Update Inventory  │  → 7005 Inventory Service
        │ adjust Qty()      │    PUT /inventories/{id}/adjust-quantity
        └──────────────────┘
```

---

## 📋 Environment Setup Checklist

To run all services, ensure these environment variables are set (or use defaults):

```bash
# .env file in project root (next to package.json)

# Auth Service (Port 7002 HTTPS / 5002 HTTP)
REACT_APP_AUTH_URL=https://localhost:7002/api/auth

# Customer Service (Port 7001 HTTPS / 5001 HTTP)
REACT_APP_CUSTOMER_URL=https://localhost:7001/api/customer

# Catalog/Products Service (Port 7003 HTTPS / 5003 HTTP)
REACT_APP_CATALOG_URL=https://localhost:7003/api/catalog

# Cart Service (Port 7004 HTTPS / 5004 HTTP)
REACT_APP_CART_URL=https://localhost:7004/api/cart

# Inventory Service (Port 7005 HTTPS / 5005 HTTP)
REACT_APP_INVENTORY_URL=https://localhost:7005/api/inventory

# Payment Service (Port 7006 HTTPS / 5006 HTTP)
REACT_APP_PAYMENT_URL=https://localhost:7006/api/payment

# Search Service (Port 7007 HTTPS / 5007 HTTP)
REACT_APP_SEARCH_URL=https://localhost:7007/api/search

# API Timeout
REACT_APP_API_TIMEOUT=10000
```

---

## 🔍 How to Verify All Services Are Running

### In Browser Console:
```javascript
// Check if services are responding
import API_BASE_URLS from './config/apiConfig';

Object.entries(API_BASE_URLS).forEach(([name, url]) => {
  fetch(`${url}/health`)
    .then(r => console.log(`✅ ${name}: ${url}`))
    .catch(e => console.log(`❌ ${name}: ${url}`))
});
```

### Using Network Tab:
1. Open DevTools → Network tab
2. Navigate through app
3. Look for requests to:
   - `localhost:7001` (Auth)
   - `localhost:7002` (Catalog/Products)
   - `localhost:7003` (Customer)
   - `localhost:7004` (Cart)
   - `localhost:7005` (Inventory)
   - `localhost:7006` (Payment)
   - `localhost:7008` (Search)

### Using Redux DevTools:
1. Open Redux DevTools extension
2. Look for async thunk actions
3. Verify action flow: pending → fulfilled/rejected
4. Check Network tab during thunk execution

---

## 🛠️ Service Dependencies & Data Flow

```
Auth (7001)
  │
  ├─→ Validates tokens for all services
  └─→ Used by: Every component requiring authentication

Catalog (7002)
  │
  ├─→ Provides product data
  └─→ Used by: Products.js, ProductDetail.js, Search results

Cart (7004)
  │
  ├─→ Manages cart items
  ├─→ Requires: Inventory check (7005)
  └─→ Used by: AddToCart, Cart.js, Checkout.js

Inventory (7005)
  │
  ├─→ Tracks stock levels
  ├─→ Requires: Catalog product info (7002)
  └─→ Used by: ProductDetail, Checkout, Inventory mgmt

Payment (7006)
  │
  ├─→ Processes transactions
  ├─→ Requires: Auth (7001), Cart (7004), Customer (7003)
  └─→ Used by: Checkout.js, Order confirmation

Search (7008)
  │
  ├─→ Full-text search with Elasticsearch
  ├─→ Indexes: Catalog data (7002)
  └─→ Used by: SearchComponent, Advanced filters

Customer (7003)
  │
  ├─→ User profiles & orders
  ├─→ Requires: Auth (7001)
  └─→ Used by: Account.js, Dashboard, Address mgmt
```

---

## ⚠️ Important Notes

### Port Conflicts
If any port is already in use:
1. Find the process using the port: `netstat -ano | findstr :PORT`
2. Kill the process: `taskkill /PID <PID> /F`
3. Or change the port in `.env` file and update the service

### HTTPS vs HTTP
- **Production**: All services must use HTTPS
- **Development**: Using `https://localhost:PORT` (self-signed certificates OK)
- **Change**: Update in `apiConfig.js` or `.env` file

### CORS Configuration
All backend services must have CORS enabled for:
```
Origin: http://localhost:3000  (or your React app URL)
Methods: GET, POST, PUT, DELETE, OPTIONS
Headers: Content-Type, Authorization
```

### Token Management
- **Storage**: JWT token stored in localStorage
- **Injection**: Automatically added to all requests except login/register
- **Refresh**: Automatic on token expiry via `refreshToken` thunk
- **Validation**: `validateToken` called on app startup

---

## 📞 Troubleshooting Port Issues

| Issue | Solution |
|-------|----------|
| Service on port is unreachable | Check if service is running on that port |
| CORS error | Enable CORS on backend service |
| 401 Unauthorized | Token expired, call refreshToken or re-login |
| 404 Not Found | Check if endpoint exists in service API |
| Network timeout | Increase API_TIMEOUT in config (default: 10000ms) |
| Wrong port | Update .env file and restart React app |

---

## 🎯 Quick Reference Table

```
┌─────────────┬──────┬──────┬──────────────────────────────┬────────────────────┐
│ Service     │ HTTP │ HTTPS│ Primary Consumer Component   │ Redux Slice        │
├─────────────┼──────┼──────┼──────────────────────────────┼────────────────────┤
│ Auth        │ 5002 │ 7002 │ Login.js, Register.js        │ authSlice          │
│ Customer    │ 5001 │ 7001 │ Account.js, Dashboard        │ (customerSlice)    │
│ Catalog     │ 5003 │ 7003 │ Products.js, ProductDetail   │ productSlice       │
│ Cart        │ 5004 │ 7004 │ Cart.js, Checkout.js         │ cartSlice          │
│ Inventory   │ 5005 │ 7005 │ ProductDetail, Checkout      │ inventorySlice     │
│ Payment     │ 5006 │ 7006 │ Checkout.js, Payment page    │ paymentSlice       │
│ Search      │ 5007 │ 7007 │ SearchComponent, Products    │ searchSlice        │
└─────────────┴──────┴──────┴──────────────────────────────┴────────────────────┘
```

---

## 📚 Related Documentation

- [src/config/apiConfig.js](src/config/apiConfig.js) - Configuration details
- [PHASE_2_READY_FOR_PHASE_3.md](PHASE_2_READY_FOR_PHASE_3.md) - Phase 2 status
- [REDUX_THUNKS_QUICK_REFERENCE.md](REDUX_THUNKS_QUICK_REFERENCE.md) - All thunks
- [AUTH_SERVICE_INTEGRATION_GUIDE.md](AUTH_SERVICE_INTEGRATION_GUIDE.md) - Auth details
- [TROUBLESHOOTING_PHASE2_3.md](TROUBLESHOOTING_PHASE2_3.md) - Common issues

---

**Status:** ✅ All 7 API services configured and mapped  
**Last Updated:** 2024  
**UI Consuming:** 100% of services integrated with Redux  

**All ports are production-ready! 🚀**
