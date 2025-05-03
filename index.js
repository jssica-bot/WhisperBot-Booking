const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 10000;

app.use(cors());
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
    console.log('📥 Received data:', req.body); // 👉 Tambahan log input dari Netlify
    const booking = new Booking(req.body);
    await booking.save();
    res.status(200).send('✅ Booking saved');
  } catch (err) {
    console.error('❌ Failed to save booking:', err); // 👉 Log error-nya lengkap
    res.status(500).send('❌ Failed to save booking');
  }
});

