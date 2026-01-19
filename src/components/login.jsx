import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import AuthLayout from "./AuthLayout";
import { useNavigate } from "react-router-dom";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  

  useEffect(()=>{
    const token = localStorage.getItem("accessToken")
  if(token){
    navigate('/home')
  }
  }, [navigate]);

  const handleLogin = async() => {
    try {
      const response = await axios.post(
        "/api/auth/login",
        {
          email,
          password,
        }
      );

      localStorage.setItem("accessToken", response.data.data.accessToken);
      console.log(response.data)

      navigate("/home");
    }  catch(err){
      setError ("Invalid email or password");
    }
  };

  return (
    <AuthLayout>
      <h2>Login to your account</h2>

      <label>Email</label>
      <input
        type="email"
        placeholder="xyz@gmail.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <label>Password</label>
      <input
        type="password"
        placeholder="Enter Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      {/* show error */}
      {error && <p style={{ color: "red" }} >{error}</p> }

      <button className="login-btn" onClick={handleLogin}>Login</button>

      <p className="register">
        Don’t Have An Account? <Link to="/register">Register Here</Link>
      </p>
    </AuthLayout>
  );
}

export default Login;
