# Phase 2: Redux Thunks - Quick Reference

## 🎯 All 31 Async Thunks at a Glance

### Product Thunks (5)

| Thunk | Parameters | Returns | API Call |
|-------|-----------|---------|----------|
| `fetchProducts` | - | `Product[]` | `GET /api/v1/products` |
| `fetchProductById` | `productId` | `Product` | `GET /api/v1/products/:id` |
| `createProduct` | `productData` | `Product` | `POST /api/v1/products` |
| `updateProduct` | `{ id, data }` | `Product` | `PUT /api/v1/products/:id` |
| `deleteProduct` | `productId` | `{ success }` | `DELETE /api/v1/products/:id` |

### Cart Thunks (6)

| Thunk | Parameters | Returns | API Call |
|-------|-----------|---------|----------|
| `fetchCartByCustomerId` | `customerId` | `Cart` | `GET /api/v1/carts/customer/:id` |
| `createCart` | `customerId` | `Cart` | `POST /api/v1/carts` |
| `addItemToCart` | `{ cartId, productId, qty }` | `Cart` | `POST /api/v1/carts/:cartId/items` |
| `removeItemFromCart` | `{ cartId, itemId }` | `Cart` | `DELETE /api/v1/carts/:cartId/items/:itemId` |
| `updateCartItem` | `{ cartId, itemId, qty }` | `Cart` | `PUT /api/v1/carts/:cartId/items/:itemId` |
| `clearCartAsync` | `cartId` | `{ success }` | `DELETE /api/v1/carts/:cartId` |

### Payment Thunks (8)

| Thunk | Parameters | Returns | API Call |
|-------|-----------|---------|----------|
| `processPayment` | `paymentData` | `Payment` | `POST /api/v1/payments` |
| `completePayment` | `paymentId` | `Payment` | `PUT /api/v1/payments/:id/complete` |
| `failPayment` | `{ paymentId, reason }` | `Payment` | `PUT /api/v1/payments/:id/fail` |
| `fetchPaymentById` | `paymentId` | `Payment` | `GET /api/v1/payments/:id` |
| `fetchPaymentByOrderId` | `orderId` | `Payment` | `GET /api/v1/payments/order/:id` |
| `fetchAllPayments` | - | `Payment[]` | `GET /api/v1/payments` |
| `addPaymentMethod` | `methodData` | `PaymentMethod` | `POST /api/v1/payment-methods` |
| `refundPayment` | `{ paymentId, amt, reason }` | `Refund` | `POST /api/v1/payments/:id/refunds` |

### Inventory Thunks (7)

| Thunk | Parameters | Returns | API Call |
|-------|-----------|---------|----------|
| `checkInventory` | `productId` | `Inventory` | `GET /api/v1/inventory/:id` |
| `checkInventoryBySku` | `sku` | `Inventory` | `GET /api/v1/inventory/sku/:sku` |
| `fetchLowStockItems` | - | `Inventory[]` | `GET /api/v1/inventory/low-stock` |
| `fetchInventoriesByWarehouse` | `warehouse` | `Inventory[]` | `GET /api/v1/inventory/warehouse/:id` |
| `adjustInventoryQuantity` | `{ id, qty, type }` | `Inventory` | `PUT /api/v1/inventory/:id` |
| `addInventoryTransaction` | `{ id, qty, type, notes }` | `Transaction` | `POST /api/v1/inventory/transactions` |
| `fetchInventoryTransactions` | `inventoryId` | `Transaction[]` | `GET /api/v1/inventory/:id/transactions` |

### Search Thunks (5)

| Thunk | Parameters | Returns | API Call |
|-------|-----------|---------|----------|
| `searchProducts` | `{ query, page, size }` | `SearchResult` | `POST /api/v1/search/products` |
| `advancedSearchProducts` | `{ query, filters, pagination }` | `SearchResult` | `POST /api/v1/search/advanced` |
| `searchByDocumentType` | `{ type, query, pagination }` | `SearchResult` | `GET /api/v1/search/documents/:type` |
| `indexDocument` | `document` | `{ indexed }` | `POST /api/v1/search/index` |
| `bulkIndexDocuments` | `documents[]` | `{ indexed }` | `POST /api/v1/search/index/bulk` |

---

## 💡 Common Usage Patterns

### Pattern 1: Fetch & Display Data

```javascript
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProducts } from '../redux/slices/productSlice';

function MyComponent() {
  const dispatch = useDispatch();
  const { items: products, loading, error } = useSelector(s => s.products);

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  return <div>{products.map(p => <p key={p.id}>{p.name}</p>)}</div>;
}
```

**Key Points:**
- Import thunk from slice file
- Use `useDispatch()` to dispatch
- Use `useSelector()` to access state
- Check `loading`/`error` before rendering

---

### Pattern 2: Handle Async Action Result

```javascript
import { useDispatch } from 'react-redux';
import { processPayment } from '../redux/slices/paymentSlice';

function Checkout() {
  const dispatch = useDispatch();

  const handlePay = async () => {
    try {
      const result = await dispatch(processPayment({
        orderId: 123,
        amount: 999,
        method: 'UPI'
      }));

      if (result.payload) {
        // Success
        console.log('Payment ID:', result.payload.id);
        navigate('/confirmation', { state: { paymentId: result.payload.id } });
      } else if (result.error) {
        // Error
        console.error('Payment failed:', result.payload?.message);
        showError('Payment failed. Please try again.');
      }
    } catch (err) {
      console.error('Unexpected error:', err);
    }
  };

  return <button onClick={handlePay}>Pay ₹999</button>;
}
```

**Key Points:**
- `await dispatch(thunk)` returns action with `payload` or `error`
- Check `result.payload` for success
- Check `result.error.payload?.message` for error details
- API errors are caught and wrapped in `rejectWithValue`

---

### Pattern 3: Dependent Data Fetching

```javascript
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProductById } from '../redux/slices/productSlice';
import { checkInventory } from '../redux/slices/inventorySlice';

function ProductDetailPage({ productId }) {
  const dispatch = useDispatch();
  const product = useSelector(s => s.products.selectedProduct);
  const inventory = useSelector(s => selectInventoryByProductId(s, productId));

  useEffect(() => {
    // First fetch product
    dispatch(fetchProductById(productId));
  }, [productId, dispatch]);

  useEffect(() => {
    // Then fetch inventory when product loads
    if (product?.id) {
      dispatch(checkInventory(product.id));
    }
  }, [product?.id, dispatch]);

  return (
    <div>
      <h1>{product?.name}</h1>
      <p>Stock: {inventory?.quantity || 0}</p>
    </div>
  );
}
```

**Key Points:**
- Use separate `useEffect` hooks for dependent data
- First effect fetches product
- Second effect triggers when product loads
- Clean dependencies to avoid infinite loops

---

### Pattern 4: Update with Optimistic UI

```javascript
import { useDispatch, useSelector } from 'react-redux';
import { addItemToCart } from '../redux/slices/cartSlice';

function AddToCartButton({ productId, quantity }) {
  const dispatch = useDispatch();
  const { loading, error } = useSelector(s => s.cart);
  const cartId = useSelector(s => s.cart.id);

  const handleAdd = async () => {
    if (!cartId) {
      alert('Cart not initialized');
      return;
    }

    try {
      const result = await dispatch(addItemToCart({
        cartId,
        productId,
        quantity
      }));

      if (result.payload) {
        // Show success toast
        showSuccess('Added to cart!');
      } else {
        // Show error
        showError(result.payload?.message || 'Failed to add item');
      }
    } catch (err) {
      showError('Unexpected error');
    }
  };

  return (
    <button onClick={handleAdd} disabled={loading}>
      {loading ? 'Adding...' : 'Add to Cart'}
    </button>
  );
}
```

**Key Points:**
- Disable button during `loading`
- Show "Adding..." text while loading
- Handle success/error in result
- Show user feedback (toast/alert)

---

### Pattern 5: Search with Filters

```javascript
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { advancedSearchProducts } from '../redux/slices/searchSlice';

function SearchComponent() {
  const dispatch = useDispatch();
  const { results, totalResults, loading } = useSelector(s => s.search);
  const [query, setQuery] = useState('');
  const [filters, setFilters] = useState({ minPrice: 0, maxPrice: 10000 });

  const handleSearch = () => {
    dispatch(advancedSearchProducts({
      query,
      filters,
      pageNumber: 1,
      pageSize: 12
    }));
  };

  return (
    <>
      <input
        value={query}
        onChange={e => setQuery(e.target.value)}
        placeholder="Search products..."
      />
      <button onClick={handleSearch} disabled={loading}>
        {loading ? 'Searching...' : 'Search'}
      </button>
      <div>
        <p>Found {totalResults} products</p>
        {results.map(p => <ProductCard key={p.id} product={p} />)}
      </div>
    </>
  );
}
```

**Key Points:**
- Build filter object from form inputs
- Dispatch with query + filters + pagination
- Show total results count
- Display loading state during search

---

## 🛠️ Selector Usage

### Access State with Selectors

```javascript
import { useSelector } from 'react-redux';
import { selectInventoryByProductId } from '../redux/slices/inventorySlice';

function Component() {
  // Method 1: Manual access
  const products = useSelector(state => state.products.items);
  
  // Method 2: Use slice selector
  const inventory = useSelector(state => 
    selectInventoryByProductId(state, productId)
  );

  // Method 3: Destructure multiple
  const { items, loading, error } = useSelector(state => ({
    items: state.products.items,
    loading: state.products.loading,
    error: state.products.error
  }));
}
```

---

## ⚠️ Error Handling

### Standard Error Format

```javascript
// All thunks return errors in this format:
{
  status: number,        // HTTP status
  message: string,       // Error message
  errors: object | null  // Detailed errors
}

// Access in component:
const result = await dispatch(someThunk());
if (result.error) {
  const { payload } = result;
  console.log(payload.message);      // "Product not found"
  console.log(payload.status);       // 404
}
```

### Common Error Scenarios

```javascript
// Cart not found (404) → Auto-creates new cart
const result = await dispatch(fetchCartByCustomerId(customerId));
// Returns new empty cart, no error

// Product not found (404)
const result = await dispatch(fetchProductById(invalidId));
// Returns error with message "Product not found"

// Validation error (400)
const result = await dispatch(createProduct(invalidData));
// Returns error with details in payload.errors

// Server error (500)
const result = await dispatch(someThunk());
// Returns error with message "Internal server error"
```

---

## 📊 State Shape Reference

### Product State
```javascript
{
  items: [],
  selectedProduct: null,
  filteredItems: [],
  searchTerm: '',
  loading: false,
  error: null,
  pagination: { current: 1, size: 12, total: 100 },
  filters: { category: '', minPrice: 0, maxPrice: 1000 },
  lastFetch: null
}
```

### Cart State
```javascript
{
  id: "cart-123",  // API cart ID
  items: [],
  totalItems: 0,
  totalPrice: 0,
  totalTax: 0,
  totalShipping: 0,
  loading: false,
  error: null,
  lastUpdated: null
}
```

### Payment State
```javascript
{
  currentPayment: null,
  paymentMethods: [],
  payments: [],
  paymentStatus: null,
  processing: false,
  methodsLoading: false,
  historyLoading: false,
  error: null,
  methodsError: null
}
```

### Inventory State
```javascript
{
  inventories: {
    "product-1": { quantity: 100, sku: "SKU123" },
    "product-2": { quantity: 0, sku: "SKU456" }
  },
  lowStockItems: [],
  warehouseInventory: [],
  currentTransactions: [],
  loading: false,
  lowStockLoading: false,
  warehouseLoading: false,
  transactionsLoading: false,
  error: null
}
```

### Search State
```javascript
{
  results: [],
  totalResults: 0,
  pageNumber: 1,
  pageSize: 12,
  totalPages: 5,
  searchQuery: '',
  filters: {},
  searchType: 'basic',
  loading: false,
  indexing: false,
  error: null,
  lastSearch: null,
  lastSearchTime: null
}
```

---

## 🚀 Testing Thunks in Browser

### Step 1: Open Redux DevTools
- Extension → Redux tab

### Step 2: Dispatch Thunks Manually

```javascript
// In browser console
const { store } = window;  // If store is exposed (dev setup)

// Or via React DevTools method:
// 1. Open React DevTools
// 2. Find component using Redux hooks
// 3. Inspect Redux context to get store

// Dispatch example
store.dispatch(fetchProducts())
  .then(result => {
    console.log('Success:', result.payload);
    console.log('State:', store.getState().products);
  })
  .catch(err => {
    console.error('Error:', err);
  });
```

### Step 3: Watch Actions

```
Action Timeline in Redux DevTools:
┌─ products/fetchProducts/pending
├─ products/fetchProducts/fulfilled (with payload)
└─ products/items (updated)
```

---

## 💡 Pro Tips

1. **Always check loading before rendering:**
   ```javascript
   if (loading) return <Spinner />;
   ```

2. **Handle both pending and fulfilled states:**
   ```javascript
   // Show loading UI while pending
   // Show data UI when fulfilled
   // Show error UI on rejected
   ```

3. **Use selectors consistently:**
   ```javascript
   // Bad
   const products = useSelector(s => s.products.items);
   
   // Good
   const products = useSelector(selectAllProducts);
   ```

4. **Memoize selectors to prevent unnecessary re-renders:**
   ```javascript
   const selectProductCount = createSelector(
     state => state.products.items,
     items => items.length
   );
   ```

5. **Handle loading states separately:**
   ```javascript
   // Can fetch multiple things concurrently
   dispatch(fetchLowStockItems());
   dispatch(fetchPaymentMethods());
   // Each has its own loading: lowStockLoading, methodsLoading
   ```

---

**Quick Link Reference:**
- Full Guide: [PHASE_2_REDUX_INTEGRATION_GUIDE.md](./PHASE_2_REDUX_INTEGRATION_GUIDE.md)
- Completion Status: [PHASE_2_COMPLETION_SUMMARY.md](./PHASE_2_COMPLETION_SUMMARY.md)
- API Integration Plan: [API_INTEGRATION_PLAN.md](./API_INTEGRATION_PLAN.md)
