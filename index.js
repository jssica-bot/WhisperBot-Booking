const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();

// ✅ Use proper CORS middleware
app.use(cors({
  origin: 'https://melodic-centaur-3b71b3.netlify.app',
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type'],
}));

app.use(bodyParser.json());

// ✅ MongoDB connection
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('✅ MongoDB connected'))
.catch(err => console.error('❌ MongoDB connection error:', err));

// ✅ Mongoose Schema
const bookingSchema = new mongoose.Schema({
  fullName: String,
  email: String,
  phone: String,
  date: String,
  time: String,
  service: String,
  notes: String,
  createdAt: { type: Date, default: Date.now }
});
const Booking = mongoose.model('Booking', bookingSchema);

// ✅ Booking endpoint
app.post('/api/book', async (req, res) => {
  try {
    const booking = new Booking(req.body);
    await booking.save();
    res.status(201).json({ message: '✅ Booking saved' });
  } catch (err) {
    console.error('❌ Failed to save booking:', err);
    res.status(500).json({ error: '❌ Failed to save booking' });
  }
});

// ✅ Health check
app.get('/', (req, res) => {
  res.send('📡 WhisperBot backend is running with proper CORS!');
});

// ✅ Port
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`🚀 Server listening on port ${port}`);
});
