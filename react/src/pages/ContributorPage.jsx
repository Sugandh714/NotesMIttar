import { useParams } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import '../style/LeaderBoard.css';
import { getSessionHeaders } from '../component/getSessionHeaders';

function ContributorPage() {
  const { username } = useParams();
  const [contributor, setContributor] = useState(null);
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const hasLoggedView = useRef(false); // ✅ Persistent between renders

  useEffect(() => {
    axios
      .get(`http://localhost:5000/api/contributor/${username}/resources`)
      .then((res) => {
        const contributorData = res.data.contributor;
        setContributor(contributorData);
        setResources(res.data.resources);
        setLoading(false);

        // ✅ Check persistent ref
        if (!hasLoggedView.current) {
          hasLoggedView.current = true; // ✅ mark as logged
          axios
            .post('http://localhost:5000/api/log/viewContributorProfile', {
              contributorUsername: contributorData.username,
              contributorStatus: contributorData.suspended ? 'suspended' : 'active',
            }, {
              headers: {
                ...getSessionHeaders(),
                'Content-Type': 'application/json',
              },
            })
            .then(() => {
              console.log('✅ Contributor profile view logged');
            })
            .catch((err) => {
              console.warn('⚠️ Failed to log contributor view:', err);
            });
        }
      })
      .catch((err) => {
        console.error('Error fetching contributor:', err);
        setError('Failed to load contributor profile.');
        setLoading(false);
      });
  }, [username]);

  const renderAvatar = (avatar) => {
    if (avatar && /\p{Extended_Pictographic}/u.test(avatar)) {
      return <div className="avatar-emoji">{avatar}</div>;
    }
    return (
      <img
        src={avatar && avatar.startsWith('http') ? avatar : '/src/assets/images/user-icon.jpg'}
        alt="Avatar"
        className="avatar-img"
      />
    );
  };

  if (loading) return <div className="container">Loading...</div>;
  if (error) return <div className="container">{error}</div>;
  if (!contributor) return <div className="container">Contributor not found.</div>;

  return (
    <div className="container">
      <div className="profile-header">
        <div className="avatar-wrapper">{renderAvatar(contributor.avatar)}</div>
        <div className="profile-info">
          <h2>{contributor.name || contributor.username}</h2>
          {contributor.username && <p>@{contributor.username}</p>}
          {contributor.contact && <p>📞 {contributor.contact}</p>}
          {contributor.branch && <p>🎓 Branch: {contributor.branch}</p>}
          {contributor.semester && <p>📚 Semester: {contributor.semester}</p>}
          {contributor.description && <p>📝 {contributor.description}</p>}
          <p>📂 Approved Uploads: {resources.length}</p>
          <p>📦 Total Uploads (including pending): {contributor.uploadCount}</p>
        </div>
      </div>

      <h3>Uploaded Resources</h3>
      <ul className="resource-list">
        {resources.map((res) => (
          <li key={res._id} className="resource-item">
            <div className="resource-header">
              <div className="resource-title">
                {[res.course, res.semester, res.subject, res.type,
                  ...(res.type?.toLowerCase() === 'pyqs' && res.year ? [res.year] : []),
                  ...(Array.isArray(res.unit) ? res.unit : []),
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
