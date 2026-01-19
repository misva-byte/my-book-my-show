import axios from "axios";
import React, { useEffect, useState } from "react";
import "./Ticket.css";
import { downloadTicket } from "../utils/downloadTicket";


const Ticket = () => {
  const [orders, setOrders] = useState([]);
  const [activeTab, setActiveTab] = useState("upcoming");

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        const res = await axios.get(
          "/api/orders",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setOrders(res.data);
      } catch (error) {
        console.error("Error fetching tickets:", error);
      }
    };

    fetchTickets();
  }, []);

  // ✅ Filter orders by tab
  const filteredOrders = orders.filter((order) => {
    const showTime = new Date(order.showtime.startTime);
    const now = new Date();

    if (activeTab === "upcoming") {
      return showTime >= now && order.status !== "COMPLETED";
    }

    return showTime < now || order.status === "COMPLETED";
  });

  // ✅ Group by showtimeId
  const groupedOrders = filteredOrders.reduce((acc, order) => {
    if (!acc[order.showtimeId]) {
      acc[order.showtimeId] = [];
    }
    acc[order.showtimeId].push(order);
    return acc;
  }, {});

  return (
    <div className="ticket-page">
      <div className="tabs">
        <button
          className={`tab ${activeTab === "upcoming" ? "active" : ""}`}
          onClick={() => setActiveTab("upcoming")}
        >
          Upcoming
        </button>
        <button
          className={`tab ${activeTab === "history" ? "active" : ""}`}
          onClick={() => setActiveTab("history")}
        >
          History
        </button>
      </div>

      <div className="ticket-grid">
        {Object.keys(groupedOrders).length > 0 ? (
          Object.values(groupedOrders).map((group) => (
            <TicketCard
              key={group[0].showtimeId}
              tickets={group}
            />
          ))
        ) : (
          <div className="no-tickets">
            No {activeTab} tickets found.
          </div>
        )}
      </div>
    </div>
  );
};

const TicketCard = ({ tickets }) => {
  const showtime = tickets[0].showtime;
  const movie = showtime.movie;

  const dateObj = new Date(showtime.startTime);

  const date = dateObj.toLocaleDateString("en-US", {
    weekday: "short",
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  const time = dateObj.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });

  const seatSource =
    tickets.find(t => t.seatData?.seats?.length > 0)?.seatData?.seats || [];

  const seats = seatSource
    .map((s) => {
      if (s.seatNumber) return s.seatNumber;
      if (s.seatNo) return s.seatNo;
      if (s.seat) return s.seat;
      if (s.row && s.column !== undefined) return `${s.row}${s.column}`;
      return null;
    })
    .filter(Boolean)
    .join(", ");

  const handleDownload = () => {
    downloadTicket({
      movieName: movie.name,
      date,
      time,
      seats,
      ticketCount: tickets.length,
      theatreName: showtime.theatre?.name, // optional if exists
    });
  };


  return (
    <div className="ticket-card">
      <div className="label">Date</div>
      <div className="value">{date}</div>

      <div className="label">Movie</div>
      <div className="value bold">{movie.name}</div>

      <div className="row">
        <div>
          <div className="label">Tickets </div>
          <div className="value">
            {seats || `${tickets.length} Ticket(s)`}
          </div>
        </div>
        <div>
          <div className="label">Time</div>
          <div className="value">{time}</div>
        </div>
      </div>

      <button 
      onClick={handleDownload}
      className="download-btn">Download Ticket</button>
    </div>
  );
};


export default Ticket;
