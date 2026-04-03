import React from 'react';
import { Link } from 'react-router-dom';

/**
 * Breadcrumb Navigation Component
 * @param {{ items: { label: string, path?: string }[] }} props
 */
function Breadcrumb({ items = [] }) {
  return (
    <nav className="breadcrumb-nav" aria-label="breadcrumb">
      <div className="container">
        <ol className="breadcrumb-list">
          {items.map((item, index) => {
            const isLast = index === items.length - 1;
            return (
              <React.Fragment key={index}>
                <li className={`breadcrumb-item${isLast ? ' active' : ''}`}>
                  {isLast || !item.path ? (
                    <span>{item.label}</span>
                  ) : (
                    <Link to={item.path}>{item.label}</Link>
                  )}
                </li>
                {!isLast && (
                  <li className="breadcrumb-separator" aria-hidden="true">›</li>
                )}
              </React.Fragment>
            );
          })}
        </ol>
      </div>
    </nav>
  );
}

export default Breadcrumb;
