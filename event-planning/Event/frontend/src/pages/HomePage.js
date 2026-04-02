import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiCompass, FiPlus, FiSearch } from 'react-icons/fi';
import EventCard from '../components/EventCard';
import '../styles/Pages.css';
import eventService from '../services/eventService';

const HomePage = () => {
  const navigate = useNavigate();
  const [featuredEvents, setFeaturedEvents] = useState([]);
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [allEvents, setAllEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [hasSearched, setHasSearched] = useState(false);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const data = await eventService.getApprovedEvents();
      setAllEvents(data);
      // Get featured events (first 3)
      setFeaturedEvents(data.slice(0, 3));
      // Get upcoming events
      setUpcomingEvents(data.slice(0, 6));
    } catch (error) {
      console.error('Error fetching events:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);

    if (query.trim() === '') {
      setHasSearched(false);
      setSearchResults([]);
      return;
    }

    const results = allEvents.filter(event =>
      event.title.toLowerCase().includes(query) ||
      event.location.toLowerCase().includes(query) ||
      event.description?.toLowerCase().includes(query)
    );

    setSearchResults(results);
    setHasSearched(true);
  };

  const handleViewDetails = (eventId) => {
    navigate(`/event/${eventId}`);
  };

  const handleBookEvent = (eventId) => {
    navigate(`/book-event/${eventId}`);
  };

  return (
    <div className="home-page">
      {/* Search Bar Section */}
      <section className="search-section">
        <div className="search-container">
          <FiSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search events..."
            value={searchQuery}
            onChange={handleSearch}
            className="search-input"
          />
          {searchQuery && (
            <button
              className="search-clear"
              onClick={() => {
                setSearchQuery('');
                setHasSearched(false);
                setSearchResults([]);
              }}
            >
              ✕
            </button>
          )}
        </div>
      </section>

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">Welcome to EventHub</h1>
          <p className="hero-subtitle">Discover, Book, and Enjoy Amazing Events Near You</p>
          
          {/* Buttons Container */}
          <div className="hero-buttons-container">
            {/* Explore Events Button */}
            <button 
              onClick={() => navigate('/calendar')}
              className="btn-explore"
            >
              <FiCompass size={20} />
              <span>Explore Events</span>
            </button>

            {/* Add Event Button */}
            <button 
              onClick={() => navigate('/create-event')}
              className="btn-add-event"
            >
              <FiPlus size={20} />
              <span>Add Event</span>
            </button>
          </div>
        </div>
      </section>

      {/* Display search results if searched, otherwise show featured events */}
      {hasSearched ? (
        <section className="search-results-section">
          <div className="results-header">
            <h2>Search Results</h2>
            <p className="results-count">
              {searchResults.length === 0 
                ? 'No events found' 
                : `${searchResults.length} event${searchResults.length !== 1 ? 's' : ''} found`}
            </p>
          </div>
          {searchResults.length > 0 ? (
            <div className="events-grid">
              {searchResults.map(event => (
                <EventCard 
                  key={event._id} 
                  event={event} 
                  onViewDetails={handleViewDetails}
                />
              ))}
            </div>
          ) : (
            <div className="no-events">
              <p>No events match your search. Try different keywords or browse featured events below.</p>
              <button 
                className="btn-primary"
                onClick={() => {
                  setSearchQuery('');
                  setHasSearched(false);
                  setSearchResults([]);
                }}
              >
                Clear Search
              </button>
            </div>
          )}
        </section>
      ) : (
        <>
      {/* Features Section */}
      <section className="features-section">
        <h2>Why Choose EventHub?</h2>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">📅</div>
            <h3>Easy Booking</h3>
            <p>Browse and book events in seconds with our intuitive platform</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🎟️</div>
            <h3>Secure Tickets</h3>
            <p>Get verified tickets for all approved and verified events</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">📸</div>
            <h3>Share Memories</h3>
            <p>Capture and share event photos in our gallery</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🎤</div>
            <h3>Vote for Artists</h3>
            <p>Help choose event entertainment through community voting</p>
          </div>
        </div>
      </section>

      {/* Featured Events Section */}
      <section className="featured-section">
        <h2>Featured Events</h2>
        {loading ? (
          <div className="loading">Loading featured events...</div>
        ) : featuredEvents.length > 0 ? (
          <div className="featured-grid">
            {featuredEvents.map(event => (
              <div key={event._id} className="featured-card">
                <div className="featured-image">
                  <img 
                    src={event.thumbnail || '/default-event.jpg'} 
                    alt={event.title}
                  />
                  <span className="featured-badge">Featured</span>
                </div>
                <div className="featured-info">
                  <h3>{event.title}</h3>
                  <p className="featured-date">
                    📅 {new Date(event.startDate).toLocaleDateString()}
                  </p>
                  <p className="featured-location">📍 {event.location}</p>
                  <p className="featured-type">🎯 {event.eventType}</p>
                  <div className="featured-actions">
                    <button 
                      className="btn-small btn-primary"
                      onClick={() => handleViewDetails(event._id)}
                    >
                      View Details
                    </button>
                    <button 
                      className="btn-small btn-success"
                      onClick={() => handleBookEvent(event._id)}
                    >
                      Book Now
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="no-events">
            <p>No featured events available at the moment</p>
          </div>
        )}
      </section>

      {/* Upcoming Events Section */}
      <section className="upcoming-section">
        <div className="upcoming-header">
          <h2>Upcoming Events</h2>
          <button 
            className="btn-link"
            onClick={() => navigate('/calendar')}
          >
            View All →
          </button>
        </div>
        {loading ? (
          <div className="loading">Loading events...</div>
        ) : upcomingEvents.length > 0 ? (
          <div className="events-grid">
            {upcomingEvents.map(event => (
              <EventCard 
                key={event._id} 
                event={event} 
                onViewDetails={handleViewDetails}
              />
            ))}
          </div>
        ) : (
          <div className="no-events">
            <p>No upcoming events</p>
          </div>
        )}
      </section>

        </>
      )}

      {/* CTA Section */}
      <section className="cta-section">
        <h2>Ready to Experience Amazing Events?</h2>
        <p>Join thousands of event enthusiasts and start booking your next adventure</p>
        <button className="btn-primary btn-large" onClick={() => navigate('/register')}>
          Get Started
        </button>
      </section>
    </div>
  );
};

export default HomePage;
