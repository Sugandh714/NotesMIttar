import React from 'react';
import '../style/admin.css';

function ManageContributor() {
  
  const contributors = [
    { name: 'Priya', username: 'p', uploads: 10, badge: 'Silver', status: 'active' },
    { name: 'Rahul', username: 'rahul123', uploads: 2, badge: 'Newbie', status: 'inactive' },
  ];

  return (
    <div className="admin-container">
      <h1 className="admin-header">👥 Manage Contributors</h1>

      <table className="admin-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Username</th>
            <th>Uploads</th>
            <th>Badge</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {contributors.map((contributor, index) => (
            <tr key={index}>
              <td>{contributor.name}</td>
              <td>{contributor.username}</td>
              <td>{contributor.uploads}</td>
              <td>{contributor.badge}</td>
              <td>{contributor.status}</td>
              <td>
                <button className="admin-button">Suspend</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ManageContributor;