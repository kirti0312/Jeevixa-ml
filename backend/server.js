const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/beds', require('./routes/beds'));
app.use('/api/infection', require('./routes/infection'));
app.use('/api/green', require('./routes/green'));
app.use('/api/surge', require('./routes/surge'));
app.use('/api/medicine', require('./routes/medicine'));
app.use('/api/chatbot', require('./routes/chatbot'));
app.use('/api/auth', require('./routes/auth'));
app.use('/api/patients', require('./routes/patients'));
app.use('/api/staff', require('./routes/staff'));
app.use('/api/alerts', require('./routes/alerts'));

// MongoDB Connection
// mongoose.connect(process.env.MONGODB_URI)
//   .then(() => console.log('✅ MongoDB Connected'))
//   .catch(err => console.log('❌ MongoDB Error:', err));
  mongoose.connect(process.env.MONGODB_URI)
  .then(async () => {
    console.log('✅ MongoDB Connected');
    //const Ward = require('./models/Ward');
    console.log('🌱 Running seed manually...');
    const seedDatabase = require('./seed');
    await seedDatabase();
  })
  .catch(err => console.log('❌ MongoDB Error:', err));
  
  const generateAlerts = require('./alertGenerator');
// Generate alerts every 5 minutes
setInterval(generateAlerts, 5 * 60 * 1000);
// Generate once on startup
setTimeout(generateAlerts, 3000);

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Jeevixa Backend running on port ${PORT}`);
});