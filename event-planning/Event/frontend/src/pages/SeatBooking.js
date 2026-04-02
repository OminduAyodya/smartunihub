import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import seatService from '../services/seatService';
import SeatSelector from '../components/SeatSelector';
import '../styles/Pages.css';
import { toast } from 'react-toastify';

const SeatBooking = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const [seats, setSeats] = useState([]);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [loading, setLoading] = useState(false);
  const [totalPrice, setTotalPrice] = useState(0);

  useEffect(() => {
    fetchSeats();
  }, [eventId]);

  useEffect(() => {
    calculateTotal();
  }, [selectedSeats, seats]);

  const fetchSeats = async () => {
    setLoading(true);
    try {
      const data = await seatService.getSeatsByEvent(eventId);
      setSeats(data);
    } catch (error) {
      toast.error('Failed to fetch seats');
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
    const total = selectedSeats.reduce((sum, seatNum) => {
      const seat = seats.find(s => s.seatNumber === seatNum);
      return sum + (seat?.price || 0);
    }, 0);
    setTotalPrice(total);
  };

  const handleBookSeats = async () => {
    if (selectedSeats.length === 0) {
      toast.warn('Please select at least one seat');
      return;
    }

    try {
      await seatService.bookSeats({
        seats: selectedSeats,
        event: eventId,
      });
      toast.success('Seats booked successfully!');
      setSelectedSeats([]);
      fetchSeats();
    } catch (error) {
      toast.error('Failed to book seats');
    }
  };

  return (
    <div className="seat-booking-page">
      <div className="back-button-container">
        <button className="back-button" onClick={() => navigate(-1)}>
          ← Back
        </button>
      </div>
      <div className="page-header">
        <h1>Book Your Seats</h1>
        <p>Select and book seats for the event</p>
      </div>

      {loading ? (
        <div className="loading">Loading seats...</div>
      ) : (
        <div className="booking-container">
          <SeatSelector 
            seats={seats}
            onSelectSeat={handleSelectSeat}
            selectedSeats={selectedSeats}
          />

          <div className="booking-summary">
            <h3>Booking Summary</h3>
            <div className="summary-item">
              <span>Selected Seats:</span>
              <span>{selectedSeats.length}</span>
            </div>
            <div className="summary-item">
              <span>Seat Numbers:</span>
              <span>{selectedSeats.join(', ') || 'None'}</span>
            </div>
            <div className="summary-divider"></div>
            <div className="summary-item total">
              <span>Total Price:</span>
              <span>₹{totalPrice}</span>
            </div>
            <button 
              className="btn-primary btn-large"
              onClick={handleBookSeats}
              disabled={selectedSeats.length === 0}
            >
              Confirm Booking
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SeatBooking;
