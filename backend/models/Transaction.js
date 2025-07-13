
// models/Transaction.js
const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  type: {
    type: String,
    required: true,
    enum: ['approval', 'rejection', 'resourceRemoval', 'docExtendOrReplace', 'contributorAction']
  },

  // Contributor management
  contributorUsername: String,

  // Contributor reason or resource rejection/removal reason
  reason: String,

  // Contributor actions: suspend, activate, remove
  adminDecision: {
    type: String,
    enum: ['approve', 'reject', 'replace', 'remove', 'suspend', 'activate'],
    required: true
  },

  // Resources (common)
  resourceId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Resource'
  },
  filename: String,
  course: String,
  semester: String,
  subject: String,
  resourceType: String,

  // Resource Extension or Replacement
  oldDocument: {
    fileHash: String,
    filename: String,
    contributor: String,
    relevanceScore: Number,
    syllabusTopics: [String],
    resourceId: mongoose.Schema.Types.ObjectId
  },
  newDocument: {
    fileHash: String,
    filename: String,
    contributor: String,
    relevanceScore: Number,
    syllabusTopics: [String],
    unit: String,
    course: String,
    semester: String,
    resourceId: mongoose.Schema.Types.ObjectId
  },

  // Resource Removal
  docFileHash: String,
  contributor: String,

  // Admin
  adminId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },

  timestamp: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Transaction', transactionSchema);