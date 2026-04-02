import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import eventService from '../services/eventService';
import '../styles/Pages.css';

const EventDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchEventDetails();
  }, [id]);

  const fetchEventDetails = async () => {
    setLoading(true);
    try {
      const data = await eventService.getEventById(id);
      setEvent(data);
    } catch (error) {
      console.error('Error fetching event:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="loading">Loading event details...</div>;
  if (!event) return <div className="error-message">Event not found</div>;

  return (
    <div className="event-details-page">
      <div className="back-button-container">
        <button className="back-button" onClick={() => navigate(-1)}>
          ← Back
        </button>
      </div>
      <div className="event-banner">
        <img 
          src={event.thumbnail || '/default-event.jpg'} 
          alt={event.title}
          className="event-banner-image"
        />
      </div>

      <div className="event-details-container">
        <div className="event-main-info">
          <h1>{event.title}</h1>
          <span className={`status-badge ${event.status}`}>{event.status}</span>

          <div className="info-section">
            <h3>Event Information</h3>
            <div className="info-item">
              <label>Description:</label>
              <p>{event.description}</p>
            </div>
            <div className="info-row">
              <div className="info-item">
                <label>Start Date:</label>
                <p>{new Date(event.startDate).toLocaleString()}</p>
              </div>
              <div className="info-item">
                <label>End Date:</label>
                <p>{new Date(event.endDate).toLocaleString()}</p>
              </div>
            </div>
            <div className="info-row">
              <div className="info-item">
                <label>Location:</label>
                <p>{event.location}</p>
              </div>
              <div className="info-item">
                <label>Event Type:</label>
                <p>{event.eventType}</p>
              </div>
            </div>
          </div>

          <div className="event-actions">
            {event.status !== 'completed' && event.eventType === 'indoor' && (
              <a href={`/seats/${event._id}`} className="btn-primary">
                Book Seats
              </a>
            )}
            {event.status !== 'pending' && event.status !== 'completed' && (
              <a href={`/stalls/${event._id}`} className="btn-primary">
                Request Stall
              </a>
            )}
            {event.status !== 'pending' && (
              <a href={`/artists/${event._id}`} className="btn-primary">
                Vote for Artists
              </a>
            )}
            {event.status !== 'pending' && (
              <a href={`/gallery/${event._id}`} className="btn-primary">
                View Gallery
              </a>
            )}
          </div>
        </div>

        <div className="event-sidebar">
          <div className="quick-info">
            <h3>Quick Info</h3>
            <div className="info-stat">
              <span className="label">Total Seats:</span>
              <span className="value">{event.totalSeats || 'N/A'}</span>
            </div>
            <div className="info-stat">
              <span className="label">Artists:</span>
              <span className="value">{event.artists?.length || 0}</span>
            </div>
            <div className="info-stat">
              <span className="label">Stalls Requested:</span>
              <span className="value">{event.stallsRequested?.length || 0}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetails;
