import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { formatPrice, getImageUrl } from '../utils/imageHelpers';
import '../styles/checkout.css';

function OrderConfirmation() {
  const order = useSelector((state) => state.orders.currentOrder);

  if (!order) {
    return (
      <div className="order-confirmation-page">
        <div className="container">
          <div className="order-confirmation-card">
            <div className="order-success-icon">😕</div>
            <h1>No Order Found</h1>
            <p>It looks like you navigated here directly. Please complete the checkout process first.</p>
            <div className="order-confirmation-actions">
              <Link to="/products" className="btn-continue-home">Browse Products</Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const addr = order.shippingAddress || {};
  const payment = order.paymentMethod || {};

  return (
    <div className="order-confirmation-page">
      <div className="container">
        <div className="order-confirmation-card">
          <div className="order-success-icon">✅</div>
          <h1>Order Confirmed!</h1>
          <p>Thank you for your purchase. We'll send a confirmation to your email shortly.</p>
          <div className="order-id-badge">Order #{order.id}</div>

          <div className="order-details-grid">
            <div className="order-detail-block">
              <h4>Shipping Address</h4>
              <p>
                {addr.firstName} {addr.lastName}<br />
                {addr.address}<br />
                {addr.city}, {addr.state} {addr.zip}<br />
                {addr.country}
              </p>
            </div>
            <div className="order-detail-block">
              <h4>Payment</h4>
              <p>
                Card ending in {payment.cardLast4 || '****'}<br />
                {payment.cardName}<br />
                <span style={{ color: 'var(--success)', fontWeight: '600' }}>✓ Payment successful</span>
              </p>
            </div>
            <div className="order-detail-block">
              <h4>Order Date</h4>
              <p>{order.date ? new Date(order.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : '—'}</p>
            </div>
            <div className="order-detail-block">
              <h4>Status</h4>
              <p style={{ color: 'var(--success)', fontWeight: '600', textTransform: 'capitalize' }}>
                {order.status || 'Confirmed'}
              </p>
            </div>
          </div>

          {/* Items */}
          {order.items && order.items.length > 0 && (
            <div className="order-items-list">
              {order.items.map((item) => (
                <div key={item.cartId} className="order-item-row">
                  <img src={getImageUrl(item.image)} alt={item.name} loading="lazy" />
                  <div className="order-item-info">
                    <strong>{item.name}</strong>
                    <span>
                      Qty: {item.quantity}
                      {item.selectedSize && item.selectedSize !== 'none' && ` · Size: ${item.selectedSize}`}
                      {item.selectedColor && item.selectedColor !== 'none' && ` · ${item.selectedColor}`}
                    </span>
                  </div>
                  <div className="order-item-total">{formatPrice(item.price * item.quantity)}</div>
                </div>
              ))}
            </div>
          )}

          {/* Totals */}
          <div className="order-totals">
            <div className="order-total-row">
              <span>Subtotal</span>
              <span>{formatPrice(order.subtotal || 0)}</span>
            </div>
            <div className="order-total-row">
              <span>Shipping</span>
              <span>{order.shipping === 0 ? 'FREE' : formatPrice(order.shipping || 0)}</span>
            </div>
            <div className="order-total-row">
              <span>Tax</span>
              <span>{formatPrice(order.tax || 0)}</span>
            </div>
            <div className="order-total-row grand">
              <span>Total</span>
              <span>{formatPrice(order.total || 0)}</span>
            </div>
          </div>

          <div className="order-confirmation-actions">
            <Link to="/products" className="btn-continue-home">Continue Shopping</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default OrderConfirmation;
