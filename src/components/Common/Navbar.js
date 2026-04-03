import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../redux/slices/authSlice';
import { toggleDarkMode } from '../../redux/slices/uiSlice';
import { selectCartItemCount } from '../../redux/slices/cartSlice';
import '../../styles/navbar.css';

/**
 * Navbar — fixed top navigation with cart badge, auth controls, dark mode toggle,
 * and a collapsible mobile menu.
 */
function Navbar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const cartCount = useSelector(selectCartItemCount);
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const darkMode = useSelector((state) => state.ui.darkMode);

  const handleLogout = () => {
    dispatch(logout());
    setMenuOpen(false);
    navigate('/');
  };

  const closeMenu = () => setMenuOpen(false);

  return (
    <nav className="navbar" role="navigation" aria-label="Main navigation">
      <div className="navbar-inner">
        {/* Brand */}
        <Link to="/" className="navbar-brand" onClick={closeMenu}>
          🛒 TakeCart
        </Link>

        {/* Hamburger (mobile only) */}
        <button
          className="navbar-hamburger"
          onClick={() => setMenuOpen((v) => !v)}
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={menuOpen}
        >
          <span className="hamburger-line" />
          <span className="hamburger-line" />
          <span className="hamburger-line" />
        </button>

        {/* Links */}
        <ul className={`navbar-links${menuOpen ? ' open' : ''}`}>
          <li>
            <NavLink to="/products" onClick={closeMenu}>
              Products
            </NavLink>
          </li>
          <li>
            <NavLink to="/cart" className="navbar-cart-btn" onClick={closeMenu} aria-label={`Cart (${cartCount} items)`}>
              🛒 Cart
              {cartCount > 0 && (
                <span className="cart-badge">{cartCount > 99 ? '99+' : cartCount}</span>
              )}
            </NavLink>
          </li>

          {/* Dark mode toggle */}
          <li>
            <button
              className="btn-dark-toggle"
              onClick={() => { dispatch(toggleDarkMode()); closeMenu(); }}
              aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
              title={darkMode ? 'Light mode' : 'Dark mode'}
            >
              {darkMode ? '☀️' : '🌙'}
            </button>
          </li>

          {isAuthenticated ? (
            <>
              <li>
                <span style={{ padding: '8px 12px', fontSize: '14px', color: 'var(--text-muted)' }}>
                  Hi, {user?.name || 'User'}
                </span>
              </li>
              <li>
                <button onClick={handleLogout}>Sign Out</button>
              </li>
            </>
          ) : (
            <>
              <li>
                <NavLink to="/login" onClick={closeMenu}>Sign In</NavLink>
              </li>
              <li>
                <NavLink to="/register" className="btn-navbar-login" onClick={closeMenu}>
                  Register
                </NavLink>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;
