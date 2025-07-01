const mongoose = require('mongoose');

const resourceViewSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  resourceId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Resource',
    required: true
  },
  ipAddress: {
    type: String,
    maxlength: 45 // IPv4/IPv6 support
  },
  userAgent: {
    type: String
  },
  viewedAt: {
    type: Date,
    default: Date.now
  },
  sessionId: {
    type: String,
    maxlength: 255 // For anonymous users
  },
  referrerUrl: {
    type: String
  },
  viewDuration: {
    type: Number // Seconds spent viewing (optional)
  }
});

// Indexes for performance
resourceViewSchema.index({ userId: 1, resourceId: 1 });
resourceViewSchema.index({ resourceId: 1, viewedAt: 1 });
resourceViewSchema.index({ userId: 1, viewedAt: 1 });

// Compound index to prevent duplicate views per day
resourceViewSchema.index({ 
  userId: 1, 
  resourceId: 1, 
  viewedAt: 1 
}, { 
  unique: true,
  partialFilterExpression: {
    viewedAt: {
      $gte: new Date(new Date().setHours(0,0,0,0))
    }
  }
});

// Static methods for common queries
resourceViewSchema.statics.getViewCountByResource = async function(resourceId) {
  return await this.countDocuments({ resourceId });
};

resourceViewSchema.statics.getViewCountByUser = async function(userId) {
  return await this.countDocuments({ userId });
};

resourceViewSchema.statics.getTotalViewsForUserResources = async function(userId) {
  const pipeline = [
    {
      $lookup: {
        from: 'resources',
        localField: 'resourceId',
        foreignField: '_id',
        as: 'resource'
      }
    },
    {
      $unwind: '$resource'
    },
    {
      $match: {
        'resource.uploadedBy': userId
      }
    },
    {
      $count: 'totalViews'
    }
  ];
  
  const result = await this.aggregate(pipeline);
  return result[0]?.totalViews || 0;
};

resourceViewSchema.statics.recordView = async function(viewData) {
  try {
    // Check if view already exists today
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const existingView = await this.findOne({
      userId: viewData.userId,
      resourceId: viewData.resourceId,
      viewedAt: {
        $gte: today,
        $lt: tomorrow
      }
    });
    
    if (existingView) {
      return null; // View already recorded today
    }
    
    return await this.create(viewData);
  } catch (error) {
    throw error;
  }
};

module.exports = mongoose.model('ResourceView', resourceViewSchema);