const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();

const app = express();

// 🔥 Allow Netlify frontend URL
app.use(cors({
  origin: 'https://melodic-centaur-3b71b3.netlify.app'
}));

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

// API route
app.post('/api/book', async (req, res) => {
  try {
    console.log('📥 Received data:', req.body);
    const booking = new Booking(req.body);
    await booking.save();
    res.status(200).send('✅ Booking saved');
  } catch (err) {
    console.error('❌ Failed to save booking:', err);
    res.status(500).send('❌ Failed to save booking');
  }
});

// Default route
app.get('/', (req, res) => {
  res.send('📡 WhisperBot Booking backend is live!');
});

const port = process.env.PORT;
app.listen(port, () => {
  console.log(`🚀 Server running on port ${port}`);
});
