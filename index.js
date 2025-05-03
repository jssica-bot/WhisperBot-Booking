const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 10000;
const mongoURI = process.env.MONGODB_URI;

if (!mongoURI) {
  console.error('❌ ERROR: MONGODB_URI is not defined in environment variables!');
  process.exit(1); // stop the server
}

// Middleware
app.use(cors());
app.use(bodyParser.json());

// MongoDB connection
mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('✅ MongoDB connected'))
.catch(err => console.error('❌ MongoDB connection error:', err));

// Schema
const bookingSchema = new mongoose.Schema({
  fullName: String,
  email: String,
  phone: String,
  date: String,
  time: String,
  service: String,
  notes: String,
  createdAt: {
    type: Date,
    default: Date.now
  }
});
const Booking = mongoose.model('Booking', bookingSchema);

// POST API
app.post('/api/book', async (req, res) => {
  try {
    const booking = new Booking(req.body);
    await booking.save();
    res.status(200).send('✅ Booking saved');
  } catch (err) {
    console.error('❌ Error saving booking:', err);
    res.status(500).send('❌ Failed to save booking');
  }
});

// Simple test route
app.get('/', (req, res) => {
  res.send('🎉 WhisperBot booking backend is live!');
});

app.listen(port, () => {
  console.log(`🚀 Server running on port ${port}`);
});
