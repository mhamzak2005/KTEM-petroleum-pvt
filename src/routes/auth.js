const express = require('express');
const router = express.Router();
const User = require('../models/users');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken'); // 1. Import JWT

// Login Route
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        // 1. Check if user exists
        const user = await User.findOne({ email }).select('+password');
        if (!user) {
            return res.status(401).json({ status: false, message: 'Invalid Email or Password' });
        }

        // 2. Compare passwords
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ status: false, message: 'Invalid Email or Password' });
        }

        // 3. Create a JWT Token
        // We embed the user ID and email inside the token
        const token = jwt.sign(
            { id: user._id, email: user.email }, 
            process.env.JWT_SECRET, 
            { expiresIn: '1d' } // Token expires in 1 day
        );

        // 4. Send the token back to the frontend
        res.status(200).json({ 
            status: true, 
            message: 'Login successful!',
            token: token, // <--- THE "PASSPORT"
            user: { id: user._id, email: user.email } 
        });

    } catch (error) {
        res.status(500).json({ status: false, message: error.message });
    }
});

// Signup Route
router.post('/signup', async (req, res) => {
    const { email, password, name } = req.body;

    try {
        // 1. Validate required fields
        if (!email || !password) {
            return res.status(400).json({ status: false, message: 'Email and password are required' });
        }

        // 2. Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(409).json({ status: false, message: 'An account with this email already exists' });
        }

        // 3. Create new user (password is hashed automatically by the pre-save hook)
        const user = await User.create({ name, email, password });

        // 4. Create a JWT Token
        const token = jwt.sign(
            { id: user._id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: '1d' }
        );

        // 5. Send the token back to the frontend
        res.status(201).json({
            status: true,
            message: 'Account created successfully!',
            token: token,
            user: { id: user._id, email: user.email, name: user.name }
        });

    } catch (error) {
        res.status(500).json({ status: false, message: error.message });
    }
});

module.exports = router;