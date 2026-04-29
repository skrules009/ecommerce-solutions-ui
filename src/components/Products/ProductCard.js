import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { addItemToCart, createCart } from '../../redux/slices/cartSlice';
import { formatPrice, getImageUrl } from '../../utils/imageHelpers';

/**
 * ProductCard — reusable grid card shown on the Products listing page.
 */
function ProductCard({ product }) {
  const dispatch = useDispatch();
  const cartId = useSelector((state) => state.cart.id);
  const user = useSelector((state) => state.auth.user);
  const [isCreatingCart, setIsCreatingCart] = useState(false);

  if (!product) return null;

  const primaryImage = getImageUrl(product.images?.[0] || product.image);
  const stock = product.variants?.stock ?? product.stock ?? 0;
  const isOutOfStock = stock <= 0;

  const handleAddToCart = async () => {
    // Check if user is logged in
    if (!user) {
      console.warn('❌ User not logged in. Cannot create cart.');
      alert('Please login first to add items to cart');
      return;
    }

    let finalCartId = cartId;

    // If no cart exists and user is authenticated, create a cart first
    if (!finalCartId) {
      setIsCreatingCart(true);
      try {
        // Try both user.customerId and user.id
        const userId = user.customerId || user.id;
        console.log('📦 Creating cart for user:', userId, 'User object:', user);
        
        if (!userId) {
          console.error('❌ No userId found in user object:', user);
          alert('User ID not found. Please logout and login again.');
          return;
        }

        const result = await dispatch(createCart(userId)).unwrap();
        console.log('✅ Cart created successfully:', result);
        finalCartId = result.id;
      } catch (error) {
        console.error('❌ Failed to create cart:', error);
        alert('Failed to create cart. Please try again.');
        return;
      } finally {
        setIsCreatingCart(false);
      }
    }

    // Add item to cart
    if (product && finalCartId) {
      const sizes = product.variants?.sizes || (Array.isArray(product.size) ? product.size : []);
      const colors = product.variants?.colors || product.color || [];
      const defaultSize = sizes.length > 0 ? String(sizes[0]) : 'none';
      const defaultColor = colors.length > 0 ? colors[0] : 'none';
      
      console.log('🛒 Adding item to cart ID:', finalCartId);
      dispatch(
        addItemToCart({
          cartId: finalCartId,
          id: product.id,
          productId: product.id,
          name: product.name,
          price: product.price,
          image: product.images?.[0] || product.image,
          quantity: 1,
          selectedSize: defaultSize !== 'none' ? defaultSize : '',
          selectedColor: defaultColor !== 'none' ? defaultColor : '',
          category: product.category,
        })
      );
    } else {
      console.error('❌ Cannot add to cart - missing cartId or product');
    }
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
            disabled={isOutOfStock || isCreatingCart}
            aria-label={isOutOfStock ? 'Out of stock' : isCreatingCart ? 'Creating cart' : `Add ${product.name} to cart`}
          >
            {isCreatingCart ? '⏳ Creating...' : isOutOfStock ? 'Out of Stock' : '🛒 Add to Cart'}
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
