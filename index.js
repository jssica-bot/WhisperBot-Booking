const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();

const app = express();

// ✅ Allow CORS from all origins (or set to Netlify domain for stricter security)
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type']
}));

// ✅ Optional fallback for older browsers
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
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

// ✅ POST endpoint
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

// ✅ Default route
app.get('/', (req, res) => {
  res.send('📡 WhisperBot Booking backend is live!');
});

// ✅ Start server using only environment PORT
const port = process.env.PORT;
app.listen(port, () => {
  console.log(`🚀 Server running on port ${port}`);
});
