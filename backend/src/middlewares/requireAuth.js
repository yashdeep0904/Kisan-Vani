import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';

export const requireAuth = async (req, res, next) => {
  try {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({ error: 'Unauthorized: Access token missing' });
    }

    // Verify JWT token signature
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'kisanvaani_secret_key');

    // Attach user record to request object
    const user = await User.findById(decoded.id).select('-password');
    if (!user) {
      return res.status(401).json({ error: 'Unauthorized: User no longer exists' });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error('Auth Middleware Verification Error:', error.message);
    return res.status(401).json({ error: 'Unauthorized: Invalid or expired access token' });
  }
};