# E-Commerce API Integration Plan

## Overview

This document outlines the complete integration strategy for connecting the React frontend with the C# microservices backend. The backend consists of 6 independent services following a standard .NET 8.0 architecture with SQL Server databases and RabbitMQ for event-driven communication.

**Service Architecture:**
- **api-catalog-service** - Product catalog management
- **api-cart-service** - Shopping cart operations
- **api-payment-service** - Payment processing
- **api-inventory-service** - Stock/inventory tracking
- **api-search-service** - Product search with Elasticsearch
- **api-customer-service** - Customer profiles & management

**Frontend Stack:**
- React 18+ with Redux Toolkit for state management
- React Router v6 for navigation
- Axios for HTTP requests
- CORS enabled on all backend services

---

## 1. API Endpoints Reference

### 1.1 Catalog Service (Port 7002)
Base URL: `https://localhost:7002/api`

#### Products Controller
```
[GET]    /products                     - Get all products
[GET]    /products/{id}                - Get product by ID
[POST]   /products                     - Create new product
[PUT]    /products/{id}                - Update product
[DELETE] /products/{id}                - Delete product
[GET]    /health                       - Health check
```

**Product DTO Structure:**
```javascript
{
  id: number,
  name: string,
  description: string,
  price: number,
  sku: string,
  category: string,
  imageUrl: string,
  status: string, // "Active", "Inactive"
  createdAt: datetime,
  updatedAt: datetime
}
```

---

### 1.2 Cart Service (Port 7004)
Base URL: `https://localhost:7004/api`

#### Carts Controller
```
[GET]    /carts                               - Get all carts
[GET]    /carts/active                        - Get active carts only
[GET]    /carts/abandoned                     - Get abandoned carts
[GET]    /carts/{id}                          - Get cart by ID
[GET]    /carts/customer/{customerId}         - Get cart by customer ID
[POST]   /carts                               - Create new cart
[POST]   /carts/{cartId}/items                - Add item to cart
[PUT]    /carts/{cartId}/items/{cartItemId}   - Update cart item quantity
[DELETE] /carts/{cartId}/items/{cartItemId}   - Remove item from cart
[DELETE] /carts/{cartId}/clear                - Clear all items from cart
[DELETE] /carts/{id}                          - Delete cart
[GET]    /health                              - Health check
```

**Cart DTO Structure:**
```javascript
{
  id: number,
  customerId: number,
  items: [
    {
      id: number,
      productId: number,
      quantity: number,
      price: number,
      addedAt: datetime
    }
  ],
  totalPrice: number,
  createdAt: datetime,
  modifiedAt: datetime
}
```

---

### 1.3 Payment Service (Port 7006)
Base URL: `https://localhost:7006/api`

#### Payments Controller
```
[GET]    /payments                            - Get all payments
[GET]    /payments/{id}                       - Get payment by ID
[GET]    /payments/status/{status}            - Get payments by status
[GET]    /payments/transaction/{transactionId} - Get payment by transaction ID
[GET]    /payments/order/{orderId}            - Get payment by order ID
[GET]    /payments/date-range                 - Get payments by date range
[POST]   /payments                            - Process payment
[PUT]    /payments/{id}/complete              - Mark payment as complete
[PUT]    /payments/{id}/fail                  - Mark payment as failed
[POST]   /payments/{id}/refund                - Refund payment
[GET]    /payments/{id}/refunds               - Get refunds for payment
[GET]    /health                              - Health check

Payment Methods Controller
[POST]   /payment-methods                     - Add payment method
[GET]    /payment-methods/customer/{customerId} - Get customer's payment methods
[PUT]    /payment-methods/{id}                - Update payment method
[DELETE] /payment-methods/{id}                - Delete payment method
```

**Payment DTO Structure:**
```javascript
{
  id: number,
  orderId: number,
  customerId: number,
  amount: number,
  currency: string, // "INR"
  status: string, // "Pending", "Completed", "Failed"
  paymentMethod: string, // "UPI", "NetBanking", "Card", "GooglePay", "ApplePay"
  transactionId: string,
  createdAt: datetime,
  completedAt: datetime
}
```

---

### 1.4 Inventory Service (Port 7005)
Base URL: `https://localhost:7005/api`

#### Inventories Controller
```
[GET]    /inventories                         - Get all inventories
[GET]    /inventories/{id}                    - Get inventory by ID
[GET]    /inventories/product/{productId}     - Get inventory by product ID
[GET]    /inventories/sku/{sku}               - Get inventory by SKU
[GET]    /inventories/warehouse/{warehouse}   - Get inventories by warehouse
[GET]    /inventories/low-stock               - Get low stock items
[GET]    /inventories/{id}/quantity           - Get inventory quantity
[POST]   /inventories                         - Create new inventory
[POST]   /inventories/{id}/transactions       - Add inventory transaction
[GET]    /inventories/{id}/transactions       - Get inventory transactions
[PUT]    /inventories/{id}                    - Update inventory
[PUT]    /inventories/{id}/adjust             - Adjust inventory quantity
[DELETE] /inventories/{id}                    - Delete inventory
[GET]    /health                              - Health check
```

**Inventory DTO Structure:**
```javascript
{
  id: number,
  productId: number,
  productSku: string,
  quantity: number,
  warehouse: string,
  reorderLevel: number,
  reorderQuantity: number,
  lastRestockDate: datetime,
  expiryDate: datetime
}
```

---

### 1.5 Search Service (Port 7008)
Base URL: `https://localhost:7008/api`

Uses Elasticsearch for advanced search capabilities.

```
[POST]   /search/index                        - Index single document
[POST]   /search/bulk-index                   - Bulk index documents
[PUT]    /search/index/{documentType}/{documentId} - Update document
[DELETE] /search/index/{documentType}/{documentId} - Delete document
[POST]   /search/search                       - Simple search
[GET]    /search/search/{documentType}        - Search by document type
[POST]   /search/search/advanced              - Advanced search with filters
```

**Search Request DTO Structure:**
```javascript
{
  query: string,
  documentType: string, // "product", "category", etc.
  pageNumber: number,
  pageSize: number,
  filters: {
    category?: string,
    priceMin?: number,
    priceMax?: number,
    // ... other filters
  },
  sort?: {
    field: string,
    order: "asc" | "desc"
  }
}
```

**Search Response DTO:**
```javascript
{
  totalResults: number,
  pageNumber: number,
  pageSize: number,
  results: [
    {
      id: number,
      name: string,
      description: string,
      price: number,
      // ... other fields
    }
  ]
}
```

---

### 1.6 Customer Service (Port 7003)
Base URL: `https://localhost:7003/api`

#### Customers Controller
```
[GET]    /customers                   - Get all customers
[GET]    /customers/active            - Get active customers only
[GET]    /customers/{id}              - Get customer by ID
[GET]    /customers/by-email/{email}  - Get customer by email
[POST]   /customers                   - Create new customer
[PUT]    /customers/{id}              - Update customer
[DELETE] /customers/{id}              - Delete customer
[GET]    /health                      - Health check
```

**Customer DTO Structure:**
```javascript
{
  id: number,
  firstName: string,
  lastName: string,
  email: string,
  phone: string,
  dateOfBirth: datetime,
  defaultAddressId: number,
  isActive: boolean,
  createdAt: datetime,
  updatedAt: datetime
}
```

---

## 2. Frontend Integration Architecture

### 2.1 API Configuration Layer

```
src/
  api/
    config.js          - API base URLs and configuration
    axiosInstance.js   - Axios client setup with interceptors
    endpoints.js       - All service endpoints constants
```

### 2.2 Redux Integration Layer

```
src/redux/
  slices/
    productSlice.js    - Products state & actions
    cartSlice.js       - Cart state & actions (UPDATE: use Cart API)
    paymentSlice.js    - Payments state & actions
    inventorySlice.js  - Inventory state & actions
    customerSlice.js   - Customer profiles state & actions
    searchSlice.js     - Search state & actions
    orderSlice.js      - Orders state (from Payment Service)
  thunks/
    productThunks.js   - Product API async operations
    cartThunks.js      - Cart API async operations
    paymentThunks.js   - Payment API async operations
    inventoryThunks.js - Inventory API async operations
    customerThunks.js  - Customer API async operations
    searchThunks.js    - Search API async operations
```

---

## 3. Implementation Steps

### Step 1: Environment Configuration

Create `src/config/apiConfig.js`:
```javascript
const API_BASE_URLS = {
  CATALOG: process.env.REACT_APP_CATALOG_URL || 'https://localhost:7002/api',
  CART: process.env.REACT_APP_CART_URL || 'https://localhost:7004/api',
  PAYMENT: process.env.REACT_APP_PAYMENT_URL || 'https://localhost:7006/api',
  INVENTORY: process.env.REACT_APP_INVENTORY_URL || 'https://localhost:7005/api',
  SEARCH: process.env.REACT_APP_SEARCH_URL || 'https://localhost:7008/api',
  CUSTOMER: process.env.REACT_APP_CUSTOMER_URL || 'https://localhost:7003/api'
};

export default API_BASE_URLS;
```

Create `.env.local`:
```
REACT_APP_CATALOG_URL=https://localhost:7002/api
REACT_APP_CART_URL=https://localhost:7004/api
REACT_APP_PAYMENT_URL=https://localhost:7006/api
REACT_APP_INVENTORY_URL=https://localhost:7005/api
REACT_APP_SEARCH_URL=https://localhost:7008/api
REACT_APP_CUSTOMER_URL=https://localhost:7003/api
```

### Step 2: Create Axios Instance with Interceptors

Create `src/api/axiosInstance.js`:
```javascript
import axios from 'axios';

const createAxiosInstance = (baseURL) => {
  const instance = axios.create({
    baseURL,
    timeout: 10000,
    headers: {
      'Content-Type': 'application/json'
    }
  });

  // Request interceptor
  instance.interceptors.request.use(
    (config) => {
      // Add auth token if available
      const token = localStorage.getItem('authToken');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  // Response interceptor
  instance.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response?.status === 401) {
        // Handle unauthorized - redirect to login
        localStorage.removeItem('authToken');
        window.location.href = '/login';
      }
      return Promise.reject(error);
    }
  );

  return instance;
};

export default createAxiosInstance;
```

### Step 3: Create API Services

Create `src/api/services/productService.js`:
```javascript
import createAxiosInstance from '../axiosInstance';
import API_BASE_URLS from '../../config/apiConfig';

const axiosInstance = createAxiosInstance(API_BASE_URLS.CATALOG);

export const productService = {
  getAllProducts: () => axiosInstance.get('/products'),
  getProductById: (id) => axiosInstance.get(`/products/${id}`),
  createProduct: (productData) => axiosInstance.post('/products', productData),
  updateProduct: (id, productData) => axiosInstance.put(`/products/${id}`, productData),
  deleteProduct: (id) => axiosInstance.delete(`/products/${id}`)
};
```

Similarly create:
- `src/api/services/cartService.js`
- `src/api/services/paymentService.js`
- `src/api/services/inventoryService.js`
- `src/api/services/customerService.js`
- `src/api/services/searchService.js`

### Step 4: Update Redux Slices with API Integration

Example: `src/redux/slices/productSlice.js`

```javascript
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { productService } from '../../api/services/productService';

export const fetchProducts = createAsyncThunk(
  'products/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const response = await productService.getAllProducts();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const fetchProductById = createAsyncThunk(
  'products/fetchById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await productService.getProductById(id);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const productSlice = createSlice({
  name: 'products',
  initialState: {
    items: [],
    currentProduct: null,
    loading: false,
    error: null
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchProductById.fulfilled, (state, action) => {
        state.currentProduct = action.payload;
      });
  }
});

export default productSlice.reducer;
```

### Step 5: Update Components to Use API Data

Example: Update `src/pages/Products.js`

```javascript
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProducts } from '../redux/slices/productSlice';

export default function Products() {
  const dispatch = useDispatch();
  const { items: products, loading, error } = useSelector(state => state.products);

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  if (loading) return <div>Loading products...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      {products.map(product => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
```

### Step 6: Update Cart Operations

Replace mock cart data with API calls in `src/redux/slices/cartSlice.js`:

```javascript
export const fetchCart = createAsyncThunk(
  'cart/fetch',
  async (customerId, { rejectWithValue }) => {
    try {
      const response = await cartService.getCartByCustomerId(customerId);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const addToCart = createAsyncThunk(
  'cart/addItem',
  async ({ cartId, productId, quantity }, { rejectWithValue }) => {
    try {
      const response = await cartService.addItemToCart(cartId, {
        productId,
        quantity
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);
```

### Step 7: Payment Integration

Create `src/redux/slices/paymentSlice.js`:

```javascript
export const processPayment = createAsyncThunk(
  'payment/process',
  async (paymentData, { rejectWithValue }) => {
    try {
      const response = await paymentService.processPayment({
        orderId: paymentData.orderId,
        customerId: paymentData.customerId,
        amount: paymentData.totalPrice,
        currency: 'INR',
        paymentMethod: paymentData.paymentMethod
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);
```

### Step 8: Order History Integration

Map payments to orders in Account page:

```javascript
export const fetchCustomerPayments = createAsyncThunk(
  'orders/fetchPayments',
  async (customerId, { rejectWithValue }) => {
    try {
      // Fetch all payments and filter by customerId
      const response = await paymentService.getAllPayments();
      return response.data.filter(p => p.customerId === customerId);
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);
```

### Step 9: Inventory Integration for Stock Management

```javascript
export const checkInventory = createAsyncThunk(
  'inventory/check',
  async (productId, { rejectWithValue }) => {
    try {
      const response = await inventoryService.getInventoryByProductId(productId);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);
```

### Step 10: Search Integration

Replace local search with API search in `src/pages/Products.js`:

```javascript
export const searchProducts = createAsyncThunk(
  'search/products',
  async ({ query, filters, pageNumber, pageSize }, { rejectWithValue }) => {
    try {
      const response = await searchService.advancedSearch({
        query,
        documentType: 'product',
        pageNumber,
        pageSize,
        filters
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);
```

---

## 4. Required Data Models for Frontend

### Cart Item Model
Update cart items to match API response:
```javascript
{
  id: number,           // From Cart API
  productId: number,
  quantity: number,
  price: number,        // Unit price
  addedAt: datetime,
  product?: {           // Optional full product details
    id: number,
    name: string,
    imageUrl: string
  }
}
```

### Order Model (from Payment)
```javascript
{
  id: number,           // Payment ID
  orderId: number,
  customerId: number,
  items: CartItem[],    // From cart at time of order
  totalPrice: number,
  status: string,       // "Pending", "Completed", "Failed"
  paymentMethod: string,
  createdAt: datetime,
  completedAt: datetime
}
```

---

## 5. Database Seeding & Sample Data

**Recommendation:** Each microservice handles its own database seeding.

### Catalog Service
- Create seed data scripts in `api-catalog-service/Data/SeedData.cs`
- Initial data: 20-50 products with categories

### Cart Service
- Seed sample carts linked to customer IDs
- Auto-cleanup of abandoned carts (older than 30 days)

### Payment Service
- Sample payment records linked to orders

### Inventory Service
- Link inventory to products
- Set realistic stock quantities

### Customer Service
- Create sample customer profiles
- Link to products for wishlists

---

## 6. Error Handling Strategy

### Global Error Handler

Create `src/api/errorHandler.js`:
```javascript
export const handleApiError = (error) => {
  if (error.response) {
    // Server responded with error status
    return {
      status: error.response.status,
      message: error.response.data?.message || 'Server error',
      errors: error.response.data?.errors
    };
  } else if (error.request) {
    // Request made but no response
    return {
      status: null,
      message: 'No response from server',
      errors: null
    };
  } else {
    // Error in request setup
    return {
      status: null,
      message: error.message || 'Unknown error',
      errors: null
    };
  }
};
```

### Error Boundary with API Support

Update `src/components/Common/ErrorBoundary.js` to handle API errors.

---

## 7. Loading States

Add loading indicators to Redux slices:
```javascript
const initialState = {
  data: null,
  loading: false,
  error: null,
  lastFetch: null
};
```

Show spinners/loaders in components:
```javascript
{loading && <Spinner />}
{error && <ErrorAlert message={error} />}
{data && <ContentComponent data={data} />}
```

---

## 8. Caching Strategy (Optional but Recommended)

Implement cache invalidation for API data:
```javascript
// Auto-refresh products every 5 minutes
const CACHE_DURATION = {
  PRODUCTS: 5 * 60 * 1000,  // 5 minutes
  CART: 1 * 60 * 1000,      // 1 minute
  INVENTORY: 2 * 60 * 1000  // 2 minutes
};
```

---

## 9. Authentication Integration

**Future Enhancement:** Add JWT token-based authentication
- Store token in localStorage
- Pass token in Authorization header (already in axiosInstance)
- Refresh token on 401 response

---

## 10. Deployment Configuration

### Development
- Use `.env.local` with localhost URLs
- Services running on ports 7002-7008

### Production
- Create `.env.production` with production API URLs
- Update CORS policy on backend services
- Use HTTPS for all API calls

---

## 11. Testing API Integration

### Unit Tests for API Services
```javascript
// src/api/services/__tests__/productService.test.js
test('fetchProducts returns list of products', async () => {
  const products = await productService.getAllProducts();
  expect(Array.isArray(products.data)).toBe(true);
});
```

### Redux Thunk Tests
```javascript
// src/redux/__tests__/productSlice.test.js
test('fetchProducts thunk updates state', async () => {
  const result = await store.dispatch(fetchProducts());
  expect(store.getState().products.items.length).toBeGreaterThan(0);
});
```

---

## 12. Implementation Timeline

**Phase 1 (Week 1):** API Configuration & Setup
- Set up axios instances and API config
- Create service layer for all 6 microservices

**Phase 2 (Week 2):** Core Integrations
- Product catalog integration
- Cart operations integration
- Inventory stock checking

**Phase 3 (Week 3):** Advanced Features
- Payment processing integration
- Search functionality
- Order history from payments

**Phase 4 (Week 4):** Testing & Optimization
- Error handling refinement
- Performance optimization
- Integration testing

---

## 13. Files to Create/Modify

### New Files to Create:
```
src/
  api/
    config/
      apiConfig.js
    services/
      axiosInstance.js
      productService.js
      cartService.js
      paymentService.js
      inventoryService.js
      customerService.js
      searchService.js
    errorHandler.js
  redux/
    thunks/
      productThunks.js
      cartThunks.js
      paymentThunks.js
      inventoryThunks.js
      customerThunks.js
      searchThunks.js
.env.local
```

### Files to Modify:
```
src/redux/slices/
  - productSlice.js
  - cartSlice.js
  - authSlice.js (add customer integration)
  - create paymentSlice.js
  - create inventorySlice.js
  - create searchSlice.js

src/pages/
  - Products.js (use API data)
  - Cart.js (use Cart API)
  - Checkout.js (integrate Payment API)
  - ProductDetail.js (fetch from API)
  - Account.js (fetch orders from Payment API)

src/components/
  - ProductCard.js (update data structure)
  - AddToCartSection.js (use Cart API)
  - ProductActionsBar.js (use Inventory API)
```

---

## 14. Troubleshooting & Common Issues

### CORS Errors
- Ensure all backend services have CORS enabled (they do: "AllowAll" policy)
- Check browser console for exact error

### 404 Errors
- Verify service is running on correct port
- Check endpoint path spelling matches exactly
- Verify database has seed data

### Token/Auth Errors
- Ensure JWT token is stored in localStorage
- Check Authorization header format: `Bearer {token}`
- Implement token refresh mechanism

### Performance Issues
- Implement pagination for large datasets
- Use Redux caching with proper invalidation
- Consider lazy loading for infinite lists

---

## 15. Next Steps

1. **Create API Configuration** - Set up `apiConfig.js` and environment variables
2. **Build Axios Instances** - Create reusable axios with interceptors
3. **Generate API Services** - Create service layer for all 6 microservices
4. **Update Redux Store** - Modify slices to use async thunks
5. **Integrate Components** - Update React components to use API data
6. **Test Thoroughly** - Verify each integration works end-to-end
7. **Deploy** - Push to production with proper environment config

---

## Appendix: Quick Reference

### Local Development Ports
- Catalog Service: https://localhost:7002
- Customer Service: https://localhost:7003
- Cart Service: https://localhost:7004
- Inventory Service: https://localhost:7005
- Payment Service: https://localhost:7006
- Search Service: https://localhost:7008

### Key Features Already Implemented in Frontend
✅ Indian localization (₹ currency, 18% GST, Indian states)
✅ Authentication UI
✅ Account page with 4 tabs
✅ Cart management UI
✅ Checkout with payment methods
✅ Order history placeholder

### API Features Available
✅ Full CRUD operations on all entities
✅ Search with Elasticsearch
✅ Inventory management & low-stock alerts
✅ Payment processing & refunds
✅ Event-driven architecture with RabbitMQ
✅ Comprehensive error handling
✅ Swagger/OpenAPI documentation on each service
✅ Health check endpoints

---

**Document Version:** 1.0
**Last Updated:** 2024
**Status:** Ready for Implementation
