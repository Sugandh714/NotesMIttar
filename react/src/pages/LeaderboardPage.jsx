import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../style/Leaderboard.css';
import Navbar from '../component/Navbar';
function LeaderboardPage() {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetch('http://localhost:5000/api/leaderboard')
      .then((res) => res.json())
      .then((data) => setUsers(data))
      .catch((err) => console.error('Failed to load leaderboard:', err));
  }, []);

  const filteredUsers = users.filter((user) =>
  user.username.toLowerCase().includes(searchTerm.toLowerCase())
);


  const rankBadge = (index) => {
    const badges = ['🥇', '🥈', '🥉'];
    return badges[index] || `#${index + 1}`;
  };

  return (
    <>
    <Navbar/>

    <div className="container">
      <h2 className="page-title">📚 Leaderboard</h2>

      <input
        type="text"
        className="search-box"
        placeholder="Search contributor by name..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      {filteredUsers.length === 0 ? (
        <p>No matching contributors found.</p>
      ) : (
        filteredUsers.map((user, idx) => (
          <div
            key={user.username}
            className="user-card"
            onClick={() => navigate(`/Contributor/${user.username}`)}
          >
            <div className="user-info">
              <h3>{rankBadge(idx)} {user.username}</h3>
              <p>Uploads: {user.totalUploads}</p>
            </div>
            <div className="view-link">View Profile →</div>
          </div>
        ))
      )}
    </div>
        </>
  );
}

export default LeaderboardPage;
