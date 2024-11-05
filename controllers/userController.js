import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const registerUser = async(req, res) => {
    const { name, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({ name, email, password: hashedPassword });

    res.status(201).json({ 
        message: 'User created',
        user
    })
}

export const loginUser = async(req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email }});

    if(!user) {
        return res.status(400).json({ message: 'User not found'})
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if(!isMatch) {
        return res.status(400).json({ message: 'Invalid credentials'})
    }

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET);
    res.json({ token });
}

// Controller to get user details by id
export const getUser = async (req, res) => {
    const { id } = req.params;  // Extract user ID from URL params

    try {
        const user = await User.findOne({ where: { id } });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Return user details (exclude password for security)
        res.json({
            id: user.id,
            name: user.name,
            email: user.email
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
}

// Controller to get all users
export const getAllUsers = async (req, res) => {
    try {
        const users = await User.findAll();  // Fetch all users from the database

        if (users.length === 0) {
            return res.status(404).json({ message: 'No users found' });
        }

        // Return user details (excluding passwords for security)
        const userDetails = users.map(user => ({
            id: user.id,
            name: user.name,
            email: user.email
        }));

        res.json(userDetails);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching users', error });
    }
}