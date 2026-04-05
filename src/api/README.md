# API Integration

This directory contains the API integration layer for connecting the React frontend with the C# microservices backend.

## Directory Structure

```
api/
  ├── axiosInstance.js          # Configured axios instance with interceptors
  ├── errorHandler.js           # Error handling utilities
  ├── services/
  │   ├── index.js             # Central export point
  │   ├── productService.js     # Catalog Service API calls
  │   ├── cartService.js        # Cart Service API calls
  │   ├── paymentService.js     # Payment Service API calls
  │   ├── inventoryService.js   # Inventory Service API calls
  │   ├── searchService.js      # Search Service API calls
  │   └── customerService.js    # Customer Service API calls
  └── README.md                 # This file
```

## Configuration

### Environment Variables

All API base URLs are configured via environment variables in `.env.local`:

```
REACT_APP_CATALOG_URL=https://localhost:7002/api
REACT_APP_CART_URL=https://localhost:7004/api
REACT_APP_PAYMENT_URL=https://localhost:7006/api
REACT_APP_INVENTORY_URL=https://localhost:7005/api
REACT_APP_SEARCH_URL=https://localhost:7008/api
REACT_APP_CUSTOMER_URL=https://localhost:7003/api
```

For production, update these URLs to point to your production server URLs.

## Usage

### Basic Service Usage

```javascript
import { productService } from '@/api/services';

// Get all products
const response = await productService.getAllProducts();
const products = response.data;

// Get single product
const productResponse = await productService.getProductById(1);
const product = productResponse.data;
```

### Error Handling

```javascript
import { productService, handleApiError } from '@/api/services';

try {
  const response = await productService.getAllProducts();
  const products = response.data;
} catch (error) {
  const errorInfo = handleApiError(error);
  console.error(errorInfo.message); // User-friendly error message
}
```

### With Redux Thunks

```javascript
import { createAsyncThunk } from '@reduxjs/toolkit';
import { productService } from '@/api/services';

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
```

## Services Reference

### Product Service
- **getAllProducts()** - Get all products
- **getProductById(id)** - Get product by ID
- **createProduct(data)** - Create new product
- **updateProduct(id, data)** - Update product
- **deleteProduct(id)** - Delete product

### Cart Service
- **getAllCarts()** - Get all carts (admin)
- **getActiveCarts()** - Get active carts
- **getAbandonedCarts()** - Get abandoned carts
- **getCartById(id)** - Get cart by ID
- **getCartByCustomerId(customerId)** - Get customer's cart
- **createCart(data)** - Create new cart
- **addItemToCart(cartId, itemData)** - Add item
- **updateCartItem(cartId, cartItemId, itemData)** - Update quantity
- **removeItemFromCart(cartId, cartItemId)** - Remove item
- **clearCart(cartId)** - Clear all items
- **deleteCart(id)** - Delete cart

### Payment Service
- **getAllPayments()** - Get all payments
- **getPaymentById(id)** - Get payment by ID
- **getPaymentsByStatus(status)** - Filter by status
- **getPaymentByOrderId(orderId)** - Get payment for order
- **getPaymentByTransactionId(transactionId)** - Get payment by transaction
- **getPaymentsByDateRange(startDate, endDate)** - Filter by date range
- **processPayment(data)** - Process new payment
- **completePayment(id)** - Mark as complete
- **failPayment(id, reason)** - Mark as failed
- **refundPayment(id, data)** - Create refund
- **getRefunds(id)** - Get refunds for payment
- **addPaymentMethod(data)** - Add payment method
- **getPaymentMethods(customerId)** - Get customer's methods
- **updatePaymentMethod(id, data)** - Update method
- **deletePaymentMethod(id)** - Delete method

### Inventory Service
- **getAllInventories()** - Get all inventories
- **getInventoryById(id)** - Get inventory by ID
- **getInventoryByProductId(productId)** - Get by product
- **getInventoryBySku(sku)** - Get by SKU
- **getInventoriesByWarehouse(warehouse)** - Get by warehouse
- **getLowStockInventories()** - Get low stock items
- **getQuantity(id)** - Get current quantity
- **createInventory(data)** - Create inventory
- **updateInventory(id, data)** - Update inventory
- **adjustQuantity(id, data)** - Adjust quantity
- **deleteInventory(id)** - Delete inventory
- **addTransaction(id, data)** - Add transaction
- **getTransactions(id)** - Get transactions

### Search Service
- **indexDocument(doc)** - Index single document
- **bulkIndexDocuments(docs)** - Bulk index
- **updateDocument(type, id, doc)** - Update document
- **deleteDocument(type, id)** - Delete document
- **search(request)** - Simple search
- **searchByType(type, query)** - Search by type
- **advancedSearch(request)** - Advanced search with filters

### Customer Service
- **getAllCustomers()** - Get all customers (admin)
- **getActiveCustomers()** - Get active customers
- **getCustomerById(id)** - Get customer by ID
- **getCustomerByEmail(email)** - Get by email
- **createCustomer(data)** - Create new customer
- **updateCustomer(id, data)** - Update customer
- **deleteCustomer(id)** - Delete customer

## Features

### Request Interceptors
- Automatically adds JWT token from localStorage to Authorization header
- Logs requests in development mode
- Sets 10-second timeout

### Response Interceptors
- Handles 401 (Unauthorized) - clears auth and redirects to login
- Handles 403 (Forbidden) - logs warning
- Handles 404 (Not Found) - logs warning
- Handles 5xx errors - logs error
- Logs successful responses in development mode

### Error Utilities
- `handleApiError()` - Parse error into standard format
- `getErrorMessage()` - Extract user-friendly message
- `isNetworkError()` - Check if network error
- `isValidationError()` - Check if 400 error
- `isUnauthorizedError()` - Check if 401 error
- `isServerError()` - Check if 5xx error
- `getValidationErrors()` - Extract field errors

## Development Tips

### SSL Certificate Issues (Development)
If you get SSL certificate errors when developing with localhost:
1. The axios instance is configured to skip certificate validation in development
2. For production, ensure valid SSL certificates on backend services

### Testing API Calls
1. Open browser DevTools Network tab to see API requests
2. Check browser Console (F12) for detailed logs
3. Verify environment variables are set correctly: `echo $REACT_APP_CATALOG_URL`

### Adding New Services
When backend adds new services, follow this pattern:

```javascript
// src/api/services/newService.js
import createAxiosInstance from '../axiosInstance';
import API_BASE_URLS from '../../config/apiConfig';

const axiosInstance = createAxiosInstance(API_BASE_URLS.NEW_SERVICE, 'NewService');

export const newService = {
  getAll: () => axiosInstance.get('/endpoint'),
  getById: (id) => axiosInstance.get(`/endpoint/${id}`),
  // ... more methods
};

export default newService;
```

Then export from `services/index.js`:
```javascript
export { default as newService } from './newService';
```

---

See `API_INTEGRATION_PLAN.md` for the complete integration strategy and roadmap.
