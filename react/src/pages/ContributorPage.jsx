import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';
import '../style/LeaderBoard.css';

function ContributorPage() {
  const { username } = useParams();
  const [contributor, setContributor] = useState(null);
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios
      .get(`http://localhost:5000/api/contributor/${username}/resources`)
      .then((res) => {
        setContributor(res.data.contributor);
        setResources(res.data.resources);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching contributor:', err);
        setError('Failed to load contributor profile.');
        setLoading(false);
      });
  }, [username]);

  if (loading) return <div className="container">Loading...</div>;
  if (error) return <div className="container">{error}</div>;
  if (!contributor) return <div className="container">Contributor not found.</div>;

  return (
    <div className="container">
      <div className="profile-header">
        <h2>{contributor.name}</h2>
        <p>Total Uploads: {contributor.totalUploads}</p>
        <span className="badge">Badge: {contributor.badge}</span>
      </div>

      <h3>Uploaded Resources</h3>

      <ul className="resource-list">
        {resources.map((res) => (
          <li key={res._id} className="resource-item">
 <div className="resource-header">
  <div className="resource-title">
  {[
    res.course,
    res.semester,
    res.subject,
    res.type,
    ...(res.type?.toLowerCase() === 'pyqs' && res.year ? [res.year] : []),
    ...(Array.isArray(res.unit) ? res.unit : [])
  ]
    .filter(Boolean)
    .join(' ')
    .replace(/_/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()}
</div>

  <a
    href={`http://localhost:5000/api/file/${res.fileId}`}
    target="_blank"
    rel="noopener noreferrer"
    download
    className="download-link"
  >
    📥 Download
  </a>
</div>

          </li>
        ))}
      </ul>
    </div>
  );
}

export default ContributorPage;
