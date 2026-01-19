import { Link } from "react-router-dom";
import AuthLayout from "./AuthLayout";

function Register() {
  return (
    <AuthLayout>
      <h2>Create an account</h2>

      <label>First Name</label>
      <input placeholder="Please Enter your first name" type="text" />

      <label>Last Name</label>
      <input placeholder="Please Enter your last name" type="text" />

      <label>Email</label>
      <input placeholder="xyz@gmail.com" type="email" />

      <label>Password</label>
      <input placeholder="Enter Password" type="password" />

      <button className="login-btn">Sign Up</button>

      <p className="register">
        Already Have An Account? <Link to="/">Log In</Link>
      </p>
    </AuthLayout>
  );
}

export default Register;
