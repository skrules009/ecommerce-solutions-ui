import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { addItemToCart } from '../../redux/slices/cartSlice';
import { formatPrice, getImageUrl, getStarArray } from '../../utils/imageHelpers';

/**
 * Quick View Modal Component.
 * Selects default size/color so the item is always added to the cart
 * with a valid variant combination.
 */
function QuickViewModal({ product, onClose }) {
  const dispatch = useDispatch();
  const cartId = useSelector((state) => state.cart.id);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');

  // Close on Escape key
  useEffect(() => {
    const handleKey = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [onClose]);

  // Initialise default variant selections when product changes
  useEffect(() => {
    if (product) {
      const sizes = product.variants?.sizes || (Array.isArray(product.size) ? product.size : []);
      const colors = product.variants?.colors || product.color || [];
      if (sizes.length > 0) setSelectedSize(String(sizes[0]));
      if (colors.length > 0) setSelectedColor(colors[0]);
    }
  }, [product?.id]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!product) return null;

  const handleAddToCart = () => {
    dispatch(
      addItemToCart({
        cartId, // Can be null - thunk will generate temporary ID
        id: product.id,
        productId: product.id,
        name: product.name,
        price: product.price,
        image: product.images?.[0] || product.image,
        quantity: 1,
        selectedSize,
        selectedColor,
        category: product.category,
      })
    );
    onClose();
  };

  const sizes = product.variants?.sizes || (Array.isArray(product.size) ? product.size : []);
  const colors = product.variants?.colors || product.color || [];

  return (
    <div
      className="quick-view-overlay"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={`Quick view: ${product.name}`}
    >
      <div
        className="quick-view-modal"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className="quick-view-close"
          onClick={onClose}
          aria-label="Close quick view"
        >
          ×
        </button>

        <div className="quick-view-content">
          <img
            className="quick-view-img"
            src={getImageUrl(product.images?.[0] || product.image)}
            alt={product.name}
          />
          <div className="quick-view-details">
            <span className="product-category-badge">{product.category}</span>
            <h3 className="product-title">{product.name}</h3>

            {/* Stars */}
            <div className="product-rating-row">
              <div className="stars-display">
                {getStarArray(product.rating || 0).map(({ type, key }) => (
                  <span key={key} className={`star-icon ${type}`} aria-hidden="true">
                    {type === 'filled' ? '★' : type === 'half' ? '⯨' : '☆'}
                  </span>
                ))}
              </div>
              <span className="rating-value">{(product.rating || 0).toFixed(1)}</span>
            </div>

            {/* Price */}
            <div className="price-section">
              <span className="price-main">{formatPrice(product.price)}</span>
              {product.originalPrice && (
                <span className="price-original">{formatPrice(product.originalPrice)}</span>
              )}
              {product.discount && (
                <span className="discount-badge">-{product.discount}%</span>
              )}
            </div>

            {/* Variant selectors */}
            {sizes.length > 0 && (
              <div className="qv-variant-row">
                <span className="qv-variant-label">Size:</span>
                <div className="qv-variant-options">
                  {sizes.map((s) => (
                    <button
                      key={s}
                      className={`size-btn${selectedSize === String(s) ? ' selected' : ''}`}
                      onClick={() => setSelectedSize(String(s))}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}
            {colors.length > 0 && (
              <div className="qv-variant-row">
                <span className="qv-variant-label">Color: <strong>{selectedColor}</strong></span>
                <div className="qv-variant-options">
                  {colors.map((c) => (
                    <button
                      key={c}
                      className={`color-btn${selectedColor === c ? ' selected' : ''}`}
                      onClick={() => setSelectedColor(c)}
                      aria-label={`Select ${c}`}
                    >
                      <div className="color-swatch" style={{ backgroundColor: require('../../utils/imageHelpers').getColorValue(c) }} />
                    </button>
                  ))}
                </div>
              </div>
            )}

            <p style={{ fontSize: '14px', color: 'var(--text-muted)', lineHeight: '1.6', marginBottom: '0' }}>
              {product.description}
            </p>

            <div className="quick-view-actions">
              <button className="btn-add-cart" onClick={handleAddToCart}>
                🛒 Add to Cart
              </button>
              <Link to={`/product/${product.id}`} className="btn-view-full" onClick={onClose}>
                View Full Details
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default QuickViewModal;
