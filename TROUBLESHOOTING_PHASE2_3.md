# Phase 2 & 3: Troubleshooting Guide

## Common Issues & Solutions

### ❌ Issue 1: "Cannot read property 'items' of undefined"

**Error:**
```
TypeError: Cannot read property 'items' of undefined
```

**Cause:**
Redux slice reducer not properly loaded in store

**Solution:**

1. **Check store.js** - Verify reducer is registered:
```javascript
// src/redux/store.js
import { paymentReducer } from './slices/paymentSlice';

const store = configureStore({
  reducer: {
    // ... other reducers
    payment: paymentReducer,  // ← Must be here
  }
});
```

2. **Verify import path:**
```javascript
// ✅ Correct
import { paymentReducer } from './slices/paymentSlice';

// ❌ Wrong
import { paymentSlice } from './slices/paymentSlice';  // Should be paymentReducer
```

3. **Check export in slice:**
```javascript
// At end of paymentSlice.js
export const { /* action creators */ } = paymentSlice.actions;
export default paymentSlice.reducer;  // ← Named 'paymentSlice' in store
```

---

### ❌ Issue 2: "Thunk is not a function"

**Error:**
```
TypeError: [Function] is not a function
```

**Cause:**
Importing wrong export from slice file

**Solution:**

1. **Import thunk correctly:**
```javascript
// ✅ Correct - Thunk is named export
import { fetchProducts } from '../redux/slices/productSlice';

// ❌ Wrong - Default export is the reducer
import productSlice from '../redux/slices/productSlice';
// This won't work: productSlice.fetchProducts()
```

2. **Check thunk export:**
```javascript
// In productSlice.js - should be exported
export const fetchProducts = createAsyncThunk(
  'products/fetchProducts',
  async () => { ... }
);
```

---

### ❌ Issue 3: "dispatch is not a function"

**Error:**
```
TypeError: dispatch is not a function
```

**Cause:**
Not importing `useDispatch` hook

**Solution:**

```javascript
// ✅ Correct
import { useDispatch } from 'react-redux';

function MyComponent() {
  const dispatch = useDispatch();
  dispatch(fetchProducts());
}

// ❌ Wrong
function MyComponent() {
  dispatch(fetchProducts());  // dispatch doesn't exist
}
```

---

### ❌ Issue 4: "API returns 404 but app doesn't handle it"

**Error:**
```
API Error: 404 Not Found
(App crashes or shows blank page)
```

**Cause:**
Thunk not handling error response properly

**Solution:**

1. **Check error handling in thunk:**
```javascript
// ✅ Good - Uses rejectWithValue
export const fetchProductById = createAsyncThunk(
  'products/fetchProductById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await productService.getProductById(id);
      return response;
    } catch (error) {
      return rejectWithValue(handleApiError(error));
    }
  }
);
```

2. **Handle error in component:**
```javascript
const { error } = useSelector(s => s.products);

return (
  <>
    {error && <Error message={error} />}
    {/* ... rest of JSX */}
  </>
);
```

---

### ❌ Issue 5: "Infinite loop - thunk dispatches every render"

**Error:**
```
Thunk called 100 times per second
Browser becomes unresponsive
```

**Cause:**
Missing dependency in `useEffect`

**Solution:**

```javascript
// ❌ Wrong - Missing dispatch dependency
useEffect(() => {
  dispatch(fetchProducts());
}, []);  // ← dispatch not in deps, but newer React warns about this

// ✅ Correct - With dependencies
useEffect(() => {
  dispatch(fetchProducts());
}, [dispatch]);  // ← dispatch included

// ✅ Or - Prevent re-fetch
useEffect(() => {
  if (products.length === 0) {
    dispatch(fetchProducts());
  }
}, [dispatch, products.length]);
```

---

### ❌ Issue 6: "Loading state stays true forever"

**Error:**
```
Spinner keeps spinning
Page never loads
```

**Cause:**
Thunk rejected but component doesn't check for errors

**Solution:**

```javascript
// ✅ Check both loading and error
const { items, loading, error } = useSelector(s => s.products);

if (loading) return <Spinner />;
if (error) return <Error message={error} />;
if (items.length === 0) return <Empty />;

return <Content items={items} />;
```

---

### ❌ Issue 7: "Cart items not persisting across page reload"

**Error:**
```
Items disappear after page refresh
```

**Cause:**
Cart state cleared on page reload (Redux state not persisted)

**Solution:**

1. **Add localStorage persistence:**
```javascript
// src/redux/store.js
const preloadedState = {
  auth: JSON.parse(localStorage.getItem('auth')) || {},
  cart: JSON.parse(localStorage.getItem('cart')) || 
    { id: null, items: [], totalItems: 0, totalPrice: 0 }
};

const store = configureStore({
  preloadedState,
  reducer: { /* ... */ }
});

// Save to localStorage on every state change
store.subscribe(() => {
  const state = store.getState();
  localStorage.setItem('auth', JSON.stringify(state.auth));
  localStorage.setItem('cart', JSON.stringify(state.cart));
});
```

2. **Or use redux-persist library:**
```bash
npm install redux-persist
```

---

### ❌ Issue 8: "Payment thunk returns undefined payload"

**Error:**
```
result.payload === undefined
Can't access payment ID
```

**Cause:**
Thunk `fulfilled` action doesn't return proper data

**Solution:**

```javascript
// ✅ Correct - Return full response
const processPayment = createAsyncThunk(
  'payment/processPayment',
  async (paymentData) => {
    const response = await paymentService.process(paymentData);
    return response;  // ← Return full response object
  }
);

// In component
const result = await dispatch(processPayment(data));
console.log(result.payload.id);  // Now works!
```

---

### ❌ Issue 9: "CORS error when calling API"

**Error:**
```
Access to XMLHttpRequest blocked by CORS policy
```

**Cause:**
Backend not configured for CORS, or requests not including credentials

**Solution:**

1. **Check axiosInstance.js:**
```javascript
// src/redux/services/axiosInstance.js
import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'http://localhost:7002',  // Correct port
  withCredentials: true,  // ← Include cookies/auth
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add auth token
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default axiosInstance;
```

2. **Ensure backend CORS headers:**
```csharp
// Backend (C#) should have:
app.UseCors(builder => builder
  .AllowAnyOrigin()
  .AllowAnyMethod()
  .AllowAnyHeader()
);
```

---

### ❌ Issue 10: "Inventory state not updating after cache invalidation"

**Error:**
```
Inventory still shows old quantity after update
```

**Cause:**
Inventory cache not being updated after API call

**Solution:**

```javascript
// In inventorySlice.js - ensure cache is updated
const inventorySlice = createSlice({
  name: 'inventory',
  initialState: {
    inventories: {}  // Cache by productId
  },
  extraReducers: (builder) => {
    builder.addCase(adjustInventoryQuantity.fulfilled, (state, action) => {
      const { id, quantity } = action.payload;
      // Find and update the inventory
      for (let productId in state.inventories) {
        if (state.inventories[productId].id === id) {
          state.inventories[productId].quantity = quantity;
          break;
        }
      }
    });
  }
});
```

---

### ❌ Issue 11: "Auth token not being sent with requests"

**Error:**
```
401 Unauthorized on API calls
```

**Cause:**
Auth token not injected into request headers

**Solution:**

```javascript
// src/redux/services/axiosInstance.js
import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'http://localhost:7002'
});

// Request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    // Get token from Redux or localStorage
    const token = localStorage.getItem('authToken') || 
                  sessionStorage.getItem('token');
    
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for 401
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Redirect to login
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
```

---

### ❌ Issue 12: "Search results not paginating correctly"

**Error:**
```
Page 2 shows same results as page 1
Pagination controls don't work
```

**Cause:**
Pagination parameters not passed to search thunk

**Solution:**

```javascript
// ✅ Correct - Pass pagination params
dispatch(advancedSearchProducts({
  query: 'laptop',
  filters: { category: 'electronics' },
  pageNumber: 2,  // ← Include page number
  pageSize: 12    // ← Include page size
}));

// In component - update page on button click
const handleNextPage = () => {
  dispatch(advancedSearchProducts({
    query: currentQuery,
    filters: currentFilters,
    pageNumber: currentPage + 1,  // Increment page
    pageSize: 12
  }));
};
```

---

### ❌ Issue 13: "Memory leak warning - useEffect cleanup"

**Error:**
```
Warning: Can't perform a React state update on an unmounted component
```

**Cause:**
Component unmounted while async thunk is running

**Solution:**

```javascript
import { useEffect, useRef } from 'react';

function Component() {
  const dispatch = useDispatch();
  const isMountedRef = useRef(true);

  useEffect(() => {
    const fetchData = async () => {
      const result = await dispatch(fetchProducts());
      
      // Only update if component still mounted
      if (isMountedRef.current) {
        // Use Redux state update (automatic)
        // or setLocalState if needed
      }
    };

    fetchData();

    return () => {
      isMountedRef.current = false;  // Cleanup
    };
  }, [dispatch]);

  return <div>...</div>;
}
```

---

### ❌ Issue 14: "Payment method selector shows undefined"

**Error:**
```
Payment methods list is empty or undefined
```

**Cause:**
Payment methods not fetched or selector not working

**Solution:**

```javascript
// 1. Fetch payment methods in useEffect
useEffect(() => {
  dispatch(fetchPaymentMethods(userId));
}, [userId, dispatch]);

// 2. Use proper selector
const paymentMethods = useSelector(state => 
  state.payment.paymentMethods || []
);

// 3. Or add selector function
export const selectPaymentMethods = (state) => 
  state.payment.paymentMethods ?? [];

// 4. Check loading state
const { paymentMethods, methodsLoading } = useSelector(s => s.payment);

if (methodsLoading) return <Spinner />;
if (!paymentMethods || paymentMethods.length === 0) {
  return <p>No payment methods. Add one to checkout.</p>;
}

return (
  <select>
    {paymentMethods.map(m => (
      <option key={m.id} value={m.id}>{m.type}</option>
    ))}
  </select>
);
```

---

## 🔍 Debugging Tips

### View Redux State in Browser

```javascript
// In browser console
// If store is accessible:
console.log(store.getState());

// Or via Redux DevTools extension:
// 1. Right-click → Inspect
// 2. Go to "Console" tab
// 3. Type: $r  (gets current component)
```

### Monitor Thunk Execution

```javascript
// In Redux DevTools:
// 1. Open extension
// 2. Look for actions: `pending`, `fulfilled`, `rejected`
// 3. Click each to see:
//    - Arguments passed
//    - Payload returned
//    - State changes before/after
```

### Log Thunk Flow

```javascript
// In thunk
export const fetchProducts = createAsyncThunk(
  'products/fetchProducts',
  async (_, { rejectWithValue }) => {
    console.log('🔵 Fetching products...');
    try {
      const response = await productService.getAll();
      console.log('✅ Received:', response);
      return response;
    } catch (error) {
      console.error('❌ Error:', error);
      return rejectWithValue(handleApiError(error));
    }
  }
);
```

---

## ✅ Verification Checklist

Before moving to Phase 3 component integration:

- [ ] All 5 Redux slices created/updated
- [ ] Store.js includes all 3 new reducers
- [ ] Async thunks dispatch without errors
- [ ] Redux DevTools shows actions correctly
- [ ] Error handling works (test with invalid ID)
- [ ] Loading states toggle properly
- [ ] Selectors return correct data
- [ ] API requests include auth token
- [ ] CORS errors resolved
- [ ] No infinite loops in useEffect

---

## 📞 Getting Help

**For Redux issues:**
1. Check Redux DevTools extension
2. Verify action payload structure
3. Check reducer case for that action
4. Look for typos in slice/action names

**For API issues:**
1. Check network tab (DevTools → Network)
2. Verify API endpoint URL
3. Check request headers (auth token)
4. Check response body for error details

**For component issues:**
1. Verify selector returns correct data
2. Check useEffect dependencies
3. Use console.log to debug state flow
4. Check for re-render loops

---

*Last Updated: Phase 2-3 Troubleshooting*  
*If you encounter an issue not listed here, check the API logs and Redux DevTools first*
