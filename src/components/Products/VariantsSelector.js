import React from 'react';
import { useDispatch } from 'react-redux';
import { getColorValue } from '../../utils/imageHelpers';
import { addNotification } from '../../redux/slices/uiSlice';

/**
 * Product Variants Selector Component
 */
function VariantsSelector({ product, selectedSize, selectedColor, onSizeChange, onColorChange }) {
  const dispatch = useDispatch();
  if (!product) return null;

  const sizes = product.variants?.sizes || (Array.isArray(product.size) ? product.size : []);
  const colors = product.variants?.colors || product.color || [];

  const handleSizeGuide = () => {
    dispatch(addNotification({ id: Date.now(), type: 'info', message: 'Size guide coming soon! Check the product description for material and fit details.' }));
  };

  return (
    <div className="variants-selector">
      {/* Size Selector */}
      {sizes.length > 0 && (
        <div className="variant-group">
          <div className="variant-label">
            Size:
            {selectedSize && (
              <span className="variant-selected-value">{selectedSize}</span>
            )}
            <button
              className="size-guide-link"
              onClick={handleSizeGuide}
              style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer' }}
              aria-label="View size guide"
            >
              Size Guide
            </button>
          </div>
          <div className="size-options">
            {sizes.map((size) => (
              <button
                key={size}
                className={`size-btn${selectedSize === String(size) ? ' selected' : ''}`}
                onClick={() => onSizeChange(String(size))}
                aria-pressed={selectedSize === String(size)}
              >
                {size}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Color Selector */}
      {colors.length > 0 && (
        <div className="variant-group">
          <div className="variant-label">
            Color:
            {selectedColor && (
              <span className="variant-selected-value">{selectedColor}</span>
            )}
          </div>
          <div className="color-options">
            {colors.map((color) => (
              <button
                key={color}
                className={`color-btn${selectedColor === color ? ' selected' : ''}`}
                onClick={() => onColorChange(color)}
                aria-label={`Select color: ${color}`}
                aria-pressed={selectedColor === color}
              >
                <div
                  className="color-swatch"
                  style={{ backgroundColor: getColorValue(color) }}
                />
                <span className="color-name">{color}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default VariantsSelector;
