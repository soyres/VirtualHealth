import express from 'express';  // ES module import
import { registerUser, loginUser, getUser, getAllUsers } from '../controllers/userController.js';

const router = express.Router();

// POST route for user registration
router.post('/register', registerUser);

// POST route for user login
router.post('/login', loginUser);

// GET route for fetching a user by ID
router.get('/user/:id', getUser); 

// Define GET route for fetching all users
router.get('/', getAllUsers); 

export default router;