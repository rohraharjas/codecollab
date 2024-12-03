const csrf = require('csurf');

// CSRF Protection Middleware
const csrfMiddleware = csrf({
  cookie: true, // Use cookies to store the CSRF token
});

// Function to send CSRF token to Streamlit frontend
const csrfTokenSender = (req, res, next) => {
  res.cookie('csrf-token', req.csrfToken(), {
    httpOnly: false, // Allow frontend to access the cookie
    sameSite: 'lax',
  });
  console.log(req.csrfToken());
  next();
};

module.exports = { csrfMiddleware, csrfTokenSender };