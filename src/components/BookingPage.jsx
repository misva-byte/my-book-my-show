import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import axiosInstance from "../api/axiosInstance";
import "./BookingPage.css";
import AppLayout from "./AppLayout";

function BookingPage() {
  const { showId } = useParams();

  const [show, setShow] = useState(null);
  const [layout, setLayout] = useState([]);
  const [selectedSeats, setSelectedSeats] = useState([]); // Track selected seats: e.g. ["A1", "B2"]
  const [bookedSeats, setBookedSeats] = useState([]);

  const navigate = useNavigate();
  const location = useLocation();
  const maxSeats = location.state?.seatCount || 10;

  useEffect(() => {
    const fetchShow = async () => {
      const res = await axiosInstance.get(`/show-times/${showId}`);
      const showData = res.data.data;

      setShow(showData);

      const parsedLayout = JSON.parse(showData.screen.layout);
      setLayout(parsedLayout);

      const booked = [];
      showData.orders.forEach(order => {
        order.seatData.seats.forEach(seat => {
        booked.push(`${seat.layoutType}-${seat.row}${seat.column}`);
      });
    });

    setBookedSeats(booked);
  };
    fetchShow();
  }, [showId]);

  if (!show) return <h2>Loading seats...</h2>;

  // Helper to get price for a seat section type
  const getPriceForType = (type) => {
    const priceObj = show.price.find(p => p.layoutType === type);
    return priceObj ? priceObj.price : 0;
  };

  // Handle seat selection toggle
  const toggleSeatSelection = (seatId, sectionType) => {
    const seatKey = `${sectionType}-${seatId}`; // Unique seat id including section
    
    if (bookedSeats.includes(seatKey)) return;

    setSelectedSeats(prev => {
      if (prev.includes(seatKey)) {
        return prev.filter(s => s !== seatKey);
      } else {
        if (prev.length >= maxSeats) {
          alert(`You can only select ${maxSeats} seats.`); // Optional: User feedback
          return prev; // Return existing state without changes
        }
        return [...prev, seatKey];
      }
    });
  };

  // Calculate total price based on selected seats
  const totalPrice = selectedSeats.reduce((total, seatKey) => {
    // seatKey example: "Platinum-A1"
    const sectionType = seatKey.split("-")[0];
    const price = getPriceForType(sectionType);
    return total + price;
  }, 0);

  return (
    <AppLayout>
      <div className="booking-page">

        <button className="back-btn" onClick={() => navigate(-1)}>
           ← Back
        </button>

        {/* Movie info */}
        <h2>{show.movie.name}</h2>
        <p>{show.screen.theaterName} • Screen {show.screen.screenNumber}</p>
        <p>{new Date(show.startTime).toLocaleString()}</p>

        <div className="seat-limit-info" style={{ color: selectedSeats.length === maxSeats ? 'green' : '#666' }}>
            Selecting {selectedSeats.length} of {maxSeats} seats
        </div>

        <h2>Select Seats</h2>

        {/* SEAT LAYOUT */}
        <div className="seat-layout">
          {layout.map((section) => {
            const price = getPriceForType(section.type);
            return (
              <div key={section.type} className="seat-section">
                <h3>{`₹${price} ${section.type}`}</h3>

                {section.layout.rows.map((row) => (
                  <div key={row} className="seat-row">
                    <span className="row-label">{row}</span>

                    {Array.from(
                      { length: section.layout.columns[1] },
                      (_, i) => {
                        const seatId = `${row}${i + 1}`;
                        const seatKey = `${section.type}-${seatId}`;
                        const isSelected = selectedSeats.includes(seatKey);
                        const isBooked = bookedSeats.includes(seatKey);
                        const isDisabled = !isSelected && !isBooked && selectedSeats.length >= maxSeats;
                        return (
                          <button
                            key={seatKey}
                            disabled={isBooked}
                            className={`seat 
                              ${isSelected ? "selected" : ""}
                              ${isBooked ? "booked" : ""}
                              ${isDisabled ? "limit-reached" : ""}
                              `}
                            onClick={() => toggleSeatSelection(seatId, section.type)}
                          >
                            {i + 1}
                          </button>
                        );
                      }
                    )}
                  </div>
                ))}
              </div>
            );
          })}
        </div>

        {/* Pay Button */}
        <div className="pay-section">
          <button
            className="pay-btn"
            disabled={selectedSeats.length === 0}
            onClick={() => 
              navigate("/payment", {
                state: {
                  totalPrice,
                  selectedSeats,
                  showId,
                  show,
                }
              })
            }
          >
            Pay ₹{totalPrice}
          </button>
        </div>
      </div>
    </AppLayout>
  );
}

export default BookingPage;
