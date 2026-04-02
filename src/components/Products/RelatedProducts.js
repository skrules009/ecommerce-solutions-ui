import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectRelatedProducts } from '../../redux/slices/productSlice';
import { formatPrice, getImageUrl } from '../../utils/imageHelpers';
import QuickViewModal from './QuickViewModal';

/**
 * Related Products Component — grid of related products with quick view.
 */
function RelatedProducts() {
  const relatedProducts = useSelector(selectRelatedProducts);
  const [quickViewProduct, setQuickViewProduct] = useState(null);

  if (!relatedProducts || relatedProducts.length === 0) return null;

  return (
    <div className="related-products">
      <h2 className="section-title">You May Also Like</h2>
      <div className="related-products-grid">
        {relatedProducts.map((product) => (
          <div key={product.id}>
            <Link
              to={`/product/${product.id}`}
              className="related-product-card"
            >
              <img
                className="related-product-img"
                src={getImageUrl(product.images?.[0] || product.image)}
                alt={product.name}
                loading="lazy"
              />
              <div className="related-product-info">
                <div className="related-product-name" title={product.name}>
                  {product.name}
                </div>
                <div className="related-product-price">{formatPrice(product.price)}</div>
                <div className="related-product-rating">
                  ★ {product.rating?.toFixed(1) || '—'}
                  <span>({product.reviewCount || 0})</span>
                </div>
              </div>
            </Link>
            <button
              className="btn-quick-add"
              onClick={() => setQuickViewProduct(product)}
              aria-label={`Quick view ${product.name}`}
            >
              👁 Quick View
            </button>
          </div>
        ))}
      </div>

      {quickViewProduct && (
        <QuickViewModal
          product={quickViewProduct}
          onClose={() => setQuickViewProduct(null)}
        />
      )}
    </div>
  );
}

export default RelatedProducts;
