import React from 'react';
import { getStarArray, formatPrice } from '../../utils/imageHelpers';

/**
 * Renders a row of star icons for a given rating.
 */
function StarRow({ rating, className = '' }) {
  return (
    <div className={`stars-display ${className}`}>
      {getStarArray(rating).map(({ type, key }) => (
        <span key={key} className={`star-icon ${type}`} aria-hidden="true">
          {type === 'filled' ? '★' : type === 'half' ? '⯨' : '☆'}
        </span>
      ))}
    </div>
  );
}

/**
 * Product Info Panel Component
 */
function ProductInfoPanel({ product }) {
  if (!product) return null;

  const {
    name,
    category,
    price,
    originalPrice,
    discount,
    rating = 0,
    reviewCount = 0,
    stock,
    sku,
    variants,
  } = product;

  const stockCount = variants?.stock ?? stock ?? 0;

  let stockStatus = 'out-of-stock';
  let stockLabel = 'Out of Stock';
  if (stockCount > 10) { stockStatus = 'in-stock'; stockLabel = 'In Stock'; }
  else if (stockCount > 0) { stockStatus = 'low-stock'; stockLabel = `Only ${stockCount} left`; }

  const savings = originalPrice ? (originalPrice - price).toFixed(2) : null;

  return (
    <div className="product-info-panel">
      {category && (
        <span className="product-category-badge">{category}</span>
      )}

      <h1 className="product-title">{name}</h1>

      {/* Rating Row */}
      <div className="product-rating-row">
        <StarRow rating={rating} />
        <span className="rating-value">{rating.toFixed(1)}</span>
        <a href="#reviews" className="review-count-link">
          ({reviewCount} reviews)
        </a>
      </div>

      {/* Price */}
      <div className="price-section">
        <div>
          <span className="price-main">{formatPrice(price)}</span>
          {originalPrice && (
            <span className="price-original">{formatPrice(originalPrice)}</span>
          )}
          {discount && (
            <span className="discount-badge">-{discount}%</span>
          )}
        </div>
        {savings && (
          <div className="price-savings">You save: ${savings}</div>
        )}
      </div>

      {/* Stock Status */}
      <div className={`stock-status ${stockStatus}`}>
        <span className="stock-dot" aria-hidden="true" />
        {stockLabel}
      </div>

      {/* Meta Info */}
      {sku && (
        <p className="info-meta">SKU: <span>{sku}</span></p>
      )}
      <p className="info-meta">Category: <span>{category}</span></p>
    </div>
  );
}

export { StarRow };
export default ProductInfoPanel;
