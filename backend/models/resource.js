const mongoose = require('mongoose');

const resourceSchema = new mongoose.Schema({
  filename: {
    type: String,
    required: true
  },
  fileId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  course: {
    type: String,
    required: true,
    enum: ['CSE', 'AIML', 'ECE', 'EEE', 'ME', 'IT']
  },
  semester: {
    type: String,
    required: true,
    enum: ['Sem 1', 'Sem 2', 'Sem 3', 'Sem 4', 'Sem 5', 'Sem 6', 'Sem 7', 'Sem 8']
  },
  subject: {
    type: String,
    required: true
  },
  type: {
    type: String,
    required: true,
    enum: ['Notes', 'PYQs', 'Books']
  },
  unit: [{
    type: String
  }],
  year: {
    type: Number,
    required: function () {
      return this.type === 'PYQs';
    }
  },
  status: {
    type: String,
    enum: ['approved', 'pending', 'rejected'],
    default: 'pending'
  },
  uploadedBy: {
    type: String,
    required: true
  },
  uploadDate: {
    type: Date,
    default: Date.now
  },
  downloadCount: {
    type: Number,
    default: 0
  },

  // ✅ NEW FIELDS for AI Relevance Data
  relevanceScore: {
    type: Number,
    default: null
  },
  topicCoverage: {
    type: [mongoose.Schema.Types.Mixed],
    default: []
  },
  coverageAnalysis: {
    type: mongoose.Schema.Types.Mixed,
    default: null
  }
});

// Indexes
resourceSchema.index({ course: 1, semester: 1, subject: 1, type: 1 });
resourceSchema.index({ uploadedBy: 1 });
resourceSchema.index({ status: 1 });

module.exports = mongoose.model('Resource', resourceSchema);
