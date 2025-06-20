import { Link, useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';

import { useEffect, useRef, useState } from 'react';
import '../style/Navbar.css';

export default function Navbar() {
  const navigate = useNavigate();
  const isLoggedIn = sessionStorage.getItem('loggedIn') === 'true';
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef();
  
const handleUploadClick = () => {
  if (isLoggedIn) {
    navigate('/upload');
  } else {
    navigate('/login', { state: { from: '/upload' } }); // ✅ FIXED
  }
};

  const handleLogout = () => {
    sessionStorage.removeItem('loggedIn');
    sessionStorage.removeItem('token');
    setShowMenu(false);
    navigate('/');
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
            <img
              src="/src/assets/images/user-icon.jpg"
              alt="User"
              className="dp-icon"
              onClick={() => setShowMenu(!showMenu)}
            />
            {showMenu && (
              <div className="dropdown-menu">
                {/* <button onClick={() => navigate('/profile')}>My Profile</button> */}
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
