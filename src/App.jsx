import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./components/login";
import Register from "./components/Register";
import Home from "./components/Home";
import NavbarLayout from "./components/NavbarLayout";
import MovieDetails from "./components/MovieDetails";
import TheaterDetails from "./components/TheaterDetails";
import BookingPage from "./components/BookingPage";
import PaymentPage from "./components/PaymentPage";
import Success from "./components/Success"; 
import Ticket from "./components/Ticket"; 
import Cancel from "./components/Cancel";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    // Added future flags to silence the console warnings
    <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <Routes>
        {/* --- Public Routes --- */}
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* --- Protected Routes --- */}
        {/* 1. Fix: Use <ProtectedRoute /> (JSX) instead of {ProtectedRoute} */}
        <Route element={<ProtectedRoute />}>
          
          {/* 2. Fix: Open NavbarLayout to wrap the child pages */}
          <Route element={<NavbarLayout />}>
            <Route path="/home" element={<Home />} />
            <Route path="/movie/:movieId" element={<MovieDetails />} />
            <Route path="/theater/:theaterId" element={<TheaterDetails />} />
            <Route path="/booking/:showId" element={<BookingPage />} />
            <Route path="/payment" element={<PaymentPage />} />
            <Route path="/success" element={<Success />} />
            <Route path="/ticket" element={<Ticket />} />
            <Route path="/cancel" element={<Cancel />} />
          </Route> {/* End of NavbarLayout */}

        </Route> {/* End of ProtectedRoute */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;