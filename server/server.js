const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();


const app = express();
app.use(cors());
app.use(express.json());


mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error('MongoDB connection error:', err));

const authRoutes = require('./routes/auth');
const sessionRoutes = require('./routes/sessions');
app.use('/api/auth', authRoutes);
app.use('/api', sessionRoutes);

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

const path = require('path');

// Serve React build files in production
if (process.env.NODE_ENV === 'production') {
  const clientPath = path.resolve(__dirname, '../client/dist');
  app.use(express.static(clientPath));

  app.get(/^\/(?!api).*/, (req, res) => {
  res.sendFile(path.join(clientPath, 'index.html'));
});
}
