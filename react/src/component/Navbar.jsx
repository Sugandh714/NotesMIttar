import { Link, useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import ProfilePage from '../pages/ProfilePage';
import { useEffect, useRef, useState } from 'react';
import '../style/Navbar.css';

export default function Navbar() {
  const isAdmin = sessionStorage.getItem('isAdmin') === 'true';
  const isLoggedIn = sessionStorage.getItem('loggedIn') === 'true';
  const navigate = useNavigate();
  const [showMenu, setShowMenu] = useState(false);
  const [userAvatar, setUserAvatar] = useState(null);
  const menuRef = useRef();

  // Load user avatar on component mount
  useEffect(() => {
    if (isLoggedIn) {
      const storedAvatar = sessionStorage.getItem('avatar');
      if (storedAvatar) {
        setUserAvatar(storedAvatar);
      } else {
        // Fetch avatar from API if not in sessionStorage
        fetchUserAvatar();
      }
    }
  }, [isLoggedIn]);

  const fetchUserAvatar = async () => {
    try {
      const username = sessionStorage.getItem('username');
      if (!username) return;

      const response = await fetch('http://localhost:5000/api/user-profile', {
        method: 'GET',
        headers: {
          'session-id': sessionStorage.getItem('sessionID'),
  'userid': sessionStorage.getItem('userId'),
  'username': sessionStorage.getItem('username'),
  'role': sessionStorage.getItem('isAdmin') === 'true' ? 'admin' : 'user',
          'Content-Type': 'application/json'
          
        }
      });

      if (response.ok) {
        const data = await response.json();
        const avatar = data.avatar || '👨‍🎓'; // Default avatar
        setUserAvatar(avatar);
        sessionStorage.setItem('avatar', avatar);
      }
    } catch (error) {
      console.error('Error fetching user avatar:', error);
    }
  };

  const handleUploadClick = () => {
    if (isLoggedIn) {
      navigate('/upload');
    } else {
      navigate('/login', { state: { from: '/upload' } });
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem('loggedIn');
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('avatar');
    sessionStorage.removeItem('username');
    sessionStorage.clear(); // Clear session storage on login page load
    setShowMenu(false);
    setUserAvatar(null);
    navigate('/');
  };

  const renderProfileDP = () => {
    // Check if userAvatar is an emoji (Unicode character)
    if (userAvatar && /\p{Extended_Pictographic}/u.test(userAvatar)) {
      return (
        <div className="avatar-emoji-dp">
          {userAvatar}
        </div>
      );
    }
    // Fallback to default image
    return (
      <img
        src="/src/assets/images/user-icon.jpg"
        alt="User"
        className="dp-icon"
      />
    );
  };

  // Close the dropdown if clicked outside
  useEffect(() => {
    const handler = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setShowMenu(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <header>
      <div className="logo">NotesMittar</div>
      <nav>
        <Link to="/">Home</Link>
        <a href="#features">Features</a>
        <Link to="/scoreboard">Scoreboard</Link>

        {isLoggedIn ? (
          <div className="profile-dp-wrapper" ref={menuRef}>
            <div
              className="dp-container"
              onClick={() => setShowMenu(!showMenu)}
            >
              {renderProfileDP()}
            </div>
            {showMenu && (
              <div className="dropdown-menu">
                {sessionStorage.getItem('isAdmin') === 'true' && (
                  <button onClick={() => navigate('/adminHome')}>
                    Admin Dashboard
                  </button>
                )}
                <button onClick={() => navigate('/ProfilePage')}>
                  Profile
                </button>
                <button onClick={handleLogout}>Logout</button>
              </div>
            )}
          </div>
        ) : (
          <Link to="/login">Login</Link>
        )}
      </nav>

    </header>
  );
}