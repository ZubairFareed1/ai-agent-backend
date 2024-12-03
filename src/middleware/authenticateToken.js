// middleware/authenticateToken.js
const jwt = require("jsonwebtoken");
const SECRET_KEY = "mysecretkey123"; // replace with your actual secret key

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.sendStatus(401); // No token, unauthorized

  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) return res.sendStatus(403); // Invalid token, forbidden
    req.user = user;
    next();
  });
};

module.exports = authenticateToken;
