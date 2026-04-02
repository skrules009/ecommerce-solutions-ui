import React from 'react';
import { getStarArray } from '../../utils/imageHelpers';

/**
 * Product Rating Component — shows average rating + distribution bars.
 */
function ProductRating({ product }) {
  if (!product) return null;

  const { rating = 0, reviewCount = 0, reviews = [] } = product;

  // Build distribution from reviews array
  const distribution = [5, 4, 3, 2, 1].map((star) => {
    const count = reviews.filter((r) => Math.round(r.rating) === star).length;
    const pct = reviewCount > 0 ? Math.round((count / reviewCount) * 100) : 0;
    return { star, count, pct };
  });

  return (
    <div className="product-rating-section" id="reviews">
      <h2 className="section-title">Ratings &amp; Reviews</h2>
      <div className="rating-overview">
        {/* Big Rating Number */}
        <div className="rating-big">
          <div className="rating-big-number">{rating.toFixed(1)}</div>
          <div className="rating-big-stars">
            {getStarArray(rating).map(({ type, key }) => (
              <span
                key={key}
                className={`star-icon ${type}`}
                aria-hidden="true"
              >
                {type === 'filled' ? '★' : type === 'half' ? '⯨' : '☆'}
              </span>
            ))}
          </div>
          <div className="rating-big-count">{reviewCount} reviews</div>
        </div>

        {/* Rating Bars */}
        <div className="rating-bars">
          {distribution.map(({ star, count, pct }) => (
            <div key={star} className="rating-bar-row">
              <span className="rating-bar-label">{star}★</span>
              <div className="rating-bar-track" role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100}>
                <div className="rating-bar-fill" style={{ width: `${pct}%` }} />
              </div>
              <span className="rating-bar-count">{count}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ProductRating;
