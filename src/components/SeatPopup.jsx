import "./SeatPopup.css";

function SeatPopup({
  visible,
  selectedSeats,
  setSelectedSeats,
  onConfirm,
  onCancel,
}) {
  if (!visible) return null;

  return (
    <div className="seat-popup-overlay">
      <div className="seat-popup-card">
        <h3>Select Number of Seats</h3>

        <div className="seat-grid">
          {[1, 2, 3, 4, 5].map((num) => (
            <button
              key={num}
              className={`seat-btn ${
                selectedSeats === num ? "selected" : ""
              }`}
              onClick={() => setSelectedSeats(num)}
            >
              {num}
            </button>
          ))}
        </div>

        <div className="seat-grid">
          {[6, 7, 8, 9, 10].map((num) => (
            <button
              key={num}
              className={`seat-btn ${
                selectedSeats === num ? "selected" : ""
              }`}
              onClick={() => setSelectedSeats(num)}
            >
              {num}
            </button>
          ))}
        </div>

        <div className="seat-popup-actions">
          <button
            className="confirm-btn"
            disabled={!selectedSeats}
            onClick={onConfirm}
          >
            Confirm
          </button>

          <button className="cancel-btn" onClick={onCancel}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

export default SeatPopup;
