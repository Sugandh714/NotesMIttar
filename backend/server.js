const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({ origin: 'http://localhost:5173', credentials: true }));
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('✅ MongoDB Connected'))
.catch(err => console.error('❌ MongoDB Error:', err));

// Mongoose User Schema
const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String
});
const User = mongoose.model('User', userSchema);

// Setup multer storage for PDFs
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});
const upload = multer({ storage });

// Register Route
app.post('/api/register', async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ message: 'User already exists' });

    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashed });
    res.status(201).json({ message: 'User created', userId: user._id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Login Route
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Try finding user by either email or name
    const user = await User.findOne({
      $or: [{ email: email }, { name: email }] // 👈 login with username or email
    });

    if (!user) return res.status(400).json({ message: 'Invalid email/username or password' });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ message: 'Invalid email/username or password' });

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET || 'secret123', { expiresIn: '1h' });
    res.json({ message: 'Login successful', token });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Resource schema
const resourceSchema = new mongoose.Schema({
  title: String,
  fileUrl: String,
  type: String,
  semester: String,
  course: String,
  subject: String,
  unit: [String],
  year: String,
  uploadedBy: String,
  status: { type: String, enum: ['approved', 'pending'], default: 'approved' },
  uploadedAt: { type: Date, default: Date.now }
});
const Resource = mongoose.model('Resource', resourceSchema);
const authenticate = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ message: 'No token provided' });

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret123');
    const user = await User.findById(decoded.userId);
    if (!user) return res.status(401).json({ message: 'Invalid token' });

    req.user = user; // Attach user info to the request
    next();
  } catch (err) {
    res.status(401).json({ message: 'Invalid or expired token' });
  }
};

// Upload route
app.post('/api/upload', authenticate, upload.single('pdf'), async (req, res) => {
  try {
    const {
      type,
      semester,
      course,
      subject,
      unit,
      year
    } = req.body;

    const file = req.file;
    if (!file) return res.status(400).json({ message: 'No PDF uploaded' });

    const unitArray = Array.isArray(unit) ? unit : [unit];

    const existingCount = await Resource.countDocuments({
      course,
      semester,
      subject,
      unit: { $in: unitArray },
      status: 'approved'
    });

    const resource = new Resource({
      title: file.originalname,
      fileUrl: `/uploads/${file.filename}`,
      type,
      semester,
      course,
      subject,
      unit: unitArray,
      year,
      uploadedBy: req.user.name, // 👈 Use name from logged-in user
      status: existingCount >= 2 ? 'pending' : 'approved'
    });

    await resource.save();

    res.status(200).json({
      message: resource.status === 'approved'
        ? 'Upload successful!'
        : 'Upload pending admin approval.',
      status: resource.status
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
app.get('/api/my-resources', authenticate, async (req, res) => {
  try {
    const userName = req.user.name;
    const resources = await Resource.find({ uploadedBy: userName }).sort({ uploadedAt: -1 });
    res.json(resources);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});



// Serve static files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
