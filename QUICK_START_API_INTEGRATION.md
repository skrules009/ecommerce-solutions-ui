# API Integration - Quick Start Guide

## ✅ What Has Been Set Up

### 1. Configuration Layer
- ✅ API configuration file with base URLs for all 6 microservices
- ✅ Environment variables setup (`.env.local`)
- ✅ Axios instance factory with interceptors for all services

### 2. API Services
- ✅ **Product Service** - Product catalog operations
- ✅ **Cart Service** - Shopping cart management  
- ✅ **Payment Service** - Payment processing & refunds
- ✅ **Inventory Service** - Stock management
- ✅ **Search Service** - Product search with Elasticsearch
- ✅ **Customer Service** - Customer profile management

### 3. Utilities
- ✅ Error handling utilities (`errorHandler.js`)
- ✅ Service exports index (`services/index.js`)
- ✅ Service documentation (README.md)

---

## 🚀 Next Steps to Complete Integration

### Phase 1: Update Redux Slices (1-2 days)

**Note:** This will replace mock data with real API data.

1. **Update productSlice.js** → Use Product Service API
   - Replace `initialState.products` with API calls
   - Add `fetchProducts` thunk
   - Add `fetchProductById` thunk
   - Update components to dispatch these thunks

2. **Update cartSlice.js** → Use Cart Service API
   - Replace local cart state with API-backed state
   - Add `fetchCart` thunk
   - Add `addToCart` thunk
   - Add `removeFromCart` thunk
   - Add `updateCartItem` thunk

3. **Create paymentSlice.js** → Bank Payments
   - Add `processPayment` thunk
   - Add `completePayment` thunk
   - Add `getPaymentStatus` thunk
   - Add `refundPayment` thunk

4. **Create inventorySlice.js** → Check Stock
   - Add `checkProductInventory` thunk
   - Add `getLowStockItems` thunk
   - Add `checkStockBeforeAddingToCart` function

---

### Phase 2: Update Components (2-3 days)

**Key Components to Update:**

1. `src/pages/Products.js`
   - Replace mock `productsData` with `fetchProducts` action
   - Add loading/error states
   - Show "Out of Stock" for items with no inventory

2. `src/pages/ProductDetail.js`
   - Fetch product from API using `fetchProductById`
   - Check inventory status
   - Disable "Add to Cart" if out of stock

3. `src/pages/Cart.js`
   - Load cart from API using `fetchCart`
   - Use Cart API for add/remove/update operations
   - Show inventory warnings if item is low stock

4. `src/pages/Checkout.js`
   - Process payment using Payment Service
   - Validate payment before submitting
   - Show payment status after completion

5. `src/pages/Account.js`
   - Replace mock order data with Payment API data
   - Map payments to orders
   - Show real order history

---

### Phase 3: Database Seeding (1 day)

Before testing, backend needs initial data:

1. **Create Sample Products** in api-catalog-service
   - 20-30 products with categories
   - Include images, descriptions, prices

2. **Create Sample Inventory** in api-inventory-service
   - Link to products
   - Set stock quantities

3. **Create Sample Customers** in api-customer-service
   - Test customer accounts
   - Linked to auth system

4. **Create Sample Orders/Payments** in api-payment-service
   - Mock order history
   - Various payment statuses

---

## 📋 Checklist for Complete Integration

### Backend Setup
- [ ] All 6 microservices running on correct ports
- [ ] SQL Server database configured for each service
- [ ] RabbitMQ running (for event publishing)
- [ ] Elasticsearch running (for search service)
- [ ] All databases migrated (`dotnet ef migrations add` & `dotnet ef database update`)
- [ ] Seed data inserted into each database
- [ ] CORS enabled on all services (already done ✅)
- [ ] Swagger UI accessible on each service (for testing)

### Frontend Setup
- [ ] `.env.local` configured with service URLs
- [ ] `package.json` has `axios` dependency (check: `npm list axios`)
- [ ] API service layer created (DONE ✅)
- [ ] Redux slices updated with thunks (IN PROGRESS)
- [ ] Components updated to use API (IN PROGRESS)
- [ ] Error handling implemented
- [ ] Loading states added to UI
- [ ] Testing completed

### Testing Checklist
- [ ] Product listing page loads from API ✓
- [ ] Product detail page loads from API ✓
- [ ] Add to cart → API cart operations work ✓
- [ ] Checkout → Payment API works ✓
- [ ] Order history shows real orders ✓
- [ ] Inventory checks prevent overselling ✓
- [ ] Search returns results from Elasticsearch ✓
- [ ] Account page shows customer data ✓

---

## 🔧 How to Use the API Layer

### Simple Example: Load Products

**Before (Mock Data):**
```javascript
import { useSelector } from 'react-redux';

export default function Products() {
  const products = useSelector(state => state.products.items);
  // products come from mock data in initialState
  return <div>{products.map(...)}</div>;
}
```

**After (API):**
```javascript
import { useDispatch, useSelector } from 'react-redux';
import { fetchProducts } from '../redux/slices/productSlice';
import { useEffect } from 'react';

export default function Products() {
  const dispatch = useDispatch();
  const { items: products, loading, error } = useSelector(state => state.products);

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  if (loading) return <Spinner />;
  if (error) return <Error message={error} />;
  
  return <div>{products.map(...)}</div>;
}
```

---

## 🐛 Testing API Calls

### Method 1: Browser DevTools
1. Open DevTools (F12)
2. Go to Network tab
3. Visit a page that makes API calls
4. See requests/responses in real-time

### Method 2: Manual Testing via Postman
1. Download Postman
2. Import API endpoints from each service's Swagger
3. Test endpoints with sample data
4. Verify response format

### Method 3: Check Console Logs
1. Open browser Console (F12)
2. Make API calls
3. See logs like: `[ProductService] REQUEST: GET /api/products`

---

## ⚠️ Common Issues & Solutions

### Issue: 404 - Service Not Found
**Solution:**
- Verify service is running: `netstat -an | find "7002"` (Windows)
- Check port in `.env.local` matches running service
- Verify endpoint path is correct

### Issue: CORS Error
**Solution:**
- Should be fixed on backend with "AllowAll" CORS policy
- Check backend logs for exact error
- Clear browser cache and try again

### Issue: 401 - Unauthorized
**Solution:**
- Login to get auth token
- Token is stored in localStorage
- Axios automatically adds it to requests

### Issue: 503 - Service Unavailable
**Solution:**
- Check backend service is running
- Check database connection
- Check RabbitMQ is running (for Catalog Service)
- Check Elasticsearch is running (for Search Service)

---

## 📚 Reference Files

### Configuration
- `src/config/apiConfig.js` - Base URLs and defaults
- `.env.local` - Environment variables
- `src/api/axiosInstance.js` - HTTP client setup

### Services (read-only, don't modify)
- `src/api/services/productService.js`
- `src/api/services/cartService.js`
- `src/api/services/paymentService.js`
- `src/api/services/inventoryService.js`
- `src/api/services/searchService.js`
- `src/api/services/customerService.js`

### Integration Plan
- `API_INTEGRATION_PLAN.md` - Complete strategy (read this!)
- `src/api/README.md` - Service documentation

---

## 📞 Support

For questions about the API integration:
1. Check `API_INTEGRATION_PLAN.md` for detailed information
2. Check `src/api/README.md` for service reference
3. Look at service files for available methods
4. Check backend Swagger docs at each service URL

---

## Timeline

**Week 1:** ✅ Setup (COMPLETE)
- API configuration
- Service layer creation
- Environment setup

**Week 2:** 🔄 Redux Integration (NEXT)
- Update Redux slices
- Add async thunks
- Connect to components

**Week 3:** 🔄 Component Updates (AFTER WEEK 2)
- Update pages to use API
- Add loading/error UI
- Test all flows

**Week 4:** 🔄 Testing & Optimization (FINAL)
- Integration testing
- Performance optimization
- Bug fixes

---

**Status:** ✅ Foundation Complete - Ready for Redux Integration
**Last Updated:** 2024
