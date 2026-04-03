import React, { useState, useCallback } from 'react';
import { getImageUrl } from '../../utils/imageHelpers';

/**
 * Image Gallery Component with lightbox and keyboard navigation.
 * The keyboard listener is only attached while the lightbox is open,
 * so arrow-key presses never fire outside of the lightbox context.
 */
function ImageGallery({ images = [], productName = '' }) {
  const safeImages = images.length > 0 ? images : [null];
  const [activeIndex, setActiveIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  const goTo = useCallback(
    (index) => {
      setActiveIndex((index + safeImages.length) % safeImages.length);
    },
    [safeImages.length]
  );

  // Keyboard handler — inlined to avoid an extra useCallback dependency chain.
  // Only attached while the lightbox is open.
  React.useEffect(() => {
    if (!lightboxOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowLeft')
        setActiveIndex((prev) => (prev - 1 + safeImages.length) % safeImages.length);
      if (e.key === 'ArrowRight')
        setActiveIndex((prev) => (prev + 1) % safeImages.length);
      if (e.key === 'Escape') setLightboxOpen(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxOpen, safeImages.length]);

  const currentSrc = getImageUrl(safeImages[activeIndex]);

  return (
    <div className="image-gallery">
      {/* Main Image */}
      <div
        className="gallery-main-wrap"
        onClick={() => setLightboxOpen(true)}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => { if (e.key === 'Enter') setLightboxOpen(true); }}
        aria-label="Open full-size image"
      >
        <img
          className="gallery-main-img"
          src={currentSrc}
          alt={`${productName} - view ${activeIndex + 1}`}
          loading="lazy"
        />
        <span className="gallery-counter">{activeIndex + 1} / {safeImages.length}</span>
        {safeImages.length > 1 && (
          <>
            <button
              className="gallery-nav-btn prev"
              onClick={(e) => { e.stopPropagation(); goTo(activeIndex - 1); }}
              aria-label="Previous image"
            >
              ‹
            </button>
            <button
              className="gallery-nav-btn next"
              onClick={(e) => { e.stopPropagation(); goTo(activeIndex + 1); }}
              aria-label="Next image"
            >
              ›
            </button>
          </>
        )}
      </div>

      {/* Thumbnails */}
      {safeImages.length > 1 && (
        <div className="gallery-thumbnails">
          {safeImages.map((src, i) => (
            <button
              key={i}
              className={`gallery-thumb${i === activeIndex ? ' active' : ''}`}
              onClick={() => setActiveIndex(i)}
              aria-label={`View image ${i + 1}`}
            >
              <img
                src={getImageUrl(src)}
                alt={`${productName} thumbnail ${i + 1}`}
                loading="lazy"
              />
            </button>
          ))}
        </div>
      )}

      {/* Lightbox */}
      {lightboxOpen && (
        <div
          className="gallery-lightbox"
          onClick={() => setLightboxOpen(false)}
          role="dialog"
          aria-modal="true"
          aria-label="Product image lightbox"
        >
          <div className="lightbox-inner" onClick={(e) => e.stopPropagation()}>
            <button
              className="lightbox-close"
              onClick={() => setLightboxOpen(false)}
              aria-label="Close lightbox"
            >
              ×
            </button>
            <img src={currentSrc} alt={productName} />
          </div>
        </div>
      )}
    </div>
  );
}

export default ImageGallery;
