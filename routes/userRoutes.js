import { check } from 'express-validator';
import express from 'express';  // ES module import
import { registerUser, loginUser, getUser, getAllUsers } from '../controllers/userController.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

// POST route for user registration with validation and sanitization (no auth required)
router.post(
  '/register',
  [
      check('name', 'Name is required').not().isEmpty(),
      check('email', 'Please include a valid email').isEmail(),
      check('password', 'Password must be at least 6 characters long').isLength({ min: 6 })
  ],
  registerUser
);

// POST route for user login (no auth required)
router.post('/login', loginUser);

// Protected GET route for fetching a user by ID (requires auth)
router.get('/user/:id', authMiddleware, getUser); 

// Protected  GET route for fetching all users (requires auth)
router.get('/', authMiddleware, getAllUsers); 

export default router;