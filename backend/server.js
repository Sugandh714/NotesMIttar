const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const Resource = require('./models/resource');
const User = require('./models/user');
const multer = require('multer');
const path = require('path');
const cors = require('cors');

const app = express();

console.log('Starting server...');

// MongoDB connection
const mongoURI = 'mongodb://localhost:27017/notesmittarDB';

// Connect to MongoDB
mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('✅ MongoDB connected');
}).catch(err => {
  console.error('❌ MongoDB connection error:', err);
  process.exit(1);
});

// GridFS Setup using mongoose connection
let gridfsBucket;
let isGridFSReady = false;

mongoose.connection.once('open', () => {
  console.log('✅ MongoDB connection opened');
  try {
    gridfsBucket = new mongoose.mongo.GridFSBucket(mongoose.connection.db, {
      bucketName: 'uploads'
    });
    isGridFSReady = true;
    console.log('✅ GridFS bucket initialized successfully');
  } catch (error) {
    console.error('❌ GridFS initialization error:', error);
  }
});

mongoose.connection.on('error', (err) => {
  console.error('❌ MongoDB connection error:', err);
});

// Multer setup for memory storage
const storage = multer.memoryStorage();
const upload = multer({ 
  storage,
  fileFilter: (req, file, cb) => {
    console.log('File received:', file.originalname, file.mimetype);
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Only PDF files are allowed!'), false);
    }
  },
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  }
});

// CORS setup
app.use(cors({
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));

app.use(bodyParser.json());

// Helper function to upload to GridFS
const uploadToGridFS = (fileBuffer, filename, metadata) => {
  return new Promise((resolve, reject) => {
    if (!isGridFSReady || !gridfsBucket) {
      reject(new Error('GridFS not ready. Please wait for database connection.'));
      return;
    }

    console.log('Starting GridFS upload:', filename);

    const uploadStream = gridfsBucket.openUploadStream(filename, {
      metadata: metadata
    });

    uploadStream.on('error', (error) => {
      console.error('GridFS upload error:', error);
      reject(error);
    });

    uploadStream.on('finish', (file) => {
      console.log('GridFS upload finished successfully:', uploadStream.id);
      resolve({
        _id: uploadStream.id,
        filename: filename,
        metadata: metadata
      });
    });

    // Handle the upload
    uploadStream.end(fileBuffer);
  });
};

// Health check route
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    mongodb: mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected',
    gridfs: isGridFSReady ? 'Ready' : 'Not Ready'
  });
});

// Signup route
app.post('/api/signup', async (req, res) => {
  const { name, username, email, password } = req.body;

  try {
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ error: 'Username already taken' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      name,
      username,
      email,
      password: hashedPassword
    });

    res.status(201).json({ message: 'Signup successful', user: newUser.username });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ error: 'Signup failed' });
  }
});

// Login route
app.post('/api/login', async (req, res) => {
  const { usernameOrEmail, password } = req.body;

  try {
    const user = await User.findOne({
      $or: [
        { username: usernameOrEmail },
        { email: usernameOrEmail }
      ]
    });

    if (!user) {
      return res.status(400).json({ error: 'User not found' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

   res.status(200).json({
  message: 'Login successful',
  user: {
    _id: user._id,
    name: user.name,
    username: user.username,
    email: user.email,
    uploadCount: user.uploadCount
  }
});
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Server error during login' });
  }
});

// Upload Route with proper error handling
app.post('/api/upload', (req, res) => {
  // Use multer middleware with error handling
  upload.single('pdf')(req, res, async (err) => {
    // Handle multer errors
    if (err) {
      console.error('Multer error:', err);
      
      if (err instanceof multer.MulterError) {
        switch (err.code) {
          case 'LIMIT_FILE_SIZE':
            return res.status(400).json({ 
              error: 'File too large! Please choose a file smaller than 10MB.' 
            });
        
          default:
            return res.status(400).json({ 
              error: 'File upload error: ' + err.message 
            });
        }
      } else {
        // Custom errors (like file type validation)
        return res.status(400).json({ 
          error: err.message 
        });
      }
    }

    // Continue with the upload process
    console.log('Upload request received');
    console.log('Headers:', req.headers);
    console.log('Body:', req.body);
    console.log('File:', req.file ? req.file.originalname : 'No file');

    try {
      if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
      }

      if (!isGridFSReady) {
        return res.status(503).json({ error: 'GridFS not ready. Please try again in a moment.' });
      }

      // Extract user info from headers
      const uploadedBy = req.headers.username || 'unknown';
      const email = req.headers.email || 'unknown@example.com';

      // Validate that user exists first
      const existingUser = await User.findOne({
        $or: [
          { username: uploadedBy },
          { email: email }
        ]
      });

      if (!existingUser) {
        return res.status(400).json({ 
          error: 'User not found. Please login again.' 
        });
      }

      const { course, semester, subject, type, year } = req.body;
      let { unit } = req.body;
      // 🚫 Reject if PYQ for the same year already exists
if (type.toLowerCase() === 'pyqs' && year) {
  const duplicatePYQ = await Resource.findOne({
    type: 'PYQs',
    year,
    course,
    semester,
    subject
  });

  if (duplicatePYQ) {
    return res.status(409).json({
      error: `❌ A PYQ for year ${year} already exists for this subject.`,
      conflict: true
    });
  }
}

      // Handle unit array properly
      if (unit) {
        if (typeof unit === 'string') {
          unit = [unit];
        } else if (Array.isArray(unit)) {
          // unit is already an array, keep it as is
        } else {
          unit = [];
        }
      } else {
        unit = [];
      }

      console.log('Processing upload for:', {
        course,
        semester,
        subject,
        type,
        uploadedBy: existingUser.username
      });
      // 🚫 Reject if PYQ for the same year already exists




      // Create filename
      const timestamp = Date.now();
      const unitStr = unit.length > 0 ? unit.join('_') : 'general';
      const filename = `${course}_${semester}_${subject}_${type}_${unitStr}_${timestamp}${path.extname(req.file.originalname)}`;

      console.log('Generated filename:', filename);

      // Upload to GridFS
      const gridFSFile = await uploadToGridFS(req.file.buffer, filename, {
        originalName: req.file.originalname,
        subject: subject,
        semester: semester,
        course: course,
        type: type,
        unit: unit,
        uploadedBy: existingUser.username,
        uploadDate: new Date()
      });

      console.log('GridFS upload successful:', gridFSFile._id);

      // Check existing approved resources for this combination
      const existing = await Resource.countDocuments({
        course,
        semester,
        subject,
        type,
        status: 'approved'
      });

      const status = existing < 2 ? 'approved' : 'pending';
      console.log(`Existing approved resources: ${existing}, Status: ${status}`);

      // Create resource record
      const resource = await Resource.create({
        filename: filename,
        fileId: gridFSFile._id,
        course,
        semester,
        subject,
        type,
        year: year || null,
        unit: unit,
        status,
        uploadedBy: existingUser.username,
        uploadDate: new Date()
      });

      console.log('Resource record created:', resource._id);

      // Update user score - FIXED: Update the existing user by their _id
      const scoreIncrement = status === 'approved' ? 1 : 0.5;

      await User.findByIdAndUpdate(
        existingUser._id,
        {
          $inc: { uploadCount: scoreIncrement }
        },
        { new: true }
      );

      console.log(`✅ Upload completed: ${filename}, Status: ${status}`);
      console.log(`✅ Updated uploadCount for user: ${existingUser.username}`);
      
      res.status(201).json({ 
        message: `Upload ${status}! Your contribution has been ${status === 'approved' ? 'accepted' : 'submitted for review'}.`,
        status,
        filename: filename,
        fileId: gridFSFile._id
      });

    } catch (error) {
      console.error('Upload error:', error);
      res.status(500).json({ error: 'Upload failed: ' + error.message });
    }
  });
});

// Fetch Contribution History Route
app.get('/api/my-resources', async (req, res) => {
  const username = req.headers.username;

  console.log('Fetching resources for user:', username);

  if (!username) {
    return res.status(400).json({ error: 'Username required in headers' });
  }

  try {
    const resources = await Resource.find({ uploadedBy: username }).sort({ uploadDate: -1 });
    console.log(`Found ${resources.length} resources for user ${username}`);
    
    const enriched = resources.map(doc => ({
      filename: doc.filename,
      course: doc.course,
      semester: doc.semester,
      subject: doc.subject,
      type: doc.type,
      unit: doc.unit,
      year: doc.year,
      status: doc.status,
      uploadDate: doc.uploadDate,
      fileId: doc.fileId
    }));

    res.json(enriched);
  } catch (error) {
    console.error('Fetch error:', error);
    res.status(500).json({ error: 'Could not fetch resources' });
  }
});

// Route to download/view files
app.get('/api/file/:id', async (req, res) => {
  try {
    const fileId = new mongoose.Types.ObjectId(req.params.id);
    console.log('Requesting file:', fileId);
    
    // Get file info first
    const files = await gridfsBucket.find({ _id: fileId }).toArray();
    
    if (!files || files.length === 0) {
      console.log('File not found:', fileId);
      return res.status(404).json({ error: 'File not found' });
    }

    const file = files[0];
    console.log('File found:', file.filename);
    
    // Set headers
    // res.set({
    //   'Content-Type': 'application/pdf',
    //   'Content-Disposition': `inline; filename="${file.filename}"`
    // });
    res.set({
  'Content-Type': file.contentType,
  'Content-Disposition': `attachment; filename="${file.filename}"`
});

    // Create download stream
    const downloadStream = gridfsBucket.openDownloadStream(fileId);
    
    downloadStream.on('error', (error) => {
      console.error('Download error:', error);
      res.status(500).json({ error: 'Error downloading file' });
    });

    downloadStream.pipe(res);
  } catch (error) {
    console.error('File access error:', error);
    res.status(500).json({ error: 'Error accessing file' });
  }
});

// Route to get all files info
app.get('/api/files', async (req, res) => {
  try {
    if (!isGridFSReady) {
      return res.status(503).json({ error: 'GridFS not ready' });
    }
    
    const files = await gridfsBucket.find().toArray();
    console.log(`Found ${files.length} files in GridFS`);
    res.json(files);
  } catch (error) {
    console.error('Files fetch error:', error);
    res.status(500).json({ error: 'Error fetching files' });
  }
});

// Leaderboard Route
app.get('/api/leaderboard', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10; // Default to top 10
    
    const leaderboard = await User.find(
      { uploadCount: { $gt: 0 } }, // Only users with uploads
      { 
        name: 1, 
        username: 1, 
        uploadCount: 1, 
        registeredAt: 1,
        _id: 0 // Don't return _id for privacy
      }
    )
    .sort({ uploadCount: -1, registeredAt: 1 }) // Sort by uploadCount desc, then by registration date
    .limit(limit);

    // Add rank to each user
    const rankedLeaderboard = leaderboard.map((user, index) => ({
      rank: index + 1,
      name: user.name,
      username: user.username,
      uploadCount: user.uploadCount,
      registeredAt: user.registeredAt
    }));

    res.json({
      leaderboard: rankedLeaderboard,
      totalUsers: leaderboard.length
    });
  } catch (error) {
    console.error('Leaderboard error:', error);
    res.status(500).json({ error: 'Failed to fetch leaderboard' });
  }
});

// Get user's rank
app.get('/api/my-rank', async (req, res) => {
  const username = req.headers.username;

  if (!username) {
    return res.status(400).json({ error: 'Username required in headers' });
  }

  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Count users with higher uploadCount
    const rank = await User.countDocuments({
      uploadCount: { $gt: user.uploadCount }
    }) + 1;

    // Get total users with uploads
    const totalUsers = await User.countDocuments({
      uploadCount: { $gt: 0 }
    });

    res.json({
      rank,
      uploadCount: user.uploadCount,
      totalUsers,
      percentile: totalUsers > 0 ? Math.round(((totalUsers - rank + 1) / totalUsers) * 100) : 0
    });
  } catch (error) {
    console.error('Rank fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch rank' });
  }
});
// Fetch filtered resources
// Fetch filtered resources
app.get('/api/resources', async (req, res) => {
  try {
    const { course, semester, subject, type } = req.query;

    if (!course || !semester || !subject || !type) {
      return res.status(400).json({ error: 'Missing required query parameters' });
    }

    const resources = await Resource.find({
      course,
      semester,
      subject,
      type,
      status: 'approved'
    }).sort({ uploadDate: -1 });

    // ✅ Fetch original filename from GridFS using fileId
    const enriched = await Promise.all(
      resources.map(async (doc) => {
        let originalName = '';
        try {
          const gridFile = await gfs.files.findOne({ _id: doc.fileId });
          originalName = gridFile?.metadata?.originalName || doc.filename;
        } catch (err) {
          console.warn(`GridFS lookup failed for ${doc.fileId}:`, err.message);
          originalName = doc.filename;
        }

        return {
          _id: doc._id,
          originalName,                // ✅ Now sent to frontend
          filename: doc.filename,      // fallback
          author: doc.uploadedBy,
          year: doc.year,
          unit: doc.unit,
          fileUrl: `http://localhost:5000/api/file/${doc.fileId}`
        };
      })
    );

    res.json(enriched);
  } catch (error) {
    console.error('Error fetching resources:', error);
    res.status(500).json({ error: 'Failed to fetch resources' });
  }
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
  console.log(`🧪 Test upload: http://localhost:${PORT}/api/test-upload`);
});