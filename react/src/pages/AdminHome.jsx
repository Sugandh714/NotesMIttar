import React from 'react';
import '../style/admin.css';
import { Navigate, Link } from 'react-router-dom';

function AdminHome() {
    const isAdmin = sessionStorage.getItem('isAdmin') === 'true';

if (!isAdmin) {
  return <Navigate to="/login" />;
}

  return (
    <div className="admin-container">
      <div className="admin-header">
        <h1>📊 Admin Dashboard</h1>
        <p className="admin-subtitle">Welcome, Admin! Manage contributors, resources, and requests below.</p>
      </div>

      <div className="admin-grid">
        <Link to="/admin/manage-contributors" className="admin-card">
          <h3>👥 Manage Contributors</h3>
          <p>View, suspend, or monitor all contributors on the platform.</p>
        </Link>

        <Link to="/admin/manage-resources" className="admin-card">
          <h3>📚 Manage Resources</h3>
          <p>Approve, reject, or review uploaded study materials.</p>
        </Link>

        <Link to="/admin/replace-extend-requests" className="admin-card">
          <h3>🔁 Replace/Extend Requests</h3>
          <p>Handle requests to replace or extend previously uploaded content.</p>
        </Link>
      </div>
    </div>
  );
}

export default AdminHome;