import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import eventService from '../services/eventService';
import '../styles/Pages.css';

const EventCalendar = () => {
  const navigate = useNavigate();
  const [date, setDate] = useState(new Date());
  const [events, setEvents] = useState([]);
  const [selectedDateEvents, setSelectedDateEvents] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchApprovedEvents();
  }, []);

  const fetchApprovedEvents = async () => {
    setLoading(true);
    try {
      const data = await eventService.getApprovedEvents();
      setEvents(data);
    } catch (error) {
      console.error('Error fetching events:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDateChange = (newDate) => {
    setDate(newDate);
    const dateString = newDate.toDateString();
    const dayEvents = events.filter(event => {
      const eventDate = new Date(event.startDate).toDateString();
      return eventDate === dateString;
    });
    setSelectedDateEvents(dayEvents);
  };

  const tileClassName = ({ date, view }) => {
    if (view === 'month') {
      const hasEvent = events.some(event => {
        const eventDate = new Date(event.startDate).toDateString();
        return eventDate === date.toDateString();
      });
      return hasEvent ? 'has-event' : '';
    }
  };

  return (
    <div className="calendar-page">
      <div className="back-button-container">
        <button className="back-button" onClick={() => navigate(-1)}>
          ← Back
        </button>
      </div>
      <div className="page-header">
        <h1>Event Calendar</h1>
        <p>View approved events</p>
      </div>

      <div className="calendar-container">
        <div className="calendar-section">
          <Calendar
            onChange={handleDateChange}
            value={date}
            tileClassName={tileClassName}
          />
        </div>

        <div className="events-section">
          <h2>Events on {date.toDateString()}</h2>
          {selectedDateEvents.length > 0 ? (
            <div className="events-list">
              {selectedDateEvents.map(event => (
                <div key={event._id} className="event-item">
                  <h3>{event.title}</h3>
                  <p className="event-time">
                    {new Date(event.startDate).toLocaleTimeString()}
                  </p>
                  <p className="event-location">{event.location}</p>
                  <a href={`/event/${event._id}`} className="btn-small">
                    View Details
                  </a>
                </div>
              ))}
            </div>
          ) : (
            <p className="no-events-message">No events on this date</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default EventCalendar;
