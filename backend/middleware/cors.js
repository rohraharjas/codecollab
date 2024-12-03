const cors = require('cors');

const corsMiddleware = cors({
  origin: (origin, callback) => {
    // Allow requests from your Streamlit frontend
    const allowedOrigins = [process.env.STREAMLIT_URL]; // Update this to your Streamlit deployment URL
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true, // Allow credentials to be included
});

module.exports = corsMiddleware;