import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addItemToCart, createCart } from '../../redux/slices/cartSlice';
import { formatPrice } from '../../utils/imageHelpers';

/**
 * Quantity & Add to Cart Section
 */
function AddToCartSection({ product, selectedSize, selectedColor }) {
  const dispatch = useDispatch();
  const cartId = useSelector((state) => state.cart.id);
  const user = useSelector((state) => state.auth.user);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const [isCreatingCart, setIsCreatingCart] = useState(false);

  const maxQty = product?.variants?.stock || product?.stock || 99;

  const handleQuantityChange = (val) => {
    const n = parseInt(val, 10);
    if (!isNaN(n)) {
      setQuantity(Math.max(1, Math.min(n, maxQty)));
    }
  };

  const handleAddToCart = async () => {
    if (!product) return;

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
      console.log('🛒 Adding item to cart ID:', finalCartId);
      dispatch(
        addItemToCart({
          cartId: finalCartId,
          id: product.id,
          productId: product.id,
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
    } else {
      console.error('❌ Cannot add to cart - missing cartId or product');
    }
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
          disabled={isOutOfStock || isCreatingCart}
          aria-label="Add to cart"
        >
          {isCreatingCart ? '⏳ Creating Cart...' : isOutOfStock ? '🚫 Out of Stock' : `🛒 Add to Cart · ${formatPrice(product?.price * quantity)}`}
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
