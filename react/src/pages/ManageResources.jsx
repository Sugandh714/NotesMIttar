import React from 'react';
import '../style/admin.css';

function ManageResources() {
  const resources = [
    { filename: 'DBMS Notes', subject: 'DBMS', status: 'approved' },
    { filename: 'OS Notes', subject: 'OS', status: 'pending' },
  ];

  return (
    <div className="admin-container">
      <h1 className="admin-header">📚 Manage Resources</h1>

      <table className="admin-table">
        <thead>
          <tr>
            <th>Filename</th>
            <th>Subject</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {resources.map((res, index) => (
            <tr key={index}>
              <td>{res.filename}</td>
              <td>{res.subject}</td>
              <td className={`status-${res.status}`}>{res.status}</td>
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

export default ManageResources;