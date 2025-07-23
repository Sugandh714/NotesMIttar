import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import '../style/CheckSession.css';
import { getSessionHeaders } from '../component/getSessionHeaders';

function AdminSessionDetail() {
  const { sessionID } = useParams();
  const navigate = useNavigate();
  const [logs, setLogs] = useState([]);
  const [sessionInfo, setSessionInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!sessionID) {
      setError('No session ID provided');
      setLoading(false);
      return;
    }

    const fetchSessionLogs = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const res = await fetch(`http://localhost:5000/blockchain/session/${sessionID}`, {
          headers: getSessionHeaders()
        });
        
        if (!res.ok) {
          throw new Error(`Failed to fetch session logs: ${res.status} ${res.statusText}`);
        }
        
        const data = await res.json();
        
        if (data.result && Array.isArray(data.result)) {
          setLogs(data.result);
          // Extract session info from first log entry if available
          if (data.result.length > 0) {
            const firstLog = data.result[0];
            setSessionInfo({
              sessionID: firstLog.sessionID || sessionID,
              username: firstLog.sessionUsername,
              firstAction: new Date(firstLog.timestamp).toLocaleString()
            });
          }
        } else {
          setLogs([]);
        }
      } catch (err) {
        console.error('Error fetching session logs:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    
    fetchSessionLogs();
  }, [sessionID]);

  const handleGoBack = () => {
    navigate('/admin/check-sessions');
  };

  const getActionBadge = (action) => {
    const actionClasses = {
      'create': 'action-create',
      'update': 'action-update', 
      'delete': 'action-delete',
      'view': 'action-view',
      'login': 'action-login',
      'logout': 'action-logout'
    };
    
    const className = actionClasses[action?.toLowerCase()] || 'action-default';
    return <span className={`action-badge ${className}`}>{action || 'N/A'}</span>;
  };

  const getStatusBadge = (status) => {
    if (!status) return '-';
    
    const statusClasses = {
      'active': 'status-active',
      'inactive': 'status-inactive',
      'pending': 'status-pending',
      'completed': 'status-completed',
      'failed': 'status-failed'
    };
    
    const className = statusClasses[status?.toLowerCase()] || 'status-default';
    return <span className={`status-badge ${className}`}>{status}</span>;
  };

  if (loading) {
    return (
      <div className="admin-session-detail">
        <div className="card">
          <div className="loading-container">
            <div className="spinner"></div>
            <p>Loading session details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="admin-session-detail">
        <div className="card">
          <div className="error-container">
            <h2>📜 Session Activity</h2>
            <div className="error-message">
              <span className="error-icon">⚠️</span>
              <p>{error}</p>
              <div className="error-actions">
                <button className="retry-button" onClick={() => window.location.reload()}>
                  Retry
                </button>
                <button className="back-button" onClick={handleGoBack}>
                  Back to Sessions
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-session-detail">
      <div className="card">
        <div className="detail-header">
          <div className="header-content">
            <h2>📜 Session Activity</h2>
            <div className="session-info">
              <div className="session-id-display">
                <strong>Session ID:</strong> <code>{sessionID}</code>
              </div>
              {sessionInfo && (
                <div className="session-meta">
                  <span className="meta-item">
                    <strong>User:</strong> {sessionInfo.username || 'Unknown'}
                  </span>
                  <span className="meta-item">
                    <strong>  First Activity:</strong> {sessionInfo.firstAction}
                  </span>
                </div>
              )}
            </div>
          </div>
          <div className="header-actions">
            <Link to="/admin/check-sessions" className="back-link">
              ⬅ Back to Sessions
            </Link>
          </div>
        </div>

        <div className="logs-summary">
          <div className="summary-card">
            <h3>Summary</h3>
            <div className="summary-stats">
              <div className="stat-item">
                <span className="stat-value">{logs.length}</span>
                <span className="stat-label">Total Actions</span>
              </div>
              {logs.length > 0 && (
                <>
                  <div className="stat-item">
                    <span className="stat-value">
                      {new Set(logs.map(log => log.action)).size}
                    </span>
                    <span className="stat-label">Unique Actions</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-value">
                      {new Set(logs.map(log => log.fileID).filter(Boolean)).size}
                    </span>
                    <span className="stat-label">Files Involved</span>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {logs.length === 0 ? (
          <div className="no-results">
            <div className="empty-state">
              <span className="empty-icon">📝</span>
              <h3>No Activity Found</h3>
              <p>No actions have been recorded for this session yet.</p>
            </div>
          </div>
        ) : (
          <div className="table-container">
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
                  <tr key={`${log.sessionID}-${index}`} className="log-row">
                    <td className="row-number">{index + 1}</td>
                    <td className="action-cell">
                      {getActionBadge(log.action)}
                    </td>
                    <td className="username">
                      {log.sessionUsername || 'Unknown'}
                    </td>
                    <td className="timestamp">
                      {log.timestamp 
                        ? new Date(log.timestamp).toLocaleString()
                        : 'N/A'
                      }
                    </td>
                    <td className="file-id">
                      {log.fileID ? <code>{log.fileID}</code> : '-'}
                    </td>
                    <td className="grid-id">
                      {log.gridID ? <code>{log.gridID}</code> : '-'}
                    </td>
                    <td className="file-status">
                      {getStatusBadge(log.fileStatus)}
                    </td>
                    <td className="contributor">
                      {log.contributorUsername || '-'}
                    </td>
                    <td className="contributor-status">
                      {getStatusBadge(log.contributorStatus)}
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

export default AdminSessionDetail;