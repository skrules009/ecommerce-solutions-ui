import React from 'react';
import { Link } from 'react-router-dom';
import '../../styles/navbar.css';

/**
 * Footer — simple site footer with brand, quick links, and copyright.
 */
function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-inner">
        <div className="footer-grid">
          <div>
            <Link to="/" className="footer-brand">🛒 TakeCart</Link>
            <p className="footer-tagline">Your one-stop ecommerce destination for fashion, shoes, and more.</p>
          </div>
          <div className="footer-col">
            <h4>Shop</h4>
            <ul>
              <li><Link to="/products">All Products</Link></li>
              <li><Link to="/products?category=Women%20Fashion">Women Fashion</Link></li>
              <li><Link to="/products?category=Shoes">Shoes</Link></li>
              <li><Link to="/products?category=Kids%20Fashion">Kids Fashion</Link></li>
            </ul>
          </div>
          <div className="footer-col">
            <h4>Account</h4>
            <ul>
              <li><Link to="/login">Sign In</Link></li>
              <li><Link to="/register">Register</Link></li>
              <li><Link to="/cart">My Cart</Link></li>
            </ul>
          </div>
          <div className="footer-col">
            <h4>Help</h4>
            <ul>
              <li><Link to="/">FAQ</Link></li>
              <li><Link to="/">Shipping Policy</Link></li>
              <li><Link to="/">Returns</Link></li>
              <li><Link to="/">Contact Us</Link></li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          © {year} TakeCart. All rights reserved.
        </div>
      </div>
    </footer>
  );
}

export default Footer;
