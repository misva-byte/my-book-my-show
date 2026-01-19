import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import axiosInstance from "../api/axiosInstance";
import "./PaymentPage.css";
import AppLayout from "./AppLayout";

function PaymentPage() {
  const location = useLocation();
  const navigate = useNavigate();

  const { totalPrice, selectedSeats, showId, show } = location.state || {};

  /* ---------------- Redirect safety ---------------- */
  useEffect(() => {
    if (!totalPrice || !selectedSeats || !show) {
      navigate(showId ? `/booking/${showId}` : "/");
    }
  }, [totalPrice, selectedSeats, show, navigate, showId]);

  if (!totalPrice || !selectedSeats || !show) return null;

  /* ---------------- PAYMENT HANDLER ---------------- */
  const handleConfirmPay = async () => {
    try {
      // Convert seat keys into backend format
      const seatsPayload = selectedSeats.map((seat) => {
        const [layoutType, seatCode] = seat.split("-");
        return {
          row: seatCode.charAt(0),
          column: Number(seatCode.slice(1)),
          layoutType,
        };
      });

      const payload = {
        showtimeId: show.id,
        seatData: {
          seats: seatsPayload,
        },
      };

      console.log("Creating order:", payload);

      // API call (baseURL comes from axiosInstance → Vercel safe)
      const res = await axiosInstance.post("/orders", payload);

      console.log("Order response:", res.data);

      // Extract Stripe URL safely
      const stripeUrl =
        res.data?.paymentUrl  ||
        res.data?.data?.paymentUrl  ||
        res.data?.data?.url;

      if (!stripeUrl) {
        alert("Unable to initiate payment");
        return;
      }

      // Redirect to Stripe
      window.location.assign(stripeUrl);

    } catch (error) {
      console.error("Payment error:", error);
      alert("Payment failed. Please try again.");
    }
  };

  /* ---------------- UI ---------------- */
  return (
    <AppLayout>
      <div className="payment-page">
        <h1>Payment</h1>
        <p>Review your payment before confirming</p>

        {/* Movie & Show Details */}
        <div className="show-details-box">
          <h3>{show.movie.name}</h3>
          <p>
            {show.screen.theaterName} • Screen {show.screen.screenNumber}
          </p>
          <p>{new Date(show.startTime).toLocaleString()}</p>
          <p>Seats: {selectedSeats.join(", ")}</p>
        </div>

        {/* Total */}
        <div className="payment-amount-box">
          <h2>
            Total Amount <span className="amount">₹{totalPrice}</span>
          </h2>
        </div>

        <button className="confirm-pay-btn" onClick={handleConfirmPay}>
          Confirm & Pay
        </button>

        <p className="secure-payment-text">
          Secure payment &bull; No extra charges
        </p>
      </div>
    </AppLayout>
  );
}

export default PaymentPage;
