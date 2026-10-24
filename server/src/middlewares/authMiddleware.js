import jwt from 'jsonwebtoken';

import User from '../models/User.js';
import asyncHandler from '../utils/asyncHandler.js';

const resolveUserFromHeader = async (authHeader) => {
  if (!authHeader?.startsWith('Bearer ')) {
    return null;
  }

  const token = authHeader.split(' ')[1];
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  const user = await User.findById(decoded.id).select('-password');

  if (!user) {
    throw new Error('User not found for this token');
  }

  return user;
};

const protect = asyncHandler(async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith('Bearer ')) {
    res.status(401);
    throw new Error('Authentication token is missing');
  }

  try {
    req.user = await resolveUserFromHeader(authHeader);
    next();
  } catch (error) {
    res.status(401);
    throw new Error('Invalid or expired token');
  }
});

const optionalAuth = asyncHandler(async (req, _res, next) => {
  try {
    req.user = await resolveUserFromHeader(req.headers.authorization);
  } catch (_error) {
    req.user = null;
  }

  next();
});

const authorize =
  (...roles) =>
  (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      res.status(403);
      throw new Error('You are not allowed to access this resource');
    }

    next();
  };

export { authorize, optionalAuth, protect };
