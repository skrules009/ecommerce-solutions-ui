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
import { clearCartAsync, selectCartItems, selectCartTotal, selectCartShipping, selectCartTax, selectCartGrandTotal } from '../redux/slices/cartSlice';
import { formatPrice, getImageUrl } from '../utils/imageHelpers';
import '../styles/checkout.css';

// Indian States List
const INDIAN_STATES = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh', 'Goa',
  'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka', 'Kerala',
  'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram', 'Nagaland',
  'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura',
  'Uttar Pradesh', 'Uttarakhand', 'West Bengal', 'Delhi', 'Puducherry', 'Chandigarh',
  'Ladakh', 'Jammu and Kashmir'
];

// Payment Methods for India
const PAYMENT_METHODS = [
  { id: 'card', label: 'Credit/Debit Card', icon: '💳' },
  { id: 'upi', label: 'UPI', icon: '📱' },
  { id: 'netbanking', label: 'Net Banking', icon: '🏦' },
  { id: 'googlepay', label: 'Google Pay', icon: '🔵' },
  { id: 'applepay', label: 'Apple Pay', icon: '🍎' },
];

/* ===== Shipping Step ===== */
function ShippingForm({ initial, onSubmit }) {
  const [form, setForm] = useState(initial);
  const [errors, setErrors] = useState({});

  const required = ['firstName', 'lastName', 'email', 'address', 'city', 'state', 'pincode'];

  const validate = () => {
    const e = {};
    required.forEach((f) => { if (!form[f]?.trim()) e[f] = 'Required'; });
    if (form.email && !/\S+@\S+\.\S+/.test(form.email)) e.email = 'Invalid email';
    if (form.pincode && !/^\d{6}$/.test(form.pincode.trim())) e.pincode = 'Pincode must be 6 digits';
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
        {field('firstName', 'First Name', 'text', 'John')}
        {field('lastName', 'Last Name', 'text', 'Doe')}
        {field('email', 'Email Address', 'email', 'john@example.com')}
        {field('phone', 'Phone (optional)', 'tel', '+91 9876543210')}
        {field('address', 'Street Address', 'text', '123 Main Street')}
        {field('city', 'City', 'text', 'Mumbai')}
        <div className="form-field">
          <label htmlFor="ship-state">State</label>
          <select
            id="ship-state"
            className={errors.state ? 'error' : ''}
            value={form.state || ''}
            onChange={(e) => setForm((p) => ({ ...p, state: e.target.value }))}
          >
            <option value="">Select State</option>
            {INDIAN_STATES.map((state) => (
              <option key={state} value={state}>{state}</option>
            ))}
          </select>
          {errors.state && <span className="field-error">{errors.state}</span>}
        </div>
        {field('pincode', 'Pincode', 'text', '400001')}
        <div className="form-field">
          <label htmlFor="ship-country">Country</label>
          <select id="ship-country" value={form.country || 'IN'} onChange={(e) => setForm((p) => ({ ...p, country: e.target.value }))}>
            <option value="IN">India</option>
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
  const [selectedMethod, setSelectedMethod] = useState(initial.paymentMethod || 'card');
  const [form, setForm] = useState(initial);
  const [errors, setErrors] = useState({});

  const validateCard = () => {
    const e = {};
    if (!form.cardName?.trim()) e.cardName = 'Required';
    if (!form.cardNumber?.replace(/\s/g, '') || form.cardNumber.replace(/\s/g, '').length < 13) e.cardNumber = 'Enter a valid card number';
    if (!form.cardExpiry?.trim()) e.cardExpiry = 'Required';
    if (!form.cardCvc?.trim() || form.cardCvc.length < 3) e.cardCvc = 'Enter a valid CVC';
    return e;
  };

  const validateUPI = () => {
    const e = {};
    if (!form.upiId?.trim()) e.upiId = 'Required';
    if (form.upiId && !/^[a-zA-Z0-9.\-_]+@[a-zA-Z0-9]+$/.test(form.upiId.trim())) e.upiId = 'Invalid UPI ID (e.g., username@bank)';
    return e;
  };

  const validateNetBanking = () => {
    const e = {};
    if (!form.bankName?.trim()) e.bankName = 'Required';
    return e;
  };

  const validate = () => {
    if (selectedMethod === 'card') return validateCard();
    if (selectedMethod === 'upi') return validateUPI();
    if (selectedMethod === 'netbanking') return validateNetBanking();
    return {};
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const e2 = validate();
    if (Object.keys(e2).length > 0) { setErrors(e2); return; }
    onSubmit({ ...form, paymentMethod: selectedMethod });
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

      {/* Payment Method Selection */}
      <div style={{ marginBottom: '30px' }}>
        <h4 style={{ marginBottom: '15px' }}>Select Payment Method</h4>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: '10px' }}>
          {PAYMENT_METHODS.map((method) => (
            <button
              key={method.id}
              type="button"
              onClick={() => {
                setSelectedMethod(method.id);
                setErrors({});
              }}
              style={{
                padding: '12px',
                border: selectedMethod === method.id ? '2px solid #3B82F6' : '1px solid #ddd',
                borderRadius: '8px',
                background: selectedMethod === method.id ? '#EFF6FF' : '#fff',
                cursor: 'pointer',
                textAlign: 'center',
                transition: 'all 0.2s',
              }}
            >
              <div style={{ fontSize: '20px', marginBottom: '5px' }}>{method.icon}</div>
              <div style={{ fontSize: '12px', fontWeight: '500' }}>{method.label}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Card Payment Form */}
      {selectedMethod === 'card' && (
        <div className="checkout-form-grid">
          <div className="form-field full-width">
            <label htmlFor="card-name">Name on Card</label>
            <input id="card-name" type="text" className={errors.cardName ? 'error' : ''} value={form.cardName || ''} onChange={(e) => setForm((p) => ({ ...p, cardName: e.target.value }))} placeholder="John Doe" autoComplete="cc-name" />
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
      )}

      {/* UPI Payment Form */}
      {selectedMethod === 'upi' && (
        <div className="checkout-form-grid">
          <div className="form-field full-width">
            <label htmlFor="upi-id">UPI ID</label>
            <input id="upi-id" type="text" className={errors.upiId ? 'error' : ''} value={form.upiId || ''} onChange={(e) => setForm((p) => ({ ...p, upiId: e.target.value }))} placeholder="yourname@upi" />
            {errors.upiId && <span className="field-error">{errors.upiId}</span>}
          </div>
        </div>
      )}

      {/* Net Banking Form */}
      {selectedMethod === 'netbanking' && (
        <div className="checkout-form-grid">
          <div className="form-field full-width">
            <label htmlFor="bank-name">Select Your Bank</label>
            <select id="bank-name" className={errors.bankName ? 'error' : ''} value={form.bankName || ''} onChange={(e) => setForm((p) => ({ ...p, bankName: e.target.value }))}>
              <option value="">Choose a bank</option>
              <option value="HDFC">HDFC Bank</option>
              <option value="ICICI">ICICI Bank</option>
              <option value="SBI">State Bank of India</option>
              <option value="Axis">Axis Bank</option>
              <option value="Kotak">Kotak Mahindra Bank</option>
              <option value="IndusInd">IndusInd Bank</option>
              <option value="IDBI">IDBI Bank</option>
              <option value="BOI">Bank of India</option>
            </select>
            {errors.bankName && <span className="field-error">{errors.bankName}</span>}
          </div>
        </div>
      )}

      {/* Google Pay Form */}
      {selectedMethod === 'googlepay' && (
        <div className="checkout-form-grid">
          <div className="form-field full-width">
            <label htmlFor="gpay-phone">Google Pay Registered Phone Number</label>
            <input id="gpay-phone" type="tel" value={form.gpayPhone || ''} onChange={(e) => setForm((p) => ({ ...p, gpayPhone: e.target.value }))} placeholder="+91 98765 43210" />
          </div>
        </div>
      )}

      {/* Apple Pay Form */}
      {selectedMethod === 'applepay' && (
        <div className="checkout-form-grid">
          <div className="form-field full-width">
            <label htmlFor="apple-email">Apple ID Email</label>
            <input id="apple-email" type="email" value={form.appleEmail || ''} onChange={(e) => setForm((p) => ({ ...p, appleEmail: e.target.value }))} placeholder="youremail@icloud.com" />
          </div>
        </div>
      )}

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
  const paymentMethodLabel = PAYMENT_METHODS.find(m => m.id === paymentMethod.paymentMethod)?.label || 'Card';
  
  return (
    <div>
      <div className="review-section">
        <h3>Shipping Address</h3>
        {Object.keys(addr).length > 0 && (
          <div>
            <div className="review-detail-row"><strong>Name:</strong> {addr.firstName} {addr.lastName}</div>
            <div className="review-detail-row"><strong>Email:</strong> {addr.email}</div>
            <div className="review-detail-row"><strong>Address:</strong> {addr.address}, {addr.city}, {addr.state} {addr.pincode}, {addr.country}</div>
          </div>
        )}
      </div>
      <div className="review-section">
        <h3>Payment Method</h3>
        <div className="review-detail-row">
          <strong>Method:</strong> {paymentMethodLabel}
        </div>
        {paymentMethod.paymentMethod === 'card' && (
          <div className="review-detail-row">
            <strong>Card:</strong> **** **** **** {paymentMethod.cardNumber?.replace(/\s/g, '').slice(-4) || '****'}
          </div>
        )}
        {paymentMethod.paymentMethod === 'upi' && (
          <div className="review-detail-row">
            <strong>UPI ID:</strong> {paymentMethod.upiId}
          </div>
        )}
        {paymentMethod.paymentMethod === 'netbanking' && (
          <div className="review-detail-row">
            <strong>Bank:</strong> {paymentMethod.bankName}
          </div>
        )}
        {paymentMethod.paymentMethod === 'googlepay' && (
          <div className="review-detail-row">
            <strong>Phone:</strong> {paymentMethod.gpayPhone}
          </div>
        )}
        {paymentMethod.paymentMethod === 'applepay' && (
          <div className="review-detail-row">
            <strong>Apple ID:</strong> {paymentMethod.appleEmail}
          </div>
        )}
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
      dispatch(clearCartAsync());
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
              <span>Tax (18% GST)</span>
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
