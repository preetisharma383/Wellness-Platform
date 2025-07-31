const jwt = require('jsonwebtoken');
module.exports = function(req, res, next) {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) return res.status(401).json({ msg: 'No token' });
  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET).id;
    next();
  } catch (err) {
    res.status(403).json({ msg: 'Invalid token' });
  }
};
