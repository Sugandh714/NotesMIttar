import React, { useState, useEffect } from 'react';
import { User, Contact, Trophy, Shield, Settings, Lock, Edit3, Save, X } from 'lucide-react';

const ProfilePage = () => {
    const [activeSection, setActiveSection] = useState('personal');
    const [isEditing, setIsEditing] = useState(false);
    const [showPasswordChange, setShowPasswordChange] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [uploadCount, setUploadCount] = useState(0);
    const [userRank, setUserRank] = useState(null);
    const [uploadsNeeded, setUploadsNeeded] = useState(null);
    const [aboveUsername, setAboveUsername] = useState(null);

    // Get auth data from sessionStorage

    const username = sessionStorage.getItem('username');

    // User data state
    const [userData, setUserData] = useState({
        username: '',
        email: '',
        fullName: '',
        avatar: '👨‍🎓',
        description: '',
        semester: '',
        branch: '',
        phone: '',
        dateJoined: '',
        rank: 'Bronze Member',
        points: 0,
        isAdmin: false
    });

    // Temporary edit state
    const [editData, setEditData] = useState({ ...userData });

    // Password change state
    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });

    const avatarOptions = [
        '👩‍🎓', '👨‍🎓', '👩‍💻', '👨‍💻', '🧑', '🧑', '🧑', '👩‍🔬'
    ];

    const branches = ['AIML', 'CSE-AI', 'ECE', 'MECHANICAL'];
    const semesters = Array.from({ length: 8 }, (_, i) => `Semester ${i + 1}`);

    // Fetch user profile data on component mount
    useEffect(() => {
         const fetchUserRank = async () => {
                        try {
                            const res = await fetch(`http://localhost:5000/api/user-rank/${username}`);
                            const data = await res.json();

                            setUploadCount(data.uploadCount);
                            setUserRank(data.rank);
                            setUploadsNeeded(data.uploadsNeededToBeatAbove);
                            setAboveUser(data.aboveUsername);
                        } catch (error) {
                            console.error('Error fetching rank info:', error);
                        }
                    };
        const fetchUserProfile = async () => {
            if (!username) {
                setError('Authentication required');
                return;
            }

            setLoading(true);
            try {
                const response = await fetch('http://localhost:5000/api/user-profile', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'username': username
                    }
                });
               
                if (response.ok) {
                    const data = await response.json();
                    setUserData({
                        username: data.username || username,
                        email: data.email || '',
                        fullName: data.fullName || data.name || '',
                        avatar: data.avatar || '👨‍🎓',
                        description: data.description || '',
                        semester: data.semester || '',
                        branch: data.branch || '',
                        phone: data.phone || '',
                        dateJoined: data.dateJoined || data.createdAt || '',
                        rank: data.rank || 'Bronze Member',
                        points: data.points || 0,
                        isAdmin: data.isAdmin || false
                    });
                    fetchUserRank();


                } else {
                    const errorData = await response.json();
                    setError(errorData.error || 'Failed to fetch profile data');
                }
            } catch (err) {
                console.error('Error fetching profile:', err);
                setError('Network error. Please try again.');
            } finally {
                setLoading(false);
            }
        };

        fetchUserProfile();
    }, [username]);

    // Update editData when userData changes
    useEffect(() => {
        setEditData({ ...userData });
    }, [userData]);

    // Sidebar navigation items
    const sidebarItems = [
        { id: 'personal', label: 'Personal Info', icon: User },
        { id: 'contact', label: 'Contact', icon: Contact },
        { id: 'rank', label: 'Rank & Points', icon: Trophy },
        { id: 'security', label: 'Security', icon: Lock },
        { id: 'settings', label: 'Settings', icon: Settings },
        ...(userData.isAdmin ? [{ id: 'admin', label: 'Admin Dashboard', icon: Shield }] : [])
    ];

    const handleEdit = () => {
        setEditData({ ...userData });
        setIsEditing(true);
        setError('');
    };

    const handleSave = async () => {
        if (!username) {
            setError('Authentication required');
            return;
        }

        setLoading(true);
        setError('');

        try {
            const response = await fetch('http://localhost:5000/api/update-profile', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'username': username
                },
                body: JSON.stringify({
                    avatar: editData.avatar,
                    description: editData.description,
                    semester: editData.semester,
                    branch: editData.branch,
                    phone: editData.phone,
                    email: editData.email,
                    fullName: editData.fullName
                })
            });

            if (response.ok) {
                const data = await response.json();
                setUserData({ ...editData });
                setIsEditing(false);
                alert('✅ Profile updated successfully!');

                // Update sessionStorage if avatar changed
                if (data.user?.avatar) {
                    sessionStorage.setItem('avatar', data.user.avatar);
                }
            } else {
                const errorData = await response.json();
                setError(errorData.error || 'Failed to update profile');
            }
        } catch (err) {
            console.error('Error updating profile:', err);
            setError('Network error. Please try again.');
        } finally {
            setLoading(false);
        }
    };
    const fetchUserRank = async () => {
        try {
            const res = await fetch(`http://localhost:5000/api/user-rank/${username}`);
            const data = await res.json();

            setUploadCount(data.uploadCount);
            setUserRank(data.rank);
            setUploadsNeeded(data.uploadsNeededToBeatAbove);
            setAboveUser(data.aboveUsername);
        } catch (error) {
            console.error('Error fetching rank info:', error);
        }
    };


    const handleCancel = () => {
        setEditData({ ...userData });
        setIsEditing(false);
        setError('');
    };

    const handlePasswordChange = async () => {
        if (!username) {
            setError('Authentication required');
            return;
        }

        if (passwordData.newPassword !== passwordData.confirmPassword) {
            setError("New passwords do not match!");
            return;
        }

        if (passwordData.newPassword.length < 6) {
            setError("New password must be at least 6 characters long!");
            return;
        }

        setLoading(true);
        setError('');

        try {
            const response = await fetch('http://localhost:5000/api/change-password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'username': username
                },
                body: JSON.stringify({
                    currentPassword: passwordData.currentPassword,
                    newPassword: passwordData.newPassword
                })
            });

            if (response.ok) {
                alert('✅ Password changed successfully!');
                setShowPasswordChange(false);
                setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
            } else {
                const errorData = await response.json();
                setError(errorData.error || 'Failed to change password');
            }
        } catch (err) {
            console.error('Error changing password:', err);
            setError('Network error. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const renderPersonalInfo = () => (
        <div className="section-content">
            <div className="section-header">
                <h2 className="section-title">Personal Information</h2>
                <button
                    onClick={isEditing ? handleSave : handleEdit}
                    className="edit-btn"
                    disabled={loading}
                >
                    {loading ? (
                        <>⏳ {isEditing ? 'Saving...' : 'Loading...'}</>
                    ) : (
                        <>
                            {isEditing ? <Save size={16} /> : <Edit3 size={16} />}
                            {isEditing ? 'Save' : 'Edit'}
                        </>
                    )}
                </button>
            </div>

            {error && (
                <div className="error-message">
                    ❌ {error}
                </div>
            )}

            <div className="profile-info">
                <div className="avatar-section">
                    <div className="current-avatar">
                        <span style={{ fontSize: '64px' }}>{userData.avatar}</span>
                    </div>
                    {isEditing && (
                        <div className="avatar-grid">
                            {avatarOptions.map((avatar, index) => (
                                <button
                                    key={index}
                                    className={`avatar-option ${editData.avatar === avatar ? 'selected' : ''}`}
                                    onClick={() => setEditData({ ...editData, avatar })}
                                >
                                    <span style={{ fontSize: '24px' }}>{avatar}</span>
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                <div className="info-grid">
                    <div className="info-item">
                        <label>Full Name</label>
                        {isEditing ? (
                            <input
                                type="text"
                                value={editData.fullName}
                                onChange={(e) => setEditData({ ...editData, fullName: e.target.value })}
                                className="input-field"
                                placeholder="Enter your full name"
                            />
                        ) : (
                            <span className="info-value">{userData.fullName || 'Not provided'}</span>
                        )}
                    </div>

                    <div className="info-item">
                        <label>Username</label>
                        <span className="info-value readonly">{userData.username} <small>(Cannot be changed)</small></span>
                    </div>

                    <div className="info-item">
                        <label>Branch</label>
                        {isEditing ? (
                            <select
                                value={editData.branch}
                                onChange={(e) => setEditData({ ...editData, branch: e.target.value })}
                                className="input-field"
                            >
                                <option value="">Select Branch</option>
                                {branches.map((branch) => (
                                    <option key={branch} value={branch}>{branch}</option>
                                ))}
                            </select>
                        ) : (
                            <span className="info-value">{userData.branch || 'Not selected'}</span>
                        )}
                    </div>

                    <div className="info-item">
                        <label>Semester</label>
                        {isEditing ? (
                            <select
                                value={editData.semester}
                                onChange={(e) => setEditData({ ...editData, semester: e.target.value })}
                                className="input-field"
                            >
                                <option value="">Select Semester</option>
                                {semesters.map((semester) => (
                                    <option key={semester} value={semester}>{semester}</option>
                                ))}
                            </select>
                        ) : (
                            <span className="info-value">{userData.semester || 'Not selected'}</span>
                        )}
                    </div>

                    <div className="info-item full-width">
                        <label>Description</label>
                        {isEditing ? (
                            <textarea
                                value={editData.description}
                                onChange={(e) => setEditData({ ...editData, description: e.target.value })}
                                className="input-field"
                                rows={3}
                                placeholder="Tell us something about yourself..."
                            />
                        ) : (
                            <span className="info-value">{userData.description || 'No description provided'}</span>
                        )}
                    </div>
                </div>

                {isEditing && (
                    <div className="edit-actions">
                        <button onClick={handleCancel} className="cancel-btn" disabled={loading}>
                            <X size={16} />
                            Cancel
                        </button>
                    </div>
                )}
            </div>
        </div>
    );

    const renderContact = () => (
        <div className="section-content">
            <div className="section-header">
                <h2 className="section-title">Contact Information</h2>
                <button
                    onClick={isEditing ? handleSave : handleEdit}
                    className="edit-btn"
                    disabled={loading}
                >
                    {loading ? (
                        <>⏳ {isEditing ? 'Saving...' : 'Loading...'}</>
                    ) : (
                        <>
                            {isEditing ? <Save size={16} /> : <Edit3 size={16} />}
                            {isEditing ? 'Save' : 'Edit'}
                        </>
                    )}
                </button>
            </div>

            {error && (
                <div className="error-message">
                    ❌ {error}
                </div>
            )}

            <div className="info-grid">
                <div className="info-item">
                    <label>Email</label>
                    {isEditing ? (
                        <input
                            type="email"
                            value={editData.email}
                            onChange={(e) => setEditData({ ...editData, email: e.target.value })}
                            className="input-field"
                            placeholder="Enter your email"
                        />
                    ) : (
                        <span className="info-value">{userData.email || 'Not provided'}</span>
                    )}
                </div>
                <div className="info-item">
                    <label>Phone</label>
                    {isEditing ? (
                        <input
                            type="tel"
                            value={editData.phone}
                            onChange={(e) => setEditData({ ...editData, phone: e.target.value })}
                            className="input-field"
                            placeholder="Enter your phone number"
                        />
                    ) : (
                        <span className="info-value">{userData.phone || 'Not provided'}</span>
                    )}
                </div>
                <div className="info-item">
                    <label>Member Since</label>
                    <span className="info-value">
                        {userData.dateJoined ? new Date(userData.dateJoined).toLocaleDateString() : 'Unknown'}
                    </span>
                </div>
            </div>

            {isEditing && (
                <div className="edit-actions">
                    <button onClick={handleCancel} className="cancel-btn" disabled={loading}>
                        <X size={16} />
                        Cancel
                    </button>
                </div>
            )}
        </div>
    );

    const renderRank = () => (
        <div className="section-content">
            <h2 className="section-title">Your Contribution Rank</h2>

            <div className="rank-section">
                <div className="rank-card">
                    <div className="rank-icon">🏆</div>
                    <div className="rank-info">
                        <h3>Rank {userRank ?? '...'}</h3>
                        <p>{uploadCount ?? 0} Uploads</p>
                    </div>
                </div>

                {userRank === 1 ? (
                    <p className="progress-text">
                        🥇 You're already leading! Keep contributing to retain your position.
                    </p>
                ) : (
                    uploadsNeeded !== null && (
                        <p className="progress-text">
                            ⏫ Upload <strong>{uploadsNeeded}</strong> more to surpass the contributor ranked above you.
                        </p>
                    )
                )}
            </div>
        </div>
    );

    const renderSecurity = () => (
        <div className="section-content">
            <h2 className="section-title">Security Settings</h2>

            {error && (
                <div className="error-message">
                    ❌ {error}
                </div>
            )}

            <div className="security-section">
                <button
                    onClick={() => {
                        setShowPasswordChange(!showPasswordChange);
                        setError('');
                        setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
                    }}
                    className="security-btn"
                    disabled={loading}
                >
                    🔒 {showPasswordChange ? 'Cancel Password Change' : 'Change Password'}
                </button>

                {showPasswordChange && (
                    <div className="password-form">
                        <input
                            type="password"
                            placeholder="Current Password"
                            value={passwordData.currentPassword}
                            onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                            className="input-field"
                        />
                        <input
                            type="password"
                            placeholder="New Password (min 6 characters)"
                            value={passwordData.newPassword}
                            onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                            className="input-field"
                        />
                        <input
                            type="password"
                            placeholder="Confirm New Password"
                            value={passwordData.confirmPassword}
                            onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                            className="input-field"
                        />
                        <div className="password-actions">
                            <button
                                onClick={handlePasswordChange}
                                className="save-btn"
                                disabled={loading || !passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword}
                            >
                                {loading ? '⏳ Updating...' : 'Update Password'}
                            </button>
                            <button
                                onClick={() => {
                                    setShowPasswordChange(false);
                                    setError('');
                                    setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
                                }}
                                className="cancel-btn"
                                disabled={loading}
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );

    const renderSettings = () => (
        <div className="section-content">
            <h2 className="section-title">Settings</h2>
            <div className="settings-section">
                <div className="setting-item">
                    <label>Email Notifications</label>
                    <input type="checkbox" defaultChecked />
                </div>
                <div className="setting-item">
                    <label>Dark Mode</label>
                    <input type="checkbox" />
                </div>
                <div className="setting-item">
                    <label>Privacy Mode</label>
                    <input type="checkbox" />
                </div>
            </div>
        </div>
    );

    const renderAdminDashboard = () => (
        <div className="section-content">
            <h2 className="section-title">Admin Dashboard</h2>
            <div className="admin-section">
                <div className="admin-stats">
                    <div className="stat-card">
                        <h3>Total Users</h3>
                        <p className="stat-number">1,234</p>
                    </div>
                    <div className="stat-card">
                        <h3>Active Sessions</h3>
                        <p className="stat-number">89</p>
                    </div>
                    <div className="stat-card">
                        <h3>Reports</h3>
                        <p className="stat-number">12</p>
                    </div>
                </div>
            </div>
        </div>
    );

    const renderContent = () => {
        switch (activeSection) {
            case 'personal':
                return renderPersonalInfo();
            case 'contact':
                return renderContact();
            case 'rank':
                return renderRank();
            case 'security':
                return renderSecurity();
            case 'settings':
                return renderSettings();
            case 'admin':
                return renderAdminDashboard();
            default:
                return renderPersonalInfo();
        }
    };

    return (
        <div className="profile-container">
            <div className="sidebar">
                <div className="sidebar-header">
                    <div className="user-preview">
                        <span className="user-avatar">{userData.avatar}</span>
                        <div className="user-info">
                            <h3>{userData.fullName}</h3>
                            <p>@{userData.username}</p>
                        </div>
                    </div>
                </div>
                <nav className="sidebar-nav">
                    {sidebarItems.map((item) => {
                        const Icon = item.icon;
                        return (
                            <button
                                key={item.id}
                                onClick={() => setActiveSection(item.id)}
                                className={`nav-item ${activeSection === item.id ? 'active' : ''}`}
                            >
                                <Icon size={20} />
                                <span>{item.label}</span>
                            </button>
                        );
                    })}
                </nav>
            </div>

            <div className="main-content">
                {renderContent()}
            </div>

            <style jsx>{`
        .profile-container {
          display: flex;
          min-height: 100vh;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
        }

        .sidebar {
          width: 280px;
          min-width: 280px;
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(10px);
          border-right: 1px solid rgba(255, 255, 255, 0.2);
          display: flex;
          flex-direction: column;
          box-shadow: 2px 0 10px rgba(0, 0, 0, 0.1);
        }

        .sidebar-header {
          padding: 1.5rem;
          border-bottom: 1px solid rgba(0, 0, 0, 0.1);
          background: rgba(255, 255, 255, 0.8);
        }

        .user-preview {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .user-avatar {
          font-size: 3rem;
          width: 60px;
          height: 60px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, #667eea, #764ba2);
          border-radius: 50%;
        }

        .user-info h3 {
          margin: 0;
          font-size: 1.2rem;
          font-weight: 600;
          color: #2d3748;
        }

        .user-info p {
          margin: 0;
          color: #718096;
          font-size: 0.9rem;
        }

        .sidebar-nav {
          flex: 1;
          padding: 1rem;
          display: flex;
          flex-direction: column;
        }

        .nav-item {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: flex-start;
          gap: 0.75rem;
          padding: 1rem;
          border: none;
          background: transparent;
          color: #4a5568;
          font-size: 0.95rem;
          font-weight: 500;
          border-radius: 0.75rem;
          cursor: pointer;
          transition: all 0.3s ease;
          margin-bottom: 0.5rem;
          text-align: left;
          min-height: 48px;
          box-sizing: border-box;
        }

        .nav-item:hover {
          background: rgba(102, 126, 234, 0.1);
          color: #667eea;
          transform: translateX(4px);
        }

        .nav-item.active {
          background: linear-gradient(135deg, #667eea, #764ba2);
          color: white;
          box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
          transform: translateX(4px);
        }

        .nav-item svg {
          flex-shrink: 0;
        }

        .nav-item span {
          flex: 1;
          text-align: left;
        }

        .main-content {
          flex: 1;
          padding: 2rem;
          overflow-y: auto;
        }

        .section-content {
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(10px);
          border-radius: 1rem;
          padding: 2rem;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
        }

        .section-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 2rem;
        }

        .section-title {
          font-size: 1.5rem;
          font-weight: 600;
          color: #2d3748;
          margin: 0;
        }

        .edit-btn {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.5rem 1rem;
          background: linear-gradient(135deg, #667eea, #764ba2);
          color: white;
          border: none;
          border-radius: 0.5rem;
          cursor: pointer;
          font-weight: 500;
          transition: all 0.2s ease;
        }

        .error-message {
          background: #fed7d7;
          color: #c53030;
          padding: 0.75rem 1rem;
          border-radius: 0.5rem;
          margin-bottom: 1rem;
          border: 1px solid #feb2b2;
          font-size: 0.9rem;
        }

        .readonly {
          color: #718096;
          font-style: italic;
        }

        .readonly small {
          color: #a0aec0;
          font-size: 0.8rem;
        }

        .edit-btn:disabled,
        .save-btn:disabled,
        .cancel-btn:disabled,
        .security-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
          transform: none;
        }

        .edit-btn:disabled:hover,
        .save-btn:disabled:hover,
        .cancel-btn:disabled:hover,
        .security-btn:disabled:hover {
          transform: none;
          box-shadow: none;
        }

        .profile-info {
          display: flex;
          flex-direction: column;
          gap: 2rem;
        }

        .avatar-section {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1rem;
        }

        .current-avatar {
          width: 100px;
          height: 100px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, #667eea, #764ba2);
          border-radius: 50%;
          box-shadow: 0 8px 20px rgba(102, 126, 234, 0.3);
        }

        .avatar-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(50px, 1fr));
          gap: 0.5rem;
          max-width: 400px;
        }

        .avatar-option {
          width: 50px;
          height: 50px;
          border: 2px solid transparent;
          border-radius: 50%;
          background: #f7fafc;
          cursor: pointer;
          transition: all 0.2s ease;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .avatar-option:hover {
          transform: scale(1.1);
        }

        .avatar-option.selected {
          border-color: #667eea;
          background: linear-gradient(135deg, #667eea, #764ba2);
        }

        .info-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 1.5rem;
        }

        .info-item {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .info-item.full-width {
          grid-column: 1 / -1;
        }

        .info-item label {
          font-weight: 600;
          color: #4a5568;
          font-size: 0.9rem;
        }

        .info-value {
          color: #2d3748;
          font-size: 1rem;
          padding: 0.75rem 0;
        }

        .input-field {
          padding: 0.75rem;
          border: 2px solid #e2e8f0;
          border-radius: 0.5rem;
          font-size: 1rem;
          transition: border-color 0.2s ease;
        }

        .input-field:focus {
          outline: none;
          border-color: #667eea;
        }

        .edit-actions {
          display: flex;
          justify-content: flex-end;
          gap: 1rem;
        }

        .cancel-btn {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.5rem 1rem;
          background: #e2e8f0;
          color: #4a5568;
          border: none;
          border-radius: 0.5rem;
          cursor: pointer;
          font-weight: 500;
          transition: all 0.2s ease;
        }

        .cancel-btn:hover {
          background: #cbd5e0;
        }

        .rank-section {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1.5rem;
        }

        .rank-card {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 1.5rem;
          background: linear-gradient(135deg, #667eea, #764ba2);
          border-radius: 1rem;
          color: white;
          text-align: center;
        }

        .rank-icon {
          font-size: 3rem;
        }

        .rank-info h3 {
          margin: 0;
          font-size: 1.5rem;
          font-weight: 600;
        }

        .rank-info p {
          margin: 0;
          opacity: 0.9;
        }

        .progress-bar {
          width: 100%;
          height: 8px;
          background: #e2e8f0;
          border-radius: 4px;
          overflow: hidden;
        }

        .progress-fill {
          height: 100%;
          background: linear-gradient(135deg, #667eea, #764ba2);
          transition: width 0.3s ease;
        }

        .progress-text {
          color: #718096;
          font-size: 0.9rem;
        }

        .security-section {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .security-btn {
          align-self: flex-start;
          padding: 0.75rem 1.5rem;
          background: linear-gradient(135deg, #667eea, #764ba2);
          color: white;
          border: none;
          border-radius: 0.5rem;
          cursor: pointer;
          font-weight: 500;
          transition: all 0.2s ease;
        }

        .security-btn:hover {
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
        }

        .password-form {
          display: flex;
          flex-direction: column;
          gap: 1rem;
          max-width: 400px;
        }

        .password-actions {
          display: flex;
          gap: 1rem;
        }

        .save-btn {
          padding: 0.75rem 1.5rem;
          background: linear-gradient(135deg, #48bb78, #38a169);
          color: white;
          border: none;
          border-radius: 0.5rem;
          cursor: pointer;
          font-weight: 500;
          transition: all 0.2s ease;
        }

        .save-btn:hover {
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(72, 187, 120, 0.3);
        }

        .settings-section {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .setting-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1rem;
          background: #f7fafc;
          border-radius: 0.5rem;
        }

        .setting-item label {
          font-weight: 500;
          color: #4a5568;
        }

        .admin-section {
          display: flex;
          flex-direction: column;
          gap: 2rem;
        }

        .admin-stats {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 1.5rem;
        }

        .stat-card {
          padding: 1.5rem;
          background: linear-gradient(135deg, #667eea, #764ba2);
          border-radius: 1rem;
          color: white;
          text-align: center;
        }

        .stat-card h3 {
          margin: 0 0 0.5rem 0;
          font-size: 1rem;
          font-weight: 500;
          opacity: 0.9;
        }

        .stat-number {
          margin: 0;
          font-size: 2rem;
          font-weight: 700;
        }

        @media (max-width: 768px) {
          .profile-container {
            flex-direction: column;
          }

          .sidebar {
            width: 100%;
            min-width: auto;
            position: relative;
            box-shadow: none;
          }

          .sidebar-header {
            padding: 1rem;
          }

          .sidebar-nav {
            display: flex;
            flex-direction: row;
            overflow-x: auto;
            padding: 0.5rem;
            gap: 0.5rem;
          }

          .nav-item {
            white-space: nowrap;
            margin-right: 0;
            margin-bottom: 0;
            min-width: 120px;
            justify-content: center;
            flex-shrink: 0;
          }

          .nav-item:hover {
            transform: translateX(0);
            transform: translateY(-2px);
          }

          .nav-item.active {
            transform: translateX(0);
            transform: translateY(-2px);
          }

          .main-content {
            padding: 1rem;
          }

          .info-grid {
            grid-template-columns: 1fr;
          }

          .admin-stats {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
        </div>
    );
};

export default ProfilePage;