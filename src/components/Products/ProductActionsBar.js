import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { addNotification } from '../../redux/slices/uiSlice';

/**
 * Product Actions Bar — share, report, ask question buttons.
 */
function ProductActionsBar({ product }) {
  const dispatch = useDispatch();
  const [shareOpen, setShareOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const productUrl = typeof window !== 'undefined' ? window.location.href : '';
  const productName = product?.name || 'this product';

  const shareOptions = [
    {
      label: 'Facebook',
      icon: '📘',
      action: () => window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(productUrl)}`, '_blank'),
    },
    {
      label: 'Twitter',
      icon: '🐦',
      action: () => window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(`Check out ${productName}`)}&url=${encodeURIComponent(productUrl)}`, '_blank'),
    },
    {
      label: 'Pinterest',
      icon: '📌',
      action: () => window.open(`https://pinterest.com/pin/create/button/?url=${encodeURIComponent(productUrl)}&description=${encodeURIComponent(productName)}`, '_blank'),
    },
    {
      label: 'Copy Link',
      icon: '🔗',
      action: () => {
        navigator.clipboard.writeText(productUrl)
          .then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
          })
          .catch(() => {
            dispatch(addNotification({ id: Date.now(), type: 'error', message: 'Could not copy link. Please copy the URL from your browser.' }));
          });
        setShareOpen(false);
      },
    },
  ];

  const handleReport = () => {
    dispatch(addNotification({ id: Date.now(), type: 'info', message: 'Thank you for your report. Our team will review this product.' }));
  };

  const handleAskQuestion = () => {
    dispatch(addNotification({ id: Date.now(), type: 'info', message: 'Q&A feature coming soon! For now, please contact our support team.' }));
  };

  return (
    <div className="product-actions-bar">
      {/* Share */}
      <div className="share-dropdown">
        <button
          className="action-btn"
          onClick={() => setShareOpen((prev) => !prev)}
          aria-haspopup="true"
          aria-expanded={shareOpen}
          aria-label="Share product"
        >
          📤 Share {copied && <span style={{ color: 'var(--success)' }}>✓ Copied!</span>}
        </button>
        {shareOpen && (
          <div className="share-options" role="menu">
            {shareOptions.map(({ label, icon, action }) => (
              <button
                key={label}
                className="share-option"
                onClick={() => { action(); setShareOpen(false); }}
                role="menuitem"
              >
                {icon} {label}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Report */}
      <button className="action-btn" onClick={handleReport} aria-label="Report product">
        🚩 Report
      </button>

      {/* Ask Question */}
      <button className="action-btn" onClick={handleAskQuestion} aria-label="Ask a question about this product">
        ❓ Ask a Question
      </button>
    </div>
  );
}

export default ProductActionsBar;
