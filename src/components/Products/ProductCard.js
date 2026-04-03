import React from 'react';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { addToCart } from '../../redux/slices/cartSlice';
import { formatPrice, getImageUrl } from '../../utils/imageHelpers';

/**
 * ProductCard — reusable grid card shown on the Products listing page.
 */
function ProductCard({ product }) {
  const dispatch = useDispatch();

  if (!product) return null;

  const primaryImage = getImageUrl(product.images?.[0] || product.image);
  const stock = product.variants?.stock ?? product.stock ?? 0;
  const isOutOfStock = stock <= 0;

  const handleAddToCart = () => {
    const sizes = product.variants?.sizes || (Array.isArray(product.size) ? product.size : []);
    const colors = product.variants?.colors || product.color || [];
    const defaultSize = sizes.length > 0 ? String(sizes[0]) : 'none';
    const defaultColor = colors.length > 0 ? colors[0] : 'none';
    dispatch(
      addToCart({
        cartId: `${product.id}-${defaultSize}-${defaultColor}`,
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.images?.[0] || product.image,
        quantity: 1,
        selectedSize: defaultSize !== 'none' ? defaultSize : '',
        selectedColor: defaultColor !== 'none' ? defaultColor : '',
        category: product.category,
      })
    );
  };

  return (
    <div className="product-card">
      <div className="product-card-img-wrap">
        <Link to={`/product/${product.id}`} aria-label={`View ${product.name}`}>
          <img
            className="product-card-img"
            src={primaryImage}
            alt={product.name}
            loading="lazy"
          />
        </Link>
        {product.discount && (
          <span className="product-card-badge">-{product.discount}%</span>
        )}
      </div>

      <div className="product-card-body">
        <div className="product-card-category">{product.category}</div>
        <div className="product-card-name">{product.name}</div>

        <div className="product-card-rating">
          <span className="star">★</span>
          <span>{product.rating?.toFixed(1) || '—'}</span>
          <span>({product.reviewCount || 0})</span>
        </div>

        <div className="product-card-price-row">
          <span className="product-card-price">{formatPrice(product.price)}</span>
          {product.originalPrice && (
            <span className="product-card-original">{formatPrice(product.originalPrice)}</span>
          )}
        </div>

        <div className="product-card-actions">
          <button
            className="btn-card-cart"
            onClick={handleAddToCart}
            disabled={isOutOfStock}
            aria-label={isOutOfStock ? 'Out of stock' : `Add ${product.name} to cart`}
          >
            {isOutOfStock ? 'Out of Stock' : '🛒 Add to Cart'}
          </button>
          <Link to={`/product/${product.id}`} className="btn-card-view" aria-label={`View details for ${product.name}`}>
            View
          </Link>
        </div>
      </div>
    </div>
  );
}

export default ProductCard;
