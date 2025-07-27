import '../style/admin.css';
import React, { useState, useEffect } from 'react';
import '../style/ManageResources.css'; // Assuming you have a CSS file for styling
import { Navigate, Link } from 'react-router-dom';
import Navbar from '../component/Navbar';
import axios from 'axios';

function AdminHome() {
  const isAdmin = sessionStorage.getItem('isAdmin') === 'true';
  const [showModal, setShowModal] = useState(false);
  const [threshold, setThreshold] = useState(80);
  const [saving, setSaving] = useState(false);
  if (!isAdmin) {
    return <Navigate to="/login" />;
  }
  useEffect(() => {
    const fetchThreshold = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/admin/config/relevance-threshold');
        setThreshold(res.data.value || 80);
      } catch (err) {
        console.error('Failed to fetch threshold:', err);
      }
    };
    fetchThreshold();
  }, []);

  if (!isAdmin) {
    return <Navigate to="/login" />;
  }

  const handleSave = async () => {
    setSaving(true);
    try {
      await axios.post('http://localhost:5000/api/admin/config/relevance-threshold', {
        value: Number(threshold)
      });
      alert('✅ Relevance threshold updated successfully!');
      setShowModal(false);
    } catch (err) {
      alert('❌ Failed to update threshold');
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="admin-container">
        <div className="admin-header" style={{ position: 'relative' }}>
          <h1>📊 Admin Dashboard</h1>
          <p className="admin-subtitle">Welcome, Admin! Manage contributors, resources, and requests below.</p>
          <button
            className="set-threshold-btn"
            style={{
              position: 'absolute',
              right: '0',
              top: '10px',
              padding: '8px 16px',
              backgroundColor: '#4f46e5',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
              fontSize: '14px'
            }}
            onClick={() => setShowModal(true)}
          >
            ⚙️ Set Relevance Threshold
          </button>
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
          <Link to="/admin/check-sessions" className="admin-card">
            <h3>🧾 Check Sessions</h3>
            <p>View all session-wise activity recorded on blockchain.</p>
          </Link>
          {showModal && (
            <div className="modal-overlay" style={{
              position: 'fixed',
              top: 0, left: 0, right: 0, bottom: 0,
              backgroundColor: 'rgba(0,0,0,0.4)',
              display: 'flex', justifyContent: 'center', alignItems: 'center',
              zIndex: 999
            }}>
              <div style={{
                background: 'white',
                padding: '2rem',
                borderRadius: '8px',
                width: '400px',
                maxWidth: '90%',
                boxShadow: '0 0 10px rgba(0,0,0,0.25)'
              }}>
                <h2 style={{ marginBottom: '1rem', fontSize: '1.25rem' }}>🛠️ Set Minimum Relevance Score</h2>

                <div style={{ marginBottom: '1rem' }}>
                  <input
                    type="range"
                    min={0}
                    max={100}
                    value={threshold}
                    onChange={(e) => setThreshold(Number(e.target.value))}
                    style={{ width: '100%' }}
                  />
                  <p style={{ textAlign: 'center', fontSize: '18px', marginTop: '8px' }}>
                    Threshold: <strong>{threshold}%</strong>
                  </p>
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
                  <button
                    onClick={() => setShowModal(false)}
                    style={{
                      backgroundColor: '#ccc',
                      padding: '8px 14px',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer'
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={saving}
                    style={{
                      backgroundColor: '#4f46e5',
                      color: 'white',
                      padding: '8px 14px',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer'
                    }}
                  >
                    {saving ? 'Saving...' : 'Save'}
                  </button>
                </div>
              </div>
            </div>
          )}


        </div>
      </div>
    </>
  );
}

export default AdminHome;