import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  setStep,
  setShippingAddress,
  setPaymentMethod,
  checkoutStart,
  checkoutSuccess,
  resetCheckout,
} from '../redux/slices/checkoutSlice';
import { createOrder } from '../redux/slices/orderSlice';
import { clearCart, selectCartItems, selectCartTotal, selectCartShipping, selectCartTax, selectCartGrandTotal } from '../redux/slices/cartSlice';
import { formatPrice, getImageUrl } from '../utils/imageHelpers';
import '../styles/checkout.css';

/* ===== Shipping Step ===== */
function ShippingForm({ initial, onSubmit }) {
  const [form, setForm] = useState(initial);
  const [errors, setErrors] = useState({});

  const required = ['firstName', 'lastName', 'email', 'address', 'city', 'state', 'zip'];

  const validate = () => {
    const e = {};
    required.forEach((f) => { if (!form[f]?.trim()) e[f] = 'Required'; });
    if (form.email && !/\S+@\S+\.\S+/.test(form.email)) e.email = 'Invalid email';
    return e;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const e2 = validate();
    if (Object.keys(e2).length > 0) { setErrors(e2); return; }
    onSubmit(form);
  };

  const field = (key, label, type = 'text', placeholder = '') => (
    <div className={`form-field${key === 'address' || key === 'email' ? ' full-width' : ''}`}>
      <label htmlFor={`ship-${key}`}>{label}</label>
      <input
        id={`ship-${key}`}
        type={type}
        className={errors[key] ? 'error' : ''}
        value={form[key] || ''}
        onChange={(e) => setForm((p) => ({ ...p, [key]: e.target.value }))}
        placeholder={placeholder}
        autoComplete={key === 'zip' ? 'postal-code' : key}
      />
      {errors[key] && <span className="field-error">{errors[key]}</span>}
    </div>
  );

  return (
    <form onSubmit={handleSubmit}>
      <div className="checkout-form-grid">
        {field('firstName', 'First Name', 'text', 'Jane')}
        {field('lastName', 'Last Name', 'text', 'Smith')}
        {field('email', 'Email Address', 'email', 'jane@example.com')}
        {field('phone', 'Phone (optional)', 'tel', '+1 555 000 0000')}
        {field('address', 'Street Address', 'text', '123 Main St')}
        {field('city', 'City', 'text', 'New York')}
        {field('state', 'State / Province', 'text', 'NY')}
        {field('zip', 'ZIP / Postal Code', 'text', '10001')}
        <div className="form-field">
          <label htmlFor="ship-country">Country</label>
          <select id="ship-country" value={form.country || 'US'} onChange={(e) => setForm((p) => ({ ...p, country: e.target.value }))}>
            <option value="US">United States</option>
            <option value="CA">Canada</option>
            <option value="GB">United Kingdom</option>
            <option value="AU">Australia</option>
          </select>
        </div>
      </div>
      <div className="checkout-form-actions">
        <button type="submit" className="btn-checkout-next">Continue to Payment →</button>
      </div>
    </form>
  );
}

/* ===== Payment Step ===== */
function PaymentForm({ initial, onBack, onSubmit }) {
  const [form, setForm] = useState(initial);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const e = {};
    if (!form.cardName?.trim()) e.cardName = 'Required';
    if (!form.cardNumber?.replace(/\s/g, '') || form.cardNumber.replace(/\s/g, '').length < 13) e.cardNumber = 'Enter a valid card number';
    if (!form.cardExpiry?.trim()) e.cardExpiry = 'Required';
    if (!form.cardCvc?.trim() || form.cardCvc.length < 3) e.cardCvc = 'Enter a valid CVC';
    return e;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const e2 = validate();
    if (Object.keys(e2).length > 0) { setErrors(e2); return; }
    onSubmit(form);
  };

  const formatCardNumber = (v) =>
    v.replace(/\D/g, '').slice(0, 16).replace(/(.{4})/g, '$1 ').trim();

  const formatExpiry = (v) =>
    v.replace(/\D/g, '').slice(0, 4).replace(/^(\d{2})(\d)/, '$1/$2');

  return (
    <form onSubmit={handleSubmit}>
      <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '20px' }}>
        🔒 This is a demo — no real payment is processed.
      </p>
      <div className="checkout-form-grid">
        <div className="form-field full-width">
          <label htmlFor="card-name">Name on Card</label>
          <input id="card-name" type="text" className={errors.cardName ? 'error' : ''} value={form.cardName || ''} onChange={(e) => setForm((p) => ({ ...p, cardName: e.target.value }))} placeholder="Jane Smith" autoComplete="cc-name" />
          {errors.cardName && <span className="field-error">{errors.cardName}</span>}
        </div>
        <div className="form-field full-width">
          <label htmlFor="card-number">Card Number</label>
          <input id="card-number" type="text" inputMode="numeric" className={errors.cardNumber ? 'error' : ''} value={form.cardNumber || ''} onChange={(e) => setForm((p) => ({ ...p, cardNumber: formatCardNumber(e.target.value) }))} placeholder="1234 5678 9012 3456" autoComplete="cc-number" maxLength={19} />
          {errors.cardNumber && <span className="field-error">{errors.cardNumber}</span>}
        </div>
        <div className="form-field">
          <label htmlFor="card-expiry">Expiry Date</label>
          <input id="card-expiry" type="text" inputMode="numeric" className={errors.cardExpiry ? 'error' : ''} value={form.cardExpiry || ''} onChange={(e) => setForm((p) => ({ ...p, cardExpiry: formatExpiry(e.target.value) }))} placeholder="MM/YY" autoComplete="cc-exp" maxLength={5} />
          {errors.cardExpiry && <span className="field-error">{errors.cardExpiry}</span>}
        </div>
        <div className="form-field">
          <label htmlFor="card-cvc">CVC</label>
          <input id="card-cvc" type="text" inputMode="numeric" className={errors.cardCvc ? 'error' : ''} value={form.cardCvc || ''} onChange={(e) => setForm((p) => ({ ...p, cardCvc: e.target.value.replace(/\D/g, '').slice(0, 4) }))} placeholder="123" autoComplete="cc-csc" maxLength={4} />
          {errors.cardCvc && <span className="field-error">{errors.cardCvc}</span>}
        </div>
      </div>
      <div className="checkout-form-actions">
        <button type="button" className="btn-checkout-back" onClick={onBack}>← Back</button>
        <button type="submit" className="btn-checkout-next">Review Order →</button>
      </div>
    </form>
  );
}

/* ===== Review Step ===== */
function OrderReview({ items, shippingAddress, paymentMethod, subtotal, shipping, tax, grandTotal, onBack, onPlace, isLoading }) {
  const addr = shippingAddress;
  return (
    <div>
      <div className="review-section">
        <h3>Shipping Address</h3>
        {Object.keys(addr).length > 0 && (
          <div>
            <div className="review-detail-row"><strong>Name:</strong> {addr.firstName} {addr.lastName}</div>
            <div className="review-detail-row"><strong>Email:</strong> {addr.email}</div>
            <div className="review-detail-row"><strong>Address:</strong> {addr.address}, {addr.city}, {addr.state} {addr.zip}, {addr.country}</div>
          </div>
        )}
      </div>
      <div className="review-section">
        <h3>Payment</h3>
        <div className="review-detail-row">
          <strong>Card:</strong> **** **** **** {paymentMethod.cardNumber?.replace(/\s/g, '').slice(-4) || '****'}
        </div>
        <div className="review-detail-row"><strong>Name:</strong> {paymentMethod.cardName}</div>
      </div>
      <div className="review-section">
        <h3>Items ({items.length})</h3>
        <div className="review-order-items">
          {items.map((item) => (
            <div key={item.cartId} className="review-order-item">
              <img src={getImageUrl(item.image)} alt={item.name} loading="lazy" />
              <div>
                <div className="review-order-item-name">{item.name}</div>
                <div className="review-order-item-meta">
                  Qty: {item.quantity}
                  {item.selectedSize && item.selectedSize !== 'none' && ` · Size: ${item.selectedSize}`}
                  {item.selectedColor && item.selectedColor !== 'none' && ` · ${item.selectedColor}`}
                </div>
              </div>
              <div className="review-order-item-price">{formatPrice(item.price * item.quantity)}</div>
            </div>
          ))}
        </div>
      </div>
      <div className="checkout-form-actions">
        <button type="button" className="btn-checkout-back" onClick={onBack}>← Back</button>
        <button
          type="button"
          className="btn-place-order"
          onClick={onPlace}
          disabled={isLoading}
        >
          {isLoading ? 'Placing Order…' : `Place Order · ${formatPrice(grandTotal)}`}
        </button>
      </div>
    </div>
  );
}

/* ===== Main Checkout Page ===== */
function Checkout() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { step, shippingAddress, paymentMethod, isLoading } = useSelector((state) => state.checkout);
  const items = useSelector(selectCartItems);
  const subtotal = useSelector(selectCartTotal);
  const shipping = useSelector(selectCartShipping);
  const tax = useSelector(selectCartTax);
  const grandTotal = useSelector(selectCartGrandTotal);

  // Redirect to cart if empty
  useEffect(() => {
    if (items.length === 0) navigate('/cart', { replace: true });
  }, [items.length, navigate]);

  const steps = ['shipping', 'payment', 'review'];
  const stepLabels = ['Shipping', 'Payment', 'Review'];
  const currentStepIndex = steps.indexOf(step);

  const handleShippingSubmit = (address) => {
    dispatch(setShippingAddress(address));
    dispatch(setStep('payment'));
  };

  const handlePaymentSubmit = (payment) => {
    dispatch(setPaymentMethod(payment));
    dispatch(setStep('review'));
  };

  const handlePlaceOrder = () => {
    dispatch(checkoutStart());
    setTimeout(() => {
      const order = {
        id: 'ORD-' + Date.now(),
        items,
        subtotal,
        shipping,
        tax,
        total: grandTotal,
        shippingAddress,
        paymentMethod: {
          type: 'card',
          cardLast4: paymentMethod.cardNumber?.replace(/\s/g, '').slice(-4) || '****',
          cardName: paymentMethod.cardName,
        },
        date: new Date().toISOString(),
        status: 'confirmed',
      };
      dispatch(createOrder(order));
      dispatch(clearCart());
      dispatch(checkoutSuccess());
      dispatch(resetCheckout());
      navigate('/order-confirmation', { replace: true });
    }, 1000);
  };

  return (
    <div className="checkout-page">
      <div className="container">
        <h1>Checkout</h1>

        {/* Steps indicator */}
        <div className="checkout-steps" aria-label="Checkout progress">
          {steps.map((s, i) => (
            <div
              key={s}
              className={`checkout-step${i === currentStepIndex ? ' active' : ''}${i < currentStepIndex ? ' completed' : ''}`}
            >
              <span className="step-number">{i < currentStepIndex ? '✓' : i + 1}</span>
              <span className="step-label">{stepLabels[i]}</span>
            </div>
          ))}
        </div>

        <div className="checkout-layout">
          {/* Form area */}
          <div className="checkout-form-card">
            <h2>{stepLabels[currentStepIndex]}</h2>

            {step === 'shipping' && (
              <ShippingForm initial={shippingAddress} onSubmit={handleShippingSubmit} />
            )}
            {step === 'payment' && (
              <PaymentForm
                initial={paymentMethod}
                onBack={() => dispatch(setStep('shipping'))}
                onSubmit={handlePaymentSubmit}
              />
            )}
            {step === 'review' && (
              <OrderReview
                items={items}
                shippingAddress={shippingAddress}
                paymentMethod={paymentMethod}
                subtotal={subtotal}
                shipping={shipping}
                tax={tax}
                grandTotal={grandTotal}
                onBack={() => dispatch(setStep('payment'))}
                onPlace={handlePlaceOrder}
                isLoading={isLoading}
              />
            )}
          </div>

          {/* Order summary sidebar */}
          <aside className="checkout-summary" aria-label="Order summary">
            <h3>Order Summary</h3>
            <div className="checkout-summary-items">
              {items.map((item) => (
                <div key={item.cartId} className="summary-item-row">
                  <span>{item.name} × {item.quantity}</span>
                  <span>{formatPrice(item.price * item.quantity)}</span>
                </div>
              ))}
            </div>
            <div className="checkout-summary-row">
              <span>Subtotal</span>
              <span>{formatPrice(subtotal)}</span>
            </div>
            <div className="checkout-summary-row">
              <span>Shipping</span>
              <span>{shipping === 0 ? 'FREE' : formatPrice(shipping)}</span>
            </div>
            <div className="checkout-summary-row">
              <span>Tax (8%)</span>
              <span>{formatPrice(tax)}</span>
            </div>
            <div className="checkout-summary-row total">
              <span>Total</span>
              <span>{formatPrice(grandTotal)}</span>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

export default Checkout;
