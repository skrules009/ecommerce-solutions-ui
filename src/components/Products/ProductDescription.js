import React, { useState } from 'react';

/**
 * Product Description Component — expandable sections for description, features, specs.
 */
function ProductDescription({ product }) {
  const [openSections, setOpenSections] = useState({ specs: false, care: false, warranty: false });

  if (!product) return null;

  const { description, features = [], specifications = {} } = product;

  const toggle = (key) => {
    setOpenSections((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const specsEntries = Object.entries(specifications).filter(([k]) => k !== 'care');
  const careText = specifications.care;

  return (
    <div className="product-description">
      <h2 className="section-title">Product Description</h2>

      {/* Main Description */}
      {description && (
        <p className="description-text">{description}</p>
      )}

      {/* Key Features */}
      {features.length > 0 && (
        <>
          <h3 style={{ fontSize: '16px', fontWeight: '600', color: 'var(--text-dark)', marginBottom: '10px' }}>
            Key Features
          </h3>
          <ul className="features-list">
            {features.map((feature, i) => (
              <li key={i}>
                <span className="feature-check" aria-hidden="true">✓</span>
                {feature}
              </li>
            ))}
          </ul>
        </>
      )}

      {/* Specifications */}
      {specsEntries.length > 0 && (
        <div className="collapsible-section">
          <button
            className="collapsible-header"
            onClick={() => toggle('specs')}
            aria-expanded={openSections.specs}
          >
            Specifications
            <span aria-hidden="true">{openSections.specs ? '▲' : '▼'}</span>
          </button>
          {openSections.specs && (
            <div className="collapsible-body">
              <table className="specs-table">
                <tbody>
                  {specsEntries.map(([key, value]) => (
                    <tr key={key}>
                      <td>{key.charAt(0).toUpperCase() + key.slice(1)}</td>
                      <td>{value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Care Instructions */}
      {careText && (
        <div className="collapsible-section">
          <button
            className="collapsible-header"
            onClick={() => toggle('care')}
            aria-expanded={openSections.care}
          >
            Care &amp; Maintenance
            <span aria-hidden="true">{openSections.care ? '▲' : '▼'}</span>
          </button>
          {openSections.care && (
            <div className="collapsible-body">{careText}</div>
          )}
        </div>
      )}

      {/* Warranty */}
      {product.warranty && (
        <div className="collapsible-section">
          <button
            className="collapsible-header"
            onClick={() => toggle('warranty')}
            aria-expanded={openSections.warranty}
          >
            Warranty Information
            <span aria-hidden="true">{openSections.warranty ? '▲' : '▼'}</span>
          </button>
          {openSections.warranty && (
            <div className="collapsible-body">{product.warranty}</div>
          )}
        </div>
      )}
    </div>
  );
}

export default ProductDescription;
