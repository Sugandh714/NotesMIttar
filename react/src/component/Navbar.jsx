import { Link, useNavigate } from 'react-router-dom';
import '../style/Navbar.css';

export default function Navbar() {
  const navigate = useNavigate();
  const isLoggedIn = sessionStorage.getItem('loggedIn') === 'true';

  const handleUploadClick = () => {
    navigate(isLoggedIn ? '/upload' : '/login');
  };

  return (
    <header>
      <div className="logo">NotesMittar</div>
      <nav>
        <Link to="/">Home</Link>
        <a href="#features">Features</a>
        <Link to="/scoreboard">Scoreboard</Link>
        {isLoggedIn ? (
          <div className="profile-dp" onClick={() => navigate('/profile')}>
            <img
              src="/src/assets/images/user-icon.png"
              alt="User"
              className="dp-icon"
            />
          </div>
        ) : (
          <Link to="/login">Login</Link>
        )}
      </nav>
    </header>
  );
}
