import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import adminService from '../services/adminService';
import '../styles/Pages.css';
import { toast } from 'react-toastify';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('events'); // 'events' or 'stalls'
  const [pendingEvents, setPendingEvents] = useState([]);
  const [pendingStalls, setPendingStalls] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [selectedStall, setSelectedStall] = useState(null);
  const [remarks, setRemarks] = useState('');

  useEffect(() => {
    if (activeTab === 'events') {
      fetchPendingEvents();
    } else {
      fetchPendingStalls();
    }
  }, [activeTab]);

  const fetchPendingEvents = async () => {
    setLoading(true);
    try {
      const data = await adminService.getPendingEvents();
      setPendingEvents(data);
      setSelectedEvent(null);
      setRemarks('');
    } catch (error) {
      toast.error('Failed to fetch pending events');
    } finally {
      setLoading(false);
    }
  };

  const fetchPendingStalls = async () => {
    setLoading(true);
    try {
      const data = await adminService.getPendingStalls();
      setPendingStalls(data);
      setSelectedStall(null);
      setRemarks('');
    } catch (error) {
      toast.error('Failed to fetch pending stall requests');
    } finally {
      setLoading(false);
    }
  };

  // Event approval handlers
  const handleApproveEvent = async (eventId) => {
    try {
      await adminService.approveEvent(eventId, remarks);
      toast.success('Event approved successfully!');
      setPendingEvents(pendingEvents.filter(e => e._id !== eventId));
      setSelectedEvent(null);
      setRemarks('');
    } catch (error) {
      toast.error('Failed to approve event');
    }
  };

  const handleRejectEvent = async (eventId) => {
    try {
      await adminService.rejectEvent(eventId, remarks);
      toast.success('Event rejected successfully!');
      setPendingEvents(pendingEvents.filter(e => e._id !== eventId));
      setSelectedEvent(null);
      setRemarks('');
    } catch (error) {
      toast.error('Failed to reject event');
    }
  };

  // Stall approval handlers
  const handleApproveStall = async (stallId) => {
    try {
      await adminService.approveStall(stallId, remarks);
      toast.success('Stall request approved successfully!');
      setPendingStalls(pendingStalls.filter(s => s._id !== stallId));
      setSelectedStall(null);
      setRemarks('');
    } catch (error) {
      toast.error('Failed to approve stall');
    }
  };

  const handleRejectStall = async (stallId) => {
    try {
      await adminService.rejectStall(stallId, remarks);
      toast.success('Stall request rejected successfully!');
      setPendingStalls(pendingStalls.filter(s => s._id !== stallId));
      setSelectedStall(null);
      setRemarks('');
    } catch (error) {
      toast.error('Failed to reject stall');
    }
  };

  return (
    <div className="admin-dashboard">
      <div className="back-button-container">
        <button className="back-button" onClick={() => navigate('/dashboard')}>
          ← Back
        </button>
      </div>
      <div className="page-header">
        <h1>Admin Dashboard</h1>
        <p>Manage event and stall approvals</p>
      </div>

      {/* Tab Navigation */}
      <div className="admin-tabs">
        <button 
          className={`tab-button ${activeTab === 'events' ? 'active' : ''}`}
          onClick={() => setActiveTab('events')}
        >
          Events ({pendingEvents.length})
        </button>
        <button 
          className={`tab-button ${activeTab === 'stalls' ? 'active' : ''}`}
          onClick={() => setActiveTab('stalls')}
        >
          Stalls ({pendingStalls.length})
        </button>
      </div>

      {loading ? (
        <div className="loading">Loading pending requests...</div>
      ) : (
        <div className="admin-content">
          {/* EVENTS TAB */}
          {activeTab === 'events' && (
            <>
              <div className="pending-events">
                <h2>Pending Events ({pendingEvents.length})</h2>
                <div className="events-list">
                  {pendingEvents.length === 0 ? (
                    <p className="no-items-message">No pending events to approve</p>
                  ) : (
                    pendingEvents.map(event => (
                      <div 
                        key={event._id} 
                        className={`event-item ${selectedEvent?._id === event._id ? 'selected' : ''}`}
                        onClick={() => {
                          setSelectedEvent(event);
                          setRemarks('');
                        }}
                      >
                        <h4>{event.title}</h4>
                        <p>{event.location}</p>
                        <p className="date">{new Date(event.startDate).toLocaleDateString()}</p>
                      </div>
                    ))
                  )}
                </div>
              </div>

              <div className="event-review">
                {selectedEvent ? (
                  <div>
                    <h2>Review Event</h2>
                    <div className="review-content">
                      <div className="review-info">
                        <h3>{selectedEvent.title}</h3>
                        <div className="info-section">
                          <p><strong>Type:</strong> {selectedEvent.eventType}</p>
                          <p><strong>Location:</strong> {selectedEvent.location}</p>
                          <p><strong>Start:</strong> {new Date(selectedEvent.startDate).toLocaleString()}</p>
                          <p><strong>Description:</strong> {selectedEvent.description}</p>
                        </div>
                      </div>

                      <div className="review-actions">
                        <div className="remarks-section">
                          <label htmlFor="remarks">Remarks</label>
                          <textarea
                            id="remarks"
                            value={remarks}
                            onChange={(e) => setRemarks(e.target.value)}
                            placeholder="Add remarks..."
                            rows={4}
                          />
                        </div>

                        <div className="action-buttons">
                          <button 
                            className="btn-success"
                            onClick={() => handleApproveEvent(selectedEvent._id)}
                          >
                            ✓ Approve Event
                          </button>
                          <button 
                            className="btn-danger"
                            onClick={() => handleRejectEvent(selectedEvent._id)}
                          >
                            ✕ Reject Event
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="no-selection">
                    <p>Select an event to review</p>
                  </div>
                )}
              </div>
            </>
          )}

          {/* STALLS TAB */}
          {activeTab === 'stalls' && (
            <>
              <div className="pending-events">
                <h2>Pending Stall Requests ({pendingStalls.length})</h2>
                <div className="events-list">
                  {pendingStalls.length === 0 ? (
                    <p className="no-items-message">No pending stall requests to approve</p>
                  ) : (
                    pendingStalls.map(stall => (
                      <div 
                        key={stall._id} 
                        className={`event-item ${selectedStall?._id === stall._id ? 'selected' : ''}`}
                        onClick={() => {
                          setSelectedStall(stall);
                          setRemarks('');
                        }}
                      >
                        <h4>{stall.stallName}</h4>
                        <p>{stall.category} • {stall.size}</p>
                        <p className="date">LKR {stall.price?.toLocaleString()}</p>
                      </div>
                    ))
                  )}
                </div>
              </div>

              <div className="event-review">
                {selectedStall ? (
                  <div>
                    <h2>Review Stall Request</h2>
                    <div className="review-content">
                      <div className="review-info">
                        <h3>{selectedStall.stallName}</h3>
                        <div className="info-section">
                          <p><strong>Category:</strong> {selectedStall.category?.charAt(0).toUpperCase() + selectedStall.category?.slice(1)}</p>
                          <p><strong>Size:</strong> {selectedStall.size?.charAt(0).toUpperCase() + selectedStall.size?.slice(1)}</p>
                          <p><strong>Location/Booth:</strong> {selectedStall.location}</p>
                          <p><strong>Price:</strong> LKR {selectedStall.price?.toLocaleString()}</p>
                          <p><strong>Description:</strong> {selectedStall.description || 'No description provided'}</p>
                        </div>
                      </div>

                      <div className="review-actions">
                        <div className="remarks-section">
                          <label htmlFor="stall-remarks">Remarks</label>
                          <textarea
                            id="stall-remarks"
                            value={remarks}
                            onChange={(e) => setRemarks(e.target.value)}
                            placeholder="Add remarks..."
                            rows={4}
                          />
                        </div>

                        <div className="action-buttons">
                          <button 
                            className="btn-success"
                            onClick={() => handleApproveStall(selectedStall._id)}
                          >
                            ✓ Approve Stall
                          </button>
                          <button 
                            className="btn-danger"
                            onClick={() => handleRejectStall(selectedStall._id)}
                          >
                            ✕ Reject Stall
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="no-selection">
                    <p>Select a stall request to review</p>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
