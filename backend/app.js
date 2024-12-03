require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');

const helmet = require('helmet');

// Middleware and Routes
const { checkUser } = require('./middleware/auth');
const { csrfMiddleware, csrfTokenSender } = require('./middleware/csrf');
const corsMiddleware = require('./middleware/cors');
const authRoutes = require('./routes/auth');
const workspaceRoutes = require('./routes/workspace');
const snippetRoutes = require('./routes/snippets');
const reviewRoutes = require('./routes/review');

// Initialize Express App
const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(helmet());
app.use(corsMiddleware);
app.use(csrfMiddleware);
app.get('/csrf-token', csrfTokenSender);


dbURI = process.env.dbURI;
mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex:true })
  .then((result) => app.listen(3000))
  .catch((err) => console.log(err));

// Global Middleware to Check User for All GET Routes
app.get('*', checkUser);

// API Routes
app.use('/api', authRoutes);
app.use('/api', reviewRoutes);
app.use('/api', workspaceRoutes);
app.use('/api', snippetRoutes);

const PORT = process.env.PORT|0;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});