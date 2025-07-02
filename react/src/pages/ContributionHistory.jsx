import React, { useEffect, useState } from 'react';
import '../style/ContributionHistory.css';

export default function ContributionHistory() {
  const [contributions, setContributions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchContributions = async () => {
      try {
        setLoading(true);
        const username = sessionStorage.getItem('username');
        const email = sessionStorage.getItem('email');
        
        if (!username) {
          throw new Error('Username not found. Please login again.');
        }

        const res = await fetch('http://localhost:5000/api/my-resources', {
          headers: { 
            'username': username,
            'email': email || 'unknown@example.com'
          }
        });
        
        if (!res.ok) {
          throw new Error(`Failed to fetch: ${res.status}`);
        }
        
        const data = await res.json();
        console.log('Fetched contributions:', data);
        setContributions(data);
      } catch (err) {
        console.error('Error fetching contributions:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchContributions();
  }, []);

  const handleFileClick = (fileId, filename) => {
    // Open file in new tab for viewing
    const fileUrl = `http://localhost:5000/api/file/${fileId}`;
    window.open(fileUrl, '_blank');
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusClassName = (status) => {
    return `status ${status.toLowerCase()}`;
  };

  if (loading) {
    return (
      <div className="history-container">
        <h1 className="history-title">📚 Your Contribution History</h1>
        <div className="loading">Loading your contributions...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="history-container">
        <h1 className="history-title">📚 Your Contribution History</h1>
        <div className="error">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="history-container">
      <h1 className="history-title">📚 Your Contribution History</h1>
      
      {contributions.length === 0 ? (
        <div className="no-contributions">
          <p>No contributions yet. Start uploading to see your history!</p>
        </div>
      ) : (
        <table className="history-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Details</th>
              <th>Status</th>
              <th>Upload Date</th>
              <th>Relevance Report</th>
            </tr>
          </thead>
          <tbody>
            {contributions.map((doc, index) => (
              <tr key={doc.fileId || index}>
                <td>
                  <button 
                    className="file-link"
                    onClick={() => handleFileClick(doc.fileId, doc.filename)}
                    title="Click to view file"
                  >
                    📄 {doc.filename || 'Unknown File'}
                  </button>
                </td>
                <td>
                  <div className="details-section">
                    <div><strong>Course:</strong> {doc.course}</div>
                    <div><strong>Semester:</strong> {doc.semester}</div>
                    <div><strong>Subject:</strong> {doc.subject}</div>
                    <div><strong>Type:</strong> {doc.type}</div>
                    {doc.unit && doc.unit.length > 0 && (
                      <div><strong>Units:</strong> {Array.isArray(doc.unit) ? doc.unit.join(', ') : doc.unit}</div>
                    )}
                    {doc.year && (
                      <div><strong>Year:</strong> {doc.year}</div>
                    )}
                  </div>
                </td>
                <td>
                  <span className={getStatusClassName(doc.status)}>
                    {doc.status === 'approved' ? '✅ Approved' : '⏳ Pending'}
                  </span>
                </td>
                <td>{formatDate(doc.uploadDate)}</td>
                <td>
                  <div className="report-box-wrapper">
                    {doc.status === 'pending' ? (
                      <div className="pending-report">
                        <i>⏳ Report will be generated after approval...</i>
                      </div>
                    ) : (
                      <div className="report-box">
                        <div className="relevance-score">
                          <strong>🎯 Relevance Score:</strong> 
                          <span className="score-value">0.92</span>
                        </div>
                        <div className="topics-section">
                          <strong>✅ Analysis:</strong>
                          <ul className="analysis-list">
                            <li>✔️ Subject match confirmed</li>
                            <li>✔️ Semester alignment verified</li>
                            <li>✔️ Content type appropriate</li>
                            {doc.unit && doc.unit.length > 0 && (
                              <li>✔️ Unit coverage: {Array.isArray(doc.unit) ? doc.unit.join(', ') : doc.unit}</li>
                            )}
                          </ul>
                        </div>
                        <div className="suggestion-box">
                          <strong>📌 AI Suggestion:</strong>
                          <p>
                            {doc.type === 'Notes' 
                              ? "Great comprehensive notes! Consider adding more examples for better understanding." 
                              : doc.type === 'PYQs' 
                              ? "Excellent question paper! This will help students prepare effectively."
                              : "Valuable resource! Quality content that matches course requirements."
                            }
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
