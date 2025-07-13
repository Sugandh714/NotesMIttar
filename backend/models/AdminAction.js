
const mongoose = require('mongoose');

const adminActionSchema = new mongoose.Schema({
  adminUsername: {
    type: String,
    required: true
  },
  targetUsername: {
    type: String,
    required: true
  },
  actionType: {
    type: String,
    enum: ['suspend', 'activate'],
    required: true
  },
  reason: {
    type: String,
    default: ''
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
}, {
  collection: 'adminactions' // Optional but makes the collection name consistent
});

module.exports = mongoose.model('AdminAction', adminActionSchema);