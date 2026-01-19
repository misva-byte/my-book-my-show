import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./components/login"
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




function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        <Route element={<NavbarLayout />}>
            <Route path="/home" element={<Home />} />
            <Route path="/movie/:movieId" element={<MovieDetails />} />
            <Route path="/theater/:theaterId" element={<TheaterDetails />} />
            <Route path="/booking/:showId" element={<BookingPage />} />
            <Route path="/payment" element={<PaymentPage />} />
            <Route path="/success" element={<Success />} />
            <Route path="/ticket" element={<Ticket />} />
            <Route path="/cancel" element={<Cancel />} />


        </Route>


      </Routes>
    </BrowserRouter>
  );
}

export default App;
