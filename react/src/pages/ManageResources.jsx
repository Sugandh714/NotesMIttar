
import React, { useState } from 'react';
import { ChevronDown, ChevronRight, FileText, User, Calendar, Brain, CheckCircle, XCircle, RefreshCw } from 'lucide-react';
import '../style/ManageResources.css'
import { useEffect } from 'react';
import axios from 'axios';
import Navbar from '../component/Navbar';

const AdminDashboard = () => {
  const [expandedRows, setExpandedRows] = useState({});
  const [pendingDocuments, setPendingDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  // Sample data for pending documents


  const toggleRow = (_id) => {
    setExpandedRows(prev => ({
      ...prev,
      [_id]: !prev[_id]
    }));
  };

  const handleAction = async (action, docId, resourceId = null) => {
    const document = pendingDocuments.find(d => d._id === docId);
    if (!document) return;

    const adminUsername = sessionStorage.getItem('username');
    if (!adminUsername) {
      alert('Admin username not found. Please log in again.');
      return;
    }

    try {
      let url = '';
      let method = 'POST';
      let data = {};

      if (action === 'accept' || action === 'replace') {
        url = `http://localhost:5000/api/admin/approve-resource/${docId}`;
        data = action === 'replace' ? { replaceResourceId: resourceId } : {};
      } else if (action === 'reject') {
          url = `http://localhost:5000/api/admin/reject-resource/${docId}`;
          data = {
            reason: prompt('Enter rejection reason (optional):') || 'No reason provided'
          };
      }

      await axios.post(url, data, {
        headers: {
          'session-id': sessionStorage.getItem('sessionID'),
    'userid': sessionStorage.getItem('userId'),
    'username': sessionStorage.getItem('username'),
    'role': sessionStorage.getItem('isAdmin') === 'true' ? 'admin' : 'user'
        }
      });

      let message = '';
      if (action === 'accept') {
        message = 'Resource approved successfully!';
      } else if (action === 'reject') {
        message = 'Resource rejected successfully!';
      } else if (action === 'replace') {
        message = 'Resource approved and replaced existing resource!';
      }

      alert(message);

      setPendingDocuments(prev => prev.filter(doc => doc._id !== docId));
    } catch (error) {
      console.error(`Failed to ${action} resource:`, error);
      alert(`Error: ${error.response?.data?.error || 'Something went wrong'}`);
    }
  };


  const getStatusBadge = (status) => {
    const statusStyles = {
      pending: 'bg-orange-100 text-orange-800 border-orange-200',
      approved: 'bg-green-100 text-green-800 border-green-200',
      rejected: 'bg-red-100 text-red-800 border-red-200'
    };

    return (
      <span className={`px-3 py-1 rounded-full text-sm font-medium border ${statusStyles[status]}`}>
        {status}
      </span>
    );
  };

  const getScoreColor = (score) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 75) return 'text-yellow-600';
    return 'text-red-600';
  };
  useEffect(() => {
    console.log('🧑‍💻 Admin username from session:', sessionStorage.getItem('username'));

    const fetchPendingResources = async () => {
      const adminUsername = sessionStorage.getItem('username');
      if (!adminUsername) {
        console.error('⚠️ Admin username not found in sessionStorage');
        return;
      }

      try {
        const res = await axios.get('http://localhost:5000/api/admin/pending-resources', {
          headers: { username: adminUsername }
        });
        console.log('✅ Pending resources:', res.data);
        setPendingDocuments(res.data);
      } catch (error) {
        console.error('❌ Error fetching resources:', error.response?.data || error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPendingResources();
  }, []);

  return (
    <>
    <Navbar />

    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 rounded-lg shadow-lg mb-8">
        <div className="flex items-center gap-3">
          <FileText size={32} />
          <h1 className="text-3xl font-bold">Resource Management Dashboard</h1>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="text-left p-4 font-semibold text-gray-700">File Name</th>
                <th className="text-left p-4 font-semibold text-gray-700">Uploaded By</th>
                <th className="text-left p-4 font-semibold text-gray-700">Uploaded At</th>
                <th className="text-left p-4 font-semibold text-gray-700">AI Report</th>
                <th className="text-left p-4 font-semibold text-gray-700">Status</th>
                <th className="text-left p-4 font-semibold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {pendingDocuments.map((doc) => (
                <React.Fragment key={doc._id}>
                  <tr className="border-b hover:bg-gray-50">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => toggleRow(doc._id)}
                          className="text-gray-500 hover:text-gray-700 transition-colors"
                        >
                          {expandedRows[doc._id] ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                        </button>
                        <div>
                          <div className="font-medium text-gray-900">{doc.filename}</div>
                          <div className="text-sm text-gray-500">
                            {doc.course} • {doc.year} • {doc.subject}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <User size={16} className="text-gray-400" />
                        <span className="text-gray-900">
                          {doc.uploadedBy?.name || doc.uploadedBy?.username || 'Unknown'}
                        </span>
                      </div>
                    </td>

                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <Calendar size={16} className="text-gray-400" />
                        <span className="text-gray-900">
                          {doc.uploadedAt ? new Date(doc.uploadedAt).toLocaleString() : 'Unknown'}
                        </span>


                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <Brain size={16} className="text-gray-400" />
                        <div>
                          <div className="font-semibold text-green-600">92% Relevance</div>
                          <div className="text-sm text-gray-600">
                            Database Normalization, ACID Properties...
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      {getStatusBadge(doc.status)}
                    </td>
                    <td className="p-4">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleAction('accept', doc._id)}
                          className="flex items-center gap-1 px-3 py-1 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors text-sm"
                        >
                          <CheckCircle size={14} />
                          Accept
                        </button>
                        <button
                          onClick={() => handleAction('reject', doc._id)}
                          className="flex items-center gap-1 px-3 py-1 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors text-sm"
                        >
                          <XCircle size={14} />
                          Reject
                        </button>
                      </div>
                    </td>
                  </tr>

                  {expandedRows[doc._id] && (
                    <tr>
                      <td colSpan="6" className="p-0 bg-gray-50">
                        <div className="p-6 border-l-4 border-blue-500">
                          <h3 className="text-lg font-semibold text-gray-800 mb-4">
                            Existing Resources for {doc.subject} ({doc.year}, {doc.semester})
                          </h3>

                          {doc.existingResources.length > 0 ? (
                            <div className="space-y-3">
                              {doc.existingResources.map((resource) => (
                                <div key={resource._id} className="bg-white p-4 rounded-lg border">
                                  <div className="grid grid-cols-6 gap-4 items-center">
                                    <div>
                                      <div className="font-medium text-gray-900">
                                        {resource.filename || 'Untitled'}

                                      </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                      <User size={14} className="text-gray-400" />
                                      <span className="text-sm text-gray-600">
                                        {resource.uploadedBy?.name || resource.uploadedBy?.username || 'Unknown'}
                                      </span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                      <Calendar size={14} className="text-gray-400" />
                                      <span className="text-sm text-gray-600">
                                        {resource.uploadedAt ? new Date(resource.uploadedAt).toLocaleString() : 'Unknown'}
                                      </span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                      <Brain size={14} className="text-gray-400" />
                                      <div>
                                        <div className="text-sm font-semibold text-yellow-600">88%</div>
                                        <div className="text-xs text-gray-500">Basic SQL, ER Diagrams</div>
                                      </div>
                                    </div>
                                    <div>
                                      {getStatusBadge(resource.status)}
                                    </div>
                                    <div>
                                      <button
                                        onClick={() => handleAction('replace', doc._id, resource._id)}
                                        className="flex items-center gap-1 px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm"
                                      >
                                        <RefreshCw size={14} />
                                        Replace
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              ))}

                            </div>
                          ) : (
                            <div className="text-center py-8 text-gray-500">
                              <FileText size={48} className="mx-auto mb-4 text-gray-300" />
                              <p>No existing resources found for this subject</p>
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
        </>
  );
};

export default AdminDashboard;