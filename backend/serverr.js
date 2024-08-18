// server.js

const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const apiRoutes = require('./routes/apiRoutes');

dotenv.config();

const app = express();
const port = process.env.PORT ;

app.use(express.json());

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

app.use('/api', apiRoutes);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
