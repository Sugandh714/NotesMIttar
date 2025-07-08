// models/Transaction.js
const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  type: {
    type: String,
    required: true,
    enum: ['docExtendOrReplace', 'resourceRemoval', 'approval', 'rejection']
  },
  
  // For docExtendOrReplace type
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
  
  // For resourceRemoval type
  docFileHash: String,
  contributor: String,
  reason: String,
  
  // Common fields
  adminId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  adminDecision: {
    type: String,
    enum: ['approve', 'reject', 'replace', 'remove'],
    required: true
  },
  
  // Resource being acted upon
  resourceId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Resource',
    required: true
  },
  
  // Additional metadata
  filename: String,
  course: String,
  semester: String,
  subject: String,
  resourceType: String,
  
  timestamp: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Indexes for better query performance
transactionSchema.index({ type: 1, timestamp: -1 });
transactionSchema.index({ adminId: 1, timestamp: -1 });
transactionSchema.index({ resourceId: 1 });

module.exports = mongoose.model('Transaction', transactionSchema);