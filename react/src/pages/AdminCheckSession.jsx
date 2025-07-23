import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../style/CheckSession.css';
import { getSessionHeaders } from '../component/getSessionHeaders';

function AdminCheckSessions() {
  const [sessions, setSessions] = useState([]);
  const [filteredSessions, setFilteredSessions] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSessions = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await fetch('http://localhost:5000/blockchain/sessions', {
          headers: getSessionHeaders()
        });
        
        if (!res.ok) {
          throw new Error(`Failed to fetch sessions: ${res.status} ${res.statusText}`);
        }
        
        const data = await res.json();
        
        if (!data.sessions || !Array.isArray(data.sessions)) {
          throw new Error('Invalid response format');
        }
        
        const sorted = data.sessions.sort(
          (a, b) => new Date(b.timestamp) - new Date(a.timestamp)
        );
        setSessions(sorted);
        setFilteredSessions(sorted);
      } catch (err) {
        console.error('Error fetching sessions:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    
    fetchSessions();
  }, []);

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    
    if (value.trim() === '') {
      setFilteredSessions(sessions);
    } else {
      const filtered = sessions.filter(session =>
        session.sessionID?.toLowerCase().includes(value.toLowerCase()) ||
        session.sessionUsername?.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredSessions(filtered);
    }
  };

  const handleSessionClick = (sessionID) => {
    if (sessionID) {
      navigate(`/admin/session/${sessionID}`);
    }
  };

  const clearSearch = () => {
    setSearchTerm('');
    setFilteredSessions(sessions);
  };

  if (loading) {
    return (
      <div className="admin-session-page">
        <div className="card">
          <div className="loading-container">
            <div className="spinner"></div>
            <p>Loading sessions...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="admin-session-page">
        <div className="card">
          <div className="error-container">
            <h2>🧾 All Blockchain Sessions</h2>
            <div className="error-message">
              <span className="error-icon">⚠️</span>
              <p>{error}</p>
              <button 
                className="retry-button" 
                onClick={() => window.location.reload()}
              >
                Retry
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-session-page">
      <div className="card">
        <div className="card-header">
          <h2>🧾 All Blockchain Sessions</h2>
          <div className="session-count">
            Total: {sessions.length} | Showing: {filteredSessions.length}
          </div>
        </div>
        
        <div className="search-container">
          <div className="search-input-wrapper">
            <input
              type="text"
              placeholder="Search by Session ID or Username..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="session-search-input"
            />
            {searchTerm && (
              <button className="clear-search" onClick={clearSearch}>
                ✕
              </button>
            )}
          </div>
        </div>

        {filteredSessions.length === 0 ? (
          <div className="no-results">
            <p>No sessions found matching your search criteria.</p>
          </div>
        ) : (
          <div className="table-container">
            <table className="session-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Session ID</th>
                  <th>Username</th>
                  <th>Created At</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredSessions.map((session, index) => (
                  <tr key={session.sessionID || index}>
                    <td className="row-number">{index + 1}</td>
                    <td className="session-id">
                      <code>{session.sessionID || 'N/A'}</code>
                    </td>
                    <td className="username">
                      {session.sessionUsername || 'Unknown'}
                    </td>
                    <td className="timestamp">
                      {session.timestamp 
                        ? new Date(session.timestamp).toLocaleString()
                        : 'N/A'
                      }
                    </td>
                    <td className="actions">
                      <button 
                        onClick={() => handleSessionClick(session.sessionID)} 
                        className="view-button"
                        disabled={!session.sessionID}
                      >
                         View Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminCheckSessions;