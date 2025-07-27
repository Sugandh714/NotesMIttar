import React, { useEffect, useState } from 'react';
import '../style/ContributionHistory.css';
import { getSessionHeaders } from '../component/getSessionHeaders';

export default function ContributionHistory() {
  const [contributions, setContributions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchContributions = async () => {
      try {
        setLoading(true);
        const res = await fetch('http://localhost:5000/api/my-resources', {
          headers: getSessionHeaders()
        });

        if (!res.ok) throw new Error(`Failed to fetch: ${res.status}`);
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
    const fileUrl = `http://localhost:5000/api/file/${fileId}`;
    window.open(fileUrl, '_blank');
  };

  const formatDate = (dateString) => new Date(dateString).toLocaleString('en-US', {
    year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
  });

  const getStatusClassName = (status) => `status ${status.toLowerCase()}`;

  const getRelevanceScore = (doc) => {
    const score = doc.relevanceScore;
    if (score !== null && score !== undefined && !isNaN(Number(score))) {
      const numScore = Number(score);
      if (numScore >= 0 && numScore <= 100) return Math.round(numScore);
    }
    return null;
  };

  const getScoreColor = (score) => {
    if (score >= 80) return '#28a745';
    if (score >= 60) return '#ffc107';
    return '#dc3545';
  };

  const getTopicCoverageSummary = (doc) => {
  if (!doc.topicCoverage || !Array.isArray(doc.topicCoverage)) return null;

  const totalTopics = doc.topicCoverage.length;

  let wellCoveredTopics = 0;
  let partiallyCoveredTopics = 0;
  let poorlyCoveredTopics = 0;

  doc.topicCoverage.forEach((t) => {
    const { matched = 0, total = 1 } = t;
    const percentage = (matched / total) * 100;

    if (percentage >= 70) wellCoveredTopics++;
    else if (percentage >= 30) partiallyCoveredTopics++;
    else poorlyCoveredTopics++;
  });

  return { totalTopics, wellCoveredTopics, partiallyCoveredTopics, poorlyCoveredTopics };
};


  const getAnalysisReasons = (doc) => {
    const score = getRelevanceScore(doc);
    if (score === null) return [];
    const reasons = [];
    const summary = getTopicCoverageSummary(doc);
    if (summary) {
      if (summary.wellCoveredTopics > 0) reasons.push(`${summary.wellCoveredTopics}/${summary.totalTopics} topics well covered`);
      if (summary.partiallyCoveredTopics > 0) reasons.push(`${summary.partiallyCoveredTopics} partially covered`);
      if (summary.poorlyCoveredTopics > 0) reasons.push(`${summary.poorlyCoveredTopics} need improvement`);
    } else {
      if (score >= 80) reasons.push("Excellent coverage and syllabus alignment");
      else if (score >= 60) reasons.push("Moderate alignment with gaps");
      else reasons.push("Low syllabus relevance");
    }
    return reasons;
  };

  const getAIRecommendations = (doc) => {
    if (doc.recommendations?.length > 0) return doc.recommendations;
    const score = getRelevanceScore(doc);
    if (score === null) return [];
    if (score >= 90) return ["🌟 Excellent contribution!"];
    if (score >= 80) return ["✅ Well aligned with syllabus."];
    if (score >= 60) return ["⚠️ Add more examples or detail."];
    return ["❌ Consider revising for better syllabus match."];
  };

  const renderAIAnalysis = (doc) => {
    const relevanceScore = getRelevanceScore(doc);

    if (doc.status === 'pending') {
      return <div className="pending-report">⏳ Report will be generated after approval...</div>;
    }

    if (relevanceScore === null) {
      return (
        <div className="pending-report">
          <div><em>⏳ AI analysis in progress...</em></div>
          <div className="debug-info">
            <strong>Debug Info:</strong><br />
            Type: {doc.type}<br />
            Status: {doc.status}<br />
            RelevanceScore: {JSON.stringify(doc.relevanceScore)}<br />
            All Fields: {Object.keys(doc).join(', ')}
          </div>
        </div>
      );
    }

    return (
      <div className="report-box">
        <div className="relevance-score">
          <strong>🎯 Relevance Score:</strong>
          <span style={{ color: getScoreColor(relevanceScore), fontWeight: 'bold' }}>{relevanceScore}%</span>
        </div>
        <div className="topics-section">
          <strong>📋 AI Analysis:</strong>
          <ul>
            {getAnalysisReasons(doc).map((reason, idx) => (
              <li key={idx}>✔️ {reason}</li>
            ))}
          </ul>
        </div>
        <div className="suggestion-box">
          <strong>📌 Suggestions:</strong>
          <ul>
            {getAIRecommendations(doc).map((suggestion, idx) => (
              <li key={idx}>{suggestion}</li>
            ))}
          </ul>
        </div>
      </div>
    );
  };

  if (loading) {
    return <div className="history-container"><h1>📚 Your Contribution History</h1><div className="loading">Loading...</div></div>;
  }
  if (error) {
    return <div className="history-container"><h1>📚 Your Contribution History</h1><div className="error">{error}</div></div>;
  }

  return (
    <div className="history-container">
      <h1>📚 Your Contribution History</h1>
      {contributions.length === 0 ? (
        <div className="no-contributions"><p>No contributions yet.</p></div>
      ) : (
        <table className="history-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Details</th>
              <th>Status</th>
              <th>Upload Date</th>
              <th>AI Analysis & Score</th>
            </tr>
          </thead>
          <tbody>
            {contributions.map((doc, index) => (
              <tr key={doc.fileId || index}>
                <td>
                  <button className="file-link" onClick={() => handleFileClick(doc.fileId, doc.filename)}>
                    📄 {doc.filename || 'Unknown'}
                  </button>
                </td>
                <td>
                  <div><strong>Course:</strong> {doc.course}</div>
                  <div><strong>Semester:</strong> {doc.semester}</div>
                  <div><strong>Subject:</strong> {doc.subject}</div>
                  <div><strong>Type:</strong> {doc.type}</div>
                  {doc.unit && <div><strong>Units:</strong> {Array.isArray(doc.unit) ? doc.unit.join(', ') : doc.unit}</div>}
                  {doc.year && <div><strong>Year:</strong> {doc.year}</div>}
                </td>
                <td><span className={getStatusClassName(doc.status)}>{doc.status}</span></td>
                <td>{formatDate(doc.uploadDate)}</td>
                <td>{renderAIAnalysis(doc)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
