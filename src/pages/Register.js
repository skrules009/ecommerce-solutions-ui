import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  registerUser,
  selectRegistering,
  selectRegisterError,
  selectIsAuthenticated,
  clearRegisterError
} from '../redux/slices/authSlice';
import '../styles/auth.css';

function Register() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const isLoading = useSelector(selectRegistering);
  const error = useSelector(selectRegisterError);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' });
  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    if (isAuthenticated) navigate('/', { replace: true });
  }, [isAuthenticated, navigate]);

  useEffect(() => () => dispatch(clearRegisterError()), [dispatch]);

  const validate = () => {
    const errors = {};
    if (!form.name.trim()) errors.name = 'Full name is required';
    if (!form.email) errors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(form.email)) errors.email = 'Enter a valid email address';
    if (!form.password) errors.password = 'Password is required';
    else if (form.password.length < 6) errors.password = 'Password must be at least 6 characters';
    if (form.password !== form.confirm) errors.confirm = 'Passwords do not match';
    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = validate();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }
    setFormErrors({});

    // Call the real async thunk
    const result = await dispatch(registerUser({
      email: form.email,
      password: form.password,
      firstName: form.name.split(' ')[0],
      lastName: form.name.split(' ').slice(1).join(' ') || '',
      phone: ''
    }));

    // Check if registration was successful
    if (result.payload) {
      navigate('/', { replace: true });
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-header">
          <h1>Create an account</h1>
          <p>Join TakeCart and start shopping</p>
        </div>

        {error && <div className="auth-error">{error}</div>}

        <form className="auth-form" onSubmit={handleSubmit} noValidate>
          <div className="form-group">
            <label htmlFor="reg-name">Full name</label>
            <input
              id="reg-name"
              type="text"
              className={`form-input${formErrors.name ? ' error' : ''}`}
              value={form.name}
              onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
              placeholder="Jane Smith"
              autoComplete="name"
            />
            {formErrors.name && <span className="field-error">{formErrors.name}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="reg-email">Email address</label>
            <input
              id="reg-email"
              type="email"
              className={`form-input${formErrors.email ? ' error' : ''}`}
              value={form.email}
              onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
              placeholder="you@example.com"
              autoComplete="email"
            />
            {formErrors.email && <span className="field-error">{formErrors.email}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="reg-password">Password</label>
            <input
              id="reg-password"
              type="password"
              className={`form-input${formErrors.password ? ' error' : ''}`}
              value={form.password}
              onChange={(e) => setForm((p) => ({ ...p, password: e.target.value }))}
              placeholder="At least 6 characters"
              autoComplete="new-password"
            />
            {formErrors.password && <span className="field-error">{formErrors.password}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="reg-confirm">Confirm password</label>
            <input
              id="reg-confirm"
              type="password"
              className={`form-input${formErrors.confirm ? ' error' : ''}`}
              value={form.confirm}
              onChange={(e) => setForm((p) => ({ ...p, confirm: e.target.value }))}
              placeholder="Repeat your password"
              autoComplete="new-password"
            />
            {formErrors.confirm && <span className="field-error">{formErrors.confirm}</span>}
          </div>

          <button type="submit" className="btn-auth" disabled={isLoading}>
            {isLoading ? 'Creating account…' : 'Create Account'}
          </button>
        </form>

        <p className="auth-switch">
          Already have an account? <Link to="/login">Sign in</Link>
        </p>
      </div>
    </div>
  );
}

export default Register;
