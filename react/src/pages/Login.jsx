import { useNavigate, Link } from 'react-router-dom';
import { useState } from 'react';
import GoogleIcon from '../assets/images/google-icon.jpg'; // Import Google icon image
import '../style/Auth.css'; // Shared CSS for login/signup

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    if (email && password) {
      sessionStorage.setItem('loggedIn', 'true');
      navigate('/upload'); // Redirect after login
    } else {
      alert('Please fill all fields.');
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
