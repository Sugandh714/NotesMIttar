import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import '../style/Auth.css';

function Signup() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSignup = (e) => {
    e.preventDefault();
    if (username && password) {
      // Save mock user state or send API request
      sessionStorage.setItem('loggedIn', 'true');
      navigate('/upload');
    } else {
      alert('Please fill all fields.');
    }
  };

  return (
    <div className="login-body">
      <div className="login-container">
        <h2>Create your MittarID</h2>
        <p className="subtext">Tere Preparation Ka Naya Yaar</p>

        <form className="login-form" onSubmit={handleSignup}>
          <input
            type="text"
            placeholder="Choose a username or email"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Create password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Confirm password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit" className="login-btn">Sign Up</button>
        </form>

        <p className="signup-link">
          Already have an account? <Link to="/login">Login here</Link>
        </p>
      </div>
    </div>
  );
}

export default Signup;
