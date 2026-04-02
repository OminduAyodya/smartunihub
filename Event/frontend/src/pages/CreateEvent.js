import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import EventForm from '../components/EventForm';
import eventService from '../services/eventService';
import '../styles/Pages.css';
import { toast } from 'react-toastify';

const CreateEvent = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [eventCreated, setEventCreated] = useState(false);
  const [eventData, setEventData] = useState(null);

  const handleCreateEvent = async (formData) => {
    setLoading(true);
    try {
      const response = await eventService.createEvent(formData);
      setEventData(formData);
      setEventCreated(true);
      toast.success('Event created successfully! Awaiting admin approval.');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create event');
    } finally {
      setLoading(false);
    }
  };

  // Show pending message after event creation
  if (eventCreated) {
    return (
      <div className="create-event-page">
        <div className="event-success-container">
          <div className="success-card">
            <div className="success-icon">✓</div>
            <h2>Event Created Successfully!</h2>
            <p className="pending-status">Status: <span className="badge-pending">Pending Admin Approval</span></p>
            
            <div className="event-details">
              <h3>{eventData?.title}</h3>
              <div className="details-grid">
                <div className="detail-item">
                  <span className="label">📍 Location:</span>
                  <span className="value">{eventData?.location || 'Not specified'}</span>
                </div>
                <div className="detail-item">
                  <span className="label">📅 Start Date:</span>
                  <span className="value">{eventData?.startDate ? new Date(eventData.startDate).toLocaleString() : 'Not specified'}</span>
                </div>
                <div className="detail-item">
                  <span className="label">🎯 Type:</span>
                  <span className="value">{eventData?.eventType?.charAt(0).toUpperCase() + eventData?.eventType?.slice(1)}</span>
                </div>
                {eventData?.eventType === 'indoor' && (
                  <div className="detail-item">
                    <span className="label">🎟️ Total Seats:</span>
                    <span className="value">{eventData?.totalSeats}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="info-box">
              <p>👋 Your event has been submitted for admin approval. You'll receive a notification once it's approved.</p>
            </div>

            <div className="action-buttons">
              <button className="btn-primary" onClick={() => navigate('/')}>
                Go Back Home
              </button>
              <button className="btn-secondary" onClick={() => navigate('/dashboard')}>
                View My Events
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="create-event-page">
      <div className="back-button-container">
        <button className="back-button" onClick={() => navigate('/dashboard')}>
          ← Back
        </button>
      </div>
      <div className="page-header">
        <h1>Add New Event</h1>
        <p>Submit your event for admin approval</p>
      </div>

      <div className="form-container">
        <EventForm onSubmit={handleCreateEvent} loading={loading} />
      </div>
    </div>
  );
};

export default CreateEvent;
