import express from 'express';
import { User } from '../models/User.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

const router = express.Router();

// Generate Token
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET || 'secret', {
        expiresIn: '30d',
    });
};

// @route   POST /api/auth/register
// @desc    Register a new user
// @access  Public
router.post('/register', async (req, res) => {
    console.log('📝 Register request received:', req.body);
    const { username, email, password, role } = req.body;

    try {
        const userExists = await User.findOne({ email });

        if (userExists) {
            console.log('⚠️ User already exists:', email);
            return res.status(400).json({ message: 'User already exists' });
        }

        console.log('✨ Creating new user...');
        const user = await User.create({
            username,
            email,
            password,
            role: role || 'operator'
        });

        if (user) {
            console.log('✅ User created:', user._id);
            res.status(201).json({
                _id: user._id,
                username: user.username,
                email: user.email,
                role: user.role,
                token: generateToken(user._id),
            });
        } else {
            console.log('❌ Invalid user data');
            res.status(400).json({ message: 'Invalid user data' });
        }
    } catch (error) {
        console.error('🔥 Registration Error:', error);
        res.status(500).json({ message: 'Server error: ' + error.message, error: error.message });
    }
});

// @route   POST /api/auth/login
// @desc    Auth user & get token
// @access  Public
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });

        if (user && (await user.matchPassword(password))) {
            res.json({
                _id: user._id,
                username: user.username,
                email: user.email,
                role: user.role,
                token: generateToken(user._id),
            });
        } else {
            res.status(401).json({ message: 'Invalid email or password' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

export default router;
