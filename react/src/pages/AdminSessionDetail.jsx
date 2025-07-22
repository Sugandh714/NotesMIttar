// src/pages/AdminSessionDetail.jsx
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import '../style/CheckSession.css'; // Assuming you have a CSS file for styling
import { getSessionHeaders } from '../component/getSessionHeaders';

function AdminSessionDetail() {
  const { sessionID } = useParams();
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSessionLogs = async () => {
      try {
        const res = await fetch(`http://localhost:5000/blockchain/session/${sessionID}`, {
          headers: getSessionHeaders()
        });
        if (!res.ok) throw new Error('Failed to fetch session logs');
        const data = await res.json();
        setLogs(data.result);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchSessionLogs();
  }, [sessionID]);

  return (
    <div className="admin-session-detail">
      <h2>📜 Session Activity: <code>{sessionID}</code></h2>
      <Link to="/admin/check-sessions">⬅ Back to Sessions</Link>
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p style={{ color: 'red' }}>{error}</p>
      ) : logs.length === 0 ? (
        <p>No actions recorded for this session.</p>
      ) : (
        <table className="session-log-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Action</th>
              <th>Username</th>
              <th>Timestamp</th>
              <th>File ID</th>
              <th>Grid ID</th>
              <th>File Status</th>
              <th>Contributor</th>
              <th>Contributor Status</th>
            </tr>
          </thead>
          <tbody>
            {logs.map((log, index) => (
              <tr key={index}>
                <td>{index + 1}</td>
                <td>{log.action}</td>
                <td>{log.sessionUsername}</td>
                <td>{new Date(log.timestamp).toLocaleString()}</td>
                <td>{log.fileID || '-'}</td>
                <td>{log.gridID || '-'}</td>
                <td>{log.fileStatus || '-'}</td>
                <td>{log.contributorUsername || '-'}</td>
                <td>{log.contributorStatus || '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default AdminSessionDetail;