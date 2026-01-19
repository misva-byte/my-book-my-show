import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import AuthLayout from "./AuthLayout";

function Register() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      navigate('/home');
    }
  }, [navigate]);

  const handleRegister = async () => {
    if (!firstName || !lastName || !email || !password) {
      setError("All fields are required");
      return;
    }

    try {
      // 1. REGISTER THE USER
      await axios.post("/api/auth/signup", {
        firstName,
        lastName,
        email,
        password,
      });

      // 2. AUTO-LOGIN (Immediately log them in to get the token)
      // We reuse the email and password state variables here
      const loginResponse = await axios.post("/api/auth/login", {
        email,
        password
      });

      // 3. EXTRACT TOKEN & NAVIGATE
      // Check where your token is located. Based on your Login.jsx, it is here:
      const token = loginResponse.data?.data?.accessToken;

      if (token) {
        localStorage.setItem("accessToken", token);
        navigate("/home");
      } else {
        // Fallback: If login fails to get token, go to login page
        navigate("/");
      }

    } catch (err) {
      console.error(err);
      // Handle errors (could be from signup OR login)
      const msg = err.response?.data?.message || "Registration failed. Try again.";
      setError(msg);
    }
  };

  return (
    <AuthLayout>
      <h2>Create an account</h2>

      <label>First Name</label>
      <input 
        placeholder="Please Enter your first name" 
        type="text" 
        value={firstName}
        onChange={(e) => setFirstName(e.target.value)}
      />

      <label>Last Name</label>
      <input 
        placeholder="Please Enter your last name" 
        type="text" 
        value={lastName}
        onChange={(e) => setLastName(e.target.value)}
      />

      <label>Email</label>
      <input 
        placeholder="xyz@gmail.com" 
        type="email" 
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <label>Password</label>
      <input 
        placeholder="Enter Password" 
        type="password" 
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      {error && <p style={{ color: "red", fontSize: "0.9rem" }}>{error}</p>}

      <button className="login-btn" onClick={handleRegister}>
        Sign Up
      </button>

      <p className="register">
        Already Have An Account? <Link to="/">Log In</Link>
      </p>
    </AuthLayout>
  );
}

export default Register;