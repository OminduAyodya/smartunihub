import React, { useState } from 'react';
import '../styles/Components.css';

const EventCard = ({ event, onViewDetails }) => {
  const [isHovered, setIsHovered] = useState(false);

  // Check if this is a pending event
  const isPending = event.status === 'pending';

  return (
    <div 
      className={`event-card ${isPending ? 'pending-event-card' : ''}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Hide image for pending events - show only details */}
      {!isPending && (
        <div className="event-image">
          <img src={event.thumbnail || '/default-event.jpg'} alt={event.title} />
          <span className={`event-status ${event.status}`}>{event.status}</span>
        </div>
      )}
      
      <div className={`event-info ${isPending ? 'pending-info' : ''}`}>
        <h3>{event.title}</h3>
        
        {/* Show status badge for pending events */}
        {isPending && (
          <span className={`event-status-badge ${event.status}`}>{event.status}</span>
        )}
        
        <p className="event-date">
          {new Date(event.startDate).toLocaleDateString()}
        </p>
        <p className="event-location">{event.location}</p>
        <p className="event-type">{event.eventType}</p>
        
        {isHovered && (
          <button className="btn-view-details" onClick={() => onViewDetails(event._id)}>
            View Details
          </button>
        )}
      </div>
    </div>
  );
};

export default EventCard;
