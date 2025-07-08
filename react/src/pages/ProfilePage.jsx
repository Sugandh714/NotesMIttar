
import React, { useState, useEffect } from 'react';
import '../style/ProfilePage.css';

const avatarOptions = [
  '👩‍🎓', '👨‍🎓', '👩‍💻', '👨‍💻', '🧑‍🔬', '🧑‍🏫', '🧑‍🚀', '👩‍🔬'
];

const branches = ['AIML', 'CSE-AI', 'ECE', 'MECHANICAL'];
const semesters = Array.from({ length: 8 }, (_, i) => `Semester ${i + 1}`);

const ProfilePage = () => {
  const [selectedAvatar, setSelectedAvatar] = useState('');
  const [description, setDescription] = useState('');
  const [semester, setSemester] = useState('');
  const [branch, setBranch] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPasswordChange, setShowPasswordChange] = useState(false);

  const token = sessionStorage.getItem('token');
  const username = sessionStorage.getItem('username');

  // Optional: fetch existing profile data if you want to pre-fill fields
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/user-profile', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
            'username': username
          }
        });

        if (res.ok) {
          const data = await res.json();
          setSelectedAvatar(data.avatar || '');
          setDescription(data.description || '');
          setSemester(data.semester || '');
          setBranch(data.branch || '');
        }
      } catch (err) {
        console.error('Error fetching profile:', err);
      }
    };

    if (token && username) {
      fetchProfile();
    }
  }, [token, username]);

  const handleProfileUpdate = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/update-profile', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'username': username
        },
        body: JSON.stringify({
          avatar: selectedAvatar,
          description,
          semester,
          branch
        })
      });

      const data = await res.json();

      if (res.ok) {
        alert('✅ Profile updated successfully!');
        // Optionally update sessionStorage if avatar changed:
        sessionStorage.setItem('avatar', data.user.avatar || '');
      } else {
        alert('❌ Failed to update profile: ' + (data.error || 'Unknown error'));
      }
    } catch (err) {
      console.error('Error updating profile:', err);
      alert('❌ Error updating profile. Check console for details.');
    }
  };

  const handlePasswordChange = async () => {
    if (newPassword !== confirmPassword) {
      alert("❌ New passwords do not match!");
      return;
    }

    try {
      const res = await fetch('http://localhost:5000/api/change-password', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'username': username
        },
        body: JSON.stringify({
          currentPassword,
          newPassword
        })
      });

      const data = await res.json();

      if (res.ok) {
        alert('✅ Password changed successfully!');
        setShowPasswordChange(false);
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      } else {
        alert('❌ Failed to change password: ' + (data.error || 'Unknown error'));
      }
    } catch (err) {
      console.error('Error changing password:', err);
      alert('❌ Error changing password. Check console.');
    }
  };

  return (
    <div className="profile-page-container">
      <div className="profile-card">
        <h2 className="profile-title">User Profile</h2>
        
        <div className="section">
          <h3 className="section-title">Select Avatar</h3>
          <div className="avatar-grid">
            {avatarOptions.map((avatar, index) => (
              <button
                key={index}
                className={`avatar-option ${selectedAvatar === avatar ? 'selected' : ''}`}
                onClick={() => setSelectedAvatar(avatar)}
              >
                <span style={{ fontSize: '32px' }}>{avatar}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="section">
          <label className="profile-label">Description (optional):</label>
          <textarea
            className="profile-textarea"
            placeholder="Tell us something about yourself..."
            value={description}
            onChange={e => setDescription(e.target.value)}
            rows={4}
          />
        </div>

        <div className="flex-row">
          <div className="half-width">
            <label className="profile-label">Semester (optional):</label>
            <select className="profile-input" value={semester} onChange={e => setSemester(e.target.value)}>
              <option value="">Select Semester</option>
              {semesters.map((sem, idx) => (
                <option key={idx} value={sem}>{sem}</option>
              ))}
            </select>
          </div>

          <div className="half-width">
            <label className="profile-label">Branch (optional):</label>
            <select className="profile-input" value={branch} onChange={e => setBranch(e.target.value)}>
              <option value="">Select Branch</option>
              {branches.map((b, idx) => (
                <option key={idx} value={b}>{b}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="button-group">
          <button className="primary-button" onClick={handleProfileUpdate}>
            💾 Save Profile
          </button>
          
          <button 
            className="secondary-button" 
            onClick={() => setShowPasswordChange(!showPasswordChange)}
          >
            🔒 Change Password
          </button>
        </div>

        {showPasswordChange && (
          <div className="password-section">
            <h3 className="section-title">Change Password</h3>
            <div className="password-form">
              <input
                type="password"
                className="profile-input"
                placeholder="Current Password"
                value={currentPassword}
                onChange={e => setCurrentPassword(e.target.value)}
              />
              <input
                type="password"
                className="profile-input"
                placeholder="New Password"
                value={newPassword}
                onChange={e => setNewPassword(e.target.value)}
              />
              <input
                type="password"
                className="profile-input"
                placeholder="Confirm New Password"
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
              />
              <div className="password-buttons">
                <button className="primary-button" onClick={handlePasswordChange}>
                  ✅ Update Password
                </button>
                <button 
                  className="cancel-button" 
                  onClick={() => setShowPasswordChange(false)}
                >
                  ❌ Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;