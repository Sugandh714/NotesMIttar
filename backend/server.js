const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const Resource = require('./models/resource');
const User = require('./models/user');
const cors = require('cors');
const app = express();
app.use(cors({
  origin: 'http://localhost:5173', // ✅ your React app URL
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));


app.use(bodyParser.json());

mongoose.connect('mongodb://localhost:27017/notesmittarDB', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('✅ MongoDB connected');
}).catch(err => {
  console.error('❌ MongoDB connection error:', err);
});



app.post('/signup', async (req, res) => {
  const { name, username, email, password } = req.body;

  try {
    // Check if username already exists
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ error: 'Username already taken' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
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
//login route
app.post('/login', async (req, res) => {
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



// Upload Route
app.post('/upload', async (req, res) => {
  const {
    filename, course, semester, subject, unit,
    year, status, uploadedBy, email
  } = req.body;

  try {
    const newResource = await Resource.create({
      filename, course, semester, subject, unit,
      year, status, uploadedBy
    });

    if (status === 'approved') {
      await User.findOneAndUpdate(
        { email },
        {
          $setOnInsert: { name: uploadedBy, registeredAt: new Date() },
          $inc: { uploadCount: 1 }
        },
        { upsert: true, new: true }
      );
    }

    res.status(201).json({ message: '✅ Resource uploaded', resource: newResource });
  } catch (error) {
    console.error('Upload failed:', error);
    res.status(500).json({ error: '❌ Upload failed' });
  }
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
