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

module.exports = router;