import React, { useEffect, useState } from 'react';
import '../style/ContributionHistory.css';

export default function ContributionHistory() {
  const [contributions, setContributions] = useState([]);

  useEffect(() => {
    const fetchContributions = async () => {
      try {
        const token = sessionStorage.getItem('token');
        const res = await fetch('http://localhost:5000/api/my-resources', {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await res.json();
        setContributions(data);
      } catch (err) {
        alert('Failed to load contributions');
      }
    };

    fetchContributions();
  }, []);

  return (
    <div className="history-container">
      <h1 className="history-title">📚 Your Contribution History</h1>
      <table className="history-table">
        <thead>
          <tr>
            <th>Title</th>
            <th>Status</th>
            <th>Relevance Report</th>
          </tr>
        </thead>
        <tbody>
          {contributions.map((doc, index) => (
            <tr key={index}>
              <td>{doc.title}</td>
              <td>
                <span className={`status ${doc.status.toLowerCase()}`}>
                  {doc.status === 'approved' ? 'Accepted' : 'Pending'}
                </span>
              </td>
              <td>
                <div className="report-box-wrapper">
                  {doc.status === 'pending' ? (
                    <i>⏳ Report in progress...</i>
                  ) : (
                    <div className="report-box">
                      <p><strong>🎯 Relevance Score:</strong> 0.88</p>
                      <div className="topics-section">
                        <strong>✅ Topics Covered:</strong>
                        <ul>
                          <li>✔️ Title matched</li>
                          <li>✔️ Correct subject</li>
                        </ul>
                      </div>
                      <div className="suggestion-box">
                        <strong>📌 AI Suggestion:</strong>
                        <p>Consider covering more units for better reach.</p>
                      </div>
                    </div>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
