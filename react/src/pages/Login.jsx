import { useNavigate, Link } from 'react-router-dom';
import { useState } from 'react';
import GoogleIcon from '../assets/images/google-icon.jpg'; // Import Google icon image
import '../style/Auth.css'; // Shared CSS for login/signup
import Home from  './Home';

function Login() {
  const BASE_URL = 'http://localhost:5000/api';
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

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
      alert('Login successful!');
      navigate('/'); // or wherever you want to go
    } else {
      alert(data.message || 'Login failed');
    }
  } catch (err) {
    alert('Error: ' + err.message);
  }
};


  return (
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
  );
}

export default Login;
