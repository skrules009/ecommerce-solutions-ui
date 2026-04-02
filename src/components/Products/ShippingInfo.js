import React from 'react';
import { formatPrice } from '../../utils/imageHelpers';

/**
 * Shipping Info Component
 */
function ShippingInfo({ product }) {
  if (!product) return null;

  const { shipping, returnWindow, warranty } = product;

  const hasShipping = shipping && (shipping.standard || shipping.express);

  return (
    <div className="shipping-info">
      <h2 className="section-title">Shipping &amp; Returns</h2>

      {hasShipping && (
        <>
          {shipping.freeOver && (
            <div className="free-shipping-banner">
              🚚 Free shipping on orders over {formatPrice(shipping.freeOver)}!
            </div>
          )}

          <div className="shipping-options">
            {shipping.standard && (
              <div className="shipping-option-card">
                <h4>Standard Shipping</h4>
                <p>Estimated {shipping.standard.days} business days</p>
                <p className="cost">
                  {shipping.standard.cost === 0
                    ? 'Free'
                    : formatPrice(shipping.standard.cost)}
                </p>
              </div>
            )}
            {shipping.express && (
              <div className="shipping-option-card">
                <h4>Express Shipping</h4>
                <p>Estimated {shipping.express.days} business days</p>
                <p className="cost">{formatPrice(shipping.express.cost)}</p>
              </div>
            )}
          </div>
        </>
      )}

      <div>
        {returnWindow && (
          <div className="policy-row">
            <span className="policy-icon">↩️</span>
            <div className="policy-text">
              <strong>Easy Returns</strong>
              <span>Return within {returnWindow} of delivery for a full refund.</span>
            </div>
          </div>
        )}
        {warranty && (
          <div className="policy-row">
            <span className="policy-icon">🛡️</span>
            <div className="policy-text">
              <strong>Warranty</strong>
              <span>{warranty}</span>
            </div>
          </div>
        )}
        <div className="policy-row">
          <span className="policy-icon">💳</span>
          <div className="policy-text">
            <strong>Secure Payments</strong>
            <span>All major credit cards accepted. 100% secure checkout.</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ShippingInfo;
