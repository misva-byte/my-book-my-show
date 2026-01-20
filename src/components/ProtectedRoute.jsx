import React from "react";
import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = () => {
  // Check if the token exists in local storage
  const token = localStorage.getItem("accessToken");

  // If token exists, render the child routes (Outlet)
  // If not, redirect them back to the Login page ("/")
  return token ? <Outlet /> : <Navigate to="/" replace />;
};

export default ProtectedRoute;