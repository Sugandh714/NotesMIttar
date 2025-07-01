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
    required: function() {
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
  viewCount: {
    type: Number,
    default: 0
  }
});

// Index for faster queries
resourceSchema.index({ course: 1, semester: 1, subject: 1, type: 1 });
resourceSchema.index({ uploadedBy: 1 });
resourceSchema.index({ status: 1 });
resourceSchema.index({ downloadCount: -1 }); // For popular resources
resourceSchema.index({ viewCount: -1 }); // For popular resources

// Virtual for total engagement score
resourceSchema.virtual('engagementScore').get(function() {
  // Weight downloads more than views (downloads = 2 points, views = 1 point)
  return (this.downloadCount * 2) + (this.viewCount * 1);
});

// Static method to get popular resources
resourceSchema.statics.getPopularResources = function(limit = 10) {
  return this.find({ status: 'approved' })
    .sort({ downloadCount: -1, viewCount: -1 })
    .limit(limit);
};

// Static method to get trending resources (high engagement in recent period)
resourceSchema.statics.getTrendingResources = function(days = 7, limit = 10) {
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - days);
  
  return this.find({ 
    status: 'approved',
    uploadDate: { $gte: cutoffDate }
  })
  .sort({ downloadCount: -1, viewCount: -1 })
  .limit(limit);
};

module.exports = mongoose.model('Resource', resourceSchema);