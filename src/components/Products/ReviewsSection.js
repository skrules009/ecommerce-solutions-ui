import React, { useState } from 'react';
import { getStarArray } from '../../utils/imageHelpers';

const INITIAL_COUNT = 5;

function ReviewCard({ review }) {
  const [expanded, setExpanded] = useState(false);
  const [helpful, setHelpful] = useState(review.helpful || 0);
  const [votedHelpful, setVotedHelpful] = useState(false);

  const isLong = review.text && review.text.length > 200;

  return (
    <div className="review-card">
      <div className="review-header">
        <div className="reviewer-info">
          <div className="reviewer-avatar" aria-hidden="true">
            {review.author ? review.author.charAt(0).toUpperCase() : '?'}
          </div>
          <div>
            <div className="reviewer-name">{review.author}</div>
            <div className="review-date">{review.date}</div>
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '4px' }}>
          <div className="review-stars" aria-label={`Rating: ${review.rating} out of 5`}>
            {getStarArray(review.rating).map(({ type, key }) => (
              <span key={key} className={`star-icon ${type}`} aria-hidden="true">
                {type === 'filled' ? '★' : type === 'half' ? '⯨' : '☆'}
              </span>
            ))}
          </div>
          {review.verified && (
            <span className="verified-badge">✓ Verified Purchase</span>
          )}
        </div>
      </div>

      {review.title && <div className="review-title">{review.title}</div>}

      <div className={`review-text${isLong && !expanded ? ' collapsed' : ''}`}>
        {review.text}
      </div>
      {isLong && (
        <button className="btn-expand-review" onClick={() => setExpanded(!expanded)}>
          {expanded ? 'Show less' : 'Read more'}
        </button>
      )}

      <div className="review-helpful">
        <span>Helpful?</span>
        <button
          className="helpful-btn"
          onClick={() => {
            if (!votedHelpful) {
              setHelpful((prev) => prev + 1);
              setVotedHelpful(true);
            }
          }}
          disabled={votedHelpful}
        >
          👍 Yes ({helpful})
        </button>
        <button className="helpful-btn">👎 No ({review.notHelpful || 0})</button>
      </div>
    </div>
  );
}

/**
 * Reviews Section Component
 */
function ReviewsSection({ reviews = [] }) {
  const [sortBy, setSortBy] = useState('newest');
  const [filterRating, setFilterRating] = useState('all');
  const [visibleCount, setVisibleCount] = useState(INITIAL_COUNT);

  const sorted = [...reviews].sort((a, b) => {
    if (sortBy === 'newest') return new Date(b.date) - new Date(a.date);
    if (sortBy === 'rating-high') return b.rating - a.rating;
    if (sortBy === 'rating-low') return a.rating - b.rating;
    if (sortBy === 'helpful') return (b.helpful || 0) - (a.helpful || 0);
    return 0;
  });

  const filtered = sorted.filter((r) =>
    filterRating === 'all' ? true : Math.round(r.rating) === parseInt(filterRating, 10)
  );

  const visible = filtered.slice(0, visibleCount);
  const hasMore = visibleCount < filtered.length;

  return (
    <div className="reviews-section">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', marginBottom: '16px' }}>
        <h2 className="section-title" style={{ marginBottom: 0, borderBottom: 'none', paddingBottom: 0 }}>
          Customer Reviews ({reviews.length})
        </h2>
        <button className="btn-write-review">✏️ Write a Review</button>
      </div>

      {/* Controls */}
      <div className="reviews-controls">
        <select
          value={sortBy}
          onChange={(e) => { setSortBy(e.target.value); setVisibleCount(INITIAL_COUNT); }}
          aria-label="Sort reviews"
        >
          <option value="newest">Newest First</option>
          <option value="helpful">Most Helpful</option>
          <option value="rating-high">Highest Rating</option>
          <option value="rating-low">Lowest Rating</option>
        </select>
        <select
          value={filterRating}
          onChange={(e) => { setFilterRating(e.target.value); setVisibleCount(INITIAL_COUNT); }}
          aria-label="Filter by rating"
        >
          <option value="all">All Ratings</option>
          <option value="5">5 Stars</option>
          <option value="4">4 Stars</option>
          <option value="3">3 Stars</option>
          <option value="2">2 Stars</option>
          <option value="1">1 Star</option>
        </select>
      </div>

      {/* Review List */}
      {visible.length === 0 ? (
        <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>No reviews match your filter.</p>
      ) : (
        visible.map((review) => (
          <ReviewCard key={review.id} review={review} />
        ))
      )}

      {/* Load More */}
      {hasMore && (
        <button
          className="btn-load-more"
          onClick={() => setVisibleCount((prev) => prev + INITIAL_COUNT)}
        >
          Load More Reviews ({filtered.length - visibleCount} remaining)
        </button>
      )}
    </div>
  );
}

export default ReviewsSection;
