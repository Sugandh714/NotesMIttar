import React from 'react';
import '../style/admin.css';
function ReplaceExtendRequests() {
  const requests = [
    {
      id: 1,
      contributor: 'Priya',
      reason: 'Replace outdated notes',
      status: 'pending'
    },
    {
      id: 2,
      contributor: 'Aman',
      reason: 'Extend with extra topics',
      status: 'pending'
    }
  ];

  return (
    <div className="admin-container">
      <h1 className="admin-header">🔁 Replace / Extend Requests</h1>

      <table className="admin-table">
        <thead>
          <tr>
            <th>Contributor</th>
            <th>Reason</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {requests.map((req) => (
            <tr key={req.id}>
              <td>{req.contributor}</td>
              <td>{req.reason}</td>
              <td className={`status-${req.status}`}>{req.status}</td>
              <td>
                <button className="admin-button">Approve</button>
                &nbsp;
                <button className="admin-button">Reject</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ReplaceExtendRequests;