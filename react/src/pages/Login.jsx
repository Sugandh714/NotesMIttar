import { useNavigate, Link } from 'react-router-dom';
import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import GoogleIcon from '../assets/images/google-icon.jpg'; // Import Google icon image
import '../style/Auth.css'; // Shared CSS for login/signup
import Home from  './Home';
import Navbar from '../component/Navbar';

function Login() {
  const location = useLocation();
  const navigate = useNavigate();
  const from = location.state?.from || '/'; 
  console.log('Redirect after login to:', from);


  const BASE_URL = 'http://localhost:5000/api';
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');


    const handleLogin = async (e) => {
  e.preventDefault();
  try {
    const res = await fetch(`${BASE_URL}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });

    const data = await res.json();

    if (res.ok) {
      sessionStorage.setItem('token', data.token);
      sessionStorage.setItem('loggedIn', 'true');
         navigate(from); // ✅ Good
      // const redirectPath = location.state?.from || '/';
      // console.log("Redirected from:", location.state);

      // navigate(redirectPath); // ✅ Go where user intended
    } else {
      alert(data.message || 'Login failed');
    }
  } catch (err) {
    alert('Error: ' + err.message);
  }
};



  return (
    <>
    <Navbar/>
    <div className="login-body">
      <div className="login-container">
        <h2>Welcome back to Mittar</h2>
        <p className="subtext">Tera Exam ka Sacha Yaar</p>

        <form className="login-form" onSubmit={handleLogin}>
          <input
            type="text"
            placeholder="Username or Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit" className="login-btn">Login</button>
        </form>

        <p className="or">or</p>

        <button className="google-login-btn">
          <img src={GoogleIcon} alt="Google Icon" />
          Continue with Google
        </button>

        <p className="signup-link">
          Don't have an account? <Link to="/signup">Sign up here</Link>
        </p>
      </div>
    </div>
    </>
  );
}

export default Login;
