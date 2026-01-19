import { Check } from "lucide-react";
import { useNavigate } from "react-router-dom";
import "./Success.css"; 
const Success = () => {
  const navigate = useNavigate();

  return (
    <div className="success-page">
      <div className="success-card">

        <h1 className="success-title">Payment Successful</h1>

        <div className="check-wrapper">
          <div className="check-bg">
            <div className="check-inner">
              <Check className="check-icon" />
            </div>
          </div>
        </div>

        <div className="button-group">
          <button
            className="btn-primary"
            onClick={() => navigate("/ticket")}
          >
            View Ticket
          </button>

          <button
            className="btn-secondary"
            onClick={() => navigate("/")}
          >
            Back to Homepage
          </button>
        </div>

      </div>
    </div>
  );
};

export default Success;
