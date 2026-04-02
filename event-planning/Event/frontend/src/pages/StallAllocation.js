import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import stallService from '../services/stallService';
import StallCard from '../components/StallCard';
import StallRequestForm from '../components/StallRequestForm';
import { isValidText, isValidPositiveNumber } from '../utils/helpers';
import '../styles/Pages.css';
import { toast } from 'react-toastify';

const StallAllocation = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const [stalls, setStalls] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filterStatus, setFilterStatus] = useState(null); // null, 'approved', 'pending'

  useEffect(() => {
    fetchStalls();
  }, [eventId]);

  const fetchStalls = async () => {
    setLoading(true);
    try {
      const data = await stallService.getStallsByEvent(eventId);
      setStalls(data);
    } catch (error) {
      toast.error('Failed to fetch stalls');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="stall-allocation-page">
      <div className="back-button-container">
        <button className="back-button" onClick={() => navigate(-1)}>
          ← Back
        </button>
      </div>
      <div className="page-header">
        <h1>Stall Allocation</h1>
        <p>Request stalls for the event</p>
      </div>

      <div className="stall-content">
        {/* Request Stall Section Header */}
        <div className="section-divider">
          <h2 className="section-title">Request a New Stall</h2>
          <p className="section-description">Submit a stall request for this event and await admin approval</p>
        </div>

        {/* Request Section */}
        <StallRequestForm 
          eventId={eventId} 
          stallService={stallService}
          onSuccess={fetchStalls}
        />

        {/* Stalls List Section Header */}
        <div className="section-divider" style={{ marginTop: '40px' }}>
          <h2 className="section-title">Browse Stalls</h2>
          <p className="section-description">View approved and pending stall requests</p>
        </div>

        {/* Filter Buttons */}
        <div className="filters">
          <button 
            className={`filter-btn ${filterStatus === 'approved' ? 'active' : ''}`}
            onClick={() => setFilterStatus('approved')}
          >
            ✅ Approved
          </button>
          <button 
            className={`filter-btn ${filterStatus === 'pending' ? 'active' : ''}`}
            onClick={() => setFilterStatus('pending')}
          >
            ⏳ Pending
          </button>
        </div>

        {loading ? (
          <div className="loading">Loading stalls...</div>
        ) : filterStatus === null ? (
          <div className="empty-state">
            <div className="empty-icon">📋</div>
            <h2>Select a Filter</h2>
            <p>Click a button above to view approved or pending stalls</p>
          </div>
        ) : (
          <>
            {filterStatus === 'approved' && (
              <div className="stall-section">
                <div className="section-header">
                  <h2>✅ Approved Stalls</h2>
                  <span className="stall-count">{stalls.filter(s => s.approvalStatus === 'approved').length}</span>
                </div>
                {stalls.filter(s => s.approvalStatus === 'approved').length > 0 ? (
                  <div className="stalls-grid">
                    {stalls.filter(s => s.approvalStatus === 'approved').map(stall => (
                      <StallCard
                        key={stall._id}
                        stall={stall}
                        onBook={() => {}}
                        onViewDetails={() => {}}
                      />
                    ))}
                  </div>
                ) : (
                  <p className="no-stalls">No approved stalls yet</p>
                )}
              </div>
            )}

            {filterStatus === 'pending' && (
              <div className="stall-section">
                <div className="section-header">
                  <h2>⏳ Pending Stalls</h2>
                  <span className="stall-count">{stalls.filter(s => s.approvalStatus === 'pending').length}</span>
                </div>
                {stalls.filter(s => s.approvalStatus === 'pending').length > 0 ? (
                  <div className="stalls-grid">
                    {stalls.filter(s => s.approvalStatus === 'pending').map(stall => (
                      <StallCard
                        key={stall._id}
                        stall={stall}
                        onBook={() => {}}
                        onViewDetails={() => {}}
                      />
                    ))}
                  </div>
                ) : (
                  <p className="no-stalls">No pending stalls</p>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default StallAllocation;
