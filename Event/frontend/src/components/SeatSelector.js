import React from 'react';
import '../styles/Components.css';

const SeatSelector = ({ seats, onSelectSeat, selectedSeats = [] }) => {
  const rows = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
  const seatsPerRow = 10;

  const isSelected = (seatId) => selectedSeats.includes(seatId);

  return (
    <div className="seat-selector">
      <h3>Select Your Seats</h3>
      <div className="seat-map">
        <div className="screen">Screen</div>
        {rows.map((row, rowIndex) => (
          <div key={row} className="seat-row">
            <div className="row-label">{row}</div>
            {Array.from({ length: seatsPerRow }, (_, i) => {
              const seatNum = i + 1;
              const seatId = `${row}${seatNum}`;
              const seat = seats?.find(s => s.seatNumber === seatId);
              const isAvailable = seat?.status === 'available';
              const selected = isSelected(seatId);

              return (
                <button
                  key={seatId}
                  className={`seat ${isAvailable ? 'available' : 'booked'} ${selected ? 'selected' : ''}`}
                  onClick={() => isAvailable && onSelectSeat(seatId)}
                  disabled={!isAvailable}
                  title={`Seat ${seatId}: $${seat?.price || 'N/A'}`}
                >
                  {seatNum}
                </button>
              );
            })}
            <div className="row-label">{row}</div>
          </div>
        ))}
      </div>
      <div className="seat-legend">
        <span className="legend-item"><span className="seat available"></span> Available</span>
        <span className="legend-item"><span className="seat booked"></span> Booked</span>
        <span className="legend-item"><span className="seat selected"></span> Selected</span>
      </div>
    </div>
  );
};

export default SeatSelector;
