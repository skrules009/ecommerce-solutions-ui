import React, { useEffect } from 'react';
import { Provider, useDispatch } from 'react-redux';
import store from './redux/store';
import { fetchProductsSuccess } from './redux/slices/productSlice';
import products from './data/products';
import './App.css';

function AppContent() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchProductsSuccess(products));
  }, [dispatch]);

  return (
    <div className="App">
      <h1>🛒 TakeCart - Ecommerce Application</h1>
      <p>Redux Store Configured with {products.length} Products!</p>
    </div>
  );
}

function App() {
  return (
    <Provider store={store}>
      <AppContent />
    </Provider>
  );
}

export default App;