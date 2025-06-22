 import React from 'react';
import '../style/ContributionHistory.css';

const contributions = [
  {
    title: 'DBMS Unit 1 Notes',
    status: 'Accepted',
    relevanceScore: 0.92,
    coveredTopics: ['ER Diagrams', 'Relational Model', 'Keys'],
    suggestedTopics: ['Normalization'],
  },
  {
    title: 'CN PYQ 2023',
    status: 'Pending',
    relevanceScore: null,
    coveredTopics: [],
    suggestedTopics: [],
  },
  {
    title: 'AI Book Summary',
    status: 'Rejected',
    relevanceScore: 0.43,
    coveredTopics: ['Introduction to AI'],
    suggestedTopics: ['Search Algorithms', 'ML Basics', 'Applications'],
  },
];

export default function ContributionHistory() {
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
                  {doc.status}
                </span>
              </td>
              <td>
  <div className="report-box-wrapper">
    {doc.status === 'Pending' ? (
      <i>⏳ Report in progress...</i>
    ) : (
      <div className="report-box">
        <p><strong>🎯 Relevance Score:</strong> {doc.relevanceScore}</p>

        <div className="topics-section">
          <strong>✅ Topics Covered:</strong>
          <ul>
            {doc.coveredTopics.map((topic, i) => (
              <li key={i}>✔️ {topic}</li>
            ))}
          </ul>
        </div>

        {doc.suggestedTopics.length > 0 && (
          <div className="suggestion-box">
            <strong>📌 AI Suggestion:</strong>
            <p>Consider adding the following to boost your relevance:</p>
            <ul>
              {doc.suggestedTopics.map((topic, i) => (
                <li key={i}>➕ {topic}</li>
              ))}
            </ul>
          </div>
        )}
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
