import React from "react";
import { useNavigate } from "react-router-dom";

function TheaterCard({ theater }) {
    const navigate = useNavigate();
  return (
    <div 
        className="theater-card"
        onClick={() => navigate(`/theater/${theater.id}`)}
    >
      <div className="theater-info">
        <h4 className="theater-name">{theater.name}</h4>
        <div className="theater-location">
          <LocationIcon />
          <span>{theater.location}</span>
        </div>
      </div>
      <RightArrowIcon />
    </div>
  );
}

const LocationIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5z" />
  </svg>
);

const RightArrowIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" className="arrow-icon">
    <path d="M9 18l6-6-6-6" stroke="#1579ff" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export default TheaterCard;
