import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiArrowLeft, FiCheckCircle, FiClock, FiMapPin, FiDollarSign, FiTag, FiEdit2, FiTrash2, FiDownload, FiMail, FiCreditCard } from 'react-icons/fi';
import stallService from '../services/stallService';
import eventService from '../services/eventService';
import '../styles/Pages.css';
import { toast } from 'react-toastify';

const StallAllocationDetailsPage = () => {
  const navigate = useNavigate();
  const [approvedStalls, setApprovedStalls] = useState([]);
  const [pendingStalls, setPendingStalls] = useState([]);
  const [selectedStall, setSelectedStall] = useState(null);
  const [eventDetails, setEventDetails] = useState({});
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState(null); // null, 'approved', or 'pending'

  useEffect(() => {
    fetchAllStalls();
  }, []);

  const fetchAllStalls = async () => {
    setLoading(true);
    try {
      const approvedResponse = await stallService.getApprovedStalls();
      const approvedArray = Array.isArray(approvedResponse) ? approvedResponse : (approvedResponse?.data ? approvedResponse.data : []);
      setApprovedStalls(approvedArray);

      const pendingResponse = await stallService.getPendingStalls();
      const pendingArray = Array.isArray(pendingResponse) ? pendingResponse : (pendingResponse?.data ? pendingResponse.data : []);
      setPendingStalls(pendingArray);

      // Don't auto-select stall - wait for user to click filter button
      setSelectedStall(null);
      setFilterStatus(null);
    } catch (error) {
      console.error('Error fetching stalls:', error);
      setApprovedStalls([]);
      setPendingStalls([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchEventDetails = async (eventId) => {
    try {
      const event = await eventService.getEventById(eventId);
      setEventDetails(prev => ({
        ...prev,
        [eventId]: event
      }));
    } catch (error) {
      console.error('Error fetching event details:', error);
    }
  };

  const handleStallSelect = (stall) => {
    setSelectedStall(stall);
    if (stall.event && !eventDetails[stall.event]) {
      fetchEventDetails(stall.event);
    }
  };

  const handleEditStall = () => {
    if (!selectedStall) return;
    navigate(`/edit-stall/${selectedStall._id}`);
  };

  const handleDeleteStall = async () => {
    if (!selectedStall) return;
    if (window.confirm('Are you sure you want to delete this stall request? This action cannot be undone.')) {
      try {
        await stallService.deleteStall(selectedStall._id);
        toast.success('Stall deleted successfully!');
        setSelectedStall(null);
        // Refresh stalls list
        await fetchAllStalls();
      } catch (error) {
        console.error('Error deleting stall:', error);
        const errorMsg = error.response?.data?.message || error.message || 'Failed to delete stall';
        toast.error(errorMsg);
      }
    }
  };

  const handleDownloadInvoice = () => {
    if (!selectedStall) return;
    try {
      // Generate PDF or download invoice
      const invoiceContent = `
Stall Allocation Invoice
========================
Stall Name: ${selectedStall.stallName}
Category: ${selectedStall.category}
Size: ${selectedStall.size}
Price: LKR ${selectedStall.price?.toLocaleString()}
Status: ${selectedStall.approvalStatus}

Generated: ${new Date().toLocaleString()}
      `;
      
      const element = document.createElement('a');
      element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(invoiceContent));
      element.setAttribute('download', `${selectedStall.stallName}-invoice.txt`);
      element.style.display = 'none';
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
      toast.success('Invoice downloaded successfully!');
    } catch (error) {
      toast.error('Failed to download invoice');
    }
  };

  const handleContactOrganizer = () => {
    if (!selectedStall) return;
    const event = eventDetails[selectedStall.event];
    if (!event) {
      toast.error('Event details not found');
      return;
    }
    // This will open a mailto link - users can send email directly
    const subject = `Inquiry about stall: ${selectedStall.stallName}`;
    const body = `Hello,\n\nI have an inquiry about my stall request for:\nStall: ${selectedStall.stallName}\nEvent: ${event.title}\n\nPlease let me know how I can assist you.`;
    window.location.href = `mailto:${event.organizerEmail || 'organizer@event.com'}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  const handleViewPaymentStatus = () => {
    if (!selectedStall) return;
    const statusMessage = selectedStall.approvalStatus === 'approved' 
      ? `Payment Status: ${selectedStall.paymentStatus || 'Pending'}\nPrice: LKR ${selectedStall.price?.toLocaleString()}`
      : 'Payment details will be available once your stall request is approved.';
    toast.info(statusMessage);
    // Future: Show detailed payment modal with transaction history
  };

  if (loading) {
    return (
      <div className="stall-allocation-details-page">
        <div className="loading">Loading stall allocations...</div>
      </div>
    );
  }

  if (approvedStalls.length === 0 && pendingStalls.length === 0) {
    return (
      <div className="stall-allocation-details-page">
        <div className="back-button-container">
          <button className="back-button" onClick={() => navigate(-1)}>
            ← Back
          </button>
        </div>
        <div className="page-header">
          <h1>Stall Allocation Details</h1>
          <p>View your approved stalls and allocation details</p>
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

        {filterStatus === 'approved' ? (
          approvedStalls.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">📭</div>
              <h2>No Approved Stalls Yet</h2>
              <p>You don't have any approved stalls. Submit a stall request and wait for admin approval.</p>
              <button 
                className="btn-primary"
                onClick={() => navigate('/request-stall')}
              >
                Request a Stall
              </button>
            </div>
          ) : null
        ) : (
          pendingStalls.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">📭</div>
              <h2>No Pending Stalls</h2>
              <p>You don't have any pending stall requests.</p>
              <button 
                className="btn-primary"
                onClick={() => navigate('/request-stall')}
              >
                Request a Stall
              </button>
            </div>
          ) : null
        )}
      </div>
    );
  }

  const event = selectedStall?.event ? eventDetails[selectedStall.event] : null;

  return (
    <div className="stall-allocation-details-page">
      <div className="back-button-container">
        <button className="back-button" onClick={() => navigate(-1)}>
          ← Back
        </button>
      </div>
      <div className="page-header">
        <h1>Stall Allocation Details</h1>
        <p>View your approved stalls and allocation information</p>
      </div>

      {/* Request New Stall Button */}
      <div className="request-stall-header">
        <button 
          className="btn-primary btn-request-new-stall"
          onClick={() => navigate('/request-stall')}
          title="Request a new stall for an event"
        >
          📋 Request Stall for New Event
        </button>
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

      <div className="stall-allocation-container">
        {/* Stalls List */}
        <div className="stalls-list-panel">
          {filterStatus === null ? (
            <div className="empty-state" style={{ padding: '40px 20px', textAlign: 'center' }}>
              <div className="empty-icon">📋</div>
              <h2>Select a Filter</h2>
              <p>Click on Approved or Pending button above to view your stalls</p>
            </div>
          ) : filterStatus === 'approved' ? (
            <>
              <h2>✅ Approved Stalls ({approvedStalls.length})</h2>
              <div className="stalls-list">
                {approvedStalls.map(stall => (
                  <div 
                    key={stall._id}
                    className={`stall-list-item ${selectedStall?._id === stall._id ? 'active' : ''}`}
                    onClick={() => handleStallSelect(stall)}
                  >
                    <div className="stall-item-header">
                      <h4>{stall.stallName}</h4>
                      <span className="status-badge approved">
                        <FiCheckCircle size={16} /> Approved
                      </span>
                    </div>
                    <p className="stall-category">{stall.category}</p>
                    <p className="stall-price">LKR {stall.price?.toLocaleString()}</p>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <>
              <h2>⏳ Pending Stalls ({pendingStalls.length})</h2>
              <div className="stalls-list">
                {pendingStalls.map(stall => (
                  <div 
                    key={stall._id}
                    className={`stall-list-item ${selectedStall?._id === stall._id ? 'active' : ''}`}
                    onClick={() => handleStallSelect(stall)}
                  >
                    <div className="stall-item-header">
                      <h4>{stall.stallName}</h4>
                      <span className="status-badge pending">
                        <FiClock size={16} /> Pending
                      </span>
                    </div>
                    <p className="stall-category">{stall.category}</p>
                    <p className="stall-price">LKR {stall.price?.toLocaleString()}</p>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Stall Details */}
        {selectedStall && (
          <div className="stall-details-panel">
            <div className="details-header">
              <h2>{selectedStall.stallName}</h2>
              {selectedStall.approvalStatus === 'approved' ? (
                <span className="approval-badge">
                  <FiCheckCircle size={20} /> Approved
                </span>
              ) : (
                <span className="approval-badge pending">
                  <FiClock size={20} /> Pending
                </span>
              )}
            </div>

            <div className="details-content">
              {/* Stall Information */}
              <div className="details-section">
                <h3>Stall Information</h3>
                <div className="details-grid">
                  <div className="detail-row">
                    <div className="detail-label">
                      <FiTag size={18} />
                      <span>Stall Name</span>
                    </div>
                    <div className="detail-value">{selectedStall.stallName}</div>
                  </div>

                  <div className="detail-row">
                    <div className="detail-label">
                      <FiTag size={18} />
                      <span>Category</span>
                    </div>
                    <div className="detail-value">
                      {selectedStall.category?.charAt(0).toUpperCase() + selectedStall.category?.slice(1)}
                    </div>
                  </div>

                  <div className="detail-row">
                    <div className="detail-label">
                      <FiTag size={18} />
                      <span>Size</span>
                    </div>
                    <div className="detail-value">
                      {selectedStall.size?.charAt(0).toUpperCase() + selectedStall.size?.slice(1)}
                    </div>
                  </div>

                  <div className="detail-row">
                    <div className="detail-label">
                      <FiMapPin size={18} />
                      <span>Location/Booth</span>
                    </div>
                    <div className="detail-value">{selectedStall.location}</div>
                  </div>

                  <div className="detail-row">
                    <div className="detail-label">
                      <FiDollarSign size={18} />
                      <span>Stall Price</span>
                    </div>
                    <div className="detail-value highlight">LKR {selectedStall.price?.toLocaleString()}</div>
                  </div>
                </div>
              </div>

              {/* Event Information */}
              {event && (
                <div className="details-section">
                  <h3>Event Information</h3>
                  <div className="details-grid">
                    <div className="detail-row">
                      <div className="detail-label">
                        <FiTag size={18} />
                        <span>Event Name</span>
                      </div>
                      <div className="detail-value">{event.title}</div>
                    </div>

                    <div className="detail-row">
                      <div className="detail-label">
                        <FiMapPin size={18} />
                        <span>Event Location</span>
                      </div>
                      <div className="detail-value">{event.location}</div>
                    </div>

                    <div className="detail-row">
                      <div className="detail-label">
                        <FiClock size={18} />
                        <span>Event Date</span>
                      </div>
                      <div className="detail-value">
                        {new Date(event.startDate).toLocaleString()}
                      </div>
                    </div>

                    <div className="detail-row">
                      <div className="detail-label">
                        <FiClock size={18} />
                        <span>End Date</span>
                      </div>
                      <div className="detail-value">
                        {new Date(event.endDate).toLocaleString()}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Additional Details */}
              {selectedStall.description && (
                <div className="details-section">
                  <h3>Additional Details</h3>
                  <p className="description-text">{selectedStall.description}</p>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="action-buttons">
              <button 
                className="btn-primary btn-edit"
                onClick={handleEditStall}
                title="Edit stall details"
              >
                <FiEdit2 size={18} />
                Edit Stall
              </button>
              <button 
                className="btn-success btn-download"
                onClick={handleDownloadInvoice}
                title="Download invoice"
              >
                <FiDownload size={18} />
                Download Invoice
              </button>
              <button 
                className="btn-info btn-contact"
                onClick={handleContactOrganizer}
                title="Contact event organizer"
              >
                <FiMail size={18} />
                Contact Organizer
              </button>
              <button 
                className="btn-warning btn-payment"
                onClick={handleViewPaymentStatus}
                title="View payment status"
              >
                <FiCreditCard size={18} />
                Payment Status
              </button>
              <button 
                className="btn-danger btn-delete"
                onClick={handleDeleteStall}
                title="Delete stall request"
              >
                <FiTrash2 size={18} />
                Delete Stall
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Floating Action Bar - Always visible when stall is selected */}
      {selectedStall && (
        <div className="floating-action-bar">
          <div className="floating-actions-container">
            <div className="selected-stall-info">
              <h4>{selectedStall.stallName}</h4>
              <span className={`status-badge ${selectedStall.approvalStatus}`}>
                {selectedStall.approvalStatus === 'approved' ? '✅ Approved' : '⏳ Pending'}
              </span>
            </div>
            
            <div className="floating-buttons">
              <button 
                className="btn-primary btn-edit"
                onClick={handleEditStall}
                title="Edit stall details"
              >
                <FiEdit2 size={16} />
                Edit
              </button>
              <button 
                className="btn-success btn-download"
                onClick={handleDownloadInvoice}
                title="Download invoice"
              >
                <FiDownload size={16} />
                Invoice
              </button>
              <button 
                className="btn-info btn-contact"
                onClick={handleContactOrganizer}
                title="Contact event organizer"
              >
                <FiMail size={16} />
                Contact
              </button>
              <button 
                className="btn-warning btn-payment"
                onClick={handleViewPaymentStatus}
                title="View payment status"
              >
                <FiCreditCard size={16} />
                Payment
              </button>
              <button 
                className="btn-danger btn-delete"
                onClick={handleDeleteStall}
                title="Delete stall request"
              >
                <FiTrash2 size={16} />
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StallAllocationDetailsPage;
