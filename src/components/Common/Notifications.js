import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { removeNotification } from '../../redux/slices/uiSlice';
import '../../styles/navbar.css';

/**
 * Notifications — renders the toast notifications stored in ui.notifications.
 * Positioned in the bottom-right corner of the viewport.
 */
function Notifications() {
  const notifications = useSelector((state) => state.ui.notifications);
  const dispatch = useDispatch();

  if (notifications.length === 0) return null;

  return (
    <div className="notifications-container" role="status" aria-live="polite">
      {notifications.map((n) => (
        <div key={n.id} className={`notification notification-${n.type || 'info'}`}>
          <span>{n.message}</span>
          <button
            onClick={() => dispatch(removeNotification(n.id))}
            aria-label="Dismiss notification"
          >
            ×
          </button>
        </div>
      ))}
    </div>
  );
}

export default Notifications;
