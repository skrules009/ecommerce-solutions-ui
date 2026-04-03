import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateUserProfile, logout } from '../redux/slices/authSlice';
import { selectOrders } from '../redux/slices/orderSlice';
import '../styles/account.css';

function Account() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const orders = useSelector(selectOrders);
  
  const [activeTab, setActiveTab] = useState('profile');
  const [editMode, setEditMode] = useState(false);
  const [newAddress, setNewAddress] = useState(false);
  const [changePassword, setChangePassword] = useState(false);

  // Profile form state
  const [profileForm, setProfileForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    dob: user?.dob || '',
  });

  // Address form state
  const [addressForm, setAddressForm] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    isDefault: false,
  });

  // Password form state
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState('');

  const INDIAN_STATES = [
    'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh', 'Goa',
    'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka', 'Kerala',
    'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram', 'Nagaland',
    'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura',
    'Uttar Pradesh', 'Uttarakhand', 'West Bengal', 'Delhi', 'Puducherry', 'Chandigarh',
    'Ladakh', 'Jammu and Kashmir'
  ];

  // Handle profile update
  const handleProfileSubmit = (e) => {
    e.preventDefault();
    setErrors({});

    if (!profileForm.name?.trim()) {
      setErrors({ name: 'Name is required' });
      return;
    }

    dispatch(updateUserProfile(profileForm));
    setSuccess('Profile updated successfully!');
    setEditMode(false);
    setTimeout(() => setSuccess(''), 3000);
  };

  // Handle add address
  const handleAddressSubmit = (e) => {
    e.preventDefault();
    const error = {};
    if (!addressForm.firstName?.trim()) error.firstName = 'First name is required';
    if (!addressForm.lastName?.trim()) error.lastName = 'Last name is required';
    if (!addressForm.address?.trim()) error.address = 'Address is required';
    if (!addressForm.city?.trim()) error.city = 'City is required';
    if (!addressForm.state?.trim()) error.state = 'State is required';
    if (!addressForm.pincode?.trim() || !/^\d{6}$/.test(addressForm.pincode)) error.pincode = 'Valid 6-digit pincode required';

    if (Object.keys(error).length > 0) {
      setErrors(error);
      return;
    }

    // Mock address save
    setSuccess('Address added successfully!');
    setNewAddress(false);
    setAddressForm({
      firstName: '',
      lastName: '',
      phone: '',
      address: '',
      city: '',
      state: '',
      pincode: '',
      isDefault: false,
    });
    setTimeout(() => setSuccess(''), 3000);
  };

  // Handle change password
  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    const error = {};

    if (!passwordForm.currentPassword?.trim()) error.currentPassword = 'Current password is required';
    if (!passwordForm.newPassword?.trim()) error.newPassword = 'New password is required';
    if (passwordForm.newPassword?.length < 6) error.newPassword = 'Password must be at least 6 characters';
    if (passwordForm.newPassword !== passwordForm.confirmPassword) error.confirmPassword = 'Passwords do not match';

    if (Object.keys(error).length > 0) {
      setErrors(error);
      return;
    }

    // Mock password change
    setSuccess('Password changed successfully!');
    setChangePassword(false);
    setPasswordForm({
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    });
    setTimeout(() => setSuccess(''), 3000);
  };

  return (
    <div className="account-page">
      <div className="container">
        <h1>My Account</h1>

        {success && <div className="alert alert-success">{success}</div>}

        {/* Tabs */}
        <div className="account-tabs">
          <button
            className={`account-tab${activeTab === 'profile' ? ' active' : ''}`}
            onClick={() => setActiveTab('profile')}
          >
            👤 Profile
          </button>
          <button
            className={`account-tab${activeTab === 'orders' ? ' active' : ''}`}
            onClick={() => setActiveTab('orders')}
          >
            📦 Orders ({orders?.length || 0})
          </button>
          <button
            className={`account-tab${activeTab === 'addresses' ? ' active' : ''}`}
            onClick={() => setActiveTab('addresses')}
          >
            📍 Addresses
          </button>
          <button
            className={`account-tab${activeTab === 'settings' ? ' active' : ''}`}
            onClick={() => setActiveTab('settings')}
          >
            ⚙️ Settings
          </button>
        </div>

        {/* Tab Content */}
        <div className="account-content">
          {/* Profile Tab */}
          {activeTab === 'profile' && (
            <div className="account-section">
              <div className="section-header">
                <h2>Personal Information</h2>
                <button
                  className="btn-edit"
                  onClick={() => setEditMode(!editMode)}
                >
                  {editMode ? '✕ Cancel' : '✏️ Edit'}
                </button>
              </div>

              {!editMode ? (
                <div className="profile-view">
                  <div className="profile-item">
                    <span className="profile-label">Name:</span>
                    <span className="profile-value">{user?.name}</span>
                  </div>
                  <div className="profile-item">
                    <span className="profile-label">Email:</span>
                    <span className="profile-value">{user?.email}</span>
                  </div>
                  <div className="profile-item">
                    <span className="profile-label">Phone:</span>
                    <span className="profile-value">{user?.phone || 'Not provided'}</span>
                  </div>
                  <div className="profile-item">
                    <span className="profile-label">Date of Birth:</span>
                    <span className="profile-value">{user?.dob || 'Not provided'}</span>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleProfileSubmit} className="profile-form">
                  <div className="form-group">
                    <label htmlFor="name">Full Name</label>
                    <input
                      id="name"
                      type="text"
                      value={profileForm.name}
                      onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                      className={errors.name ? 'error' : ''}
                    />
                    {errors.name && <span className="error-text">{errors.name}</span>}
                  </div>

                  <div className="form-group">
                    <label htmlFor="email">Email</label>
                    <input
                      id="email"
                      type="email"
                      value={profileForm.email}
                      onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                      disabled
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="phone">Phone Number</label>
                    <input
                      id="phone"
                      type="tel"
                      value={profileForm.phone}
                      onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                      placeholder="+91 98765 43210"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="dob">Date of Birth</label>
                    <input
                      id="dob"
                      type="date"
                      value={profileForm.dob}
                      onChange={(e) => setProfileForm({ ...profileForm, dob: e.target.value })}
                    />
                  </div>

                  <button type="submit" className="btn-save">Save Changes</button>
                </form>
              )}
            </div>
          )}

          {/* Orders Tab */}
          {activeTab === 'orders' && (
            <div className="account-section">
              <h2>Order History</h2>
              {orders && orders.length > 0 ? (
                <div className="orders-list">
                  {orders.map((order) => (
                    <div key={order.id} className="order-card">
                      <div className="order-header">
                        <div>
                          <h3>Order ID: {order.id}</h3>
                          <p className="order-date">
                            Placed on: {new Date(order.date).toLocaleDateString('en-IN')} at {new Date(order.date).toLocaleTimeString()}
                          </p>
                        </div>
                        <span className={`order-status status-${order.status}`}>
                          {order.status?.toUpperCase()}
                        </span>
                      </div>

                      <div className="order-items">
                        <h4>Items:</h4>
                        {order.items?.map((item) => (
                          <div key={item.cartId} className="order-item">
                            <div className="item-info">
                              <span className="item-name">{item.name}</span>
                              <span className="item-qty">Qty: {item.quantity}</span>
                            </div>
                            <span className="item-price">₹{(item.price * item.quantity).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                          </div>
                        ))}
                      </div>

                      <div className="order-summary">
                        <div className="summary-row">
                          <span>Subtotal:</span>
                          <span>₹{order.subtotal?.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                        </div>
                        <div className="summary-row">
                          <span>Shipping:</span>
                          <span>{order.shipping === 0 ? 'FREE' : `₹${order.shipping?.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}</span>
                        </div>
                        <div className="summary-row">
                          <span>GST (18%):</span>
                          <span>₹{order.tax?.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                        </div>
                        <div className="summary-row total">
                          <span>Total:</span>
                          <span>₹{order.total?.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                        </div>
                      </div>

                      <div className="order-address">
                        <h4>Delivery Address:</h4>
                        <p>
                          {order.shippingAddress?.firstName} {order.shippingAddress?.lastName}<br />
                          {order.shippingAddress?.address}<br />
                          {order.shippingAddress?.city}, {order.shippingAddress?.state} {order.shippingAddress?.pincode}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="empty-state">No orders yet. Start shopping!</p>
              )}
            </div>
          )}

          {/* Addresses Tab */}
          {activeTab === 'addresses' && (
            <div className="account-section">
              <div className="section-header">
                <h2>Saved Addresses</h2>
                <button
                  className="btn-add"
                  onClick={() => setNewAddress(!newAddress)}
                >
                  {newAddress ? '✕ Cancel' : '+ Add New Address'}
                </button>
              </div>

              {newAddress && (
                <form onSubmit={handleAddressSubmit} className="address-form">
                  <div className="form-grid">
                    <div className="form-group">
                      <label htmlFor="fname">First Name</label>
                      <input
                        id="fname"
                        type="text"
                        value={addressForm.firstName}
                        onChange={(e) => setAddressForm({ ...addressForm, firstName: e.target.value })}
                        className={errors.firstName ? 'error' : ''}
                      />
                      {errors.firstName && <span className="error-text">{errors.firstName}</span>}
                    </div>

                    <div className="form-group">
                      <label htmlFor="lname">Last Name</label>
                      <input
                        id="lname"
                        type="text"
                        value={addressForm.lastName}
                        onChange={(e) => setAddressForm({ ...addressForm, lastName: e.target.value })}
                        className={errors.lastName ? 'error' : ''}
                      />
                      {errors.lastName && <span className="error-text">{errors.lastName}</span>}
                    </div>

                    <div className="form-group full-width">
                      <label htmlFor="phone-addr">Phone Number</label>
                      <input
                        id="phone-addr"
                        type="tel"
                        value={addressForm.phone}
                        onChange={(e) => setAddressForm({ ...addressForm, phone: e.target.value })}
                        placeholder="+91 98765 43210"
                      />
                    </div>

                    <div className="form-group full-width">
                      <label htmlFor="addr">Street Address</label>
                      <input
                        id="addr"
                        type="text"
                        value={addressForm.address}
                        onChange={(e) => setAddressForm({ ...addressForm, address: e.target.value })}
                        className={errors.address ? 'error' : ''}
                      />
                      {errors.address && <span className="error-text">{errors.address}</span>}
                    </div>

                    <div className="form-group">
                      <label htmlFor="city-addr">City</label>
                      <input
                        id="city-addr"
                        type="text"
                        value={addressForm.city}
                        onChange={(e) => setAddressForm({ ...addressForm, city: e.target.value })}
                        className={errors.city ? 'error' : ''}
                      />
                      {errors.city && <span className="error-text">{errors.city}</span>}
                    </div>

                    <div className="form-group">
                      <label htmlFor="state-addr">State</label>
                      <select
                        id="state-addr"
                        value={addressForm.state}
                        onChange={(e) => setAddressForm({ ...addressForm, state: e.target.value })}
                        className={errors.state ? 'error' : ''}
                      >
                        <option value="">Select State</option>
                        {INDIAN_STATES.map((state) => (
                          <option key={state} value={state}>{state}</option>
                        ))}
                      </select>
                      {errors.state && <span className="error-text">{errors.state}</span>}
                    </div>

                    <div className="form-group">
                      <label htmlFor="pincode-addr">Pincode</label>
                      <input
                        id="pincode-addr"
                        type="text"
                        value={addressForm.pincode}
                        onChange={(e) => setAddressForm({ ...addressForm, pincode: e.target.value })}
                        placeholder="400001"
                        className={errors.pincode ? 'error' : ''}
                      />
                      {errors.pincode && <span className="error-text">{errors.pincode}</span>}
                    </div>

                    <div className="form-group checkbox">
                      <input
                        id="default-addr"
                        type="checkbox"
                        checked={addressForm.isDefault}
                        onChange={(e) => setAddressForm({ ...addressForm, isDefault: e.target.checked })}
                      />
                      <label htmlFor="default-addr">Set as default address</label>
                    </div>
                  </div>

                  <button type="submit" className="btn-save">Save Address</button>
                </form>
              )}

              <div className="addresses-list">
                <div className="address-card">
                  <div className="address-header">
                    <h4>Default Address</h4>
                    <span className="address-badge">Default</span>
                  </div>
                  <p>
                    {user?.name}<br />
                    {user?.email}
                  </p>
                  <div className="address-actions">
                    <button className="btn-link">Edit</button>
                    <button className="btn-link">Delete</button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Settings Tab */}
          {activeTab === 'settings' && (
            <div className="account-section">
              <h2>Account Settings</h2>

              <div className="settings-group">
                <h3>Change Password</h3>
                {!changePassword ? (
                  <button
                    className="btn-change-password"
                    onClick={() => setChangePassword(true)}
                  >
                    Change Password
                  </button>
                ) : (
                  <form onSubmit={handlePasswordSubmit} className="password-form">
                    <div className="form-group">
                      <label htmlFor="current-pwd">Current Password</label>
                      <input
                        id="current-pwd"
                        type="password"
                        value={passwordForm.currentPassword}
                        onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                        className={errors.currentPassword ? 'error' : ''}
                      />
                      {errors.currentPassword && <span className="error-text">{errors.currentPassword}</span>}
                    </div>

                    <div className="form-group">
                      <label htmlFor="new-pwd">New Password</label>
                      <input
                        id="new-pwd"
                        type="password"
                        value={passwordForm.newPassword}
                        onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                        className={errors.newPassword ? 'error' : ''}
                      />
                      {errors.newPassword && <span className="error-text">{errors.newPassword}</span>}
                    </div>

                    <div className="form-group">
                      <label htmlFor="confirm-pwd">Confirm Password</label>
                      <input
                        id="confirm-pwd"
                        type="password"
                        value={passwordForm.confirmPassword}
                        onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                        className={errors.confirmPassword ? 'error' : ''}
                      />
                      {errors.confirmPassword && <span className="error-text">{errors.confirmPassword}</span>}
                    </div>

                    <div className="form-actions">
                      <button type="submit" className="btn-save">Update Password</button>
                      <button
                        type="button"
                        className="btn-cancel"
                        onClick={() => setChangePassword(false)}
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                )}
              </div>

              <div className="settings-group">
                <h3>Account Actions</h3>
                <button
                  className="btn-logout"
                  onClick={() => {
                    if (window.confirm('Are you sure you want to log out?')) {
                      dispatch(logout());
                    }
                  }}
                >
                  🚪 Sign Out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Account;
