
// Update your User model (models/user.js) to include these fields:

const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  username: {
    type: String,
    required: true,
    unique: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  uploadCount: {
    type: Number,
    default: 0
  },
  isAdmin: {
    type: Boolean,
    default: false
  },
  contact: {
    type: String,
    default: ''
  },
  avatar: {
    type: String,
    default: null
  },
  branch: {
    type: String,
    default: ''
  },
  semester: {
    type: String,
    default: ''
  },
  description: {
    type: String,
    default: ''
  },
  registeredAt: {
    type: Date,
    default: Date.now
  },
  status: {
    type: String,
    enum: ['active', 'suspended'],
    default: 'active'
  },
  suspensionReason: {
  type: String,
  default: ''
},

 

  

}, {
  timestamps: true,  // includes createdAt and updatedAt
  versionKey: false  // disables __v field
});

module.exports = mongoose.model('User', userSchema);