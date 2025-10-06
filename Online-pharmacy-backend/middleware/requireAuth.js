
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET;

export const requireAuth = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    // Check if token exists and is in the right format
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Unauthorized. Login required.' });
    }

    const token = authHeader.split(' ')[1]; // Extract token

    // Verify token
    const decoded = jwt.verify(token, JWT_SECRET);

    // Attach user ID to request
    req.user = { id: decoded.id };

    next(); // Pass to the next middleware or controller
  } catch (error) {
    return res.status(401).json({ message: 'Invalid or expired token.' });
  }
};
