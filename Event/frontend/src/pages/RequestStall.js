import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import StallForm from '../components/StallForm';
import stallService from '../services/stallService';
import '../styles/Pages.css';
import { toast } from 'react-toastify';

const RequestStall = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [stallCreated, setStallCreated] = useState(false);
  const [stallData, setStallData] = useState(null);

  const handleRequestStall = async (formData) => {
    setLoading(true);
    try {
      const response = await stallService.requestStall(formData);
      setStallData(formData);
      setStallCreated(true);
      toast.success('Stall request submitted successfully! Awaiting admin approval.');
    } catch (error) {
      const errorMsg = error.response?.data?.message || error.message || 'Failed to request stall';
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  // Show pending message after stall request submission
  if (stallCreated) {
    return (
      <div className="create-event-page">
        <div className="event-success-container">
          <div className="success-card">
            <div className="success-icon">✓</div>
            <h2>Stall Request Submitted Successfully!</h2>
            <p className="pending-status">Status: <span className="badge-pending">Pending Admin Approval</span></p>
            
            <div className="event-details">
              <h3>{stallData?.stallName}</h3>
              <div className="details-grid">
                <div className="detail-item">
                  <span className="label">📍 Location/Booth:</span>
                  <span className="value">{stallData?.location || 'Not specified'}</span>
                </div>
                <div className="detail-item">
                  <span className="label">📦 Size:</span>
                  <span className="value">{stallData?.size?.charAt(0).toUpperCase() + stallData?.size?.slice(1)}</span>
                </div>
                <div className="detail-item">
                  <span className="label">🏷️ Category:</span>
                  <span className="value">{stallData?.category?.charAt(0).toUpperCase() + stallData?.category?.slice(1)}</span>
                </div>
                <div className="detail-item">
                  <span className="label">💰 Stall Price:</span>
                  <span className="value">LKR {stallData?.price?.toLocaleString()}</span>
                </div>
              </div>
            </div>

            <div className="info-box">
              <p>👋 Your stall request has been submitted for admin approval. You'll receive a notification once it's approved and will be visible to event organizers.</p>
            </div>

            <div className="action-buttons">
              <button className="btn-primary" onClick={() => navigate('/')}>
                Go Back Home
              </button>
              <button className="btn-secondary" onClick={() => navigate('/dashboard')}>
                View My Requests
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="create-event-page">      <div className="back-button-container">
        <button className="back-button" onClick={() => navigate('/dashboard')}>
          ← Back
        </button>
      </div>      <div className="page-header">
        <h1>Request a Stall</h1>
        <p>Submit your stall request for event approval</p>
      </div>

      <div className="form-container">
        <StallForm onSubmit={handleRequestStall} loading={loading} />
      </div>
    </div>
  );
};

export default RequestStall;
