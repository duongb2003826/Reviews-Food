const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  // Check for the token being sent in a header or as a query parameter
  let token = req.get('Authorization') || req.query.token;
  if (token) {
    // Remove the 'Bearer ' if it was included in the token header
    token = token.replace('Bearer ', '');
    // Check if token is valid and not expired
    jwt.verify(token, process.env.JWT_SECRET, function(err, decoded) {
      if (err) {
        return res.status(401).json({ message: "Unauthorized" });
      } else {
        req.user = decoded.user;  
        // If your app cares... (optional)
        req.exp = new Date(decoded.exp * 1000);  
        return next();
      }
    });
  } else {
    // No token was sent
    req.user = null;
    return next();
  }
};

module.exports = authMiddleware;
