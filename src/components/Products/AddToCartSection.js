import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { addItemToCart } from '../../redux/slices/cartSlice';
import { formatPrice } from '../../utils/imageHelpers';

/**
 * Quantity & Add to Cart Section
 */
function AddToCartSection({ product, selectedSize, selectedColor }) {
  const dispatch = useDispatch();
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  const maxQty = product?.variants?.stock || product?.stock || 99;

  const handleQuantityChange = (val) => {
    const n = parseInt(val, 10);
    if (!isNaN(n)) {
      setQuantity(Math.max(1, Math.min(n, maxQty)));
    }
  };

  const handleAddToCart = () => {
    if (!product) return;
    dispatch(
      addItemToCart({
        cartId: `${product.id}-${selectedSize || 'none'}-${selectedColor || 'none'}`,
        id: product.id,
        name: product.name,
        price: product.price,
        image: (product.images && product.images[0]) || product.image,
        quantity,
        selectedSize,
        selectedColor,
        category: product.category,
      })
    );
    setAdded(true);
    setTimeout(() => setAdded(false), 3000);
  };

  const isOutOfStock = maxQty <= 0;

  return (
    <div className="add-to-cart-section">
      {/* Quantity Selector */}
      <div className="quantity-selector" role="group" aria-label="Quantity selector">
        <button
          className="qty-btn"
          onClick={() => handleQuantityChange(quantity - 1)}
          disabled={quantity <= 1}
          aria-label="Decrease quantity"
        >
          −
        </button>
        <input
          type="number"
          className="qty-input"
          value={quantity}
          min={1}
          max={maxQty}
          onChange={(e) => handleQuantityChange(e.target.value)}
          aria-label="Quantity"
        />
        <button
          className="qty-btn"
          onClick={() => handleQuantityChange(quantity + 1)}
          disabled={quantity >= maxQty}
          aria-label="Increase quantity"
        >
          +
        </button>
      </div>

      {/* Action Buttons */}
      <div className="cart-actions">
        <button
          className="btn-add-cart"
          onClick={handleAddToCart}
          disabled={isOutOfStock}
          aria-label="Add to cart"
        >
          🛒 {isOutOfStock ? 'Out of Stock' : `Add to Cart · ${formatPrice(product?.price * quantity)}`}
        </button>
        <button className="btn-wishlist" aria-label="Add to wishlist">
          ♡ Add to Wishlist
        </button>
      </div>

      {/* Success Toast */}
      {added && (
        <div className="cart-success-toast" role="status">
          ✅ Added {quantity} item{quantity > 1 ? 's' : ''} to your cart!
        </div>
      )}
    </div>
  );
}

export default AddToCartSection;
