const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();

const app = express();

// 🔥 Allow Netlify frontend URL and handle preflight requests
const corsOptions = {
  origin: 'https://melodic-centaur-3b71b3.netlify.app',
  methods:'GET, POST, OPTIONS',
  allowedHeaders:'Content-Type, Authorization',
  credentials: true
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions)); // Handle preflight requests

app.use(bodyParser.json());

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('✅ MongoDB connected'))
.catch(err => console.error('❌ MongoDB connection error:', err));

// Schema
const bookingSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  date: { type: String, required: true },
  time: { type: String, required: true },
  service: { type: String, required: true },
  notes: String,
  createdAt: { type: Date, default: Date.now }
});
const Booking = mongoose.model('Booking', bookingSchema);

// API route
app.post('/api/book', async (req, res) => {
  try {
    console.log('📥 Received data:', req.body);
    
    // Validate request body
    if (!req.body.fullName || !req.body.email || !req.body.phone || !req.body.date || !req.body.time || !req.body.service) {
      return res.status(400).send('❌ Missing required fields');
    }

    const booking = new Booking(req.body);
    await booking.save();
    res.status(201).json({ message: '✅ Booking saved', booking });
  } catch (err) {
    console.error('❌ Failed to save booking:', err);
    res.status(500).json({ error: '❌ Failed to save booking' });
  }
});

// Default route
app.get('/', (req, res) => {
  res.send('📡 WhisperBot Booking backend is live!');
});

const port = process.env.PORT || 3000; // Ensure a default port if env var is missing
app.listen(port, () => {
  console.log(`🚀 Server running on port ${port}`);
});
