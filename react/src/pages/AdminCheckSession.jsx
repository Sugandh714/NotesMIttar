// src/pages/AdminCheckSessions.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../style/CheckSession.css';
import { getSessionHeaders } from '../component/getSessionHeaders';

function AdminCheckSessions() {
    const [sessions, setSessions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchSessions = async () => {
            try {
                setLoading(true);
                const res = await fetch('http://localhost:5000/blockchain/sessions', {
                    headers: getSessionHeaders()
                });
                if (!res.ok) throw new Error('Failed to fetch sessions');
                const data = await res.json();
                const sorted = data.sessions.sort((a, b) =>
  new Date(b.timestamp) - new Date(a.timestamp)
);
setSessions(sorted);

                setSessions(data.sessions);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchSessions();
    }, []);

    const handleSessionClick = (sessionID) => {
        navigate(`/admin/session/${sessionID}`);
    };

    return (
        <div className="admin-session-page">
            <h2>🧾 All Blockchain Sessions</h2>
            {loading ? (
                <p>Loading...</p>
            ) : error ? (
                <p style={{ color: 'red' }}>{error}</p>
            ) : (
                <table className="session-table">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Session ID</th>
                            <th>Username</th>
                            <th>Timestamp</th>
                            <th>View</th>
                        </tr>
                    </thead>
                    <tbody>
                        {sessions.map((session, index) => (
                            <tr key={session.sessionID}>
                                <td>{index + 1}</td>
                                <td>{session.sessionID}</td>
                                <td>{session.sessionUsername}</td>
                                <td>{new Date(session.timestamp).toLocaleString()}</td>
                                <td>
                                    <button onClick={() => handleSessionClick(session.sessionID)}>
                                        View Details
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>

                </table>
            )}
        </div>
    );
}

export default AdminCheckSessions;
