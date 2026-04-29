import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  removeItemFromCart,
  updateCartItem,
  clearCartAsync,
  fetchCartByCustomerId,
} from '../redux/slices/cartSlice';
import { formatPrice, getImageUrl } from '../utils/imageHelpers';
import '../styles/cart.css';

function Cart() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);

  // Get cart state
  const cart = useSelector((state) => state.cart);
  const items = cart.items || [];
  
  // Calculate totals with proper handling
  const subtotal = cart.totalPrice ? parseFloat(cart.totalPrice) : 0;
  const shipping = cart.shippingCost ? parseFloat(cart.shippingCost) : 0;
  const tax = cart.tax ? parseFloat(cart.tax) : 0;
  
  // Grand total = Subtotal + Shipping + Tax
  const grandTotal = parseFloat((subtotal + shipping + tax).toFixed(2));
  
  const itemCount = cart.totalItems || items.length;

  // Log for debugging
  console.log('Cart State:',{
    subtotal,
    shipping,
    tax,
    grandTotal,
    cartTotalPrice: cart.totalPrice,
    cartTax: cart.tax,
    itemCount,
  });

  // Load cart on mount if user is authenticated
  useEffect(() => {
    if (user && user.id) {
      dispatch(fetchCartByCustomerId(user.id));
    }
  }, [user, dispatch]);

  if (!items || items.length === 0) {
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

  const handleRemoveItem = (itemId) => {
    if (cart.id) {
      dispatch(removeItemFromCart({ cartId: cart.id, cartItemId: itemId }));
    }
  };

  const handleUpdateQuantity = (itemId, quantity, unitPrice) => {
    if (cart.id && quantity > 0) {
      dispatch(updateCartItem({ cartId: cart.id, cartItemId: itemId, quantity, unitPrice }));
    }
  };

  const handleClearCart = () => {
    if (cart.id) {
      dispatch(clearCartAsync(cart.id));
    }
  };

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
                onClick={handleClearCart}
                aria-label="Remove all items from cart"
              >
                Clear Cart
              </button>
            </div>

            {items.map((item) => (
              <div key={item.id} className="cart-item">
                <img
                  className="cart-item-img"
                  src={getImageUrl(item.image || item.productImage)}
                  alt={item.productName || item.name}
                  loading="lazy"
                />
                <div className="cart-item-details">
                  <Link to={`/product/${item.productId}`} className="cart-item-name">
                    {item.productName || item.name}
                  </Link>
                  <div className="cart-item-meta">
                    {item.productSku && `SKU: ${item.productSku}`}
                  </div>
                  <div className="cart-item-price">
                    {formatPrice(item.totalPrice || (item.unitPrice * item.quantity))}
                    {item.quantity > 1 && (
                      <span className="cart-item-unit-price">({formatPrice(item.unitPrice || item.price)} each)</span>
                    )}
                  </div>
                  <div className="cart-item-controls">
                    {/* Quantity selector */}
                    <div className="cart-qty-selector" role="group" aria-label="Quantity">
                      <button
                        className="cart-qty-btn"
                        onClick={() => handleUpdateQuantity(item.id, item.quantity - 1, item.unitPrice)}
                        disabled={item.quantity <= 1}
                        aria-label="Decrease quantity"
                      >
                        −
                      </button>
                      <span className="cart-qty-display">{item.quantity}</span>
                      <button
                        className="cart-qty-btn"
                        onClick={() => handleUpdateQuantity(item.id, item.quantity + 1, item.unitPrice)}
                        aria-label="Increase quantity"
                      >
                        +
                      </button>
                    </div>
                    <button
                      className="btn-remove-item"
                      onClick={() => handleRemoveItem(item.id)}
                      aria-label={`Remove ${item.productName || item.name} from cart`}
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
              <span className="amount">{formatPrice(subtotal)}</span>
            </div>
            
            <div className={`cart-summary-row${shipping === 0 ? ' shipping-free' : ''}`}>
              <span>Shipping</span>
              <span className="amount">{shipping === 0 ? 'FREE' : formatPrice(shipping)}</span>
            </div>
            
            {subtotal > 0 && (
              <p className="cart-promo-note">✅ Free shipping on all orders!</p>
            )}
            
            <div className="cart-summary-divider"></div>
            
            <div className="cart-summary-row">
              <span>Estimated Tax (18% GST)</span>
              <span className="amount">{formatPrice(tax)}</span>
            </div>
            
            <div className="cart-summary-row total">
              <span className="total-label">Total Amount</span>
              <span className="total-amount">{formatPrice(grandTotal)}</span>
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
