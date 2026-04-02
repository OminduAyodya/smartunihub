import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import stallService from '../services/stallService';
import StallForm from '../components/StallForm';
import '../styles/Pages.css';
import { toast } from 'react-toastify';

const MyStallsPage = () => {
  const navigate = useNavigate();
  const [approvedStalls, setApprovedStalls] = useState([]);
  const [pendingStalls, setPendingStalls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState(null); // null, 'approved', 'pending'
  const [showRequestForm, setShowRequestForm] = useState(false);

  useEffect(() => {
    fetchMyStalls();
  }, []);

  const fetchMyStalls = async () => {
    setLoading(true);
    try {
      const approvedResponse = await stallService.getApprovedStalls();
      const approvedArray = Array.isArray(approvedResponse) ? approvedResponse : (approvedResponse?.data ? approvedResponse.data : []);
      setApprovedStalls(approvedArray);

      const pendingResponse = await stallService.getPendingStalls();
      const pendingArray = Array.isArray(pendingResponse) ? pendingResponse : (pendingResponse?.data ? pendingResponse.data : []);
      setPendingStalls(pendingArray);
    } catch (error) {
      console.error('Error fetching stalls:', error);
      const errorMsg = error.response?.data?.message || error.message || '';
      
      if (errorMsg.includes('Invalid token')) {
        toast.error('❌ Session expired. Please log in again.');
      } else if (errorMsg.includes('No token')) {
        toast.error('❌ Please log in to view your stalls.');
      } else {
        toast.error('⚠️ Could not load stalls. Make sure the server is running.');
      }
      setApprovedStalls([]);
      setPendingStalls([]);
    } finally {
      setLoading(false);
    }
  };

  const handleRequestSuccess = async (formData) => {
    try {
      await stallService.requestStall(formData);
      toast.success('Stall request submitted successfully!');
      setShowRequestForm(false);
      await fetchMyStalls();
      setFilterStatus(null);
    } catch (error) {
      console.error('Error submitting stall request:', error);
      toast.error(error.response?.data?.message || 'Failed to submit stall request');
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
        <h1>My Stalls</h1>
        <p>Manage your stall requests and approvals</p>
      </div>

      <div className="stall-content">
        {/* Request Stall Section */}
        <div className="section-divider">
          <h2 className="section-title">📋 Request a New Stall</h2>
          <p className="section-description">Submit a stall request for any event and await admin approval</p>
        </div>

        {!showRequestForm ? (
          <button 
            className="btn-primary btn-request-stall"
            onClick={() => setShowRequestForm(true)}
            style={{ marginBottom: '30px' }}
          >
            📋 Request New Stall
          </button>
        ) : (
          <div style={{ marginBottom: '40px', padding: '20px', backgroundColor: '#f8f9fa', borderRadius: '8px' }}>
            <h3 style={{ marginBottom: '20px' }}>Fill in Stall Details</h3>
            <StallForm 
              onSubmit={handleRequestSuccess}
              loading={false}
            />
            <button 
              className="btn-secondary"
              onClick={() => setShowRequestForm(false)}
              style={{ marginTop: '10px' }}
            >
              Cancel
            </button>
          </div>
        )}

        {/* My Stalls Section */}
        <div className="section-divider" style={{ marginTop: '40px' }}>
          <h2 className="section-title">My Stall Requests</h2>
          <p className="section-description">View your approved and pending stall requests</p>
        </div>

        {/* Filter Buttons */}
        <div className="filters">
          <button 
            className={`filter-btn ${filterStatus === 'approved' ? 'active' : ''}`}
            onClick={() => setFilterStatus('approved')}
          >
            ✅ Approved ({approvedStalls.length})
          </button>
          <button 
            className={`filter-btn ${filterStatus === 'pending' ? 'active' : ''}`}
            onClick={() => setFilterStatus('pending')}
          >
            ⏳ Pending ({pendingStalls.length})
          </button>
        </div>

        {loading ? (
          <div className="loading">Loading your stalls...</div>
        ) : approvedStalls.length === 0 && pendingStalls.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📋</div>
            <h2>No Stall Requests Yet</h2>
            <p>You don't have any stall requests. Use the form above to request your first stall!</p>
            <button 
              className="btn-primary"
              onClick={() => setShowRequestForm(true)}
              style={{ marginTop: '20px' }}
            >
              📋 Request a Stall
            </button>
          </div>
        ) : filterStatus === null ? (
          <div className="empty-state">
            <div className="empty-icon">📋</div>
            <h2>Select a Filter</h2>
            <p>Click Approved or Pending above to view your stalls</p>
          </div>
        ) : (
          <>
            {/* Approved Stalls */}
            {filterStatus === 'approved' && (
              <div className="stall-section">
                <div className="section-header">
                  <h2>✅ Approved Stalls</h2>
                  <span className="stall-count">{approvedStalls.length}</span>
                </div>
                {approvedStalls.length > 0 ? (
                  <div className="stalls-grid">
                    {approvedStalls.map(stall => (
                      <div key={stall._id} className="stall-card">
                        <div className="stall-header">
                          <h3>{stall.stallName}</h3>
                          <span className="stall-status approved">✅ Approved</span>
                        </div>
                        <div className="stall-details">
                          <p><strong>Category:</strong> {stall.category}</p>
                          <p><strong>Size:</strong> {stall.size}</p>
                          <p><strong>Price:</strong> LKR {stall.price?.toLocaleString()}</p>
                          <p><strong>Location:</strong> {stall.location || 'Not specified'}</p>
                          {stall.eventName && <p><strong>Event:</strong> {stall.eventName}</p>}
                        </div>
                        <div className="stall-actions">
                          <button 
                            className="btn-primary btn-sm"
                            onClick={() => navigate(`/edit-stall/${stall._id}`)}
                          >
                            ✎ Edit
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="empty-state">
                    <p>You don't have any approved stalls yet.</p>
                  </div>
                )}
              </div>
            )}

            {/* Pending Stalls */}
            {filterStatus === 'pending' && (
              <div className="stall-section">
                <div className="section-header">
                  <h2>⏳ Pending Stalls</h2>
                  <span className="stall-count">{pendingStalls.length}</span>
                </div>
                {pendingStalls.length > 0 ? (
                  <div className="stalls-grid">
                    {pendingStalls.map(stall => (
                      <div key={stall._id} className="stall-card">
                        <div className="stall-header">
                          <h3>{stall.stallName}</h3>
                          <span className="stall-status pending">⏳ Pending</span>
                        </div>
                        <div className="stall-details">
                          <p><strong>Category:</strong> {stall.category}</p>
                          <p><strong>Size:</strong> {stall.size}</p>
                          <p><strong>Price:</strong> LKR {stall.price?.toLocaleString()}</p>
                          <p><strong>Location:</strong> {stall.location || 'Not specified'}</p>
                          {stall.eventName && <p><strong>Event:</strong> {stall.eventName}</p>}
                        </div>
                        <div className="stall-actions">
                          <button 
                            className="btn-primary btn-sm"
                            onClick={() => navigate(`/edit-stall/${stall._id}`)}
                          >
                            ✎ Edit
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="empty-state">
                    <p>You don't have any pending stall requests.</p>
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default MyStallsPage;
