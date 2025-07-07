const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: String,
  username: {
    type: String,
    required: true,
    unique: true // ✅ enforce uniqueness
  },
  email: String,
  password: String,
  isAdmin: {
  type: Boolean,
  default: false
},
 // stored as a hash ideally
  uploadCount: { type: Number, default: 0 },
  registeredAt: { type: Date, default: Date.now }
}, { versionKey: false });

module.exports = mongoose.model('user', userSchema);
