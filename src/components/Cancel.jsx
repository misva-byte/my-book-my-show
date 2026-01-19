import { X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import "./Cancel.css";

const Cancel = () => {
  const navigate = useNavigate();

  return (
    <div className="cancel-page">
      <div className="cancel-card">

        <h1 className="cancel-title">Payment Failed</h1>
        <p className="cancel-subtitle">
          Your payment could not be completed. Please try again.
        </p>

        <div className="cross-wrapper">
          <div className="cross-bg">
            <div className="cross-inner">
              <X className="cross-icon" />
            </div>
          </div>
        </div>

        <div className="button-group">
          <button
            className="btn-primary"
            onClick={() => navigate("/")}
          >
            Try Again
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

export default Cancel;
