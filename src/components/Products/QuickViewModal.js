import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { addToCart } from '../../redux/slices/cartSlice';
import { formatPrice, getImageUrl, getStarArray } from '../../utils/imageHelpers';

/**
 * Quick View Modal Component
 */
function QuickViewModal({ product, onClose }) {
  const dispatch = useDispatch();

  // Close on Escape key
  useEffect(() => {
    const handleKey = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [onClose]);

  if (!product) return null;

  const handleAddToCart = () => {
    dispatch(
      addToCart({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.images?.[0] || product.image,
        quantity: 1,
        category: product.category,
      })
    );
    onClose();
  };

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
