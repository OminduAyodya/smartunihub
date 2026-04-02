import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FiArrowLeft } from 'react-icons/fi';
import StallForm from '../components/StallForm';
import stallService from '../services/stallService';
import '../styles/Pages.css';
import { toast } from 'react-toastify';

const EditStall = () => {
  const navigate = useNavigate();
  const { stallId } = useParams();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [stallData, setStallData] = useState(null);
  const [stallUpdated, setStallUpdated] = useState(false);

  useEffect(() => {
    fetchStallDetails();
  }, [stallId]);

  const fetchStallDetails = async () => {
    setLoading(true);
    try {
      const stall = await stallService.getStallDetails(stallId);
      setStallData(stall);
    } catch (error) {
      toast.error('Failed to load stall details');
      navigate('/stall-allocations');
    } finally {
      setLoading(false);
    }
  };

  const handleEditStall = async (formData) => {
    setSubmitting(true);
    try {
      const response = await stallService.updateStall(stallId, formData);
      setStallUpdated(true);
      toast.success('Stall updated successfully!');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update stall');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="create-event-page">
        <div className="loading">Loading stall details...</div>
      </div>
    );
  }

  // Show success message after update
  if (stallUpdated) {
    return (
      <div className="create-event-page">
        <div className="event-success-container">
          <div className="success-card">
            <div className="success-icon">✓</div>
            <h2>Stall Updated Successfully!</h2>
            <p className="pending-status">Your stall details have been updated.</p>
            
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
              <p>✓ Your stall details have been updated successfully.</p>
            </div>

            <div className="action-buttons">
              <button className="btn-primary" onClick={() => navigate('/stall-allocations')}>
                Back to My Stalls
              </button>
              <button className="btn-secondary" onClick={() => navigate('/')}>
                Go Home
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
        <button className="back-button" onClick={() => navigate('/stall-allocations')}>
          ← Back
        </button>
      </div>

      <div className="page-header">
        <h1>Edit Stall</h1>
        <p>Update your stall details</p>
      </div>

      <div className="form-container">
        {stallData && (
          <StallForm 
            initialData={stallData}
            onSubmit={handleEditStall}
            loading={submitting}
            isEditMode={true}
          />
        )}
      </div>
    </div>
  );
};

export default EditStall;
