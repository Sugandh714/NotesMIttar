

import React, { useEffect, useState } from 'react';
import '../style/Admin.css';
import axios from 'axios';
import Navbar from '../component/Navbar';

function ManageContributor() {
  const [contributors, setContributors] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchContributors = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/admin/contributors', {
       headers: {
  'session-id': sessionStorage.getItem('sessionID'),
  'userid': sessionStorage.getItem('userId'),
  'username': sessionStorage.getItem('username'),
  'role': sessionStorage.getItem('isAdmin') === 'true' ? 'admin' : 'user',
  'Content-Type': 'application/json'
}

      });
      setContributors(res.data || []);
    } catch (err) {
      console.error('Error fetching contributors:', err);
    } finally {
      setLoading(false);
    }
  };

  const toggleSuspend = async (username) => {
    let reason = '';
    const user = contributors.find(u => u.username === username);
    const isSuspending = user.status === 'active';

    if (isSuspending) {
      reason = prompt(`Why are you suspending ${username}?`);
      if (!reason) return alert("Suspension reason is required.");
    }

    try {
      const res = await axios.post('http://localhost:5000/api/admin/contributor/suspend', {
        username,
        reason: reason || ''
      }, {
      headers: {
  'session-id': sessionStorage.getItem('sessionID'),
  'userid': sessionStorage.getItem('userId'),
  'username': sessionStorage.getItem('username'),
  'role': sessionStorage.getItem('isAdmin') === 'true' ? 'admin' : 'user',
  'Content-Type': 'application/json'
}

      });

      alert(`User ${username} ${res.data.user.status === 'suspended' ? 'suspended' : 're-activated'} successfully.`);
      fetchContributors();
    } catch (err) {
      console.error('Error suspending user:', err);
      alert('An error occurred while updating user status.');
    }
  };

  useEffect(() => {
    fetchContributors();
  }, []);

  if (loading) return <div>Loading contributors...</div>;

  return (
    <>
    <Navbar />
   
    <div className="admin-container">
      <h1 className="admin-header">👥 Manage Contributors</h1>
      <table className="admin-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Username</th>
            <th>Uploads</th>
            <th>Status</th>
            <th>Action</th>
            <th>Reason</th>
          </tr>
        </thead>
        <tbody>
          {contributors.map((contributor, index) => (
            <tr key={index}>
              <td>{contributor.name}</td>
              <td>
                <a href={`/contributor/${contributor.username}`} className="clickable-link">
                  {contributor.username}
                </a>
              </td>
              <td>{contributor.uploadCount}</td>
              <td className={`status-${contributor.status}`}>{contributor.status}</td>
              <td>
                <button
                  className="admin-button"
                  onClick={() => toggleSuspend(contributor.username)}
                >
                  {contributor.status === 'active' ? 'Suspend' : 'Activate'}
                </button>
              </td>
              <td>
                {contributor.status === 'suspended' && contributor.suspensionReason
                  ? <span style={{ color: 'red' }}>{contributor.suspensionReason}</span>
                  : '-'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
     </>
  );
}

export default ManageContributor;