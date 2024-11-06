import { validationResult } from 'express-validator';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import logger from '../config/logger.js'; 

/**
 * Register a new user
 * @route POST /api/users/register
 */
export const registerUser = async (req, res) => {
    try {
      const { name, email, password } = req.body;
  
      // Basic validation: Check that all fields are provided
      if (!name || !email || !password) {
        return res.status(400).json({ errors: 'All fields are required.' });
      }

    // Check if the email already exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
        return res.status(400).json({ message: 'Email already in use' });
    }

    // Hash the password before saving it
    const salt = await bcrypt.genSalt(10);  // Generate a salt (10 rounds is a good default)
    const hashedPassword = await bcrypt.hash(password, salt);  // Hash the password with the salt

    // Create new user with hashed password
    const user = await User.create({ name, email, password: hashedPassword });

      return res.status(201).json({
        message: 'User created successfully!',
        user: {
            id: user.id,
            name: user.name,
            email: user.email,
        },
      });
    } catch (err) {
      if (err.name === 'SequelizeUniqueConstraintError') {
        return res.status(400).json({
          message: 'Email must be unique',
        });
      }
      console.error(err);
      return res.status(500).json({
        message: 'Server error creating user',
        error: err.message,
      });
    }
};

/**
 * Login a user
 * @route POST /api/users/login
 */
export const loginUser = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ where: { email } });

        if (!user) {
            return res.status(400).json({ message: 'User not found' }); // No change here
        }

        // Check if password matches
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            // This should be the message for incorrect password
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.json({ token });
    } catch (err) {
        logger.error(`Error during login: ${err.message}`);
        res.status(500).json({ message: 'Server error during login', error: err.message });
    }
};

/**
 * Get user details by ID
 * @route GET /api/users/user/:id
 */
export const getUser = async (req, res) => {
    const { id } = req.params;

    try {
        const user = await User.findOne({ where: { id } });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json({
            id: user.id,
            name: user.name,
            email: user.email
        });
    } catch (error) {
        logger.error(`Error fetching user: ${error.message}`);
        res.status(500).json({ message: 'Server error fetching user', error: error.message });
    }
};

/**
 * Get all users
 * @route GET /api/users
 */
export const getAllUsers = async (req, res) => {
    try {
        const users = await User.findAll();

        if (users.length === 0) {
            return res.status(404).json({ message: 'No users found' });
        }

        const userDetails = users.map(user => ({
            id: user.id,
            name: user.name,
            email: user.email
        }));

        res.json(userDetails);
    } catch (error) {
        logger.error(`Error fetching users: ${error.message}`);
        res.status(500).json({ message: 'Error fetching users', error: error.message });
    }
};
