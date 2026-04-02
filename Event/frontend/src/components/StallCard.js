import React from 'react';
import '../styles/Components.css';

const StallCard = ({ stall, onBook, onViewDetails }) => {
  return (
    <div className="stall-card">
      <div className="stall-header">
        <h3>{stall.stallName}</h3>
        <span className={`stall-status ${stall.status}`}>{stall.status}</span>
      </div>
      <div className="stall-details">
        <p><strong>Category:</strong> {stall.category}</p>
        <p><strong>Size:</strong> {stall.size}</p>
        <p><strong>Location:</strong> {stall.location}</p>
        <p className="price"><strong>Price:</strong> ₹{stall.price}</p>
      </div>
      <div className="stall-actions">
        <button className="btn-secondary" onClick={() => onViewDetails(stall._id)}>
          View Details
        </button>
        {stall.status === 'available' && (
          <button className="btn-primary" onClick={() => onBook(stall._id)}>
            Request Stall
          </button>
        )}
      </div>
    </div>
  );
};

export default StallCard;
