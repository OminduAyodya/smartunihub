import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import eventService from '../services/eventService';
import seatService from '../services/seatService';
import { isValidEmail, isValidPhone, isValidName } from '../utils/helpers';
import '../styles/Pages.css';
import { toast } from 'react-toastify';

const BookEvent = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [seats, setSeats] = useState([]);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [ticketQuantity, setTicketQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [bookingStep, setBookingStep] = useState(1); // 1: Select, 2: Review, 3: Confirm
  const [bookingData, setBookingData] = useState({
    name: '',
    email: '',
    phone: '',
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    fetchEventData();
  }, [eventId]);

  const fetchEventData = async () => {
    setLoading(true);
    try {
      const eventData = await eventService.getEventById(eventId);
      setEvent(eventData);

      if (eventData.eventType === 'indoor') {
        const seatsData = await seatService.getSeatsByEvent(eventId);
        setSeats(seatsData);
      }
    } catch (error) {
      toast.error('Failed to load event details');
      navigate(-1);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectSeat = (seatNumber) => {
    setSelectedSeats(prev => {
      if (prev.includes(seatNumber)) {
        return prev.filter(s => s !== seatNumber);
      } else {
        return [...prev, seatNumber];
      }
    });
  };

  const calculateTotal = () => {
    if (event?.eventType === 'indoor' && selectedSeats.length > 0) {
      return selectedSeats.reduce((sum, seatNum) => {
        const seat = seats.find(s => s.seatNumber === seatNum);
        return sum + (seat?.price || 0);
      }, 0);
    }
    return 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setBookingData(prev => ({
      ...prev,
      [name]: value,
    }));
    // Clear field error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  // ============================================
  // EVENT BOOKING FORM VALIDATION LOGIC
  // ============================================
  // Validates all required booking form fields
  // Returns object with field names as keys and error messages as values
  // Returns empty object {} if validation passes
  const validateBookingForm = () => {
    const newErrors = {};

    // Full Name Validation
    // Requirements: Required field, minimum 2 characters, only letters and spaces
    if (!bookingData.name.trim()) {
      newErrors.name = 'Full name is required';
    } else if (!isValidName(bookingData.name)) {
      newErrors.name = 'Name must be at least 2 characters and contain only letters and spaces';
    }

    // Email Validation
    // Requirements: Required field, must match valid email format
    if (!bookingData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!isValidEmail(bookingData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    // Phone Number Validation
    // Requirements: Required field, must be exactly 10 digits
    if (!bookingData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!isValidPhone(bookingData.phone)) {
      newErrors.phone = 'Phone number must be exactly 10 digits';
    }

    return newErrors;
  };

  const handleConfirmBooking = async () => {
    // Validate form
    const newErrors = validateBookingForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setBookingStep(2);
      toast.error('Please fill in all required fields correctly');
      return;
    }

    if (event.eventType === 'indoor' && selectedSeats.length === 0) {
      toast.error('Please select at least one seat');
      return;
    }

    try {
      await seatService.bookSeats({
        seats: selectedSeats,
        event: eventId,
        attendee: bookingData,
      });
      toast.success('Booking confirmed! Check your email for details.');
      setBookingStep(3);
      setTimeout(() => navigate('/'), 3000);
    } catch (error) {
      toast.error('Booking failed. Please try again.');
    }
  };

  if (loading) return <div className="loading">Loading event details...</div>;
  if (!event) return <div className="error-message">Event not found</div>;

  return (
    <div className="book-event-page">
      <div className="back-button-container">
        <button className="back-button" onClick={() => navigate(-1)}>
          ← Back
        </button>
      </div>
      <div className="page-header">
        <h1>Book Your Event Ticket</h1>
        <p>{event.title}</p>
      </div>

      <div className="booking-container">
        {/* Left Side: Event Info & Seat Selection */}
        <div className="booking-main">
          {/* Step 1: Seat Selection */}
          {bookingStep === 1 && (
            <div className="booking-step">
              <h2>Step 1: Select Your Tickets</h2>

              {event.eventType === 'indoor' ? (
                <div>
                  <h3>Available Seats</h3>
                  <div className="seat-selection">
                    <div className="seat-categories">
                      {/* Display seats by section */}
                      {['A', 'B', 'C'].map(section => (
                        <div key={section} className="seat-section">
                          <h4>Section {section}</h4>
                          <div className="seat-grid">
                            {seats
                              .filter(s => s.section === section && s.status === 'available')
                              .slice(0, 10)
                              .map(seat => (
                                <button
                                  key={seat._id}
                                  className={`seat-btn ${
                                    selectedSeats.includes(seat.seatNumber) ? 'selected' : ''
                                  }`}
                                  onClick={() => handleSelectSeat(seat.seatNumber)}
                                  title={`${seat.seatNumber} - ₹${seat.price}`}
                                >
                                  {seat.seatNumber}
                                </button>
                              ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="outdoor-event">
                  <p>This is an outdoor event. Ticket quantity:</p>
                  <div className="quantity-selector">
                    <button 
                      className="qty-btn"
                      onClick={() => setTicketQuantity(Math.max(1, ticketQuantity - 1))}
                    >
                      −
                    </button>
                    <input 
                      type="number" 
                      value={ticketQuantity} 
                      readOnly
                      className="qty-input"
                    />
                    <button 
                      className="qty-btn"
                      onClick={() => setTicketQuantity(ticketQuantity + 1)}
                    >
                      +
                    </button>
                  </div>
                  <p className="qty-info">{ticketQuantity} ticket(s) selected</p>
                </div>
              )}

              <button 
                className="btn-primary btn-large"
                onClick={() => {
                  if (event.eventType === 'indoor' && selectedSeats.length === 0) {
                    toast.error('Please select at least one seat');
                    return;
                  }
                  setBookingStep(2);
                }}
              >
                Continue to Details
              </button>
            </div>
          )}

          {/* Step 2: Attendee Details */}
          {bookingStep === 2 && (
            <div className="booking-step">
              <h2>Step 2: Your Details</h2>
              <form className="attendee-form">
                <div className="form-group">
                  <label htmlFor="name">Full Name *</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={bookingData.name}
                    onChange={handleInputChange}
                    placeholder="Enter your full name"
                    required
                    className={errors.name ? 'input-error' : ''}
                  />
                  {errors.name && <span className="error-text">{errors.name}</span>}
                </div>

                <div className="form-group">
                  <label htmlFor="email">Email Address *</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={bookingData.email}
                    onChange={handleInputChange}
                    placeholder="Enter your email"
                    required
                    className={errors.email ? 'input-error' : ''}
                  />
                  {errors.email && <span className="error-text">{errors.email}</span>}
                </div>

                <div className="form-group">
                  <label htmlFor="phone">Phone Number *</label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={bookingData.phone}
                    onChange={handleInputChange}
                    placeholder="Enter your 10-digit phone number"
                    required
                    maxLength="10"
                    className={errors.phone ? 'input-error' : ''}
                  />
                  {errors.phone && <span className="error-text">{errors.phone}</span>}
                </div>

                <div className="form-actions">
                  <button 
                    type="button"
                    className="btn-secondary"
                    onClick={() => setBookingStep(1)}
                  >
                    Back
                  </button>
                  <button 
                    type="button"
                    className="btn-primary"
                    onClick={() => setBookingStep(3)}
                  >
                    Review Booking
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Step 3: Confirmation */}
          {bookingStep === 3 && (
            <div className="booking-step">
              <h2>Step 3: Review & Confirm</h2>
              <div className="booking-summary-details">
                <div className="summary-section">
                  <h3>Event Details</h3>
                  <p><strong>Event:</strong> {event.title}</p>
                  <p><strong>Date:</strong> {new Date(event.startDate).toLocaleString()}</p>
                  <p><strong>Location:</strong> {event.location}</p>
                </div>

                <div className="summary-section">
                  <h3>Your Details</h3>
                  <p><strong>Name:</strong> {bookingData.name}</p>
                  <p><strong>Email:</strong> {bookingData.email}</p>
                  <p><strong>Phone:</strong> {bookingData.phone}</p>
                </div>

                {event.eventType === 'indoor' && selectedSeats.length > 0 && (
                  <div className="summary-section">
                    <h3>Tickets Booked</h3>
                    <p><strong>Seats:</strong> {selectedSeats.join(', ')}</p>
                    <p><strong>Total Seats:</strong> {selectedSeats.length}</p>
                  </div>
                )}

                <div className="payment-terms">
                  <input type="checkbox" id="terms" />
                  <label htmlFor="terms">
                    I agree to the terms and conditions
                  </label>
                </div>

                <div className="form-actions">
                  <button 
                    type="button"
                    className="btn-secondary"
                    onClick={() => setBookingStep(2)}
                  >
                    Back
                  </button>
                  <button 
                    type="button"
                    className="btn-success btn-large"
                    onClick={handleConfirmBooking}
                  >
                    Confirm & Pay
                  </button>
                </div>
              </div>
            </div>
          )}

          {bookingStep === 3 && (
            <div className="booking-success">
              <h2>✅ Booking Confirmed!</h2>
              <p>Your tickets have been booked successfully.</p>
              <p>A confirmation email has been sent to {bookingData.email}</p>
              <button className="btn-primary" onClick={() => navigate('/')}>
                Return to Home
              </button>
            </div>
          )}
        </div>

        {/* Right Side: Booking Summary */}
        <div className="booking-sidebar">
          <div className="booking-summary-card">
            <h3>Booking Summary</h3>
            
            <div className="summary-item">
              <span>Event:</span>
              <strong>{event.title}</strong>
            </div>

            <div className="summary-item">
              <span>Date:</span>
              <strong>{new Date(event.startDate).toLocaleDateString()}</strong>
            </div>

            <div className="summary-item">
              <span>Type:</span>
              <strong>{event.eventType === 'indoor' ? '🎭 Indoor' : '🏟️ Outdoor'}</strong>
            </div>

            {event.eventType === 'indoor' && selectedSeats.length > 0 && (
              <>
                <div className="summary-divider"></div>
                <div className="summary-item">
                  <span>Selected Seats:</span>
                  <strong>{selectedSeats.length}</strong>
                </div>
                <div className="summary-item">
                  <span>Seat Numbers:</span>
                  <strong>{selectedSeats.slice(0, 3).join(', ')}{selectedSeats.length > 3 ? '...' : ''}</strong>
                </div>
              </>
            )}

            {event.eventType === 'outdoor' && (
              <>
                <div className="summary-divider"></div>
                <div className="summary-item">
                  <span>Tickets:</span>
                  <strong>{ticketQuantity}</strong>
                </div>
              </>
            )}

            <div className="summary-divider"></div>

            <div className="summary-item total">
              <span>Total Price:</span>
              <strong>₹{calculateTotal()}</strong>
            </div>

            <button 
              className="btn-primary btn-large"
              style={{ marginTop: '20px' }}
              onClick={() => {
                if (bookingStep === 1) {
                  if (event.eventType === 'indoor' && selectedSeats.length === 0) {
                    toast.error('Please select at least one seat');
                    return;
                  }
                  setBookingStep(2);
                } else if (bookingStep === 2) {
                  setBookingStep(3);
                }
              }}
              disabled={bookingStep === 3}
            >
              {bookingStep === 1 ? 'Continue' : bookingStep === 2 ? 'Review' : 'Booking Complete'}
            </button>

            <div className="booking-info">
              <p>✓ 100% Secure Booking</p>
              <p>✓ Instant Confirmation</p>
              <p>✓ Mobile Tickets</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookEvent;
