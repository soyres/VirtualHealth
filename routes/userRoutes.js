import { check } from 'express-validator';
import express from 'express';  // ES module import
import { registerUser, loginUser, getUser, getAllUsers } from '../controllers/userController.js';

const router = express.Router();

// POST route for user registration with validation and sanitization
router.post(
  '/register',
  [
      check('name', 'Name is required').not().isEmpty(),
      check('email', 'Please include a valid email').isEmail(),
      check('password', 'Password must be at least 6 characters long').isLength({ min: 6 })
  ],
  registerUser
);

// POST route for user login
router.post('/login', loginUser);

// GET route for fetching a user by ID
router.get('/user/:id', getUser); 

// Define GET route for fetching all users
router.get('/', getAllUsers); 

export default router;