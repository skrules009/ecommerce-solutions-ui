import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  removeItemFromCart,
  updateCartItem,
  clearCartAsync,
  selectCartItems,
  selectCartTotal,
  selectCartShipping,
  selectCartTax,
  selectCartGrandTotal,
  selectCartItemCount,
} from '../redux/slices/cartSlice';
import { formatPrice, getImageUrl } from '../utils/imageHelpers';
import '../styles/cart.css';

function Cart() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const items = useSelector(selectCartItems);
  const subtotal = useSelector(selectCartTotal);
  const shipping = useSelector(selectCartShipping);
  const tax = useSelector(selectCartTax);
  const grandTotal = useSelector(selectCartGrandTotal);
  const itemCount = useSelector(selectCartItemCount);

  if (items.length === 0) {
    return (
      <div className="cart-page">
        <div className="container">
          <div className="cart-empty">
            <div className="cart-empty-icon">🛒</div>
            <h2>Your cart is empty</h2>
            <p>Looks like you haven't added anything yet.</p>
            <Link to="/products" className="btn-start-shopping">Start Shopping</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <div className="container">
        <h1>Shopping Cart</h1>

        <div className="cart-layout">
          {/* Cart Items */}
          <div className="cart-items-col">
            <div className="cart-header-row">
              <span className="cart-items-count">{itemCount} item{itemCount !== 1 ? 's' : ''}</span>
              <button
                className="btn-clear-cart"
                onClick={() => dispatch(clearCartAsync())}
                aria-label="Remove all items from cart"
              >
                Clear Cart
              </button>
            </div>

            {items.map((item) => (
              <div key={item.cartId} className="cart-item">
                <img
                  className="cart-item-img"
                  src={getImageUrl(item.image)}
                  alt={item.name}
                  loading="lazy"
                />
                <div className="cart-item-details">
                  <Link to={`/product/${item.id}`} className="cart-item-name">
                    {item.name}
                  </Link>
                  <div className="cart-item-meta">
                    {item.selectedSize && item.selectedSize !== 'none' && `Size: ${item.selectedSize}`}
                    {item.selectedSize && item.selectedSize !== 'none' && item.selectedColor && item.selectedColor !== 'none' && ' · '}
                    {item.selectedColor && item.selectedColor !== 'none' && `Color: ${item.selectedColor}`}
                  </div>
                  <div className="cart-item-price">
                    {formatPrice(item.price * item.quantity)}
                    {item.quantity > 1 && (
                      <span className="cart-item-unit-price">({formatPrice(item.price)} each)</span>
                    )}
                  </div>
                  <div className="cart-item-controls">
                    {/* Quantity selector */}
                    <div className="cart-qty-selector" role="group" aria-label="Quantity">
                      <button
                        className="cart-qty-btn"
                        onClick={() =>
                          dispatch(updateCartItem({ cartId: item.cartId, quantity: item.quantity - 1 }))
                        }
                        disabled={item.quantity <= 1}
                        aria-label="Decrease quantity"
                      >
                        −
                      </button>
                      <span className="cart-qty-display">{item.quantity}</span>
                      <button
                        className="cart-qty-btn"
                        onClick={() =>
                          dispatch(updateCartItem({ cartId: item.cartId, quantity: item.quantity + 1 }))
                        }
                        aria-label="Increase quantity"
                      >
                        +
                      </button>
                    </div>
                    <button
                      className="btn-remove-item"
                      onClick={() => dispatch(removeItemFromCart(item.cartId))}
                      aria-label={`Remove ${item.name} from cart`}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Cart Summary */}
          <aside className="cart-summary" aria-label="Order summary">
            <h2>Order Summary</h2>

            <div className="cart-summary-row">
              <span>Subtotal ({itemCount} item{itemCount !== 1 ? 's' : ''})</span>
              <span>{formatPrice(subtotal)}</span>
            </div>
            <div className={`cart-summary-row${shipping === 0 ? ' shipping-free' : ''}`}>
              <span>Shipping</span>
              <span>{'FREE'}</span>
            </div>
            {subtotal > 0 && (
              <p className="cart-promo-note">✅ Free shipping on all orders!</p>
            )}
            <div className="cart-summary-row">
              <span>Estimated Tax (18% GST)</span>
              <span>{formatPrice(tax)}</span>
            </div>
            <div className="cart-summary-row total">
              <span>Total</span>
              <span>{formatPrice(grandTotal)}</span>
            </div>

            <button
              className="btn-checkout"
              onClick={() => navigate('/checkout')}
              aria-label="Proceed to checkout"
            >
              Proceed to Checkout →
            </button>
            <Link to="/products" className="btn-continue-shopping">
              ← Continue Shopping
            </Link>
          </aside>
        </div>
      </div>
    </div>
  );
}

export default Cart;
