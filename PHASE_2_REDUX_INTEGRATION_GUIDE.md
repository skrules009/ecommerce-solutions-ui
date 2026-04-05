# Phase 2: Redux Integration - Implementation Guide

## ✅ What's Been Completed

### Redux Slices Updated with Async Thunks

All Redux slices have been updated to use `createAsyncThunk` for API integration:

#### 1. **productSlice.js** (Updated)
- ✅ `fetchProducts()` - Fetch all products from API
- ✅ `fetchProductById(id)` - Fetch single product
- ✅ `createProduct(data)` - Create new product (admin)
- ✅ `updateProduct(id, data)` - Update product (admin)
- ✅ `deleteProduct(id)` - Delete product (admin)

**State Additions:**
- `loading: false` - Loading state
- `error: null` - Error messages
- `lastFetch: null` - Cache tracking

#### 2. **cartSlice.js** (Updated)
- ✅ `fetchCartByCustomerId(customerId)` - Fetch customer's cart
- ✅ `createCart(customerId)` - Create new cart
- ✅ `addItemToCart(cartId, productId, quantity)` - Add item via API
- ✅ `removeItemFromCart(cartId, cartItemId)` - Remove item via API
- ✅ `updateCartItem(cartId, cartItemId, quantity)` - Update quantity via API
- ✅ `clearCartAsync(cartId)` - Clear cart via API

**State Additions:**
- `id: null` - API cart ID
- `loading: false` - Loading state
- `error: null` - Error messages

#### 3. **paymentSlice.js** (NEW)
- ✅ `processPayment(paymentData)` - Process payment
- ✅ `completePayment(paymentId)` - Complete payment
- ✅ `failPayment(paymentId, reason)` - Fail payment
- ✅ `fetchPaymentById(paymentId)` - Get payment by ID
- ✅ `fetchPaymentByOrderId(orderId)` - Get payment for order
- ✅ `fetchAllPayments()` - Get all payments (order history)
- ✅ `addPaymentMethod(methodData)` - Add payment method
- ✅ `fetchPaymentMethods(customerId)` - Get customer's payment methods
- ✅ `refundPayment(paymentId, amount, reason)` - Refund payment

**Selectors Included:**
- `selectCurrentPayment` - Current payment being processed
- `selectPaymentStatus` - Payment status
- `selectPaymentMethods` - Customer's payment methods
- `selectPaymentHistory` - Payment/order history

#### 4. **inventorySlice.js** (NEW)
- ✅ `checkInventory(productId)` - Check stock for product
- ✅ `checkInventoryBySku(sku)` - Check stock by SKU
- ✅ `fetchLowStockItems()` - Get low stock items
- ✅ `fetchInventoriesByWarehouse(warehouse)` - Get warehouse inventory
- ✅ `adjustInventoryQuantity(id, quantity)` - Adjust stock (admin)
- ✅ `addInventoryTransaction(id, quantity, type)` - Add transaction
- ✅ `fetchInventoryTransactions(inventoryId)` - Get transaction history

**Selectors Included:**
- `selectInventoryByProductId` - Get inventory for product
- `selectLowStockItems` - Low stock items
- `selectInventoryTransactions` - Transaction history

#### 5. **searchSlice.js** (NEW)
- ✅ `searchProducts(query, pageNumber, pageSize)` - Basic search
- ✅ `advancedSearchProducts(query, filters)` - Advanced search with filters
- ✅ `searchByDocumentType(type, query)` - Search by type
- ✅ `indexDocument(document)` - Index document (admin)
- ✅ `bulkIndexDocuments(documents)` - Bulk index (admin)

**Selectors Included:**
- `selectSearchResults` - Search results
- `selectSearchTotal` - Total results found
- `selectSearchFilters` - Current filters
- `selectSearchQuery` - Current search query

### Store Updated
- ✅ `src/redux/store.js` - Added paymentReducer, inventoryReducer, searchReducer

---

## 📋 How to Use in Components

### Example 1: Load Products in Products.js

**Before (Mock Data):**
```javascript
import { useSelector } from 'react-redux';

export default function Products() {
  const products = useSelector(state => state.products.items);
  // Uses static mock data
  return <div>{products.map(...)}</div>;
}
```

**After (With API):**
```javascript
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProducts } from '../redux/slices/productSlice';

export default function Products() {
  const dispatch = useDispatch();
  const { items: products, loading, error } = useSelector(state => state.products);

  useEffect(() => {
    // Fetch products when component mounts
    dispatch(fetchProducts());
  }, [dispatch]);

  if (loading) return <Spinner />;
  if (error) return <Error message={error} />;
  
  return (
    <div className="products-grid">
      {products.map(product => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
```

---

### Example 2: Add to Cart with API

**Before (Local State):**
```javascript
import { useDispatch } from 'react-redux';
import { addToCart } from '../redux/slices/cartSlice';

export default function AddToCartButton({ product }) {
  const dispatch = useDispatch();

  const handleAddToCart = () => {
    dispatch(addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      quantity: 1
    }));
  };

  return <button onClick={handleAddToCart}>Add to Cart</button>;
}
```

**After (With API):**
```javascript
import { useDispatch, useSelector } from 'react-redux';
import { addItemToCart } from '../redux/slices/cartSlice';

export default function AddToCartButton({ product }) {
  const dispatch = useDispatch();
  const { id: cartId } = useSelector(state => state.cart);

  const handleAddToCart = () => {
    if (!cartId) {
      console.error('Cart not initialized');
      return;
    }

    dispatch(addItemToCart({
      cartId,
      productId: product.id,
      quantity: 1
    }));
  };

  return <button onClick={handleAddToCart}>Add to Cart</button>;
}
```

---

### Example 3: Process Payment in Checkout.js

**Before (Not Implemented):**
```javascript
// Payment was not fully implemented
export default function Checkout() {
  // ...
}
```

**After (With API):**
```javascript
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { processPayment, completePayment } from '../redux/slices/paymentSlice';

export default function Checkout() {
  const dispatch = useDispatch();
  const { 
    currentPayment, 
    paymentStatus, 
    processing, 
    error: paymentError 
  } = useSelector(state => state.payment);

  const handlePayment = async () => {
    const paymentData = {
      orderId: 123, // Replace with real order ID
      customerId: userId,
      amount: cartTotal,
      paymentMethod: 'UPI'
    };

    const result = await dispatch(processPayment(paymentData));
    
    if (result.payload) {
      // Payment processed successfully
      console.log('Payment ID:', result.payload.id);
      // Redirect to confirmation page
    }
  };

  return (
    <div className="checkout">
      <button 
        onClick={handlePayment} 
        disabled={processing}
      >
        {processing ? 'Processing...' : 'Pay Now'}
      </button>
      
      {paymentError && <Error message={paymentError} />}
      
      {paymentStatus === 'completed' && (
        <Success message="Payment completed successfully!" />
      )}
    </div>
  );
}
```

---

### Example 4: Check Inventory Before Adding to Cart

**New Capability:**
```javascript
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { checkInventory } from '../redux/slices/inventorySlice';
import { addItemToCart } from '../redux/slices/cartSlice';

export default function ProductCard({ product }) {
  const dispatch = useDispatch();
  const inventory = useSelector(state => 
    selectInventoryByProductId(state, product.id)
  );

  useEffect(() => {
    // Check inventory when product loads
    dispatch(checkInventory(product.id));
  }, [product.id, dispatch]);

  const handleAddToCart = () => {
    if (!inventory || inventory.quantity <= 0) {
      alert('Out of stock');
      return;
    }

    dispatch(addItemToCart({
      cartId: state.cart.id,
      productId: product.id,
      quantity: 1
    }));
  };

  return (
    <div className="product-card">
      <h3>{product.name}</h3>
      {inventory?.quantity > 0 ? (
        <button onClick={handleAddToCart}>Add to Cart</button>
      ) : (
        <button disabled>Out of Stock</button>
      )}
    </div>
  );
}
```

---

### Example 5: Show Order History in Account.js

**Before (Mock Data):**
```javascript
export default function Account() {
  const orders = mockOrderData; // From static file
  return (
    <div>
      {orders.map(order => (
        <OrderCard key={order.id} order={order} />
      ))}
    </div>
  );
}
```

**After (With API):**
```javascript
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllPayments } from '../redux/slices/paymentSlice';

export default function Account() {
  const dispatch = useDispatch();
  const { 
    payments, 
    historyLoading, 
    historyError 
  } = useSelector(state => state.payment);
  const userId = useSelector(state => state.auth.user?.id);

  useEffect(() => {
    if (userId) {
      // Fetch order history (from payments)
      dispatch(fetchAllPayments());
    }
  }, [userId, dispatch]);

  if (historyLoading) return <Spinner />;
  if (historyError) return <Error message={historyError} />;

  // Filter payments for current user
  const userOrders = payments.filter(p => p.customerId === userId);

  return (
    <div className="account">
      <h2>Order History</h2>
      {userOrders.length === 0 ? (
        <p>No orders yet</p>
      ) : (
        <div className="orders-list">
          {userOrders.map(order => (
            <OrderCard key={order.id} order={order} />
          ))}
        </div>
      )}
    </div>
  );
}
```

---

### Example 6: Search Products with Filters

**Before (Local Filter):**
```javascript
const filtered = products.filter(p => 
  p.name.includes(searchTerm) && 
  p.price >= minPrice && 
  p.price <= maxPrice
);
```

**After (With API Search):**
```javascript
import { useDispatch, useSelector } from 'react-redux';
import { advancedSearchProducts, setFilters } from '../redux/slices/searchSlice';

export default function ProductSearch() {
  const dispatch = useDispatch();
  const { 
    results, 
    loading, 
    totalResults 
  } = useSelector(state => state.search);

  const handleSearch = (query, filters) => {
    dispatch(advancedSearchProducts({
      query,
      filters: {
        category: filters.category,
        priceMin: filters.minPrice,
        priceMax: filters.maxPrice,
        inStock: filters.inStock
      },
      pageNumber: 1,
      pageSize: 12
    }));
  };

  return (
    <div>
      <SearchBar onSearch={handleSearch} />
      
      {loading && <Spinner />}
      
      <div className="results">
        <p>Found {totalResults} products</p>
        {results.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
```

---

## 🔄 Migration Checklist

Follow this order to migrate components to use API:

### Priority 1 (Core Flow)
- [ ] `src/pages/Products.js` - Use `fetchProducts()`
- [ ] `src/pages/ProductDetail.js` - Use `fetchProductById()`
- [ ] `src/pages/Cart.js` - Use cart async thunks
- [ ] `src/pages/Checkout.js` - Use `processPayment()`

### Priority 2 (Features)
- [ ] `src/pages/Account.js` - Use `fetchAllPayments()` for order history
- [ ] `src/components/AddToCartSection.js` - Use `addItemToCart()`
- [ ] `src/components/ProductCard.js` - Use `checkInventory()`

### Priority 3 (Optional)
- [ ] Search functionality - Use `advancedSearchProducts()`
- [ ] Inventory management (admin) - Use inventory thunks

---

## 🧪 Testing Redux Integration

### Using Redux DevTools

1. **Install Redux DevTools Browser Extension**
   - Chrome: Redux DevTools extension
   - Firefox: Redux DevTools extension

2. **Check State Changes**
   - Open DevTools → Redux tab
   - Dispatch actions and watch state update
   - Time-travel debug (replay actions)

3. **Verify Async Thunks**
   - Look for `pending`, `fulfilled`, `rejected` actions
   - Check payload data structure

### Test Checklist

```javascript
// Example test flow in browser console
store.dispatch(fetchProducts())
  .then(() => {
    console.log('Products loaded:', store.getState().products.items);
  })
  .catch(error => {
    console.error('Error:', error);
  });
```

---

## 📊 State Structure After Phase 2

```javascript
{
  products: {
    items: [],              // From API
    filteredItems: [],
    loading: false,         // NEW
    error: null,            // NEW
    filters: {},
    searchTerm: '',
    pagination: { ... },
    selectedProduct: null,
    lastFetch: null         // NEW
  },
  
  cart: {
    id: null,               // NEW - API cart ID
    items: [],              // From API
    totalPrice: 0,
    totalItems: 0,
    loading: false,         // NEW
    error: null,            // NEW
    lastUpdated: null
  },
  
  payment: {                // NEW
    currentPayment: null,
    processing: false,
    paymentError: null,
    paymentMethods: [],
    payments: [],
    paymentStatus: null
  },
  
  inventory: {              // NEW
    inventories: {},
    lowStockItems: [],
    loading: false,
    error: null
  },
  
  search: {                 // NEW
    results: [],
    totalResults: 0,
    loading: false,
    error: null,
    filters: {}
  }
}
```

---

## ⚠️ Important Notes

### Error Handling
All thunks use `rejectWithValue` to provide error information:
```javascript
if (error) {
  // Access: action.payload?.message
  console.log(error_message);
}
```

### Loading States
Always check loading states before rendering data:
```javascript
const { items, loading, error } = useSelector(state => state.products);

if (loading) return <Spinner />;
if (error) return <Error />;
return <Content items={items} />;
```

### API Error Handling
The `handleApiError()` utility converts axios errors to standard format:
```javascript
{
  status: 404,
  message: "Product not found",
  errors: null
}
```

---

## 🚀 Next: Phase 3

Once Phase 2 is complete:
- Update all components to use API data
- Add loading spinners
- Add error boundaries
- Test end-to-end flows

See [QUICK_START_API_INTEGRATION.md](../QUICK_START_API_INTEGRATION.md) for next steps.

---

**Status:** Phase 2 ✅ Ready for Component Integration  
**Next:** Phase 3 - Update React Components  
**Timeline:** 1-2 weeks for Phase 2 completion
