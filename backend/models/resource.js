const mongoose = require('mongoose');

const resourceSchema = new mongoose.Schema({
  filename: String,
  course: String,
  semester: Number,
  subject: String,
  unit: Number,
  year: Number,
  status: { type: String, enum: ['approved', 'pending'], default: 'pending' },
  views: { type: Number, default: 0 },
  rating: { type: Number, default: 0 },
  uploadedBy: String,
  uploadedAt: { type: Date, default: Date.now }
}, { versionKey: false });

module.exports = mongoose.model('resource', resourceSchema);
