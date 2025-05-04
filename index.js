const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();

// ✅ Manual CORS for Netlify frontend
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'https://melodic-centaur-3b71b3.netlify.app');
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.header('Access-Control-Allow-Credentials', 'true');
  
  if (req.method === 'OPTIONS') {
    return res.sendStatus(204); // Respond to preflight
  }

  next();
});

app.use(bodyParser.json());

// ✅ MongoDB connection
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('✅ MongoDB connected'))
.catch(err => console.error('❌ MongoDB connection error:', err));

// ✅ Booking schema & model
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

// ✅ Booking API
app.post('/api/book', async (req, res) => {
  try {
    const booking = new Booking(req.body);
    await booking.save();
    res.status(201).json({ message: '✅ Booking saved' });
  } catch (err) {
    console.error('❌ Booking failed:', err);
    res.status(500).json({ error: '❌ Failed to save booking' });
  }
});

// ✅ Root endpoint
app.get('/', (req, res) => {
  res.send('📡 WhisperBot Booking backend is running.');
});

// ✅ PORT for Render
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`🚀 Server running on port ${port}`);
});
