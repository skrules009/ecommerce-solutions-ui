/**
 * imageHelpers.js
 * Utility functions for image handling and optimization.
 */

const FALLBACK_IMAGE = 'https://picsum.photos/seed/fallback/600/600';

/**
 * Returns a valid image URL, falling back to a placeholder if the src is empty.
 * @param {string} src
 * @param {string} [fallback]
 * @returns {string}
 */
export function getImageUrl(src, fallback = FALLBACK_IMAGE) {
  if (!src || typeof src !== 'string' || src.trim() === '') {
    return fallback;
  }
  return src;
}

/**
 * Returns the first image from an array, or the fallback.
 * @param {string[]} images
 * @param {string} [fallback]
 * @returns {string}
 */
export function getPrimaryImage(images, fallback = FALLBACK_IMAGE) {
  if (Array.isArray(images) && images.length > 0) {
    return getImageUrl(images[0], fallback);
  }
  return fallback;
}

/**
 * Returns the CSS color value for a named color.
 * @param {string} colorName
 * @returns {string}
 */
export function getColorValue(colorName) {
  const colorMap = {
    Black: '#1F2937',
    White: '#FFFFFF',
    Red: '#EF4444',
    Blue: '#3B82F6',
    Green: '#10B981',
    Yellow: '#F59E0B',
    Pink: '#EC4899',
    Purple: '#8B5CF6',
    Orange: '#F97316',
    Gray: '#9CA3AF',
    Grey: '#9CA3AF',
    Brown: '#92400E',
    Navy: '#1E3A5F',
    Cream: '#FEF3C7',
    Gold: '#D97706',
    Silver: '#6B7280',
  };
  return colorMap[colorName] || '#6B7280';
}

/**
 * Generates an array of star values (filled, half, empty) for a given rating.
 * @param {number} rating  - Rating value (0-5)
 * @returns {{ type: 'filled'|'half'|'empty', key: number }[]}
 */
export function getStarArray(rating) {
  const stars = [];
  for (let i = 1; i <= 5; i++) {
    if (rating >= i) {
      stars.push({ type: 'filled', key: i });
    } else if (rating >= i - 0.5) {
      stars.push({ type: 'half', key: i });
    } else {
      stars.push({ type: 'empty', key: i });
    }
  }
  return stars;
}

/**
 * Formats a price number as a USD string.
 * @param {number} price
 * @returns {string}
 */
export function formatPrice(price) {
  if (typeof price !== 'number' || isNaN(price)) return '$0.00';
  return `$${price.toFixed(2)}`;
}
