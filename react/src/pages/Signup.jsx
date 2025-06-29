import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import '../style/Auth.css';
import Navbar from '../component/Navbar';

function Signup() {
  const BASE_URL = 'http://localhost:5000/api';
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();

    if (!name || !username || !email || !password || !confirmPassword) {
      return alert('Please fill all fields.');
    }

    if (password !== confirmPassword) {
      return alert('Passwords do not match.');
    }

    try {
      const res = await fetch(`${BASE_URL}/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, username, email, password })
      });

      const data = await res.json();

      if (res.ok) {
        alert('Signup successful! You can now login.');
        navigate('/login');
      } else {
        alert(data.error || 'Signup failed.');
        if (data.error === 'Username already taken') {
          setUsername('');
        }
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
          <h2>Create your MittarID</h2>
          <p className="subtext">Tere Preparation Ka Naya Yaar</p>

          <form className="login-form" onSubmit={handleSignup}>
            <input
              type="text"
              placeholder="Your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            <input
              type="text"
              placeholder="Choose a unique username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
            <input
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
            <button type="submit" className="login-btn">Sign Up</button>
          </form>

          <p className="signup-link">
            Already have an account? <Link to="/login">Login here</Link>
          </p>
        </div>
      </div>
    </>
  );
}

export default Signup;
