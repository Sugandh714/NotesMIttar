import { useNavigate, Link } from 'react-router-dom';
import { useState } from 'react';
import {  useLocation } from 'react-router-dom';
import GoogleIcon from '../assets/images/google-icon.jpg'; // Import Google icon image
import '../style/Auth.css'; // Shared CSS for login/signup
import Navbar from '../component/Navbar';

function NavLogin() {
  const BASE_URL = 'http://localhost:5000/api';
  const [usernameOrEmail, setUsernameOrEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  // Fallback to home if no previous route
  const from = location.state?.from || '/';

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!usernameOrEmail || !password) {
      return alert('Please fill all fields.');
    }

    try {
      const res = await fetch(`${BASE_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ usernameOrEmail, password })
      });

      const data = await res.json();
      if(data.user.status === 'suspended'){
          alert('Your account has been suspended. Please contact support.');
          sessionStorage.clear(); // Clear any partial login info
          return;
       }
if (res.ok) {
  const sessionID = data.sessionID;

  sessionStorage.setItem('sessionID', sessionID);
  sessionStorage.setItem('loggedIn', 'true');
  sessionStorage.setItem('userId', data.user._id);
  sessionStorage.setItem('username', data.user.username);
  sessionStorage.setItem('email', data.user.email);
  sessionStorage.setItem('name', data.user.name);
  sessionStorage.setItem('user', JSON.stringify({
    username: data.user.username,
    email: data.user.email
  }));

  if (data.user.avatar) {
    sessionStorage.setItem('avatar', data.user.avatar);
  }

  if (data.user.isAdmin === true) {
    sessionStorage.setItem('isAdmin', 'true');
    sessionStorage.setItem('admin', JSON.stringify(data.user));
  } else {
    sessionStorage.setItem('isAdmin', 'false');
    sessionStorage.removeItem('admin');
  }

  // Delay navigation slightly to ensure sessionStorage is fully written
  setTimeout(() => {
    navigate(from, { replace: true });
  }, 100); // 100ms is usually enough
}

 // ⬅️ Changed to replace: true
      else {
        alert(data.error || 'Login failed');
      }
    } catch (err) {
      alert('Something went wrong: ' + err.message);
    }
  };

  return (
    <>
      <Navbar />
      <div className="login-body">
        <div className="login-container">
          <h2>Welcome back to Mittar</h2>
          <p className="subtext">Tera Exam ka Sacha Yaar</p>

          <form className="login-form" onSubmit={handleLogin}>
            <input
              type="text"
              placeholder="Username or Email"
              value={usernameOrEmail}
              onChange={(e) => setUsernameOrEmail(e.target.value)}
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

export default NavLogin; 