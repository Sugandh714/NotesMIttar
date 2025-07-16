const mongoose = require('mongoose');

const ActionSchema = new mongoose.Schema({
  timestamp: { type: Date, default: Date.now },
  details: mongoose.Schema.Types.Mixed
}, { _id: false });

const SessionLogSchema = new mongoose.Schema({
  sessionID: { type: String, required: true, unique: true },
  sessionUsername: { type: String, required: true },
  sessionUserID: { type: String, required: true },
  sessionRole: { type: String, enum: ['user', 'admin'], required: true },
  sessionTimestamp: { type: Date, required: true },

  // Categorized logs
  viewResources: [ActionSchema],
  uploadResources: [ActionSchema],
  manageContributor: [ActionSchema],
  manageResources: [ActionSchema]
});

module.exports = mongoose.model('SessionLog', SessionLogSchema);
