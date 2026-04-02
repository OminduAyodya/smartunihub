import React, { useEffect, useState } from 'react';
import EventCard from '../components/EventCard';
import '../styles/Pages.css';
import eventService from '../services/eventService';

const Dashboard = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filterStatus, setFilterStatus] = useState(null); // null, 'approved', 'pending', 'completed'

  useEffect(() => {
    if (filterStatus !== null) {
      fetchEvents();
    }
  }, [filterStatus]);

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const data = await eventService.getAllEvents();
      const filteredEvents = data.filter(event => event.status === filterStatus);
      setEvents(filteredEvents);
    } catch (error) {
      console.error('Error fetching events:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = (eventId) => {
    window.location.href = `/event/${eventId}`;
  };

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Welcome to EventHub</h1>
        <p>Discover and manage amazing events</p>
      </div>

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
        <button 
          className={`filter-btn ${filterStatus === 'completed' ? 'active' : ''}`}
          onClick={() => setFilterStatus('completed')}
        >
          🎉 Completed
        </button>
      </div>

      {loading ? (
        <div className="loading">Loading events...</div>
      ) : filterStatus === null ? (
        <div className="empty-state">
          <div className="empty-icon">📅</div>
          <h2>Select a Filter</h2>
          <p>Click a button above to view events</p>
        </div>
      ) : events.length > 0 ? (
        <div className="events-grid">
          {events.map(event => (
            <EventCard 
              key={event._id} 
              event={event} 
              onViewDetails={handleViewDetails}
            />
          ))}
        </div>
      ) : (
        <div className="no-events">
          <p>No events found</p>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
