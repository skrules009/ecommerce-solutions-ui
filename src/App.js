import React, { useEffect } from 'react';
import { Provider, useDispatch } from 'react-redux';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import store from './redux/store';
import { fetchProductsSuccess } from './redux/slices/productSlice';
import products from './data/products';
import ProductDetail from './pages/ProductDetail';
import './App.css';

function AppContent() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchProductsSuccess(products));
  }, [dispatch]);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={
          <div className="App">
            <h1>🛒 TakeCart - Ecommerce Application</h1>
            <p>Redux Store Configured with {products.length} Products!</p>
            <p>Visit <a href="/product/1">/product/1</a> to view a product detail page.</p>
          </div>
        } />
        <Route path="/product/:id" element={<ProductDetail />} />
      </Routes>
    </BrowserRouter>
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
