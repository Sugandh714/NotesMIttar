const mongoose = require('mongoose');

const ContactMessageSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: [true, 'Name is required'],
    trim: true,
    maxlength: [100, 'Name cannot exceed 100 characters']
  },
  email: { 
    type: String, 
    required: [true, 'Email is required'],
    trim: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  message: { 
    type: String, 
    required: [true, 'Message is required'],
    trim: true,
    minlength: [10, 'Message must be at least 10 characters long'],
    maxlength: [1000, 'Message cannot exceed 1000 characters']
  },
  submittedAt: { 
    type: Date, 
    default: Date.now 
  },
  // Add optional fields for better tracking
  status: {
    type: String,
    enum: ['new', 'read', 'replied'],
    default: 'new'
  },
  ipAddress: {
    type: String,
    default: null
  }
}, {
  timestamps: true // This will add createdAt and updatedAt automatically
});

// Add indexes for better performance
ContactMessageSchema.index({ submittedAt: -1 });
ContactMessageSchema.index({ email: 1 });
ContactMessageSchema.index({ status: 1 });

// Add a method to format the message for email
ContactMessageSchema.methods.toEmailFormat = function() {
  return `
    Name: ${this.name}
    Email: ${this.email}
    Submitted: ${this.submittedAt.toLocaleString()}
    
    Message:
    ${this.message}
  `;
};

module.exports = mongoose.model('ContactMessage', ContactMessageSchema);